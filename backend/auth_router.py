from pydantic import BaseModel
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from sqlmodel import Session, select

import random, string
from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from Crypto.Hash import MD4

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from database import User, UserUpdate, engine, get_user_db, patch_user_db
from ldap import ldap_verify_username_password, ldap_add_user, ldap_change_pwd
from mail import send_nouveau_mail

auth_router = APIRouter (
    prefix="/auth"
)


# Générée avec openssl rand -hex 32
SECRET_KEY = "6b208126144669aeb9b52ab55b16781873b5324f30449dc0ed2531e63178da65"
SECRET_KEY_MAIL = "603a3f6d3f28d2b1e176cf06a8b1720925cfab48403aeeee7bc96663cb030bc5"
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
    user = get_user_db (username)

    if not user:  # s'il n'y en a aucun ou plusieurs
        return None  # on le signal, ce qui provoque une erreur
    user = user[0]
    # Vérification du mot de passe avec le ldap
    if not ldap_verify_username_password (username, password):
        return None

    return user


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """
    Détermine si le jeton *token* est un jeton d'authentification valide
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

    user = get_user_db (uid)
    if not user:
        raise credentials_exception
    return user[0]


def create_access_token(data: dict, key: str, expires_delta: timedelta | None = None) -> str:
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
    encoded_jwt = jwt.encode(to_encode, key, algorithm=ALGORITHM)  # et on les encode
    return encoded_jwt


@auth_router.post ("/token")
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

    if not user.email_verifie:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email non vérifié",
            )

    access_token = create_access_token(
        data={"sub": user.uid},
        key=SECRET_KEY,
        expires_delta=timedelta (minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token (access_token=access_token, token_type="bearer")


@auth_router.post ("/verify_email/{uid}/{token}")
async def verify_mail (
    uid: str,
    token: str
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY_MAIL, algorithms=[ALGORITHM])
        uid_token = payload.get("sub")
        if uid_token is None or uid_token != uid:  # S'il n'y en a pas, c'est un jeton invalide
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = get_user_db (uid)

    if not user:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur recherché n'existe pas"
        )

    user = user[0]
    if user.email_verifie:
        return user

    if not ldap_add_user (
        user.promotion + user.nom.lower (), user.mot_de_passe,
        user.promotion, user.nom, user.prenom
    ):
        raise HTTPException (
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de créer l'utilisateur LDAP"
        )
    user = patch_user_db (user, UserUpdate(email_verifie=True, mot_de_passe="0"))
    return user


@user_router.get ("/new_password_mail/{uid}")
async def get_new_password_mail (
    uid: str
):
    """
    Marque l'utilisateur comme ayant perdu son mail et lui envoie un mail de nouveau mdp
    """
    send_nouveau_mail
    user = get_user_db (uid)
    if not user:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur recherché n'existe pas"
        )
    user = user[0]
    user.has_lost_pass = True
    send_nouveau_mail (user)
    with Session (engine) as session:
        session.add (user)
        session.commit()


@user_router.get ("/new_password/{token}")
async def obtain_new_password (
    token: str
):
    """
    Change le mdp de l'utilisateur
    """
    try:
        payload = jwt.decode(token, SECRET_KEY_MAIL, algorithms=[ALGORITHM])
        uid_token = payload.get("sub")
        if uid_token is None:  # S'il n'y en a pas, c'est un jeton invalide
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = get_user_db (uid)
    if not user:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur recherché n'existe pas"
        )

    user = user[0]
    if not user.has_lost_pass:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur n'a pas demandé de nouveau mot de passe"
        )

    disallow_radius_wifi (uid)

    s = string.lowercase+string.digits+string+string.punctuation  # Génération du nouveau mdp
    mdp = ''.join(random.sample(s, 15))

    ldap_change_pwd (user.uid, mdp)

    hash = MD4.new()
    hash.update(user.mot_de_passe.encode('utf-16le'))
    user.nt_pass = hash.hexdigest()

    user.has_lost_pass = False


    allow_radius_wifi (uid)

    with Session (engine) as session:
        session.add (user)
        session.commit()

    return { "data": mdp }