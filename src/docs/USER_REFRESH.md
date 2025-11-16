# Système de Rafraîchissement Automatique des Informations Utilisateur

## Vue d'ensemble

Le système de rafraîchissement automatique permet de mettre à jour périodiquement les informations utilisateur (permissions, rôles, type d'entité) sans nécessiter une reconnexion. Cela garantit que les modifications de permissions effectuées par un administrateur sont appliquées en temps réel.

## Fonctionnement

### Implémentation actuelle

Le système utilise un **rafraîchissement périodique** via le hook `useUserRefresh` qui :

1. **Appelle l'API `/auth/user`** à intervalle régulier (par défaut: 20 secondes)
2. **Met à jour automatiquement** les stores `authStore` et `aclStore`
3. **Rafraîchit immédiatement** quand la fenêtre redevient visible
4. **S'arrête automatiquement** quand l'utilisateur se déconnecte

### Configuration

La configuration se trouve dans `src/config/userRefresh.ts` :

```typescript
export const USER_REFRESH_CONFIG = {
  DEFAULT_INTERVAL: 20 * 1000, // 20 secondes
  ONLY_WHEN_VISIBLE: true,
  REFRESH_ON_VISIBILITY_CHANGE: true,
}
```

### Utilisation

Le hook est déjà intégré dans `AuthenticatedLayout` et s'active automatiquement pour tous les utilisateurs authentifiés.

Pour une utilisation personnalisée :

```tsx
import { useUserRefresh } from '@/hooks/useUserRefresh'

function MyComponent() {
  // Rafraîchissement toutes les 2 minutes
  useUserRefresh({
    interval: 2 * 60 * 1000,
    onlyWhenVisible: true,
    enabled: true,
    onRefreshSuccess: () => {
      console.log('Permissions mises à jour!')
    },
    onRefreshError: (error) => {
      console.error('Erreur lors du rafraîchissement:', error)
    },
  })

  return <div>...</div>
}
```

## Alternatives

### Option 1: Rafraîchissement périodique (actuel) ✅

**Avantages:**

- ✅ Simple à implémenter
- ✅ Pas de dépendances supplémentaires
- ✅ Fonctionne avec n'importe quelle API REST
- ✅ Contrôle total sur la fréquence

**Inconvénients:**

- ⚠️ Délai entre la modification et l'application (jusqu'à l'intervalle)
- ⚠️ Appels API même si rien n'a changé

**Recommandation:** Utiliser un intervalle de 2-5 minutes pour un bon équilibre entre réactivité et charge serveur.

### Option 2: WebSocket / Server-Sent Events (SSE)

**Avantages:**

- ✅ Mises à jour en temps réel (instantanées)
- ✅ Pas d'appels API inutiles
- ✅ Communication bidirectionnelle

**Inconvénients:**

- ⚠️ Nécessite une infrastructure WebSocket/SSE côté serveur
- ⚠️ Plus complexe à implémenter
- ⚠️ Gestion de reconnexion nécessaire

**Implémentation suggérée:**

```typescript
// Exemple avec WebSocket
const ws = new WebSocket('wss://api.example.com/user-updates')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'permissions_updated') {
    // Rafraîchir les informations utilisateur
    getUserInfo()
  }
}
```

### Option 3: Polling intelligent avec ETag / Last-Modified

**Avantages:**

- ✅ Réduit la bande passante (304 Not Modified)
- ✅ Simple à implémenter
- ✅ Compatible avec HTTP standard

**Inconvénients:**

- ⚠️ Nécessite un support ETag côté serveur
- ⚠️ Toujours un délai (même si réduit)

### Option 4: Rafraîchissement sur événements spécifiques

**Avantages:**

- ✅ Pas d'appels inutiles
- ✅ Contrôle précis

**Inconvénients:**

- ⚠️ Nécessite de déclencher manuellement
- ⚠️ Peut manquer des mises à jour

**Exemple:**

```typescript
// Rafraîchir après certaines actions
const handlePermissionChange = async () => {
  await updatePermission()
  // Rafraîchir les infos utilisateur
  await getUserInfo()
}
```

## Recommandation

Pour la plupart des cas d'usage, **l'option 1 (rafraîchissement périodique)** est la meilleure solution car :

1. Elle est déjà implémentée et fonctionnelle
2. Elle ne nécessite pas de modifications côté serveur
3. Un intervalle de 20 secondes offre une mise à jour rapide des permissions
4. Le rafraîchissement immédiat à la visibilité garantit une mise à jour rapide

Si vous avez besoin de mises à jour **instantanées**, envisagez l'**option 2 (WebSocket/SSE)** mais cela nécessitera une infrastructure supplémentaire.

## Indicateur de chargement discret

Lors de la vérification de l'authentification, un **indicateur de chargement discret** s'affiche en haut à droite de l'écran au lieu d'une page de chargement complète. Cela améliore l'expérience utilisateur en :

- ✅ Évitant le flash de contenu lors du chargement
- ✅ Permettant à l'utilisateur de voir le contenu pendant la vérification
- ✅ Affichant un indicateur non intrusif avec le message "Vérification de l'authentification..."

Le composant `AuthLoadingIndicator` est utilisé automatiquement par `StrictProtectedRoute` et peut être personnalisé si nécessaire.

## Personnalisation

### Configuration via variables d'environnement

La configuration se fait via le fichier `.env` à la racine du projet. Créez un fichier `.env` basé sur `.env.example` :

```env
# Intervalle de rafraîchissement en millisecondes (défaut: 20000 = 20 secondes)
VITE_USER_REFRESH_INTERVAL=20000

# Activer le rafraîchissement uniquement quand la fenêtre est visible (défaut: true)
VITE_USER_REFRESH_ONLY_VISIBLE=true

# Activer le rafraîchissement immédiat quand la fenêtre redevient visible (défaut: true)
VITE_USER_REFRESH_ON_VISIBILITY_CHANGE=true
```

**Important:** Après modification du fichier `.env`, redémarrez le serveur de développement pour que les changements prennent effet.

### Exemples de configuration

**Rafraîchissement toutes les 2 minutes:**

```env
VITE_USER_REFRESH_INTERVAL=120000
```

**Rafraîchissement toutes les 1 minute (très fréquent):**

```env
VITE_USER_REFRESH_INTERVAL=60000
```

**Désactiver le rafraîchissement uniquement quand visible:**

```env
VITE_USER_REFRESH_ONLY_VISIBLE=false
```

**Désactiver le rafraîchissement à la visibilité:**

```env
VITE_USER_REFRESH_ON_VISIBILITY_CHANGE=false
```

### Modifier l'intervalle global (méthode alternative)

Si vous préférez modifier directement le code, éditez `src/config/userRefresh.ts` :

```typescript
export const USER_REFRESH_CONFIG = {
  DEFAULT_INTERVAL: 2 * 60 * 1000, // 2 minutes au lieu de 5
  // ...
}
```

**Note:** Les variables d'environnement ont la priorité sur les valeurs par défaut dans le code.

### Désactiver le rafraîchissement automatique

Dans `AuthenticatedLayout`, modifiez :

```typescript
useUserRefresh({
  enabled: false, // Désactiver complètement
})
```

### Rafraîchissement manuel

Le hook retourne une fonction pour rafraîchir manuellement :

```typescript
const { refreshUserInfo } = useUserRefresh()

// Rafraîchir immédiatement
await refreshUserInfo()
```

## Dépannage

### Les permissions ne se mettent pas à jour

1. Vérifiez que l'utilisateur est bien authentifié
2. Vérifiez la console pour les erreurs
3. Vérifiez que l'API `/auth/user` retourne les bonnes permissions
4. Réduisez l'intervalle pour tester plus rapidement

### Trop d'appels API

1. Augmentez l'intervalle dans `USER_REFRESH_CONFIG`
2. Activez `onlyWhenVisible: true` pour éviter les appels quand l'onglet est inactif

### Performance

Le rafraîchissement est optimisé pour :

- Éviter les appels multiples simultanés
- S'arrêter automatiquement à la déconnexion
- Ne rafraîchir que quand la fenêtre est visible (optionnel)
