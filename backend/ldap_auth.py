# Source : https://ldap3.readthedocs.io/en/latest/index.html

from ldap3 import Server, Connection, ObjectDef, AttrDef, Reader, Writer, ALL
import os
from dotenv import load_dotenv

server = Server ("ldaps://ldap.rezal-mdm.com", get_info=ALL)

def test_ldap ():
    load_dotenv ()
    LDAP_USERNAME = os.getenv ("LDAP_USERNAME")
    LDAP_PASSWORD = os.getenv ("LDAP_PASSWORD")

    server = Server ("ldaps://ldap.rezal-mdm.com", get_info=ALL)
    with Connection (server, LDAP_USERNAME, LDAP_PASSWORD) as conn:
        print (f"Bind : {conn.bind()}")
        print (f"Who : {conn.extend.standard.who_am_i ()}")
        print (conn)
        print (server.info)
        obj = ObjectDef ("groupOfNames", conn)
        print (obj)
        r = Reader(conn, obj, "ou=Groups,dc=rezal-mdm,dc=com")

        r.search ()
        print (r)
        for e in r:
            print (e)
