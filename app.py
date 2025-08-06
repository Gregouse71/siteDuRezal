from fastapi import FastAPI
from sqlmodel import Session, select

from database import UserReceived, User, engine, create_user

app = FastAPI()

@app.get ("/is_alive")
def is_alive ():
    return True

@app.post ("/users")
def post_users (user_to_create: UserReceived):
    """
    Crée un utilisateur dans la db
    """
    with Session (engine) as session:
        user_rec = UserReceived.model_validate (user_to_create)
        user = create_user (user_rec)

        session.add (user)
        session.commit ()
        return user_to_create

@app.delete ("/users/{uid}")
def delete_users (uid: str):
    """
    Efface de la db les utilisateurs ayant pour uid *uid*
    """
    with Session (engine) as session:
        statement = select (User).where (User.uid == uid)
        users_to_del = session.exec (statement).all () # liste des utilisateurs à effacer

        for user in users_to_del:
            session.delete (user)

        session.commit()
        return users_to_del