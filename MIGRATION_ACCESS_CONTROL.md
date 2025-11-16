# 🔄 Guide de Migration du Contrôle d'Accès

## ✅ Améliorations Implémentées

### 1. Support des Types d'Entités
- ✅ `ProtectedRoute` supporte maintenant `requiredEntityType` et `requiredEntityTypes`
- ✅ `PermissionGate` supporte maintenant `requiredEntityType` et `requiredEntityTypes`
- ✅ Les hooks `useHasEntityType` et `useHasAnyEntityType` sont disponibles

### 2. Helper pour Routes TanStack Router
- ✅ Création de `src/utils/route-protection.tsx` avec des helpers :
  - `createProtectedRoute()` - Route protégée complète
  - `createPermissionProtectedRoute()` - Route avec permission unique
  - `createAnyPermissionProtectedRoute()` - Route avec plusieurs permissions (au moins une)
  - `createAllPermissionsProtectedRoute()` - Route avec plusieurs permissions (toutes requises)
  - `createRoleProtectedRoute()` - Route avec rôle unique
  - `createAnyRoleProtectedRoute()` - Route avec plusieurs rôles (au moins un)

### 3. Pages Migrées
- ✅ `comptabilite/payments/index.tsx` - Utilise `ProtectedRoute` avec `Permission.VIEW_PAYMENT`
- ✅ `comptabilite/payments/create.tsx` - Utilise `ProtectedRoute` avec `Permission.CREATE_PAYMENT`
- ✅ `comptabilite/payments/edit.$id.tsx` - Utilise `ProtectedRoute` avec `Permission.UPDATE_PAYMENT`

---

## 📋 Pages Restantes à Migrer

### Comptabilité (8 pages)
- [ ] `comptabilite/checks/index.tsx` → `Permission.VIEW_CHECK`
- [ ] `comptabilite/checks/form.tsx` → `Permission.CREATE_CHECK` / `Permission.UPDATE_CHECK`
- [ ] `comptabilite/banks/index.tsx` → `Permission.VIEW_BANK`
- [ ] `comptabilite/payment-types/index.tsx` → `Permission.VIEW_PAYMENT_TYPE`
- [ ] `comptabilite/payment-methods/index.tsx` → `Permission.VIEW_PAYMENT_METHOD`
- [ ] `comptabilite/invoices/index.tsx` → `Permission.VIEW_INVOICE`
- [ ] `comptabilite/invoices/details.tsx` → `Permission.VIEW_INVOICE`
- [ ] `comptabilite/invoices/create.tsx` → `Permission.CREATE_INVOICE` (si existe)

### Administration (5 pages)
- [ ] `administration/users/index.tsx` → Déjà migré avec vérification manuelle, à convertir en `ProtectedRoute`
- [ ] `assignment-requests/index.tsx` → Déjà migré avec vérification manuelle, à convertir en `ProtectedRoute`
- [ ] `assignments/statistics/assignments-statistics.tsx` → Déjà migré avec vérification manuelle, à convertir en `ProtectedRoute`
- [ ] `assignments/statistics/invoices-statistics.tsx` → Déjà migré avec vérification manuelle, à convertir en `ProtectedRoute`
- [ ] `assignments/statistics/payments-statistics.tsx` → Déjà migré avec vérification manuelle, à convertir en `ProtectedRoute`

### Assignments (Pages principales)
- [ ] `assignments/page.tsx` → `Permission.VIEW_ASSIGNMENT`
- [ ] `assignments/detail.tsx` → `Permission.VIEW_ASSIGNMENT`
- [ ] `assignments/create.tsx` → `Permission.CREATE_ASSIGNMENT`
- [ ] `assignments/edit/$id.tsx` → `Permission.UPDATE_ASSIGNMENT`

---

## 🔧 Pattern de Migration

### Avant (avec RequireAnyRoleGate)
```tsx
import { RequireAnyRoleGate } from '@/components/ui/permission-gate'
import { UserRole } from '@/stores/aclStore'
import ForbiddenError from '@/features/errors/forbidden'

export default function MyPage() {
  return (
    <RequireAnyRoleGate
      roles={[UserRole.SYSTEM_ADMIN, UserRole.CEO, UserRole.ACCOUNTANT]}
      fallback={<ForbiddenError />}
    >
      <PageContent />
    </RequireAnyRoleGate>
  )
}
```

### Après (avec ProtectedRoute)
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

export default function MyPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_PAYMENT}>
      <PageContent />
    </ProtectedRoute>
  )
}
```

### Avant (avec vérification manuelle)
```tsx
import { useACL } from '@/hooks/useACL'
import { Permission } from '@/types/auth'

export default function MyPage() {
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

### Après (avec ProtectedRoute)
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

export default function MyPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_USER}>
      <PageContent />
    </ProtectedRoute>
  )
}
```

---

## 🎯 Mapping Rôles → Permissions

Pour migrer les pages qui utilisent `RequireAnyRoleGate` avec des rôles, voici le mapping recommandé :

| Rôles Utilisés | Permission Recommandée |
|----------------|----------------------|
| `SYSTEM_ADMIN, CEO, ACCOUNTANT_MANAGER, ACCOUNTANT, OPENER` | `VIEW_PAYMENT`, `CREATE_PAYMENT`, `UPDATE_PAYMENT` |
| `SYSTEM_ADMIN, CEO, ACCOUNTANT_MANAGER, ACCOUNTANT` | `VIEW_INVOICE`, `VIEW_CHECK`, `VIEW_BANK`, `VIEW_PAYMENT_TYPE`, `VIEW_PAYMENT_METHOD` |
| `SYSTEM_ADMIN, ADMIN, EXPERT_ADMIN, CEO, EXPERT_MANAGER, EXPERT, ...` | `VIEW_ASSIGNMENT`, `CREATE_ASSIGNMENT`, `UPDATE_ASSIGNMENT` |

---

## 📝 Exemples d'Utilisation Avancés

### Protection avec Permission + Type d'Entité
```tsx
<ProtectedRoute
  requiredPermission={Permission.VIEW_ASSIGNMENT}
  requiredEntityTypes={[EntityTypeEnum.MAIN_ORGANIZATION, EntityTypeEnum.ORGANIZATION]}
>
  <AssignmentsPage />
</ProtectedRoute>
```

### Protection avec Plusieurs Permissions (au moins une)
```tsx
<ProtectedRoute
  requiredPermissions={[Permission.VIEW_INVOICE, Permission.VIEW_PAYMENT]}
  requireAllPermissions={false}
>
  <FinancialReportsPage />
</ProtectedRoute>
```

### Protection avec Permission + Rôle
```tsx
<ProtectedRoute
  requiredPermission={Permission.MANAGE_APP}
  requiredRole={UserRole.SYSTEM_ADMIN}
>
  <SystemAdminPage />
</ProtectedRoute>
```

### Utilisation dans les Routes TanStack Router
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { createPermissionProtectedRoute } from '@/utils/route-protection'
import { Permission } from '@/types/auth'
import AssignmentsPage from '@/features/assignments/page'

export const Route = createFileRoute('/_authenticated/assignments/')({
  component: createPermissionProtectedRoute(
    AssignmentsPage,
    Permission.VIEW_ASSIGNMENT
  ),
})
```

---

## ⚠️ Notes Importantes

1. **Types d'Entités** : `requireAllEntityTypes` n'a pas de sens car un utilisateur n'a qu'un seul type d'entité. Utilisez toujours `requiredEntityTypes` avec `requireAllEntityTypes={false}` (par défaut).

2. **Fallback** : Si vous ne spécifiez pas de `fallback`, `ProtectedRoute` affichera automatiquement la page `<Forbidden />`.

3. **Redirection** : Par défaut, `ProtectedRoute` redirige vers `/sign-in` si l'utilisateur n'est pas authentifié. Vous pouvez personnaliser avec `redirectTo`.

4. **Performance** : `ProtectedRoute` vérifie les permissions/rôles/types d'entités de manière réactive. Les hooks utilisés sont optimisés pour éviter les re-renders inutiles.

---

## 🚀 Prochaines Étapes

1. Migrer toutes les pages comptabilité restantes
2. Migrer les pages avec vérifications manuelles
3. Protéger les pages assignments principales
4. Ajouter des tests pour vérifier que les protections fonctionnent correctement
5. Documenter les permissions requises pour chaque page dans la documentation

---

**Date de création :** 2024
**Dernière mise à jour :** 2024

