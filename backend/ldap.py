# Source : https://ldap3.readthedocs.io/en/latest/index.html

from ldap3 import Server, Connection, ObjectDef, AttrDef, Reader, Writer, ALL, HASHED_SALTED_SHA512, MODIFY_DELETE
import os
from dotenv import load_dotenv

from database import User

# Recuperation des identifiants de connexion au LDAP
load_dotenv ()
LDAP_ADMIN_USERNAME = os.getenv ("LDAP_USERNAME")
LDAP_ADMIN_PASSWORD = os.getenv ("LDAP_PASSWORD")
LDAP_SERVER = os.getenv ("LDAP_SERVER")

# Paramètres relatifs au LDAP :
POSITION_UTILISATEURS = os.getenv ("POSITION_UTILISATEURS_LDAP") # Position des utilisateurs dans l'arbre du LDAP
GROUPE_WIFI = os.getenv ("GROUPE_WIFI_LDAP") # Groupe dans lequel il faut être pour avoir le WiFi
GROUPE_ADMIN = os.getenv ("GROUPE_ADMIN_LDAP") # Groupe des admins du site

def distinguished_name_from_uid (uid: str):
    return f"uid={uid},{POSITION_UTILISATEURS}"

server = Server (LDAP_SERVER, get_info=ALL, port = 636, use_ssl = True)

def allow_ldap_wifi (uid: str):
    """
    Autorise l'acces au wifi à l'utilisateur *uid*
    """
    return ldap_add_user_to_group (uid.replace(" ", ""), GROUPE_WIFI)

def disallow_ldap_wifi (uid: str):
    """
    N'autorise plus l'acces à l'utilisateur dont l'uid est *uid*
    """
    return ldap_delete_user_from_group (uid.replace(" ", ""), GROUPE_WIFI)


def has_ldap_wifi (uid:str):
    """
    Détermine si l'utilisateur *uid* a accès au wifi
    """
    return ldap_user_in_group (uid, GROUPE_WIFI)


def has_ldap_site_admin (uid:str):
    """
    Détermine si l'utilisateur *uid* est admin du site
    """
    return ldap_user_in_group (uid, GROUPE_ADMIN)


def ldap_verify_username_password (username: str, password: str) -> bool:
    """
    Vérifie si username et password correspondent à un utilisateur du ldap
    """
    distinguished_name = distinguished_name_from_uid(username)
    try:
        with Connection (server, distinguished_name, password) as conn:
              # Si l'utilisateur avec cet username et password peut s'authentifier, c'est bon
            if not conn.extend.standard.who_am_i () is None:
                return True
    except:
        pass
    # Dans tous les autres cas, l'utilisateur n'est pas bien authentifié
    return False


def ldap_add_user (user: User, password: str) -> bool:
    """
    Ajoute l'utilisateur dont le nom d'utilisateur est *username* au LDAP
    Si la promo n'est pas XX, il est aussi ajouté au groupe de sa promo
    """
    distinguished_name = distinguished_name_from_uid(user.uid)
    promo: str, nom, prenom, mail

 user.nom, user.prenom, user.email

    try:
        with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
            # Creation de l'utilisateur
            conn.add (distinguished_name, "inetOrgPerson", {
                "sn": user.prenom,
                "cn": user.nom,
                "uid": user.uid,
                "mail": user.email
            })
            # Changement du mot de passe, en utilisant la méthode par défaut du LDAP (qui, on l'espere, est securisee (c'est une blague, il faut la configurer soit meme pour qu'elle soit securisee))
            conn.extend.standard.modify_password (distinguished_name, None, password)
        return True

    except:
        return False


def ldap_change_pwd (uid: str, password: str):
    """
    Change le mot de passe ldap de l'utilisateur
    """
    distinguished_name = distinguished_name_from_uid(uid)
    try:
        with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
            # Changement du mot de passe, en utilisant la méthode par défaut du LDAP (qui, on l'espere, est securisee (c'est une blague, il faut la configurer soit meme pour qu'elle soit securisee))
            conn.extend.standard.modify_password (distinguished_name, None, password)
        return True

    except:
        return False


def ldap_delete_user (uid: str):
    """
    Efface l'utilisateur dont l'uid est *uid* du LDAP
    """
    distinguished_name = distinguished_name_from_uid(uid)
    try:
        with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
            return conn.delete (distinguished_name)
    except:
        return False


def ldap_add_user_to_group (uid: str, group: str):
    """
    Ajoute l'utilisateur dont l'**identifiant** est *uid* (e.g. 24girardet) au groupe *group* (e.g. cn=wifi,ou=Gestion,ou=Groups,dc=rezal-mdm,dc=com)
    """
    distinguished_name = distinguished_name_from_uid(uid)
    try:
        with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
            obj = ObjectDef ("groupOfNames", conn)
            r = Reader (conn, obj, group)
            r.search ()
            w = Writer.from_cursor (r)
            w[0].member += distinguished_name
            w.commit ()
        return True
    except:
        return False


def ldap_delete_user_from_group (uid: str, group: str):
    """
    Retire l'utilisateur dont l'**identifiant** est *uid* (e.g. 24girardet) du groupe *group* (e.g. cn=wifi,ou=Gestion,ou=Groups,dc=rezal-mdm,dc=com)
    """
    distinguished_name = distinguished_name_from_uid(uid)
    try:
        with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
            conn.modify (group, {"member": [(MODIFY_DELETE, [distinguished_name])]})
        return True
    except:
        return False


def ldap_user_in_group (uid: str, group: str):
    """
    Détermine si l'utilisateur *uid* est membre du groupe *group*
    i.e. si *uid* est dans la liste des membres de *group*
    """
    try:
        with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
            obj = ObjectDef ("groupOfNames", conn)
            r = Reader(conn, obj, group)
            r.search ()
            return distinguished_name_from_uid (uid) in r[0].member
    except:
        return False


def test_ldap ():
    conn =  Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD, )
    print (conn)
    print (f"Bind : {conn.bind()}")
    print (f"Who : {conn.extend.standard.who_am_i ()}")
    # print (server.info)
    obj = ObjectDef ("groupOfNames", conn)
    print (obj)
    r = Reader(conn, obj, GROUPE_WIFI)
    r.search ()
    # w = Writer.from_cursor(r)
    # print (r)
    for e in r:
        print (e)
    # print (w[0])
    # w[0].member += "uid=24liens,ou=People,dc=rezal-mdm,dc=com"
    # w.commit ()
    # print (w[0])

if __name__ == "__main__":
    # ldap_add_user ("23frucharde", "1234", "24", "fru", "ach")
    # ldap_add_user_to_group ("23frucharde", GROUPE_WIFI)
    # ldap_delete_user_from_group ("23frucharde", GROUPE_WIFI)
    # ldap_delete_user ("uid=23frucharde,ou=People,dc=rezal-mdm,dc=com")
    # print (allow_ldap_wifi ("23frucharde"))
    # print (disallow_ldap_wifi ("23frucharde"))
    # print(ldap_user_in_group ("23frucharde", GROUPE_ADMIN))
    # print (has_ldap_site_admin ("24girardet"))
    # print (has_ldap_site_admin ("23frucharde"))
    # print (has_ldap_wifi ("24girardet"))
    # print (has_ldap_wifi ("23frucharde"))
    test_ldap ()
