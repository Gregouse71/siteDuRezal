from sqlmodel import Session, select, col
from ldap3 import Connection

from database import User, engine
from ldap import server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD, has_ldap_wifi, allow_ldap_wifi, disallow_ldap_wifi



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

            has_wifi = has_ldap_wifi (uid)
            if has_wifi:
                disallow_ldap_wifi(uid)
                allow_ldap_wifi(new_uid)

            with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
                conn.modify(f'uid={uid},ou=People,dc=rezal-mdm,dc=com', {'uid': [('MODIFY_REPLACE', [f'{new_uid}'])]})
                conn.modify_dn(f'uid={uid},ou=People,dc=rezal-mdm,dc=com', f'uid={new_uid}')

        session.commit ()
