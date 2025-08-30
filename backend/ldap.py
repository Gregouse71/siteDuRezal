# Source : https://ldap3.readthedocs.io/en/latest/index.html

from ldap3 import Server, Connection, ObjectDef, AttrDef, Reader, Writer, ALL, HASHED_SALTED_SHA512
from ldap3.utils.hashed import hashed
import os
from dotenv import load_dotenv

load_dotenv ()
LDAP_ADMIN_USERNAME = os.getenv ("LDAP_USERNAME")
LDAP_ADMIN_PASSWORD = os.getenv ("LDAP_PASSWORD")

server = Server ("ldaps://ldap.rezal-mdm.com", get_info=ALL)


def ldap_verify_username_password (username: str, password: str) -> bool:
    """
    Vérifie si username et password sont les
    """
    distinguished_name = f"uid={username},ou=People,dc=rezal-mdm,dc=com"
    try:
        with Connection (server, distinguished_name, password) as conn:
              # Si l'utilisateur avec cet username et password peut s'authentifier, c'est bon
            if not conn.extend.standard.who_am_i () is None:
                return True
    except:
        pass
    # Dans tous les autres cas, l'utilisateur n'est pas bien authentifié
    return False


def ldap_add_user (uid: str, password: str, promo: str, nom, prenom):
    """
    Ajoute l'utilisateur dont le nom d'utilisateur est *username* au LDAP
    Si la promo n'est pas XX, il est aussi ajouté au groupe de sa promo
    """
    distinguished_name = f"uid={uid},ou=People,dc=rezal-mdm,dc=com"
    hashed_password = hashed(HASHED_SALTED_SHA512, password)

    print (distinguished_name)

    with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
        # Creation de l'utilisateur
        conn.add (distinguished_name, "inetOrgPerson", {"sn": prenom, "cn": nom, "uid": uid})
        # Changement du mot de passe, en utilisant la méthode par défaut du LDAP (qui, on l'espere, est securisee (c'est une blague, il faut la configurer soit meme pour qu'elle soit securisee))
        conn.extend.standard.modify_password (distinguished_name, None, password)


def test_ldap ():
    server = Server ("ldaps://ldap.rezal-mdm.com", get_info=ALL)
    with Connection (server, LDAP_ADMIN_USERNAME, LDAP_ADMIN_PASSWORD) as conn:
        print (f"Bind : {conn.bind()}")
        print (f"Who : {conn.extend.standard.who_am_i ()}")
        print (conn)
        # print (server.info)
        obj = ObjectDef ("groupOfNames", conn)
        print (obj)
        r = Reader(conn, obj, "cn=wifi,ou=Gestion,ou=Groups,dc=rezal-mdm,dc=com")
        r.search ()
        w = Writer.from_cursor(r)
        # print (r)
        # for e in r:
        #     print (e)
        # print (w[0])
        # w[0].member += "uid=24liens,ou=People,dc=rezal-mdm,dc=com"
        # w.commit ()
        # print (w[0])

if __name__ == "__main__":
    ldap_add_user ("23frucharde", "1234", "24", "fru", "ach")
    test_ldap ()