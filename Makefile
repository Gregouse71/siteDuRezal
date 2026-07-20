.ONESHELL:


setup: setup-front setup-back
	ln -rfs hooks/* .git/hooks/

setup-front:
	cd frontend
	npm --version > /dev/null || (echo Merci d\'installer npm) 
	npm ci

setup-back:
	cd backend
	conda --version > /dev/null || echo "Merci d'installer conda, ou de faire la migration vers un autre gestionnaire de paquet"
	conda env create --file environment.yml
	echo "Vous aurez besoin de `conda activate site_rezal` pour travailler sur le backend."

#Ce serait bien d'ajouter un truc qui mets en place une DB de dev...
# Ce que j'ai au taf c'est une seed, et puis après il garde un historique de tous les changement de table
# avec les codes qui ont tournés pour modifier la table, comme ça il y a juste à faire tourner l'ensemble de
# ces scripts chez tout le monde pour avoir une DB compatible avec la dernière version.