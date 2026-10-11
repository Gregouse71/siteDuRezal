from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import SQLModel, Field, Session, select, delete, update, create_engine, desc
from typing import Annotated
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
import os

from database import User
from ldap import ldap_group_members
from auth_router import get_current_user

load_dotenv()
GROUPE_WIFI_LDAP = os.getenv("GROUPE_WIFI_LDAP")
RADIUS_DATABASE = os.getenv("RADIUS_DATABASE")

radius_router = APIRouter (
    prefix="/radius"
)

class RadAcct (SQLModel, table=True):
    __tablename__ = "radacct"
    """
    Classe représentant la table de comptabilité du radius.
    Définie en reproduisant la définition fournie dans 
    /etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql
    """
    radacctid: int | None = Field(
        default=None,
        primary_key=True,
        sa_column_kwargs={"autoincrement": True},
    )
    acctsessionid: str = Field(default="", max_length=64, index=True)
    acctuniqueid: str = Field(default="", max_length=32, unique=True)
    username: str = Field(default="", max_length=64, index=True)
    realm: str | None = Field(default="", max_length=64)
    nasipaddress: str = Field(default="", max_length=15, index=True)
    nasportid: str | None = Field(default=None, max_length=32)
    nasporttype: str | None = Field(default=None, max_length=32)
    acctstarttime: datetime | None = Field(default=None, index=True)
    acctupdatetime: datetime | None = Field(default=None)
    acctstoptime: datetime | None = Field(default=None, index=True)
    acctinterval: int | None = Field(default=None, index=True)
    acctsessiontime: int | None = Field(default=None, index=True)
    acctauthentic: str | None = Field(default=None, max_length=32)
    connectinfo_start: str | None = Field(default=None, max_length=128)
    connectinfo_stop: str | None = Field(default=None, max_length=128)
    acctinputoctets: int | None = Field(default=None)
    acctoutputoctets: int | None = Field(default=None)
    calledstationid: str = Field(default="", max_length=50)
    callingstationid: str = Field(default="", max_length=50)
    acctterminatecause: str = Field(default="", max_length=32)
    servicetype: str | None = Field(default=None, max_length=32)
    framedprotocol: str | None = Field(default=None, max_length=32)
    framedipaddress: str = Field(default="", max_length=15, index=True)
    framedipv6address: str = Field(default="", max_length=45, index=True)
    framedipv6prefix: str = Field(default="", max_length=45, index=True)
    framedinterfaceid: str = Field(default="", max_length=44, index=True)
    delegatedipv6prefix: str = Field(default="", max_length=45, index=True)
    class_: str | None = Field(
        default=None,
        max_length=64,
        index=True,
        sa_column_kwargs={"name": "class"},
    )


engine_radius = create_engine(RADIUS_DATABASE, pool_recycle=3600)


@radius_router.get ("/list")
async def get_radius_users (
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
    return ldap_group_members(GROUPE_WIFI_LDAP)


def get_user_sessions(uid: str, nbsess: int = 20):
    """
    Recherche toutes les sessions de comptabilité du radius pour l'utilisateur
    """
    with Session (engine_radius) as session:
        statement = select (RadAcct).where (RadAcct.username == uid).order_by (
            RadAcct.acctstoptime.isnot (None),
            desc (RadAcct.acctstoptime)
        ).limit (nbsess)
        
        sessions = session.exec (statement).all ()

        return sessions


@radius_router.get ("/sessions/{uid}")
async def get_sessions (
    uid: str,
    current_user: Annotated[User, Depends(get_current_user)]
) -> list[RadAcct]:
    """
    Renvoie les session de comptabilité de l'utilisateur
    """
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )

    sess = get_user_sessions (uid)

    return sess


@radius_router.delete ("/sessions/{uid}/{suppr}")
async def del_sessions (
    uid: str,
    suppr: bool,
    current_user: Annotated[User, Depends(get_current_user)]
) -> str:
    """
    Renvoie les session de comptabilité de l'utilisateur
    """
    if not current_user.is_admin:
        raise HTTPException (
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'avez pas les droits pour réaliser cette action"
        )
    print(suppr, uid)
    with Session (engine_radius) as session:
        if suppr:
            statement = delete (RadAcct).where (RadAcct.username == uid)
        else:
            statement = update (RadAcct)\
                .where (RadAcct.username == uid, RadAcct.acctstoptime == None)\
                .values (acctstoptime=datetime.now(tz=ZoneInfo("Europe/Paris")))
        session.exec (statement)
        session.commit ()
        return "Success"