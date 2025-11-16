# Variables d'environnement

Ce document liste toutes les variables d'environnement utilisées dans l'application.

## Configuration de l'API

```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_SUFIX=/api/v1
```

## Configuration du rafraîchissement automatique des informations utilisateur

Ces variables permettent de configurer le système de rafraîchissement périodique des permissions et informations utilisateur.

### VITE_USER_REFRESH_INTERVAL

**Description:** Intervalle de rafraîchissement en millisecondes

**Type:** Nombre (string)

**Défaut:** `20000` (20 secondes)

**Exemples:**
- 20 secondes: `20000` (défaut, pour une mise à jour rapide)
- 1 minute: `60000`
- 2 minutes: `120000`
- 5 minutes: `300000`
- 10 minutes: `600000`

```env
VITE_USER_REFRESH_INTERVAL=20000
```

### VITE_USER_REFRESH_ONLY_VISIBLE

**Description:** Activer le rafraîchissement uniquement quand la fenêtre est visible

**Type:** Booléen (`"true"` ou `"false"`)

**Défaut:** `"true"`

**Explication:** Si activé, le rafraîchissement ne se fera que lorsque l'onglet du navigateur est visible. Cela permet d'économiser les ressources quand l'utilisateur n'utilise pas activement l'application.

```env
VITE_USER_REFRESH_ONLY_VISIBLE=true
```

### VITE_USER_REFRESH_ON_VISIBILITY_CHANGE

**Description:** Activer le rafraîchissement immédiat quand la fenêtre redevient visible

**Type:** Booléen (`"true"` ou `"false"`)

**Défaut:** `"true"`

**Explication:** Si activé, les informations utilisateur seront rafraîchies immédiatement quand l'utilisateur revient sur l'onglet après une absence.

```env
VITE_USER_REFRESH_ON_VISIBILITY_CHANGE=true
```

## Exemple de fichier .env complet

Créez un fichier `.env` à la racine du projet :

```env
# Configuration de l'API
VITE_API_BASE_URL=https://api.example.com
VITE_API_SUFIX=/api/v1

# Configuration du rafraîchissement automatique des informations utilisateur
# Intervalle de rafraîchissement en millisecondes (défaut: 20000 = 20 secondes)
VITE_USER_REFRESH_INTERVAL=20000

# Activer le rafraîchissement uniquement quand la fenêtre est visible (défaut: true)
VITE_USER_REFRESH_ONLY_VISIBLE=true

# Activer le rafraîchissement immédiat quand la fenêtre redevient visible (défaut: true)
VITE_USER_REFRESH_ON_VISIBILITY_CHANGE=true
```

## Notes importantes

1. **Variables VITE_**: Toutes les variables d'environnement accessibles côté client doivent commencer par `VITE_` dans Vite.

2. **Redémarrage requis**: Après modification du fichier `.env`, vous devez redémarrer le serveur de développement pour que les changements prennent effet.

3. **Fichiers .env**: Vous pouvez créer différents fichiers selon l'environnement :
   - `.env` - Variables par défaut
   - `.env.local` - Variables locales (ignoré par git)
   - `.env.development` - Variables pour le développement
   - `.env.production` - Variables pour la production

4. **Sécurité**: Ne commitez jamais le fichier `.env` contenant des secrets. Utilisez `.env.example` pour documenter les variables nécessaires.

