from pydantic import EmailStr
from datetime import datetime
from sqlmodel import SQLModel, Session, Field, UniqueConstraint, create_engine, select
from fastapi import HTTPException, status
import os
from dotenv import load_dotenv
from Crypto.Hash import MD4

load_dotenv ()
DATABASE_SERVER = os.getenv ("DATABASE_SERVER")
RADIUS_SERVER = os.getenv ("RADIUS_SERVER")

class UserReceived(SQLModel):
    """
    Classe représentant les utilisateurs envoyés par le frontend.
    Sert à la validation.
    """

    nom: str
    prenom: str
    email: EmailStr
    mot_de_passe: str
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
    mot_de_passe: str | None = None

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
    mot_de_passe: str | None = None  # Pour conserver entre la creation du compte et l'ajout au ldap
    nt_pass: str

    nom: str
    prenom: str
    promotion: str
    email: EmailStr
    createdAt: datetime

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
    hash = MD4.new()
    hash.update(user_rec.mot_de_passe.encode('utf-16le'))
    
    return User (uid=user_rec.promotion + user_rec.nom.lower (), 
                 nom=user_rec.nom,
                 prenom=user_rec.prenom,
                 email=user_rec.email,
                 is_admin=False,
                 acces_wifi=False,
                 email_verifie=False,
                 createdAt=datetime.now(),
                 mot_de_passe=user_rec.mot_de_passe,
                 promotion=user_rec.promotion,
                 nt_pass=hash.hexdigest(),
                )


def add_new_user_db (
    user_to_create: UserReceived,
    i=0,
    uid_candidate=""
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

        # On vérifie qu'il n'y a pas déjà d'utilisateur avec cet uid
        statement = select (User). where (User.uid == user.uid)
        collisions = session.exec (statement).all ()

        if collisions:
            if i < len (user_to_create.prenom):
                next_uid_candidate = user.uid + user.prenom[0] if uid_candidate == "" else uid_candidate + user.prenom[i]
            else:
                next_uid_candidate = uid_candidate + str (i)
            return add_new_user_db (user_to_create, i + 1, next_uid_candidate)

        session.add (user)
        session.commit ()
        session.refresh (user)
        return user


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


class RadiusUser (SQLModel, table=True):
    """
    Classe représentant les utilisateurs dans la bdd du Radius
    """
    __tablename__ = 'radcheck'
    id: int = Field (primary_key=True)
    username: str
    attribute: str
    op: str
    value: str

    def __init__ (self, uid: str, nt_pass: str):
        self.username = uid
        self.attribute = "NT-Password"
        self.op = ":="
        self.value = nt_pass


def allow_radius_wifi (uid: str, pwd: str):
    with Session(radius_engine) as session:
        new_user = RadiusUser(uid, pwd)
        session.add (new_user)
        session.commit ()
        return True


def disallow_radius_wifi (uid):
    with Session (radius_engine) as session:
        statement = select (RadiusUser).where (RadiusUser.id == uid)
        user_to_del = session.exec (statement).all()
        for u in user_to_del:
            session.delete (u)
        return True


# Setting up the database connection and session
print (DATABASE_SERVER)
engine = create_engine(DATABASE_SERVER)
SQLModel.metadata.create_all(engine)

radius_engine = create_engine(RADIUS_SERVER)
if __name__ == "__main__":
    print ("Testing")
    with Session(radius_engine) as session:
        # statement = select (RadiusUser).where (RadiusUser.id == "18adamy")
        # user = statement.exec().first()
        # print (user)
        allow_radius_wifi ("24girardet", "")

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

            createdAt=datetime.now()
        ))
        session.commit ()