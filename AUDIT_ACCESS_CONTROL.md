# 🔒 Audit du Système de Contrôle d'Accès

## 📋 Résumé Exécutif

L'application dispose d'un **système de contrôle d'accès (ACL) complet** basé sur :
- ✅ **Permissions** (enum `Permission`)
- ✅ **Rôles** (enum `UserRole`)
- ✅ **Types d'entités** (enum `EntityTypeEnum`)

Cependant, il existe **plusieurs patterns différents** pour protéger les pages, ce qui crée une **incohérence** dans l'implémentation.

---

## 🏗️ Architecture Actuelle

### 1. **Composants de Protection Disponibles**

#### A. `ProtectedRoute` (`src/components/auth/ProtectedRoute.tsx`)
- ✅ Supporte les **permissions** (unique, multiples, toutes requises)
- ✅ Supporte les **rôles** (unique, multiples, tous requis)
- ❌ **NE supporte PAS** les types d'entités
- ✅ Affiche `<Forbidden />` si l'accès est refusé
- ✅ Redirige vers `/sign-in` si non authentifié

**Utilisation actuelle :** ⚠️ **TRÈS PEU UTILISÉ** dans les routes

#### B. `StrictProtectedRoute` (`src/components/auth/StrictProtectedRoute.tsx`)
- ✅ Vérifie uniquement l'**authentification**
- ❌ Ne vérifie **PAS** les permissions/rôles/types d'entités
- ✅ Utilisé dans `AuthenticatedLayout` pour protéger toutes les routes authentifiées

#### C. `PermissionGate` (`src/components/ui/permission-gate.tsx`)
- ✅ Supporte les **permissions** (unique, multiples, toutes requises)
- ✅ Supporte les **rôles** (unique, multiples, tous requis)
- ❌ **NE supporte PAS** les types d'entités
- ✅ Masque/affiche du contenu (pas de redirection)
- ✅ Composants utilitaires : `RequirePermissionGate`, `RequireAnyRoleGate`, etc.

**Utilisation actuelle :** ✅ **UTILISÉ** dans plusieurs pages comptabilité

#### D. Vérifications Manuelles dans les Composants
- ✅ Pattern utilisé dans : `users/index.tsx`, `assignment-requests/index.tsx`, `statistics/*.tsx`
- ✅ Utilise `useACL()` hook avec `hasPermission()` et `isInitialized`
- ✅ Affiche un message "Accès refusé" si la permission n'est pas présente
- ❌ **Incohérent** - chaque page implémente sa propre logique

---

## 📊 État Actuel par Type de Protection

### 1. **Pages Protégées par `RequireAnyRoleGate`** (11 pages)
Toutes dans le module `comptabilite` :
- ✅ `comptabilite/payments/index.tsx`
- ✅ `comptabilite/payments/create.tsx`
- ✅ `comptabilite/payments/edit.$id.tsx`
- ✅ `comptabilite/checks/index.tsx`
- ✅ `comptabilite/checks/form.tsx`
- ✅ `comptabilite/banks/index.tsx`
- ✅ `comptabilite/payment-types/index.tsx`
- ✅ `comptabilite/payment-methods/index.tsx`
- ✅ `comptabilite/invoices/index.tsx`
- ✅ `comptabilite/invoices/details.tsx`

**Pattern utilisé :**
```tsx
export default function Page() {
  return (
    <RequireAnyRoleGate
      roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, ...]}
      fallback={<ForbiddenError />}
    >
      <PageContent />
    </RequireAnyRoleGate>
  )
}
```

### 2. **Pages Protégées par Vérifications Manuelles** (4 pages)
- ✅ `administration/users/index.tsx` - Vérifie `Permission.VIEW_USER`
- ✅ `assignment-requests/index.tsx` - Vérifie `Permission.VIEW_ASSIGNMENT_REQUEST`
- ✅ `assignments/statistics/assignments-statistics.tsx` - Vérifie `Permission.ASSIGNMENT_STATISTICS`
- ✅ `assignments/statistics/invoices-statistics.tsx` - Vérifie `Permission.INVOICE_STATISTICS`
- ✅ `assignments/statistics/payments-statistics.tsx` - Vérifie `Permission.PAYMENT_STATISTICS`

**Pattern utilisé :**
```tsx
export default function Page() {
  const { hasPermission, isInitialized } = useACL()
  const canView = hasPermission(Permission.VIEW_USER)

  if (isInitialized && !canView) {
    return (
      <>
        <Header>...</Header>
        <Main>
          <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold tracking-tight mb-2'>Accès refusé</h2>
              <p className='text-muted-foreground'>
                Vous n'avez pas la permission de voir les utilisateurs.
              </p>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return <PageContent />
}
```

### 3. **Pages NON Protégées** (Majorité des pages)
- ⚠️ `assignments/page.tsx` - Aucune protection explicite
- ⚠️ `assignments/detail.tsx` - Aucune protection explicite
- ⚠️ Toutes les autres pages administratives - Aucune protection explicite

---

## 🔍 Analyse des Limitations

### ❌ **Problèmes Identifiés**

1. **Incohérence des Patterns**
   - 3 patterns différents pour protéger les pages
   - Certaines pages utilisent `RequireAnyRoleGate` (basé sur rôles)
   - D'autres utilisent des vérifications manuelles (basé sur permissions)
   - La majorité des pages ne sont **pas protégées**

2. **Pas de Support des Types d'Entités**
   - `ProtectedRoute` ne supporte pas les types d'entités
   - `PermissionGate` ne supporte pas les types d'entités
   - Les vérifications manuelles n'utilisent pas les types d'entités pour restreindre l'accès

3. **Protection Incomplète**
   - Beaucoup de pages sensibles ne sont pas protégées
   - Pas de protection au niveau des routes TanStack Router
   - Les routes sont définies sans métadonnées de protection

4. **Duplication de Code**
   - Le pattern de vérification manuelle est dupliqué dans plusieurs pages
   - Chaque page réimplémente la même logique d'affichage "Accès refusé"

---

## ✅ Points Positifs

1. **Infrastructure ACL Solide**
   - Store Zustand bien structuré (`aclStore.ts`)
   - Hook `useACL()` avec toutes les fonctionnalités nécessaires
   - Service ACL avec méthodes utilitaires (`aclService.ts`)

2. **Composants de Protection Disponibles**
   - `ProtectedRoute` est bien conçu (mais peu utilisé)
   - `PermissionGate` fonctionne bien pour l'UI
   - Composants utilitaires pratiques

3. **Support des Types d'Entités**
   - Le store ACL stocke `userEntityType`
   - Méthodes `hasEntityType()` et `hasAnyEntityType()` disponibles
   - Helpers dans `useACL()` : `isMainOrganization()`, `isInsurerEntity()`, etc.

---

## 🎯 Recommandations

### 1. **Standardiser sur `ProtectedRoute`**
   - ✅ Utiliser `ProtectedRoute` pour toutes les pages
   - ✅ Ajouter le support des types d'entités à `ProtectedRoute`
   - ✅ Créer un wrapper pour TanStack Router

### 2. **Ajouter Support des Types d'Entités**
   ```tsx
   interface ProtectedRouteProps {
     // ... existing props
     requiredEntityType?: string
     requiredEntityTypes?: string[]
     requireAllEntityTypes?: boolean
   }
   ```

### 3. **Protection au Niveau des Routes**
   - Créer un helper pour définir les métadonnées de protection dans les routes
   - Utiliser un middleware TanStack Router pour vérifier les permissions

### 4. **Migrer les Pages Existantes**
   - Remplacer les vérifications manuelles par `ProtectedRoute`
   - Remplacer `RequireAnyRoleGate` par `ProtectedRoute` avec permissions

### 5. **Documentation**
   - Créer un guide de migration
   - Documenter les patterns recommandés
   - Ajouter des exemples pour chaque cas d'usage

---

## 📝 Exemple de Protection Complète Recommandée

```tsx
// src/routes/_authenticated/assignments/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'
import AssignmentsPage from '@/features/assignments/page'

export const Route = createFileRoute('/_authenticated/assignments/')({
  component: () => (
    <ProtectedRoute
      requiredPermission={Permission.VIEW_ASSIGNMENT}
      requiredEntityTypes={['main_organization', 'organization']}
      requireAllEntityTypes={false}
    >
      <AssignmentsPage />
    </ProtectedRoute>
  ),
})
```

---

## 📈 Statistiques

- **Pages protégées par `RequireAnyRoleGate`** : 11 pages
- **Pages protégées par vérifications manuelles** : 5 pages
- **Pages non protégées** : ~100+ pages
- **Composants de protection disponibles** : 2 (`ProtectedRoute`, `PermissionGate`)
- **Support des types d'entités** : ❌ Non implémenté dans les composants de protection

---

## 🔗 Fichiers Clés

- `src/components/auth/ProtectedRoute.tsx` - Composant de protection de routes
- `src/components/ui/permission-gate.tsx` - Composant de protection UI
- `src/stores/aclStore.ts` - Store ACL Zustand
- `src/hooks/useACL.ts` - Hook ACL principal
- `src/services/aclService.ts` - Service ACL
- `src/features/errors/forbidden.tsx` - Page d'erreur 403

---

**Date de l'audit :** 2024
**Version de l'application :** Actuelle

