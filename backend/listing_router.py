from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, update
from typing import Annotated
from dotenv import load_dotenv
import os

from database import User, engine
from ldap import clear_ldap_wifi
from auth_router import get_current_user

load_dotenv()
GROUPE_WIFI_LDAP = os.getenv("GROUPE_WIFI_LDAP")

listing_router = APIRouter (
    prefix="/list"
)


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

@listing_router.get("/clearall")
def clear_all_cotiz(
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Supprime toutes les données de cotisation de l'année
    """
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )

    with Session(engine) as session:
        statement = update (User).values(
            acces_wifi=False,
            cotizT1=None, t1PaidAt=None, t1PaymentType=None,
            cotizT2=None, t2PaidAt=None, t2PaymentType=None,
            cotizT3=None, t3PaidAt=None, t3PaymentType=None
        )
        session.exec(statement)
        session.commit()
        clear_ldap_wifi()
    return "Success"