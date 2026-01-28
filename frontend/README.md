# Le frontend

Le frontend est écrit en React. Je vous laisse apprécier l'abondance de commentaires et la structure de dossiers des plus claires.

On commence par installer les packets avec npm :
```bash
npm install -g serve  # Webserveur pour servir le site
npm install
```

On peut ensuite réaliser la compilation du site, et le servir :
```bash
npm run dev
```

Le serveur écoute alors normalement sur le port 3000.

Attention : dans * src/base_url.js * se trouve l'url qui permet d'identifier l'api. Si vous déplacez le site, il faudra le modifier directement sur la machine qui héberge le site. Ce fichier n'est pas suivi par git car il peut être différent sur l'ordinateur de chacun pour le développement.
