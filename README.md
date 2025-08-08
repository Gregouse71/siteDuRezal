# Site du Rézal

Le nouveau site du rézal.



En l'état, pour s'authentifier il faut : envoyer à /auth/token un username et un mot de passe, dont l'username est déjà dans la base de données avec le mot de passe <username> + 1 :
```bash
http -f -v POST :8000/auth/token username=24gir password=24gir1
```

Ensuite, toutes les opérations nécessitant d'être authentifié se font en renvoyant le token :
```bash
http GET :8000/user/me/ -v -A bearer -a <le token reçu précédemment>
```

TODO :
- [] Ajouter la verfication de l'email
- [] Communiquer avec la bdd du radius
- [] Finir de porter les fonctions de l'ancien nouveau site
- [] Faite le front (à adapter de l'ancien nouveau site)