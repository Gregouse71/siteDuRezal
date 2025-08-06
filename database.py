from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

from sqlmodel import SQLModel, Session, Field, create_engine

class UserReceived(SQLModel, table=False):
    """
    Classe représentant les utilisateurs envoyés par le frontend.
    Sert à la validation.
    """

    uid: str  # uid correspondant au LDAP

    name: str
    email: str


class User (UserReceived, table=True):
    """
    Classe représentant les utilisateurs dans la bdd
    """
    __tablename__ = 'users'
    id: int = Field (primary_key=True)

    acces_wifi: bool


def create_user (user_rec: UserReceived):
    return User (uid=user_rec.uid, name=user_rec.name, email=user_rec.email, acces_wifi=False)




# Setting up the database connection and session
engine = create_engine('sqlite:///./test.db')
SQLModel.metadata.create_all(engine)
