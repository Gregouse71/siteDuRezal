from sqlmodel import SQLModel, Session, select, create_engine
from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Annotated

from database import User, engine
from authentication import get_current_user

wifi_router = APIRouter (
    prefix="/wifi"
)


class RadiusUser (SQLModel):
    """
    Classe représentant les utilisateurs dans la bdd du RADIUS
    NE PAS TOUCHER, le model est fixe
    IL EST IMPERATIF d'utiliser le constructeur fourni afin d'envoyer les bonnes valeurs
    """
    __tablename__ = 'radcheck'
    username: str  # Identifiant
    attribute: str # 
    op: str        #
    value: str     # Mot de passe hashé NTLM

    def __init__ (self, user: User):
        self.username = user.uid
        self.attribute = "NT-Password"
        self.op = ":="
        self.value = user.nt_password


class WiFiUpdate (SQLModel):
    uid: str
    state: bool


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

        with Session (radius_engine) as rad_session:  # Modification de la bdd du RADIUS
            if req.state:
                rad_user = RadiusUser (user)
                rad_session.add (rad_user)
                rad_session.commit ()
                rad_session.refresh (rad_user)
            else:
                statement = select (RadiusUser).where (RadiusUser.username == user.uid)
                rad_users_to_del = rad_session.exec (statement).all ()
                rad_session.delete (rad_users_to_del)
                rad_session.commit ()

        return user
    


# Setting up the database connection and session
RADIUS_DATABASE_URL = "sqlite:///./test_rad.db"
radius_engine = create_engine(RADIUS_DATABASE_URL)
SQLModel.metadata.create_all(engine)