from sqlmodel import Session, select, col
from ldap3 import Connection

from database import User, engine
from ldap import server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD



if __name__ == "__main__":
    with Session(engine) as session:
        statement = select (User). where (col (User.uid).contains (" "))
        users = session.exec (statement).all ()
        for user in users:
            print (user)
            uid = user.uid
            new_uid = uid.replace (" ", "")
            user.uid = new_uid
            session.add (user)

            with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
                c.modify_dn('uid={uid},ou=People,dc=rezal-mdm,dc=com', 'uid={new_uid}')

        session.commit ()
