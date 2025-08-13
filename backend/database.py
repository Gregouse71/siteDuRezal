from pydantic import EmailStr
from sqlmodel import SQLModel, Session, Field, UniqueConstraint, create_engine, select
from Crypto.Hash import MD4

class UserReceived(SQLModel):
    """
    Classe représentant les utilisateurs envoyés par le frontend.
    Sert à la validation.
    """

    nom: str
    prenom: str
    email: EmailStr
    mot_de_passe: str
    promo: str  # 24, 25, XX pour ceux qui ne sont pas de l'école


class UserUpdate (SQLModel, table=False):
    """
    Classe représentant les modifications à faire à un utilisateur
    """
    nom: str | None = None
    prenom: str | None = None
    email: EmailStr | None = None
    promo: str | None = None

    is_admin: bool | None = None


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
    nt_password: str

    nom: str
    prenom: str
    email: EmailStr


def user_from_received (user_rec: UserReceived) -> User:
    """
    Génère un utilisateur à partir des données reçues
    """
    # Hashage du mot de passe, NTLM (c'est horrible mais le radius en a besoin)
    ntlm_hash = MD4.new (user_rec.mot_de_passe.encode ('utf-16le')). hexdigest ().upper ()

    return User (uid=user_rec.promo + user_rec.nom, 
                 nom=user_rec.nom,
                 prenom=user_rec.prenom,
                 email=user_rec.email,
                 is_admin=False,
                 acces_wifi=False,
                 nt_password=ntlm_hash
                )


def add_new_user_db (
    user_to_create: UserReceived
) -> User:
    """
    Créé un nouvel utilisateur dans la bdd
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
            acces_wifi=False,
            nt_password="075C574484C3F64146E8230E72B9754B"
        ))
        session.commit ()