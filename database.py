from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from typing import Annotated

from sqlmodel import SQLModel, Session, Field, UniqueConstraint, create_engine, select

class UserReceived(SQLModel, table=False):
    """
    Classe représentant les utilisateurs envoyés par le frontend.
    Sert à la validation.
    """

    nom: str
    prenom: str
    email: str
    promo: str  # 24, 25, XX pour ceux qui ne sont pas de l'école


class User (UserReceived, table=True):
    """
    Classe représentant les utilisateurs dans la bdd
    """
    __tablename__ = 'users'
    __table_args__ = (UniqueConstraint("uid"),)   # On veut que l'uid soit unique
    id: int = Field (primary_key=True)
    uid: str  # uid correspondant au LDAP

    is_admin: bool

    acces_wifi: bool


class UserUpdate (SQLModel, table=False):
    """
    Classe représentant les modifications à faire à un utilisateur
    """
    uid: str

    is_admin: bool | None = None
    acces_wifi: bool | None = None



def user_from_received (user_rec: UserReceived):
    """
    Génère un utilisateur à partir des données reçues
    """
    return User (uid=user_rec.promo + user_rec.nom, 
                 nom=user_rec.nom,
                 prenom=user_rec.prenom,
                 email=user_rec.email,
                 promo=user_rec.promo,
                 is_admin=False,
                 acces_wifi=False)



# Setting up the database connection and session
engine = create_engine('sqlite:///./test.db')
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

            nom="Admin",
            prenom="Piche",
            email="admin@rezal-mdm.com",
            promo="XX",
            acces_wifi=False
        ))
        session.commit ()