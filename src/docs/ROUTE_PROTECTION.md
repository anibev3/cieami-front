# Protection des Routes Authentifiées

## Vue d'ensemble

Ce document décrit la mise en place d'une protection stricte pour toutes les routes du répertoire `_authenticated`. Aucun utilisateur non connecté ne peut accéder à ces routes, même en cas de manipulation directe de l'URL.

## Architecture de Protection

### 1. Protection au niveau de la Route (`src/routes/_authenticated/route.tsx`)

```typescript
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    // Vérification supplémentaire au niveau de la route
    if (!authService.isAuthenticated()) {
      throw redirect({
        to: '/sign-in-2',
        search: {
          redirect: window.location.pathname,
        },
      })
    }
  },
})
```

**Fonctionnalités :**

- Vérification immédiate avant le chargement de la route
- Redirection automatique vers la page de connexion
- Sauvegarde de la page demandée pour redirection après connexion

### 2. Protection au niveau du Layout (`src/components/layout/authenticated-layout.tsx`)

```typescript
export function AuthenticatedLayout({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth()

  // Affichage d'un loader pendant la vérification
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Si l'utilisateur n'est pas authentifié, ne rien afficher
  if (!isAuthenticated) {
    return null
  }

  return (
    <StrictProtectedRoute>
      {/* Contenu du layout */}
    </StrictProtectedRoute>
  )
}
```

**Fonctionnalités :**

- Vérification de l'état d'authentification
- Affichage d'un loader pendant la vérification
- Rendu conditionnel basé sur l'authentification

### 3. Protection Stricte (`src/components/auth/StrictProtectedRoute.tsx`)

```typescript
export function StrictProtectedRoute({ children }: StrictProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Vérification immédiate au niveau du service
    if (!authService.isAuthenticated()) {
      navigate({ to: '/sign-in-2' })
      return
    }
  }, [isAuthenticated, isLoading, navigate])

  // Rendu conditionnel
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return null

  return <>{children}</>
}
```

**Fonctionnalités :**

- Double vérification (service + store)
- Redirection immédiate si aucun token
- Protection contre les états incohérents

## Niveaux de Protection

### Niveau 1 : Route Guard (TanStack Router)

- **Quand** : Avant le chargement de la route
- **Action** : Redirection immédiate
- **Avantage** : Protection au niveau du routeur

### Niveau 2 : Layout Protection

- **Quand** : Pendant le rendu du layout
- **Action** : Rendu conditionnel
- **Avantage** : Protection au niveau de l'interface

### Niveau 3 : Strict Protection

- **Quand** : Dans le composant de protection
- **Action** : Vérification multiple
- **Avantage** : Protection maximale

## Flux de Protection

```
1. Utilisateur accède à une route /_authenticated/*
   ↓
2. Route Guard vérifie l'authentification
   ↓
3. Si non authentifié → Redirection vers /sign-in-2
   ↓
4. Si authentifié → Chargement du layout
   ↓
5. Layout vérifie l'état d'authentification
   ↓
6. Si non authentifié → Rendu null
   ↓
7. Si authentifié → Chargement de StrictProtectedRoute
   ↓
8. StrictProtectedRoute vérifie à nouveau
   ↓
9. Si non authentifié → Redirection
   ↓
10. Si authentifié → Rendu du contenu
```

## Gestion des Redirections

### Redirection après Connexion

```typescript
// Dans le formulaire de connexion
const urlParams = new URLSearchParams(window.location.search)
const redirectTo = urlParams.get('redirect') || '/'
navigate({ to: redirectTo as '/' })
```

**Fonctionnalités :**

- Sauvegarde de la page demandée
- Redirection automatique après connexion
- Fallback vers la page d'accueil

### Redirection en cas d'Expiration

```typescript
// Dans l'intercepteur axios
if (error.response?.status === 401) {
  removeAuthToken()
  if (
    typeof window !== 'undefined' &&
    window.location.pathname !== '/sign-in-2'
  ) {
    window.location.href = '/sign-in-2'
  }
}
```

**Fonctionnalités :**

- Détection automatique de l'expiration
- Nettoyage du token
- Redirection immédiate

## Tests de Protection

### Utilitaire de Test (`src/utils/authTest.ts`)

```typescript
// Dans la console du navigateur
authTest.checkRouteProtection()
authTest.simulateLogout()
```

**Méthodes disponibles :**

- `isAuthenticated()` : Vérifier l'état d'authentification
- `getToken()` : Obtenir le token actuel
- `hasValidToken()` : Vérifier la validité du token
- `simulateLogout()` : Simuler une déconnexion
- `checkRouteProtection()` : Test complet de la protection

### Scénarios de Test

1. **Accès direct à une route protégée sans token**

   - Résultat attendu : Redirection vers `/sign-in-2`

2. **Accès avec un token invalide**

   - Résultat attendu : Redirection après détection d'erreur 401

3. **Expiration du token pendant la navigation**

   - Résultat attendu : Redirection automatique

4. **Manipulation du localStorage**
   - Résultat attendu : Protection maintenue

## Sécurité Renforcée

### Mesures Implémentées

1. **Vérification Multiple**

   - Service d'authentification
   - Store Zustand
   - Intercepteurs axios

2. **Protection contre les États Incohérents**

   - Vérification du token avant chaque rendu
   - Synchronisation automatique de l'état

3. **Redirection Immédiate**

   - Pas de contenu affiché si non authentifié
   - Redirection avant tout rendu

4. **Nettoyage Automatique**
   - Suppression du token en cas d'expiration
   - Nettoyage de l'état local

### Bonnes Pratiques

1. **Ne jamais faire confiance au client**

   - Vérification côté client ET serveur
   - Validation des tokens à chaque requête

2. **Protection en profondeur**

   - Multiple niveaux de vérification
   - Redondance des contrôles

3. **Expérience utilisateur**
   - Loaders pendant les vérifications
   - Messages d'erreur clairs
   - Redirections fluides

## Maintenance

### Ajout de Nouvelles Routes Protégées

1. Placer la route dans le répertoire `_authenticated`
2. La protection est automatiquement appliquée
3. Tester avec `authTest.checkRouteProtection()`

### Modification de la Logique de Protection

1. Modifier `StrictProtectedRoute.tsx` pour la logique principale
2. Modifier `authenticated-layout.tsx` pour l'affichage
3. Modifier `route.tsx` pour la protection au niveau routeur

### Debugging

```typescript
// Dans la console du navigateur
console.log('Token:', authTest.getToken())
console.log('Authentifié:', authTest.isAuthenticated())
console.log('Protection:', authTest.checkRouteProtection())
```
