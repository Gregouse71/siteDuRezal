from fastapi import APIRouter, Depends, status
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

        # On vérifie qu'il n'y a pas déjà d'utilisateur avec cet uid
        statement = select (User). where (User.uid == user.uid)
        collisions = session.exec (statement).all ()
        if collisions: # TODO : ajouter de la logique pour éviter ce genre d'erreur
            return HTTPException (
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ce sont de famille existe déjà"
                )

        session.add (user)
        session.commit ()
        return user_to_create

@user_router.get ("/{uid}")
def get_users (
    uid: str,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Renvoie les détails de l'utilisateur dont l'identifiant est *uid*
    """
    # Pour avoir les détails d'un compte, il faut avoir les droits admin ou chercher son propre compte
    if not current_user.uid == uid and not current_user.is_admin:
        return HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    
    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        user = session.exec (statement).all ()

    return user[0]


@user_router.patch ("/{uid}")
def patch_users (
    uid: str,
    user: User
) -> User:
    return


@user_router.delete ("/{uid}")
def delete_users (
    uid: str,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User :
    """
    Efface de la db les utilisateurs ayant pour uid *uid*
    """
    # Pour supprimer un compte, il faut avoir les droits admin ou supprimer son propre compte
    if not current_user.uid == uid and not current_user.is_admin:
        return HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )

    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        users_to_del = session.exec (statement).all () # liste des utilisateurs à effacer

        for user in users_to_del:
            session.delete (user)

        session.commit()
        return users_to_del
