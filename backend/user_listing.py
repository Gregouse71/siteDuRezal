from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import SQLModel, Session, select, col
from typing import Annotated
from pydantic import EmailStr

from database import UserReceived, User, user_from_received, engine

from authentication import get_current_user

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


@listing_router.get ("/all")
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


@listing_router.get ("/filter")
async def filter_user (
    filters: GetUser,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Renvoie tous les utilisateurs qui matchent avec les paramètres envoyés
    """
    with Session (engine) as session:
        statement = select (User).where (filters.uid is None or col (User.uid).contains (filters.uid),
                                         filters.is_admin is None or col (User.is_admin) == filters.is_admin,
                                         filters.acces_wifi is None or col (User.acces_wifi) == filters.acces_wifi,
                                         filters.is_admin is None or col (User.is_admin) == filters.is_admin,
                                         filters.nom is None or col (User.nom) == filters.nom,
                                         filters.prenom is None or col (User.prenom) == filters.prenom,
                                         filters.email is None or col (User.email) == filters.email,)
        users = session.exec (statement).all ()
        return users
