from pydantic import BaseModel
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from sqlmodel import Session, select

from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from database import User, engine

auth_router = APIRouter (
    prefix="/auth"
)


# Générée avec openssl rand -hex 32
SECRET_KEY = "6b208126144669aeb9b52ab55b16781873b5324f30449dc0ed2531e63178da65"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class Token (BaseModel):
    """
    Décrit le token envoyé : une valeur et un type (le type est toujours "bearer")
    """
    access_token: str
    token_type: str

class TokenData (BaseModel):
    """
    Données contenues dans un token
    """
    uid: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def authenticate_user(username: str, password: str) -> User:
    """
    Détermine si *password* est le mot de passe de l'utilisateur *username*
    """
    with Session (engine) as session:
        statement = select (User).where (User.uid == username)
        user = session.exec (statement).all ()  # On récupère tous les utilisateurs avec cet username

        if not user:  # s'il n'y en a aucun ou plusieurs
            return None  # on le signal, ce qui provoque une erreur
        user = user[0]
        ## TODO : à remplacer par la logique du ldap
        if not password == user.uid + "1":
            return None

        return user


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """
    Détermine si le jeton *token* est un jeton d'authentification valide
    TODO : ajouter une vérification de la durée de validitité
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:  # On cherche l'uid contenu dans le jeton
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid = payload.get("sub")
        if uid is None:  # S'il n'y en a pas, c'est un jeton invalide
            raise credentials_exception
        token_data = TokenData(uid=uid)

    except InvalidTokenError:
        raise credentials_exception

    with Session (engine) as session:  #S'il existe, on renvoie l'utilisateur ayant l'uid correspondant
        statement = select (User).where (User.uid == uid)
        user = session.exec (statement).all ()

        if not user:
            raise credentials_exception

        return user[0]


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Crée un jeton d'accès à partir des données de *data*, valide pour une durée *expires_delta*
    data ne doit pas contenir de clé *exp*
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta  # on calcule la date d'expiration
    else:  # si elle n'est pas demandée, c'est 15 min
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})  # On ajoute la date d'expiration aux données du jeton
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # et on les encode
    return encoded_jwt


@auth_router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    """
    Renvoie un token d'identification de l'utilisateur.
    La requête doit contenir les données d'un form, avec les chanmps *username* et *password*
    """
    user = authenticate_user (form_data.username, form_data.password)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
            )

    access_token = create_access_token(
        data={"sub": user.uid},
        expires_delta=timedelta (minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token (access_token=access_token, token_type="bearer")