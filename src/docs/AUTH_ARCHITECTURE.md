# Architecture d'Authentification

## Vue d'ensemble

Cette architecture d'authentification est construite avec une approche modulaire et robuste, utilisant Zustand pour la gestion d'état, Axios pour les requêtes HTTP, et des hooks personnalisés pour une meilleure expérience développeur.

## Structure des fichiers

```
src/
├── types/
│   └── auth.ts                 # Types TypeScript pour l'authentification
├── lib/
│   └── axios.ts               # Client Axios configuré avec intercepteurs
├── config/
│   └── api.ts                 # Configuration centralisée de l'API
├── services/
│   └── authService.ts         # Service d'authentification
├── stores/
│   └── authStore.ts           # Store Zustand pour l'état d'authentification
├── hooks/
│   └── useAuth.ts             # Hooks personnalisés pour l'authentification
├── components/
│   └── auth/
│       ├── index.ts           # Exports des composants d'authentification
│       ├── ProtectedRoute.tsx # Composant de protection des routes
│       ├── RedirectIfAuthenticated.tsx # Composant de redirection
│       └── UserInfo.tsx       # Composant d'affichage des infos utilisateur
└── features/
    └── auth/
        └── sign-in/
            └── components/
                └── user-auth-form.tsx # Formulaire de connexion mis à jour
```

## Composants principaux

### 1. Types (`src/types/auth.ts`)

Définit toutes les interfaces TypeScript pour :

- Les données de connexion (`LoginCredentials`)
- Les réponses API (`LoginResponse`, `UserResponse`)
- Les modèles de données (`User`, `Entity`, `Role`)
- Les états d'authentification (`AuthState`)

### 2. Client Axios (`src/lib/axios.ts`)

Client HTTP robuste avec :

- Configuration centralisée
- Intercepteurs pour l'authentification automatique
- Gestion globale des erreurs
- Notifications toast automatiques
- Redirection automatique en cas d'expiration de session

### 3. Service d'authentification (`src/services/authService.ts`)

Service singleton avec méthodes pour :

- `login()` : Authentification utilisateur
- `getUserInfo()` : Récupération des informations utilisateur
- `logout()` : Déconnexion
- `saveToken()` : Sauvegarde du token
- `isAuthenticated()` : Vérification de l'authentification

### 4. Store Zustand (`src/stores/authStore.ts`)

Store persistant avec :

- État d'authentification complet
- Actions pour login/logout
- Persistance automatique dans le localStorage
- Hooks utilitaires pour l'accès aux données

### 5. Hooks personnalisés (`src/hooks/useAuth.ts`)

Hooks spécialisés :

- `useAuthHook()` : Hook principal avec navigation
- `useRequireAuth()` : Protection des routes
- `useRedirectIfAuthenticated()` : Redirection des utilisateurs connectés
- `useUser()`, `useIsAuthenticated()`, `useAuthLoading()` : Hooks utilitaires

### 6. Composants d'authentification

- `ProtectedRoute` : Protège les routes authentifiées
- `RedirectIfAuthenticated` : Redirige les utilisateurs connectés
- `UserInfo` : Affiche les informations utilisateur avec menu déroulant

## Utilisation

### Connexion

```tsx
import { useAuthHook } from '@/hooks/useAuth'

function LoginComponent() {
  const { loginWithRedirect, isLoading, error } = useAuthHook()

  const handleLogin = async (credentials) => {
    await loginWithRedirect(credentials)
  }
}
```

### Protection de routes

```tsx
import { ProtectedRoute } from '@/components/auth'

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

### Affichage des informations utilisateur

```tsx
import { UserInfo } from '@/components/auth'

function Header() {
  return (
    <header>
      <UserInfo />
    </header>
  )
}
```

## Sécurité

### Gestion des tokens

- Stockage sécurisé dans le localStorage
- Suppression automatique en cas d'expiration
- Intercepteurs pour ajout automatique des headers

### Gestion des erreurs

- Gestion centralisée des erreurs HTTP
- Notifications utilisateur automatiques
- Redirection automatique en cas d'expiration

### Protection des routes

- Vérification automatique de l'authentification
- Redirection vers la page de connexion si nécessaire
- État de chargement pendant la vérification

## Configuration

### Variables d'environnement

```env
VITE_API_BASE_URL=https://e-expert-back.ddev.site/api/v1
```

### Configuration API

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://e-expert-back.ddev.site/api/v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/tokens',
      USER_INFO: '/auth/user',
      LOGOUT: '/auth/tokens',
    },
  },
}
```

## Fonctionnalités avancées

### Persistance d'état

- L'état d'authentification est automatiquement persisté
- Restauration automatique au rechargement de la page
- Synchronisation avec le localStorage

### Gestion des sessions

- Vérification automatique de la validité du token
- Récupération automatique des informations utilisateur
- Déconnexion automatique en cas d'expiration

### Expérience utilisateur

- États de chargement pendant les opérations
- Messages d'erreur contextuels
- Redirections automatiques
- Notifications toast pour les actions importantes

## Tests recommandés

1. **Test de connexion** : Vérifier que la connexion fonctionne avec les bonnes credentials
2. **Test de déconnexion** : Vérifier que la déconnexion nettoie correctement l'état
3. **Test d'expiration** : Simuler l'expiration d'un token
4. **Test de persistance** : Vérifier que l'état persiste après rechargement
5. **Test de protection** : Vérifier que les routes protégées redirigent correctement

## Maintenance

### Ajout de nouveaux endpoints

1. Ajouter l'endpoint dans `src/config/api.ts`
2. Créer la méthode correspondante dans `src/services/authService.ts`
3. Ajouter les types nécessaires dans `src/types/auth.ts`

### Modification de la logique d'authentification

1. Modifier le store dans `src/stores/authStore.ts`
2. Mettre à jour les hooks dans `src/hooks/useAuth.ts`
3. Tester les composants qui utilisent ces hooks

### Ajout de nouvelles fonctionnalités

1. Créer les types nécessaires
2. Ajouter les méthodes dans le service
3. Mettre à jour le store si nécessaire
4. Créer les hooks personnalisés
5. Implémenter les composants UI
