from pydantic import BaseModel
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from sqlmodel import Session, select

import urllib
import random, string
from datetime import timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError
import os
from dotenv import load_dotenv

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from database import User, UserUpdate, engine, get_user_db, patch_user_db
from ldap import ldap_verify_username_password, ldap_add_user, ldap_change_pwd
from utils import create_access_token
from mail import send_nouveau_mail


auth_router = APIRouter (
    prefix="/auth"
)


load_dotenv ()
SECRET_KEY = os.getenv ("SECRET_KEY")
SECRET_KEY_MAIL = os.getenv ("SECRET_KEY_MAIL")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 10


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
        algorithm=ALGORITHM,
        expires_delta=timedelta (minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token (access_token=access_token, token_type="bearer")


@auth_router.get ("/new_password_mail/{email_url}")
async def get_new_password_mail (
    email_url: str
):
    """
    Marque l'utilisateur comme ayant perdu son mail et lui envoie un mail de nouveau mdp
    """
    email = urllib.parse.unquote (email_url)
    with Session (engine) as session:
        statement = select (User). where (User.email == email)
        user = session.exec (statement).all ()

        if not user:
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'utilisateur recherché n'existe pas"
            )
        user = user[0]
        user.has_lost_pass = True
        send_nouveau_mail (user)
        session.add (user)
        session.commit()


@auth_router.get ("/new_password/{token}")
async def obtain_new_password (
    token: str
):
    """
    Change le mdp de l'utilisateur
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY_MAIL, algorithms=[ALGORITHM])
        uid = payload.get("sub")
        if uid is None:  # S'il n'y en a pas, c'est un jeton invalide
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException (
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Le jeton d'authentification a expiré"
        )
    except InvalidTokenError:
        raise credentials_exception

    user = get_user_db (uid)
    if not user:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur recherché n'existe pas"
        )

    user = user[0]
    if (not user.has_lost_pass) and user.email_verifie:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur n'a pas demandé de nouveau mot de passe"
        )
    

    s = string.ascii_letters + string.digits  # Génération du nouveau mdp
    mdp = ''.join(random.sample(s, 15))

    if (not user.email_verifie) and not ldap_add_user (
        user.promotion + user.nom.lower (), mdp,
        user.promotion, user.nom, user.prenom, user.email
    ):
        raise HTTPException (
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de créer l'utilisateur LDAP"
        )
    if user.has_lost_pass:
        ldap_change_pwd (user.uid, mdp)

    user = patch_user_db (user, UserUpdate (has_lost_pass=False, email_verifie=True))
    return { "user": user.uid, "mdp": mdp }
