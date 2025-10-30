## ACL – Guide complet d'utilisation (Rôles, Permissions, Exemples)

Ce document décrit la mise en œuvre de l'ACL (Access Control List) dans l'application: les rôles, les permissions, les APIs disponibles (hooks/services/stores) et des exemples concrets d'usage côté UI et navigation.

### Sommaire

- Rôles supportés et labels
- Permissions supportées et labels
- Architecture ACL (où se trouvent les éléments)
- Initialisation de l'ACL après authentification
- Vérifications de rôles et de permissions (hooks et helpers)
- Contrôle d'affichage (UI) avec exemples
- Protection des routes/pages (pattern)
- Cas d'usage: REPAIRER_ADMIN ne peut pas créer un dossier
- Débogage et bonnes pratiques

---

### Rôles supportés et labels

Définis dans `src/types/auth.ts` (enum `UserRole`). Les labels sont fournis par `aclService.getRoleLabel`.

- system_admin: Administrateur système
- admin: Administrateur plateforme
- expert_admin: Administrateur expert
- ceo: Directeur général
- expert_manager: Responsable expert
- expert: Expert
- opener: Ouvreur
- editor_manager: Responsable édition
- editor: Éditeur
- validator: Validateur
- accountant_manager: Responsable comptable
- accountant: Comptable
- business_developer: Développeur business
- insurer_admin: Administrateur assureur
- insurer_standard_user: Utilisateur assureur
- repairer_admin: Administrateur réparateur
- repairer_standard_user: Utilisateur réparateur
- client: Client
- unassigned: Non assigné

Notes:

- Certains rôles "lecture seule" sont considérés comme restreints pour des actions (ex: `REPAIRER_ADMIN`).

---

### Permissions supportées et labels

Définies dans `src/types/auth.ts` (enum `Permission`). Les labels sont fournis par `aclService.getPermissionLabel`.

- Utilisateurs: VIEW_USER, CREATE_USER, UPDATE_USER, DELETE_USER, ENABLE_USER, DISABLE_USER, RESET_USER
- Dossiers: VIEW_ASSIGNMENT, CREATE_ASSIGNMENT, UPDATE_ASSIGNMENT, REALIZE_ASSIGNMENT, EDIT_ASSIGNMENT, VALIDATE_ASSIGNMENT, CLOSE_ASSIGNMENT, CANCEL_ASSIGNMENT, GENERATE_ASSIGNMENT, DELETE_ASSIGNMENT, ASSIGNMENT_STATISTICS
- Factures: VIEW_INVOICE, CREATE_INVOICE, UPDATE_INVOICE, CANCEL_INVOICE, GENERATE_INVOICE, DELETE_INVOICE, INVOICE_STATISTICS
- Paiements: VIEW_PAYMENT, CREATE_PAYMENT, UPDATE_PAYMENT, CANCEL_PAYMENT, DELETE_PAYMENT, PAYMENT_STATISTICS
- Application: MANAGE_APP

---

### Architecture ACL (où se trouvent les éléments)

- Service ACL: `src/services/aclService.ts`
  - Vérifications primitives (hasRole, hasAnyRole, hasPermission, …)
  - Labels des rôles/permissions
- Store ACL (Zustand + persist): `src/stores/aclStore.ts`
  - État global ACL: `userRole`, `userPermissions`, `isInitialized`
  - Actions: `initializeACL(user)`, `setUserRole`, `setUserPermissions`, `clearACL`
  - Sélecteurs/hooks utilitaires (hasRole, hasPermission, …)
- Hook consolidé: `src/hooks/useACL.ts`
  - Expose l'état, les actions, les helpers (ex: `canViewAssignments`, `isReadOnlyRole`, …)
- Données Sidebar: `src/components/layout/data/sidebar-data.ts`
  - `requiredRoles` sur chaque item pour piloter l'affichage selon le rôle

---

### Initialisation de l'ACL après authentification

Au moment de la connexion (après récupération du user), initialisez l'ACL avec le rôle et les permissions du user.

```ts
import { useACLStore } from '@/stores/aclStore'

// Après login et récupération du `user`
const { initializeACL } = useACLStore.getState()
initializeACL(user) // user.role.name doit correspondre à UserRole, user.permissions: string[] -> Permission[]
```

Le store persiste automatiquement `userRole`, `userPermissions`, `isInitialized`.

---

### Vérifications de rôles et de permissions (hooks et helpers)

```ts
import { Permission, UserRole } from '@/types/auth'
import { useACL } from '@/hooks/useACL'

const Component = () => {
  const {
    userRole,
    userPermissions,
    hasRole,
    hasAnyRole,
    hasPermission,
    canViewAssignments,
    canCreateAssignments,
    isReadOnlyRole, // true pour INSURER_ADMIN, REPAIRER_ADMIN
  } = useACL()

  const isExpert = hasRole(UserRole.EXPERT)
  const canCreate = canCreateAssignments() && !isReadOnlyRole()

  // ...
}
```

Helpers disponibles via `useACL`:

- Rôles: `hasRole`, `hasAnyRole`, `isSystemAdmin`, `isAdmin`, `isExpertRole`, `isReadOnlyRole`, etc.
- Permissions: `hasPermission`, `canViewUsers`, `canCreateAssignments`, `canGenerateAssignments`, etc.

---

### Contrôle d'affichage (UI) – exemples

Masquer/afficher un bouton selon rôle/permission:

```tsx
import { UserRole } from '@/types/auth'
import { useACL } from '@/hooks/useACL'
import { Button } from '@/components/ui/button'

export function CreateButton() {
  const { hasRole } = useACL()
  if (hasRole(UserRole.REPAIRER_ADMIN)) return null
  return (
    <Button
      onClick={() => {
        /* ... */
      }}
    >
      Créer
    </Button>
  )
}
```

Piloter le Sidebar via `requiredRoles` (déjà en place):

```ts
// src/components/layout/data/sidebar-data.ts
{
  title: 'Dossiers',
  url: '/assignments',
  requiredRoles: [UserRole.REPAIRER_ADMIN, /* autres rôles autorisés */]
}
```

---

### Protection des routes/pages (pattern)

Protéger une page en important `useACL` et en redirigeant si nécessaire:

```tsx
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Permission } from '@/types/auth'
import { useACL } from '@/hooks/useACL'

export default function ProtectedPage() {
  const navigate = useNavigate()
  const { hasPermission, isInitialized } = useACL()

  useEffect(() => {
    if (!isInitialized) return
    if (!hasPermission(Permission.VIEW_ASSIGNMENT)) {
      navigate({ to: '/403' })
    }
  }, [isInitialized, hasPermission, navigate])

  return <div>Contenu protégé</div>
}
```

---

### Cas d'usage: REPAIRER_ADMIN ne peut pas créer un dossier

Exigence: sur la page de listing des dossiers, un utilisateur avec le rôle `REPAIRER_ADMIN` n'a pas le droit de créer un dossier.

Implémentation (déjà appliquée):

````tsx
// src/features/assignments/page.tsx
import { useACL } from '@/hooks/useACL'
import { UserRole } from '@/types/auth'

// ...
const { hasRole } = useACL()

// Dans le header de page
{!hasRole(UserRole.REPAIRER_ADMIN) && (
  <Button onClick={handleCreateAssignment}>
    Nouveau dossier
  </Button>
)}
``;

Alternative (afficher désactivé avec info-bulle):

```tsx
const isRepairerAdmin = hasRole(UserRole.REPAIRER_ADMIN)
<Button disabled={isRepairerAdmin} title={isRepairerAdmin ? 'Votre rôle ne permet pas de créer un dossier' : ''}>
  Nouveau dossier
</Button>
````

---

### Débogage et bonnes pratiques

- Toujours appeler `initializeACL(user)` après login (user doit contenir `role.name` et `permissions`).
- Pour le Sidebar, préférez `requiredRoles` plutôt qu'une logique répétée dans le rendu.
- Pour les pages/sections sensibles, combinez une garde UI (masquer/disable) et une garde de navigation (redirect 403) si nécessaire.
- Utilisez les helpers `can*` pour améliorer la lisibilité (`canCreateAssignments`, `canGenerateAssignments`, …).
- En cas d'incohérence frontend/backend, logguez `userRole` et `userPermissions` pour vérifier la source de vérité.

---

### Références de fichiers

- `src/services/aclService.ts`: service, labels, helpers bas niveau
- `src/stores/aclStore.ts`: store Zustand + persist, état et actions
- `src/hooks/useACL.ts`: hook unifié, helpers pratiques
- `src/components/layout/data/sidebar-data.ts`: données du menu latéral avec `requiredRoles`
- `src/features/assignments/page.tsx`: exemple d'usage (restriction REPAIRER_ADMIN sur le bouton "Nouveau dossier")
