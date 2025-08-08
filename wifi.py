from sqlmodel import SQLModel, Session, select
from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Annotated

from database import User, engine
from authentication import get_current_user

wifi_router = APIRouter (
    prefix="/wifi"
)

class WiFiUpdate (SQLModel):
    uid: str
    state: bool

@wifi_router.post ("/")
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

    with Session (engine) as session:
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
        return user
