


setup: setup-front
	ln -irs hooks/* .git/hooks/

setup-front:
	cd frontend &&\
	(npm --version > /dev/null || (echo Merci d\'installer npm)) &&\
	npm ci
