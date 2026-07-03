# Le backend

Fastapi permet de produire automatiquement la documentation de l'API.

## Pour le faire fonctionner

On commence par installer tous les packets nécessaires, par exemple en créant un environnement virtuel avec conda : `conda env create -f environment.yml`  
En suite, on active l'environnement et on lance le site :

```bash
conda activate site_rezal
fastapi run app.py
```

Fastapi écoute alors normalement sur le port 8000

## Authentification

Pour s'authentifier il faut : envoyer à /auth/token un username et un mot de passe. Le LDAP est alors interrogé pour verifier la validiter du mot de passe :

```bash
http -f -v POST :8000/auth/token username=24gir password=24gir1
```

Ensuite, toutes les opérations nécessitant d'être authentifié se font en renvoyant le token :

```bash
http GET :8000/user/me/ -v -A bearer -a <le token reçu précédemment>
```

## LDAP

Si nécessaire, des opérations manuelles peuvent être réalisée directement sur le LDAP :

- modifier un mot de passe : `ldappasswd -H ldaps://ldap.rezal-mdm.com -W -D cn=admin,dc=rezal-mdm,dc=com uid=<nom d'utilisateur>,ou=People,dc=rezal-mdm,dc=com`
- supprimer un utilisateur : `ldapdelete -H ldaps://ldap.rezal-mdm.com -W -D cn=admin,dc=rezal-mdm,dc=com uid=<nom d'utilisateur>,ou=People,dc=rezal-mdm,dc=com`
- faire un recherche : `ldapsearch -H ldaps://ldap.rezal-mdm.com -W -D cn=admin,dc=rezal-mdm,dc=com "<filtre>"`
  On remplace alors filtre par une expression qui permet de faire la recherche. Par exemple, _uid=*_ va rechercher tous les utilisateurs. _uid=nom_ va rechercher tous les utilisateurs dont l'uid est _nom_.

Plus d'infos dans la doc spécifique au LDAP.
