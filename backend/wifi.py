from sqlmodel import SQLModel, Session, select
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Annotated

from datetime import datetime
from database import User, engine, UserUpdate, patch_user_db
from auth_router import get_current_user
from ldap import allow_ldap_wifi, disallow_ldap_wifi

wifi_router = APIRouter (
    prefix="/wifi"
)

DEBUT_T1 = datetime (2025, 9, 1)
DEBUT_T2 = datetime (2025, 11, 17)
DEBUT_T3 = datetime (2026, 2, 16)

class WiFiUpdate (SQLModel):
    uid: str
    state: bool


class Cotiz (SQLModel):
    T1: bool | None = None
    T2: bool | None = None
    T3: bool | None = None


@wifi_router.post ("/cotiser")
def ajouter_credits_trimestre (
    req: Cotiz,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Dépense les crédits pour activer le wifi sur un trimestre
    """
    print (current_user)
    if current_user.credits < 1:
        raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vous n'avez pas assez de crédits"
            )

    if req.T1:
        update = UserUpdate (
            credits=current_user.credits - 1,
            cotizT1=True, t1PaidAt=datetime.now(),
            t1PaymentType="Autocredits",
        )
        if DEBUT_T2 > datetime.now () > DEBUT_T1:
            allow_ldap_wifi (current_user.uid)
            update.acces_wifi = True

        user = patch_user_db (current_user, update)
        return user

    if req.T2:
        update = UserUpdate (
            credits=current_user.credits - 1,
            cotizT2=True, t2PaidAt=datetime.now(),
            t2PaymentType="Autocredits",
        )
        if DEBUT_T3 > datetime.now () > DEBUT_T2:
            allow_ldap_wifi (current_user.uid)
            update.acces_wifi = True

        user = patch_user_db (current_user, update)
        return user

    if req.T3:
        update = UserUpdate (
            credits=current_user.credits - 1,
            cotizT3=True, t3PaidAt=datetime.now(),
            t3PaymentType="Autocredits",
        )
        if datetime.now () > DEBUT_T3:
            allow_ldap_wifi (current_user.uid)
            update.acces_wifi = True

        user = patch_user_db (current_user, update)
        return user



@wifi_router.post ("")
async def set_wifi_state (
    req: WiFiUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Autorise ou interdit l'acces au wifi à l'utilisateur dont l'uid est *uid*
    """
    # Pour modifier l'acces wifi d'un compte, il faut avoir les droits admin
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )

    with Session (engine) as session:  # Modification de la bdd locale
        statement = select (User).where (User.uid == req.uid)
        user = session.exec (statement).all ()

        if not user:
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'utilisateur recherché n'existe pas"
            )
        user = user[0]
        
        user.sqlmodel_update ({"acces_wifi": req.state})
        session.add (user)
        session.commit ()
        session.refresh (user)

        if WiFiUpdate.state:
            success = allow_ldap_wifi (WiFiUpdate.uid)
        else:
            success = disallow_ldap_wifi (WiFiUpdate.uid)
        if not success:
            raise HTTPException (
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Impossible de modifier l'acces au wifi pour cet uid"
            )

        return user
