from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from datetime import datetime

from database import UserReceived, UserUpdate, User, add_new_user_db, get_user_db, patch_user_db, delete_user_db
from ldap import ldap_add_user, ldap_delete_user, allow_ldap_wifi, disallow_ldap_wifi
from auth_router import get_current_user
from mail import send_premier_mail

user_router = APIRouter (
    prefix="/users"
)


@user_router.get ("/me")
async def get_self (
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    return current_user


@user_router.post ("")
async def post_users (
    user_to_create: UserReceived, 
    # current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Crée un utilisateur dans la db
    """

    user = add_new_user_db (user_to_create)
    send_premier_mail (user)
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

    user = get_user_db (uid)

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
    
    user = get_user_db (uid)

    if not user:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur recherché n'existe pas"
        )

    user = patch_user_db (user[0], user_update)
    if user.acces_wifi:
        allow_ldap_wifi (user.uid)
    elif (not user.acces_wifi is None) and (not user.acces_wifi):
        disallow_ldap_wifi (user.uid)
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

    user = get_user_db (uid)
    if not user:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="L'utilisateur recherché n'existe pas"
        )

    user = delete_user_db (user)[0]
    if not user:
        raise HTTPException (
            status_code=status.HTTP_500,
            detail="Impossible de supprimer l'utilisateur du LDAP"
        )

    ldap_delete_user (user.uid)

    return user
