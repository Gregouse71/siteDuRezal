from pydantic import EmailStr
from datetime import datetime
from sqlmodel import SQLModel, Session, Field, UniqueConstraint, create_engine, select
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv
from unidecode import unidecode

load_dotenv ()
DATABASE_SERVER = os.getenv ("DATABASE_SERVER")

class UserReceived(SQLModel):
    """
    Classe représentant les utilisateurs envoyés par le frontend.
    Sert à la validation.
    """

    nom: str
    prenom: str
    email: EmailStr
    promotion: str  # 24, 25, XX pour ceux qui ne sont pas de l'école

class UserUpdate (SQLModel, table=False):
    """
    Classe représentant les modifications à faire à un utilisateur
    """
    nom: str | None = None
    prenom: str | None = None
    email: EmailStr | None = None
    promotion: str | None = None

    is_admin: bool | None = None
    acces_wifi: bool | None = None
    email_verifie: bool | None = None
    credits: int | None = None

    cotizT1: bool | None = None
    t1PaidAt: datetime | None = None
    cotizT2: bool | None = None
    t2PaidAt: datetime | None = None
    cotizT3: bool | None = None
    t3PaidAt: datetime | None = None
    t1PaymentType: str | None = None
    t2PaymentType: str | None = None
    t3PaymentType: str | None = None

    detail: str | None = None


class User (SQLModel, table=True):
    """
    Classe représentant les utilisateurs dans la bdd
    """
    __tablename__ = 'users'
    __table_args__ = (UniqueConstraint("uid"),)   # On veut que l'uid soit unique
    id: int = Field (primary_key=True)
    uid: str  # uid correspondant au LDAP

    is_admin: bool
    acces_wifi: bool
    email_verifie: bool
    has_lost_pass: bool

    nom: str
    prenom: str
    promotion: str
    email: EmailStr
    createdAt: datetime
    credits: int

    cotizT1: bool | None = None
    t1PaidAt: datetime | None = None
    cotizT2: bool | None = None
    t2PaidAt: datetime | None = None
    cotizT3: bool | None = None
    t3PaidAt: datetime | None = None
    t1PaymentType: str | None = None
    t2PaymentType: str | None = None
    t3PaymentType: str | None = None

    detail: str | None = None


def user_from_received (user_rec: UserReceived) -> User:
    """
    Génère un utilisateur à partir des données reçues
    """
    return User (uid=user_rec.promotion + unidecode(user_rec.nom).lower ().replace (" ", ""), 
                 nom=user_rec.nom,
                 prenom=user_rec.prenom,
                 email=user_rec.email,
                 is_admin=False,
                 acces_wifi=False,
                 email_verifie=False,
                 createdAt=datetime.now(),
                 promotion=user_rec.promotion,
                 has_lost_pass=False,
                 credits=0,
                )


def add_new_user_db (
    user_to_create: UserReceived,
) -> User:
    """
    Créé un nouvel utilisateur dans la bdd
    """
    # Cette fonction a-t-elle vraiment besoin d'être récursive ?
    # Certains vous dirons que non. Et bien moi je pense que ce n'est pas tous les
    # qu'on a la possibilité de faire crasher son sevrveur avec une récursivité
    # qui crash si elle atteint sa condiftion d'arrêt.
    with Session (engine) as session:
        user_rec = UserReceived.model_validate (user_to_create)
        user = user_from_received (user_rec)

        # On vérifie que l'adresse mail est unique
        statement = select (User). where (User.email == user.email)
        collisions = session.exec (statement).all ()
        if collisions:
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cette adresse mail est déjà utilisée"
            )

        # On vérifie qu'il n'y a pas déjà d'utilisateur avec cet uid
        statement = select (User). where (User.uid == user.uid)
        collisions = session.exec (statement).all ()

        while collisions:
            user.uid = user.uid + "_"
            statement = select (User). where (User.uid == user.uid)
            collisions = session.exec (statement).all ()

        try:
            session.add (user)
            session.commit ()
            session.refresh (user)
            return user
        except:
            session.rollback ()
            raise HTTPException (
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Erreur inconnue"
            )


def get_user_db (
    uid: str
) -> list [User]:
    """
    Renvoie l'utilisateur dont *uid* est l'uid
    """
    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        user = session.exec (statement).all ()

        return user


def patch_user_db (
    user: User,
    patch: UserUpdate
) -> User:
    with Session (engine) as session:
        data = patch.model_dump (exclude_unset=True)

        user.sqlmodel_update (data)
        session.add (user)
        session.commit()
        session.refresh (user)

        return user


def delete_user_db (
    users_to_del: list [User]
) -> list [User]:
    with Session (engine) as session:
        for user in users_to_del:
            session.delete (user)
        session.commit()
        return users_to_del


# Setting up the database connection and session
engine = create_engine(DATABASE_SERVER, pool_recycle=3600)
SQLModel.metadata.create_all(engine)


# Au démarrage, on s'assure que tout le monde a un compte
# TODO : en réalité, il faudrait pull tous les comtes du LDAP
with Session (engine) as session:
    statement = select (User).where (User.uid == "admin")
    user = session.exec (statement).all ()
    if not user:
        session.add (User (
            uid="admin",
            is_admin=True,
            promotion="XX",

            nom="Admin",
            prenom="Piche",
            email="admin@rezal-mdm.com",
            acces_wifi=False,
            email_verifie=True,
            has_lost_pass=False,
            credits=0,

            createdAt = datetime.now()
        ))
        session.add (User (
            uid="24girardet",
            is_admin=True,
            promotion="24",

            nom="Greg",
            prenom="Piche",
            email="gregoire.girardet@etu.minesparis.psl.eu",
            acces_wifi=False,
            email_verifie=True,
            has_lost_pass=False,
            credits=0,

            createdAt=datetime.now()
        ))
        session.add (User (
            uid="24liens",
            is_admin=True,
            promotion="24",

            nom="Liens",
            prenom="Mathis",
            email="mathis.liens@etu.minesparis.psl.eu",
            acces_wifi=False,
            email_verifie=True,
            has_lost_pass=False,
            credits=0,

            createdAt=datetime.now()
        ))
        session.commit ()
