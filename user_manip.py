from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import Annotated

from database import UserReceived, User, user_from_received, engine

from authentication import get_current_user

user_router = APIRouter (
    prefix="/users"
)

@user_router.post ("/")
def post_users (
    user_to_create: UserReceived, 
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Crée un utilisateur dans la db
    TODO : ajouter une vérification de l'unicité avec une gestion des erreurs propre
    """
    with Session (engine) as session:
        user_rec = UserReceived.model_validate (user_to_create)
        user = user_from_received (user_rec)

        session.add (user)
        session.commit ()
        return user_to_create

@user_router.delete ("/{uid}")
def delete_users (uid: str):
    """
    Efface de la db les utilisateurs ayant pour uid *uid*
    """
    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        users_to_del = session.exec (statement).all () # liste des utilisateurs à effacer

        for user in users_to_del:
            session.delete (user)

        session.commit()
        return users_to_del