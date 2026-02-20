#!/bin/bash
# Script de mise à jour du site du Rézal, à partir du repo GitLab
# Par Mathis Liens et Grégoire Girardet

# Si c'est la copie, on utilise rrsync pour limiter les possibilités
if [[ "$SSH_ORIGINAL_COMMAND" == rsync* ]]; then
    /usr/bin/rrsync -wo /home/rezal/site_rezal2025

# Si c'est la mise à jour
elif [[ "$SSH_ORIGINAL_COMMAND" == "update-site" ]]; then
    set -e
    # Restauration du fichier .env
    cp /home/rezal/.env /home/rezal/site_rezal2025/backend
    cd /home/rezal/site_rezal2025
    
    #On arrête le backend, juste au cas où il soit un peu sensible au remplacement de code
    echo "Arrêt des services"
    systemctl stop --user site-rezal-backend
    
    echo "Mise à jour des dépendances javascript front..."
    cd frontend
    npm install --omit=dev
    
    echo "Building front..."
    npm run build
    cp -r build/* /var/www/site_rezal
    
    echo "Done"
    
    #Au tour du back
    cd ../backend
    echo "Téléchargement des nouvelles dépendance backend"
    /home/rezal/miniconda3/bin/conda env update --file environment.yml --prune --quiet
    echo "Fini"
    
    echo "restarting backend"
    systemctl start --user site-rezal-backend
    
    echo "Fini"
    #Sleep 2 histoire que les services aient le temps de planter si nécessaire, sinon tant qu'ils démarrent le statut est forcément bon
    sleep 10
    systemctl status --user "site-rezal-backend"
else
    echo Commande invalide
fi