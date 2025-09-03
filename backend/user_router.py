from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from datetime import datetime

from database import UserReceived, UserUpdate, User, add_new_user_db, get_user_db, patch_user_db, delete_user_db
from ldap import ldap_add_user, allow_ldap_wifi, disallow_ldap_wifi
from auth_router import get_current_user
from mail import send_mail

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
    if not ldap_add_user (
        user_to_create.promotion + user_to_create.nom.lower (), user_to_create.mot_de_passe,
        user_to_create.promotion, user_to_create.nom, user_to_create.prenom
    ):
        raise HTTPException (
            status_code=status.HTTP_409_CONFLICT,
            detail="Impossible de créer l'utilisateur LDAP"
        )
    user = add_new_user_db (user_to_create)
    send_mail (user)
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
    else:
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

    return user
