from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import SQLModel, Session, select
from typing import Annotated
from dotenv import load_dotenv
from pydantic import EmailStr
import os

from database import User, engine
from ldap import ldap_group_members
from auth_router import get_current_user

load_dotenv()
GROUPE_WIFI_LDAP = os.getenv("GROUPE_WIFI_LDAP")

listing_router = APIRouter (
    prefix="/list"
)

class GetUser (SQLModel):
    """
    Classe contenant les paramètres de recherche des utilisateurs
    """
    id: int | None = None
    uid: str | None = None

    is_admin: bool | None = None

    acces_wifi: bool | None = None
    nt_password: str | None = None

    nom: str | None = None
    prenom: str | None = None
    email: EmailStr | None = None


@listing_router.get ("/alluids")
async def get_all (
    current_user: Annotated[User, Depends(get_current_user)]
) -> list [str]:
    """
    Liste tous les uid des utilisateurs
    """
    # Pour lister tous les comptes, il faut avoir les droits admin
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    
    with Session (engine) as session:
        statement = select (User.uid)
        users = session.exec (statement).all ()
        return users


@listing_router.get ("/radius_users")
async def get_radius_users (
    current_user: Annotated[User, Depends(get_current_user)]
) -> list [str]:
    """
    Liste tous les uid des utilisateurs
    """
    # Pour lister tous les comptes, il faut avoir les droits admin
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    return ldap_group_members(GROUPE_WIFI_LDAP)


@listing_router.get ("/all")
async def filter_user (
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Renvoie tous les utilisateurs qui matchent avec les paramètres envoyés
    """
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    with Session (engine) as session:
        # statement = select (User).where (filters.uid is None or col (User.uid).contains (filters.uid),
        #                                  filters.is_admin is None or col (User.is_admin) == filters.is_admin,
        #                                  filters.acces_wifi is None or col (User.acces_wifi) == filters.acces_wifi,
        #                                  filters.is_admin is None or col (User.is_admin) == filters.is_admin,
        #                                  filters.nom is None or col (User.nom) == filters.nom,
        #                                  filters.prenom is None or col (User.prenom) == filters.prenom,
        #                                  filters.email is None or col (User.email) == filters.email,)
        statement = select (User)
        users = session.exec (statement).all ()
        return users
