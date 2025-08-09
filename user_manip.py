from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import SQLModel, Session, select
from typing import Annotated

from database import UserReceived, User, user_from_received, engine

from authentication import get_current_user

user_router = APIRouter (
    prefix="/users"
)


class UserUpdate (SQLModel, table=False):
    """
    Classe représentant les modifications à faire à un utilisateur
    """
    uid: str

    is_admin: bool | None = None


@user_router.get ("/me")
async def get_self (
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    return current_user


@user_router.post ("/")
async def post_users (
    user_to_create: UserReceived, 
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Crée un utilisateur dans la db
    """
    with Session (engine) as session:
        user_rec = UserReceived.model_validate (user_to_create)
        user = user_from_received (user_rec)

        # On vérifie qu'il n'y a pas déjà d'utilisateur avec cet uid
        statement = select (User). where (User.uid == user.uid)
        collisions = session.exec (statement).all ()
        if collisions: # TODO : ajouter de la logique pour éviter ce genre d'erreur
            raise HTTPException (
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ce sont de famille existe déjà"
                )

        session.add (user)
        session.commit ()
        session.refresh (user)
        return user

@user_router.get ("/{uid}")
async def get_users (
    uid: str,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Renvoie les détails de l'utilisateur dont l'identifiant est *uid*
    """
    # Pour avoir les détails d'un compte, il faut avoir les droits admin ou chercher son propre compte
    if not current_user.uid == uid and not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    
    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        user = session.exec (statement).all ()

        if not user:
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'utilisateur recherché n'existe pas"
            )

    return user[0]


@user_router.patch ("/{uid}")
async def patch_users (
    uid: str,
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Modifie les infos de l'utilisateur ayant pour uid *uid*
    """
    # Il faut être admin pour modifier les infos
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    
    with Session (engine) as session:
        statement = select (User).where (User.uid == user_update.uid)
        user = session.exec (statement).all ()
        if not user:
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'utilisateur recherché n'existe pas"
            )

        user = user[0]
        
        data = user_update.model_dump (exclude_unset=True)
        user.sqlmodel_update (data)
        session.add (user)
        session.commit()
        session.refresh (user)
        return user


@user_router.delete ("/{uid}")
async def delete_users (
    uid: str,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User :
    """
    Efface de la db les utilisateurs ayant pour uid *uid*
    """
    # Pour supprimer un compte, il faut avoir les droits admin ou supprimer son propre compte
    if not current_user.uid == uid and not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )

    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        users_to_del = session.exec (statement).all () # liste des utilisateurs à effacer

        if not users_to_del:
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'utilisateur recherché n'existe pas"
            )

        for user in users_to_del:
            session.delete (user)

        session.commit()
        return users_to_del
