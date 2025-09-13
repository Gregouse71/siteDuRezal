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
    if current_user.credits < 5:
        raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vous n'avez pas assez de crédits"
            )
    if req.T1:
        update = UserUpdate (credits=current_user.credits-5, cotizT1=True, t1PaidAt=datetime.now(), t1PaymentType="Autocredits")
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
