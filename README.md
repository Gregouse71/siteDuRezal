# Site du Rézal

Ce répertoire contient le site du Rézal, nouvelle version modernisé de 2025. Il est divisé en un frontend écrit javascript avec React, et un backend écrit en python avec fastapi.

## Frontend

Le frontend a été récupéré de la cersion précédente du site.

## Backend

Le backend a été entièrement réécrit. Il est conçu pour réaliser l'authentification des utilisateurs avec le protocole LDAP avec le serveur du Rézal. Ainsi la vérification de l'identité des utilisateurs est centralisée, et peut être réutilisée par d'autres services. Une base de données est tout de même nécessaire utilisée pour stocker les informations des utilisateurs propres uniquement au Rézal.
