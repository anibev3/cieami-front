# Guide de Déploiement - Expert Auto

## Prérequis

- Node.js 18+ 
- pnpm 8+
- Accès au serveur de déploiement

## Installation des dépendances

```bash
pnpm install
```

## Build de production

Pour créer une version optimisée pour la production :

```bash
pnpm build:prod
```

Cette commande :
- Compile l'application avec Vite en mode production
- Optimise et minifie tous les assets
- Génère les fichiers dans le dossier `dist/`

## Structure des fichiers de build

Après le build, vous trouverez dans `dist/` :

```
dist/
├── index.html          # Point d'entrée de l'application
├── assets/             # Tous les assets compilés
│   ├── *.js           # Fichiers JavaScript
│   ├── *.css          # Fichiers CSS
│   └── *.png          # Images
└── images/            # Images statiques
```

## Déploiement

### Option 1 : Serveur web statique

1. Copiez le contenu du dossier `dist/` vers votre serveur web
2. Configurez votre serveur pour servir `index.html` pour toutes les routes
3. Assurez-vous que les en-têtes CORS sont correctement configurés

### Option 2 : Netlify

1. Connectez votre repository à Netlify
2. Configurez les paramètres de build :
   - Build command : `pnpm build:prod`
   - Publish directory : `dist`
3. Déployez

### Option 3 : Vercel

1. Connectez votre repository à Vercel
2. Vercel détectera automatiquement la configuration Vite
3. Le déploiement se fera automatiquement

## Configuration de l'environnement

### Variables d'environnement

Créez un fichier `.env.production` avec les variables nécessaires :

```env
VITE_API_BASE_URL=https://back.roomcodetraining.com/api/v1
VITE_APP_NAME=Expert Auto
```

### Configuration du serveur

Pour un serveur Apache, ajoutez un fichier `.htaccess` :

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Pour un serveur Nginx :

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Optimisations

### Compression

Activez la compression gzip sur votre serveur pour réduire la taille des fichiers.

### Cache

Configurez les en-têtes de cache appropriés :

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Monitoring

### Logs

Surveillez les logs d'erreur de votre serveur web pour détecter les problèmes.

### Performance

Utilisez des outils comme Lighthouse ou PageSpeed Insights pour surveiller les performances.

## Dépannage

### Erreurs TypeScript

Si vous rencontrez des erreurs TypeScript lors du build :

1. Utilisez `pnpm build:prod` au lieu de `pnpm build`
2. Vérifiez que toutes les dépendances sont installées
3. Nettoyez le cache : `pnpm store prune`

### Problèmes de routing

Si les routes ne fonctionnent pas en production :

1. Vérifiez la configuration de votre serveur web
2. Assurez-vous que toutes les routes redirigent vers `index.html`
3. Vérifiez les en-têtes CORS

### Problèmes d'API

Si l'API ne répond pas :

1. Vérifiez l'URL de l'API dans les variables d'environnement
2. Vérifiez les en-têtes CORS côté serveur
3. Testez l'API directement avec un outil comme Postman

## Support

Pour toute question ou problème, consultez :
- La documentation de Vite : https://vitejs.dev/
- La documentation de TanStack Router : https://tanstack.com/router
- Les logs d'erreur de votre serveur 