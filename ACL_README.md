# Système ACL (Access Control List) - Expert Auto

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation et configuration](#installation-et-configuration)
- [Types et interfaces](#types-et-interfaces)
- [Services](#services)
- [Stores Zustand](#stores-zustand)
- [Composants de protection](#composants-de-protection)
- [Hooks utilitaires](#hooks-utilitaires)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Cas d'usage avancés](#cas-dusage-avancés)
- [Bonnes pratiques](#bonnes-pratiques)
- [Dépannage](#dépannage)

## 🎯 Vue d'ensemble

Le système ACL (Access Control List) d'Expert Auto est un système de gestion des permissions et rôles basé sur Zustand, conçu pour gérer dynamiquement les accès utilisateur selon les permissions assignées depuis le backoffice d'administration.

### Caractéristiques principales

- ✅ **Gestion dynamique** : Les permissions sont assignées depuis le backoffice, pas de mapping statique
- ✅ **Persistance** : État sauvegardé automatiquement dans le localStorage
- ✅ **Réactivité** : Interface qui s'adapte en temps réel aux permissions
- ✅ **Type Safety** : TypeScript complet avec types stricts
- ✅ **Performance** : Hooks optimisés avec Zustand
- ✅ **Flexibilité** : Support des permissions individuelles et multiples

## 🏗️ Architecture

```
src/
├── types/
│   └── auth.ts                 # Types et enums ACL
├── services/
│   └── aclService.ts           # Service de logique métier ACL
├── stores/
│   ├── authStore.ts            # Store d'authentification (intègre ACL)
│   └── aclStore.ts             # Store ACL principal
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Protection des routes
│   └── ui/
│       └── permission-gate.tsx # Affichage conditionnel
└── hooks/
    └── useACL.ts               # Hook personnalisé unifié
```

## ⚙️ Installation et configuration

Le système ACL est déjà intégré et configuré. Il s'initialise automatiquement lors de la connexion utilisateur.

### Initialisation automatique

```tsx
// Dans authStore.ts - se fait automatiquement
login: async (credentials) => {
  const userResponse = await authService.getUserInfo()
  useACLStore.getState().initializeACL(userResponse.data)
}
```

## 📝 Types et interfaces

### Enums principaux

```tsx
// Rôles utilisateur
enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  ADMIN = 'admin',
  CEO = 'ceo',
  EXPERT_MANAGER = 'expert_manager',
  EXPERT = 'expert',
  OPENER = 'opener',
  EDITOR = 'editor',
  VALIDATOR = 'validator',
  ACCOUNTANT = 'accountant',
  INSURER_ADMIN = 'insurer_admin',
  REPAIRER_ADMIN = 'repairer_admin'
}

// Permissions
enum Permission {
  // Utilisateurs
  VIEW_USER = 'user.view',
  CREATE_USER = 'user.create',
  UPDATE_USER = 'user.update',
  DELETE_USER = 'user.delete',
  ENABLE_USER = 'user.enable',
  DISABLE_USER = 'user.disable',
  RESET_USER = 'user.reset',

  // Dossiers
  VIEW_ASSIGNMENT = 'assignment.view',
  CREATE_ASSIGNMENT = 'assignment.create',
  UPDATE_ASSIGNMENT = 'assignment.update',
  REALIZE_ASSIGNMENT = 'assignment.realize',
  EDIT_ASSIGNMENT = 'assignment.edit',
  VALIDATE_ASSIGNMENT = 'assignment.validate',
  CLOSE_ASSIGNMENT = 'assignment.close',
  CANCEL_ASSIGNMENT = 'assignment.cancel',
  GENERATE_ASSIGNMENT = 'assignment.generate',
  DELETE_ASSIGNMENT = 'assignment.delete',
  ASSIGNMENT_STATISTICS = 'assignment.statistics',

  // Factures
  VIEW_INVOICE = 'invoice.view',
  CREATE_INVOICE = 'invoice.create',
  UPDATE_INVOICE = 'invoice.update',
  CANCEL_INVOICE = 'invoice.cancel',
  GENERATE_INVOICE = 'invoice.generate',
  DELETE_INVOICE = 'invoice.delete',
  INVOICE_STATISTICS = 'invoice.statistics',

  // Paiements
  VIEW_PAYMENT = 'payment.view',
  CREATE_PAYMENT = 'payment.create',
  UPDATE_PAYMENT = 'payment.update',
  CANCEL_PAYMENT = 'payment.cancel',
  DELETE_PAYMENT = 'payment.delete',
  PAYMENT_STATISTICS = 'payment.statistics',

  // Application
  MANAGE_APP = 'app.manage'
}
```

## 🔧 Services

### ACLService

Service principal pour la logique métier ACL.

```tsx
import { aclService } from '@/services/aclService'

// Vérifications de permissions
aclService.hasPermission(userPermissions, Permission.VIEW_USER)
aclService.hasAnyPermission(userPermissions, [Permission.VIEW_USER, Permission.CREATE_USER])
aclService.hasAllPermissions(userPermissions, [Permission.VIEW_USER, Permission.CREATE_USER])

// Vérifications de rôles
aclService.hasRole(userRole, UserRole.ADMIN)
aclService.hasAnyRole(userRole, [UserRole.ADMIN, UserRole.EXPERT_MANAGER])

// Utilitaires
aclService.getRoleLabel(UserRole.ADMIN) // "Administrateur plateforme"
aclService.getPermissionLabel(Permission.VIEW_USER) // "Voir les utilisateurs"
aclService.getAllPermissions() // Toutes les permissions disponibles
aclService.getAllRoles() // Tous les rôles disponibles
```

## 🗃️ Stores Zustand

### ACLStore

Store principal pour la gestion de l'état ACL.

```tsx
import { useACLStore } from '@/stores/aclStore'

const {
  userRole,
  userPermissions,
  isInitialized,
  hasPermission,
  hasRole,
  clearACL,
  initializeACL
} = useACLStore()
```

### Hooks utilitaires

```tsx
// Hooks réactifs
const hasPermission = useHasPermission(Permission.VIEW_USER)
const hasRole = useHasRole(UserRole.ADMIN)
const userRole = useUserRole()
const userPermissions = useUserPermissions()
```

## 🛡️ Composants de protection

### ProtectedRoute

Protection des routes avec redirection automatique.

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Protection par permission
<ProtectedRoute requiredPermission={Permission.VIEW_ASSIGNMENT}>
  <AssignmentsPage />
</ProtectedRoute>

// Protection par plusieurs permissions
<ProtectedRoute 
  requiredPermissions={[Permission.VIEW_USER, Permission.UPDATE_USER]}
  requireAllPermissions={false} // true = toutes, false = au moins une
>
  <UserManagementPage />
</ProtectedRoute>

// Protection par rôle
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminPanel />
</ProtectedRoute>

// Protection complexe
<ProtectedRoute
  requiredPermissions={[Permission.MANAGE_APP]}
  requiredRoles={[UserRole.SYSTEM_ADMIN, UserRole.ADMIN]}
  requireAllRoles={false}
  fallback={<CustomForbiddenComponent />}
  redirectTo="/custom-login"
>
  <SuperAdminPage />
</ProtectedRoute>
```

### Composants utilitaires

```tsx
import { 
  RequirePermission, 
  RequireAnyPermission, 
  RequireAllPermissions,
  RequireRole,
  RequireAnyRole,
  RequireAllRoles
} from '@/components/auth/ProtectedRoute'

<RequirePermission permission={Permission.CREATE_USER}>
  <CreateUserButton />
</RequirePermission>

<RequireAnyRole roles={[UserRole.EXPERT, UserRole.EXPERT_MANAGER]}>
  <ExpertTools />
</RequireAnyRole>
```

### PermissionGate

Affichage conditionnel de contenu sans redirection.

```tsx
import { PermissionGate } from '@/components/ui/permission-gate'

<PermissionGate permission={Permission.DELETE_USER}>
  <Button variant="destructive">Supprimer</Button>
</PermissionGate>

<PermissionGate 
  permissions={[Permission.VIEW_INVOICE, Permission.VIEW_PAYMENT]}
  requireAllPermissions={false}
  fallback={<span>Accès limité</span>}
>
  <FinancialDashboard />
</PermissionGate>
```

## 🎣 Hooks utilitaires

### useACL

Hook principal qui combine toutes les fonctionnalités ACL.

```tsx
import { useACL } from '@/hooks/useACL'

const {
  // État
  userRole,
  userPermissions,
  isInitialized,
  
  // Actions
  setUserRole,
  setUserPermissions,
  clearACL,
  initializeACL,
  
  // Méthodes de vérification
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  
  // Hooks réactifs
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useHasAnyRole,
  useHasAllRoles,
  
  // Utilitaires de rôles
  isSystemAdmin,
  isAdmin,
  isExpert,
  isExpertManager,
  isAccountant,
  isValidator,
  isEditor,
  isOpener,
  
  // Utilitaires de permissions
  canViewUsers,
  canCreateUsers,
  canUpdateUsers,
  canDeleteUsers,
  canViewAssignments,
  canCreateAssignments,
  canUpdateAssignments,
  canDeleteAssignments,
  canGenerateAssignments,
  canViewInvoices,
  canCreateInvoices,
  canUpdateInvoices,
  canDeleteInvoices,
  canGenerateInvoices,
  canCancelInvoices,
  canViewPayments,
  canCreatePayments,
  canUpdatePayments,
  canDeletePayments,
  canCancelPayments,
  canManageApp,
  
  // Vérifications de rôles courantes
  isManagementRole,
  isExpertRole,
  isFinancialRole,
  isReadOnlyRole
} = useACL()
```

## 💡 Exemples d'utilisation

### 1. Vérification simple dans un composant

```tsx
import { useACL } from '@/hooks/useACL'

export function UserList() {
  const { canViewUsers, canCreateUsers } = useACL()

  if (!canViewUsers()) {
    return <div>Vous n'avez pas accès à cette page</div>
  }

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      {canCreateUsers() && <Button>Créer un utilisateur</Button>}
      {/* ... liste des utilisateurs */}
    </div>
  )
}
```

### 2. Menu d'actions conditionnel

```tsx
import { useACL } from '@/hooks/useACL'

export function AssignmentActions({ assignment }) {
  const { 
    canUpdateAssignments, 
    canDeleteAssignments, 
    canGenerateAssignments 
  } = useACL()

  return (
    <DropdownMenu>
      <DropdownMenuContent>
        {canUpdateAssignments() && (
          <DropdownMenuItem>Modifier</DropdownMenuItem>
        )}
        {canDeleteAssignments() && (
          <DropdownMenuItem className="text-destructive">
            Supprimer
          </DropdownMenuItem>
        )}
        {canGenerateAssignments() && (
          <DropdownMenuItem>Générer rapport</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 3. Protection de route avec fallback personnalisé

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/hooks/useACL'

function CustomForbidden() {
  return (
    <div className="text-center p-8">
      <h2>Accès restreint</h2>
      <p>Vous n'avez pas les permissions nécessaires.</p>
      <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
    </div>
  )
}

<ProtectedRoute 
  requiredPermission={Permission.MANAGE_APP}
  fallback={<CustomForbidden />}
>
  <AdminDashboard />
</ProtectedRoute>
```

### 4. Affichage conditionnel avec PermissionGate

```tsx
import { PermissionGate } from '@/components/ui/permission-gate'
import { Permission } from '@/hooks/useACL'

<PermissionGate 
  permission={Permission.CREATE_INVOICE}
  fallback={<span className="text-muted">Création de facture non autorisée</span>}
>
  <Button>Nouvelle facture</Button>
</PermissionGate>

<PermissionGate 
  permissions={[Permission.VIEW_INVOICE, Permission.VIEW_PAYMENT]}
  requireAllPermissions={false}
>
  <FinancialSummary />
</PermissionGate>
```

### 5. Utilisation des hooks réactifs

```tsx
import { useHasPermission, Permission } from '@/stores/aclStore'

export function InvoiceActions() {
  const canEdit = useHasPermission(Permission.UPDATE_INVOICE)
  const canDelete = useHasPermission(Permission.DELETE_INVOICE)
  const canGenerate = useHasPermission(Permission.GENERATE_INVOICE)

  return (
    <div className="flex gap-2">
      {canEdit && <Button>Modifier</Button>}
      {canDelete && <Button variant="destructive">Supprimer</Button>}
      {canGenerate && <Button>Générer PDF</Button>}
    </div>
  )
}
```

### 6. Vérification de rôles spécifiques

```tsx
import { useACL } from '@/hooks/useACL'

export function Dashboard() {
  const { isAdmin, isExpertRole, isFinancialRole } = useACL()

  return (
    <div>
      {isAdmin() && <AdminWidgets />}
      {isExpertRole() && <ExpertTools />}
      {isFinancialRole() && <FinancialReports />}
    </div>
  )
}
```

### 7. Gestion des permissions multiples

```tsx
import { useACL } from '@/hooks/useACL'

export function AdvancedActions() {
  const { hasAllPermissions, hasAnyPermission } = useACL()

  // Vérifier si l'utilisateur a TOUTES les permissions
  const canManageUsers = hasAllPermissions([
    Permission.VIEW_USER,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER
  ])

  // Vérifier si l'utilisateur a AU MOINS UNE permission
  const canViewFinancialData = hasAnyPermission([
    Permission.VIEW_INVOICE,
    Permission.VIEW_PAYMENT
  ])

  return (
    <div>
      {canManageUsers && <UserManagementPanel />}
      {canViewFinancialData && <FinancialDataWidget />}
    </div>
  )
}
```

## 🚀 Cas d'usage avancés

### 1. Gestion des permissions par entité

```tsx
import { useACL } from '@/hooks/useACL'

export function EntityBasedPermissions({ entityId }) {
  const { hasPermission } = useACL()

  // Permissions spécifiques à une entité
  const canManageEntity = hasPermission(`entity.${entityId}.manage`)
  const canViewEntity = hasPermission(`entity.${entityId}.view`)

  return (
    <div>
      {canViewEntity && <EntityDetails entityId={entityId} />}
      {canManageEntity && <EntityManagement entityId={entityId} />}
    </div>
  )
}
```

### 2. Permissions conditionnelles selon le statut

```tsx
import { useACL } from '@/hooks/useACL'

export function StatusBasedActions({ assignment }) {
  const { canUpdateAssignments, canGenerateAssignments } = useACL()

  const canEdit = assignment.status === 'pending' && canUpdateAssignments()
  const canGenerate = assignment.status === 'edited' && canGenerateAssignments()

  return (
    <div>
      {canEdit && <Button>Modifier</Button>}
      {canGenerate && <Button>Générer rapport</Button>}
    </div>
  )
}
```

### 3. Gestion des permissions temporaires

```tsx
import { useACL } from '@/hooks/useACL'
import { useState, useEffect } from 'react'

export function TemporaryPermissions() {
  const { setUserPermissions, userPermissions } = useACL()
  const [tempPermissions, setTempPermissions] = useState([])

  // Ajouter temporairement des permissions
  const addTemporaryPermission = (permission) => {
    const newPermissions = [...userPermissions, permission]
    setUserPermissions(newPermissions)
    setTempPermissions([...tempPermissions, permission])
  }

  // Restaurer les permissions originales
  const restorePermissions = () => {
    const originalPermissions = userPermissions.filter(
      p => !tempPermissions.includes(p)
    )
    setUserPermissions(originalPermissions)
    setTempPermissions([])
  }

  useEffect(() => {
    return () => {
      // Nettoyer à la destruction du composant
      restorePermissions()
    }
  }, [])

  return (
    <div>
      <Button onClick={() => addTemporaryPermission(Permission.MANAGE_APP)}>
        Mode admin temporaire
      </Button>
      <Button onClick={restorePermissions}>
        Restaurer permissions
      </Button>
    </div>
  )
}
```

### 4. Gestion des permissions par contexte

```tsx
import { createContext, useContext, ReactNode } from 'react'
import { useACL } from '@/hooks/useACL'

interface PermissionContextType {
  canAccess: (permission: Permission) => boolean
  canAccessAny: (permissions: Permission[]) => boolean
  canAccessAll: (permissions: Permission[]) => boolean
}

const PermissionContext = createContext<PermissionContextType | null>(null)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useACL()

  const value = {
    canAccess: hasPermission,
    canAccessAny: hasAnyPermission,
    canAccessAll: hasAllPermissions
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissionContext() {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider')
  }
  return context
}

// Utilisation
function MyComponent() {
  const { canAccess } = usePermissionContext()

  return (
    <div>
      {canAccess(Permission.VIEW_USER) && <UserList />}
    </div>
  )
}
```

## ✅ Bonnes pratiques

### 1. Vérification des permissions

```tsx
// ✅ Bon - Vérification explicite
const { canViewUsers } = useACL()
if (!canViewUsers()) return null

// ❌ Éviter - Vérification implicite
const { userPermissions } = useACL()
if (!userPermissions.includes('user.view')) return null
```

### 2. Protection des routes

```tsx
// ✅ Bon - Protection au niveau route
<ProtectedRoute requiredPermission={Permission.VIEW_USER}>
  <UserPage />
</ProtectedRoute>

// ✅ Bon - Protection au niveau composant
<PermissionGate permission={Permission.CREATE_USER}>
  <CreateUserButton />
</PermissionGate>

// ❌ Éviter - Vérification dans le rendu
function UserButton() {
  const { hasPermission } = useACL()
  return hasPermission(Permission.CREATE_USER) ? <Button>Créer</Button> : null
}
```

### 3. Gestion des erreurs

```tsx
// ✅ Bon - Gestion gracieuse des erreurs
<ProtectedRoute 
  requiredPermission={Permission.VIEW_USER}
  fallback={<AccessDenied />}
>
  <UserPage />
</ProtectedRoute>

// ❌ Éviter - Pas de fallback
<ProtectedRoute requiredPermission={Permission.VIEW_USER}>
  <UserPage />
</ProtectedRoute>
```

### 4. Performance

```tsx
// ✅ Bon - Utilisation des hooks réactifs
const canEdit = useHasPermission(Permission.UPDATE_USER)

// ❌ Éviter - Recalcul à chaque rendu
const { hasPermission } = useACL()
const canEdit = hasPermission(Permission.UPDATE_USER)
```

### 5. Lisibilité

```tsx
// ✅ Bon - Noms explicites
const { canCreateUsers, canDeleteUsers } = useACL()

// ❌ Éviter - Noms génériques
const { hasPermission } = useACL()
const canCreate = hasPermission(Permission.CREATE_USER)
const canDelete = hasPermission(Permission.DELETE_USER)
```

## 🔄 Combinaisons complètes possibles

### 1. Protection de routes - Toutes les combinaisons

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission, UserRole } from '@/hooks/useACL'

// 1.1 Permission unique
<ProtectedRoute requiredPermission={Permission.VIEW_USER}>
  <UserPage />
</ProtectedRoute>

// 1.2 Permissions multiples - AU MOINS UNE
<ProtectedRoute 
  requiredPermissions={[Permission.VIEW_USER, Permission.CREATE_USER]}
  requireAllPermissions={false}
>
  <UserManagementPage />
</ProtectedRoute>

// 1.3 Permissions multiples - TOUTES REQUISES
<ProtectedRoute 
  requiredPermissions={[Permission.VIEW_USER, Permission.UPDATE_USER, Permission.DELETE_USER]}
  requireAllPermissions={true}
>
  <FullUserManagementPage />
</ProtectedRoute>

// 1.4 Rôle unique
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminPage />
</ProtectedRoute>

// 1.5 Rôles multiples - AU MOINS UN
<ProtectedRoute 
  requiredRoles={[UserRole.ADMIN, UserRole.EXPERT_MANAGER]}
  requireAllRoles={false}
>
  <ManagementPage />
</ProtectedRoute>

// 1.6 Rôles multiples - TOUS REQUIS (cas rare mais possible)
<ProtectedRoute 
  requiredRoles={[UserRole.ADMIN]} // Un seul rôle dans ce cas
  requireAllRoles={true}
>
  <StrictAdminPage />
</ProtectedRoute>

// 1.7 Combinaison permissions + rôles
<ProtectedRoute 
  requiredPermissions={[Permission.MANAGE_APP]}
  requiredRole={UserRole.SYSTEM_ADMIN}
>
  <SystemAdminPage />
</ProtectedRoute>

// 1.8 Combinaison complexe
<ProtectedRoute 
  requiredPermissions={[Permission.VIEW_INVOICE, Permission.VIEW_PAYMENT]}
  requireAllPermissions={false}
  requiredRoles={[UserRole.ACCOUNTANT, UserRole.ADMIN]}
  requireAllRoles={false}
  fallback={<CustomAccessDenied />}
  redirectTo="/dashboard"
>
  <FinancialReportsPage />
</ProtectedRoute>
```

### 2. PermissionGate - Toutes les combinaisons

```tsx
import { PermissionGate } from '@/components/ui/permission-gate'
import { Permission, UserRole } from '@/hooks/useACL'

// 2.1 Permission unique
<PermissionGate permission={Permission.CREATE_USER}>
  <CreateButton />
</PermissionGate>

// 2.2 Permissions multiples - AU MOINS UNE
<PermissionGate 
  permissions={[Permission.VIEW_INVOICE, Permission.VIEW_PAYMENT]}
  requireAllPermissions={false}
>
  <FinancialWidget />
</PermissionGate>

// 2.3 Permissions multiples - TOUTES REQUISES
<PermissionGate 
  permissions={[Permission.CREATE_INVOICE, Permission.UPDATE_INVOICE, Permission.DELETE_INVOICE]}
  requireAllPermissions={true}
>
  <FullInvoiceManagement />
</PermissionGate>

// 2.4 Rôle unique
<PermissionGate role={UserRole.EXPERT}>
  <ExpertTools />
</PermissionGate>

// 2.5 Rôles multiples - AU MOINS UN
<PermissionGate 
  roles={[UserRole.EXPERT, UserRole.EXPERT_MANAGER]}
  requireAllRoles={false}
>
  <ExpertSection />
</PermissionGate>

// 2.6 Combinaison permissions + rôles
<PermissionGate 
  permission={Permission.GENERATE_ASSIGNMENT}
  role={UserRole.EXPERT}
>
  <GenerateReportButton />
</PermissionGate>

// 2.7 Combinaison complexe avec fallback
<PermissionGate 
  permissions={[Permission.VIEW_USER, Permission.UPDATE_USER]}
  requireAllPermissions={false}
  roles={[UserRole.ADMIN, UserRole.EXPERT_MANAGER]}
  requireAllRoles={false}
  fallback={<span className="text-muted">Accès limité</span>}
>
  <UserManagementTools />
</PermissionGate>

// 2.8 Imbrication de PermissionGates
<PermissionGate permission={Permission.VIEW_ASSIGNMENT}>
  <div>
    <h2>Dossiers</h2>
    <PermissionGate permission={Permission.CREATE_ASSIGNMENT}>
      <Button>Nouveau dossier</Button>
    </PermissionGate>
    <PermissionGate permission={Permission.ASSIGNMENT_STATISTICS}>
      <StatsWidget />
    </PermissionGate>
  </div>
</PermissionGate>
```

### 3. Hooks - Toutes les utilisations

```tsx
import { useACL } from '@/hooks/useACL'
import { useHasPermission, useHasAnyPermission, useHasAllPermissions, useHasRole, useHasAnyRole } from '@/stores/aclStore'

function AllHooksCombinations() {
  // 3.1 Hook principal
  const {
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canViewUsers,
    canCreateUsers,
    isAdmin,
    isExpertRole
  } = useACL()

  // 3.2 Hooks réactifs individuels
  const canView = useHasPermission(Permission.VIEW_USER)
  const canViewOrCreate = useHasAnyPermission([Permission.VIEW_USER, Permission.CREATE_USER])
  const canFullManage = useHasAllPermissions([Permission.VIEW_USER, Permission.CREATE_USER, Permission.UPDATE_USER, Permission.DELETE_USER])
  const isAdminRole = useHasRole(UserRole.ADMIN)
  const isManagement = useHasAnyRole([UserRole.ADMIN, UserRole.EXPERT_MANAGER])

  // 3.3 Vérifications dynamiques
  const checkDynamicPermission = (permission: Permission) => {
    return hasPermission(permission)
  }

  // 3.4 Vérifications conditionnelles
  const canEditAssignment = (assignmentStatus: string) => {
    if (assignmentStatus === 'closed') return false
    return hasPermission(Permission.UPDATE_ASSIGNMENT)
  }

  // 3.5 Vérifications par contexte
  const getAvailableActions = () => {
    const actions = []
    
    if (canViewUsers()) actions.push('view')
    if (canCreateUsers()) actions.push('create')
    if (hasPermission(Permission.UPDATE_USER)) actions.push('update')
    if (hasPermission(Permission.DELETE_USER)) actions.push('delete')
    
    return actions
  }

  // 3.6 Vérifications par rôle métier
  const getUIConfig = () => {
    if (isAdmin()) {
      return { showAllMenus: true, showStats: true, showManagement: true }
    }
    if (isExpertRole()) {
      return { showAllMenus: false, showStats: false, showManagement: false }
    }
    return { showAllMenus: false, showStats: false, showManagement: false }
  }

  return (
    <div>
      {/* Utilisation des vérifications */}
      {canView && <UserList />}
      {canViewOrCreate && <UserActions />}
      {canFullManage && <FullUserManagement />}
      {isAdminRole && <AdminPanel />}
      {isManagement && <ManagementTools />}
    </div>
  )
}
```

### 4. Combinaisons avancées dans les composants

```tsx
// 4.1 Menu conditionnel complexe
function DynamicMenu() {
  const { 
    canViewUsers, canCreateUsers, canUpdateUsers, canDeleteUsers,
    canViewAssignments, canCreateAssignments, canGenerateAssignments,
    canViewInvoices, canCreateInvoices, canGenerateInvoices,
    isAdmin, isExpertRole, isFinancialRole
  } = useACL()

  const menuItems = [
    // Section Utilisateurs
    ...(canViewUsers() ? [{
      label: 'Utilisateurs',
      items: [
        ...(canViewUsers() ? [{ label: 'Liste', path: '/users' }] : []),
        ...(canCreateUsers() ? [{ label: 'Créer', path: '/users/create' }] : []),
        ...(canUpdateUsers() ? [{ label: 'Gérer', path: '/users/manage' }] : [])
      ]
    }] : []),

    // Section Dossiers
    ...(canViewAssignments() ? [{
      label: 'Dossiers',
      items: [
        { label: 'Liste', path: '/assignments' },
        ...(canCreateAssignments() ? [{ label: 'Nouveau', path: '/assignments/create' }] : []),
        ...(canGenerateAssignments() ? [{ label: 'Rapports', path: '/assignments/reports' }] : [])
      ]
    }] : []),

    // Section Finances
    ...(canViewInvoices() ? [{
      label: 'Finances',
      items: [
        { label: 'Factures', path: '/invoices' },
        ...(canCreateInvoices() ? [{ label: 'Nouvelle facture', path: '/invoices/create' }] : []),
        ...(canGenerateInvoices() ? [{ label: 'Générer PDF', action: 'generate' }] : [])
      ]
    }] : []),

    // Section Admin
    ...(isAdmin() ? [{
      label: 'Administration',
      items: [
        { label: 'Paramètres', path: '/admin/settings' },
        { label: 'Logs', path: '/admin/logs' }
      ]
    }] : [])
  ]

  return (
    <nav>
      {menuItems.map(section => (
        <div key={section.label}>
          <h3>{section.label}</h3>
          {section.items.map(item => (
            <Link key={item.label} to={item.path}>{item.label}</Link>
          ))}
        </div>
      ))}
    </nav>
  )
}

// 4.2 Tableau avec actions conditionnelles
function DataTable({ data, type }) {
  const { hasPermission } = useACL()

  const getActions = (item, type) => {
    const actions = []

    // Actions communes
    actions.push({ label: 'Voir', action: 'view', permission: null })

    // Actions spécifiques par type
    switch (type) {
      case 'users':
        if (hasPermission(Permission.UPDATE_USER)) {
          actions.push({ label: 'Modifier', action: 'edit', permission: Permission.UPDATE_USER })
        }
        if (hasPermission(Permission.DELETE_USER)) {
          actions.push({ label: 'Supprimer', action: 'delete', permission: Permission.DELETE_USER })
        }
        break

      case 'assignments':
        if (hasPermission(Permission.UPDATE_ASSIGNMENT)) {
          actions.push({ label: 'Modifier', action: 'edit', permission: Permission.UPDATE_ASSIGNMENT })
        }
        if (hasPermission(Permission.GENERATE_ASSIGNMENT) && item.status === 'edited') {
          actions.push({ label: 'Générer', action: 'generate', permission: Permission.GENERATE_ASSIGNMENT })
        }
        break

      case 'invoices':
        if (hasPermission(Permission.UPDATE_INVOICE) && !item.cancelled_at) {
          actions.push({ label: 'Modifier', action: 'edit', permission: Permission.UPDATE_INVOICE })
        }
        if (hasPermission(Permission.CANCEL_INVOICE) && !item.cancelled_at) {
          actions.push({ label: 'Annuler', action: 'cancel', permission: Permission.CANCEL_INVOICE })
        }
        if (hasPermission(Permission.GENERATE_INVOICE)) {
          actions.push({ label: 'Générer PDF', action: 'generate', permission: Permission.GENERATE_INVOICE })
        }
        break
    }

    return actions
  }

  return (
    <table>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              {getActions(item, type).map(action => (
                <Button 
                  key={action.action}
                  onClick={() => handleAction(action.action, item)}
                  variant={action.action === 'delete' ? 'destructive' : 'default'}
                >
                  {action.label}
                </Button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// 4.3 Dashboard adaptatif
function AdaptiveDashboard() {
  const { 
    isAdmin, isExpertRole, isFinancialRole,
    canViewUsers, canViewAssignments, canViewInvoices, canViewPayments,
    hasAnyPermission
  } = useACL()

  const widgets = [
    // Widget Statistiques générales - visible pour tous
    { id: 'stats', component: <GeneralStats />, condition: () => true },

    // Widget Utilisateurs - Admin uniquement
    { 
      id: 'users', 
      component: <UserStats />, 
      condition: () => isAdmin() && canViewUsers() 
    },

    // Widget Dossiers - Experts et Managers
    { 
      id: 'assignments', 
      component: <AssignmentStats />, 
      condition: () => (isExpertRole() || isAdmin()) && canViewAssignments() 
    },

    // Widget Finances - Comptables et Admins
    { 
      id: 'finances', 
      component: <FinancialStats />, 
      condition: () => (isFinancialRole() || isAdmin()) && hasAnyPermission([Permission.VIEW_INVOICE, Permission.VIEW_PAYMENT])
    },

    // Widget Actions rapides - selon permissions
    { 
      id: 'quick-actions', 
      component: <QuickActions />, 
      condition: () => hasAnyPermission([
        Permission.CREATE_USER, 
        Permission.CREATE_ASSIGNMENT, 
        Permission.CREATE_INVOICE
      ])
    }
  ]

  const visibleWidgets = widgets.filter(widget => widget.condition())

  return (
    <div className="dashboard-grid">
      {visibleWidgets.map(widget => (
        <div key={widget.id} className="widget">
          {widget.component}
        </div>
      ))}
    </div>
  )
}
```

### 5. Patterns avancés de sécurité

```tsx
// 5.1 HOC (Higher-Order Component) pour la protection
function withPermission(WrappedComponent, requiredPermission) {
  return function PermissionWrappedComponent(props) {
    const { hasPermission } = useACL()
    
    if (!hasPermission(requiredPermission)) {
      return <AccessDenied />
    }
    
    return <WrappedComponent {...props} />
  }
}

// Utilisation
const ProtectedUserList = withPermission(UserList, Permission.VIEW_USER)

// 5.2 Hook personnalisé pour la validation de formulaire
function useFormPermissions(formType) {
  const { hasPermission } = useACL()
  
  const getFieldPermissions = () => {
    switch (formType) {
      case 'user':
        return {
          canEditName: hasPermission(Permission.UPDATE_USER),
          canEditRole: hasPermission(Permission.MANAGE_APP),
          canEditPermissions: hasPermission(Permission.MANAGE_APP)
        }
      case 'assignment':
        return {
          canEditBasicInfo: hasPermission(Permission.UPDATE_ASSIGNMENT),
          canEditFinancial: hasPermission(Permission.UPDATE_ASSIGNMENT),
          canEditStatus: hasPermission(Permission.VALIDATE_ASSIGNMENT)
        }
      default:
        return {}
    }
  }
  
  return getFieldPermissions()
}

// Utilisation
function UserForm() {
  const { canEditName, canEditRole, canEditPermissions } = useFormPermissions('user')
  
  return (
    <form>
      <input disabled={!canEditName} placeholder="Nom" />
      <select disabled={!canEditRole}>
        <option>Rôle</option>
      </select>
      {canEditPermissions && (
        <PermissionSelector />
      )}
    </form>
  )
}

// 5.3 Middleware de validation pour les actions
function useSecureAction() {
  const { hasPermission } = useACL()
  
  const executeWithPermission = (permission, action, ...args) => {
    if (!hasPermission(permission)) {
      toast.error('Vous n\'avez pas les permissions nécessaires')
      return false
    }
    
    return action(...args)
  }
  
  return { executeWithPermission }
}

// Utilisation
function UserActions() {
  const { executeWithPermission } = useSecureAction()
  
  const handleDeleteUser = (userId) => {
    executeWithPermission(
      Permission.DELETE_USER,
      async () => {
        await deleteUser(userId)
        toast.success('Utilisateur supprimé')
      }
    )
  }
  
  return (
    <Button onClick={() => handleDeleteUser(123)}>
      Supprimer
    </Button>
  )
}
```

## 🔧 Dépannage

### Problèmes courants

#### 1. Permissions non mises à jour
```tsx
// Problème : Les permissions ne se mettent pas à jour après connexion
// Solution : Vérifier l'initialisation dans authStore

// Dans authStore.ts
login: async (credentials) => {
  const userResponse = await authService.getUserInfo()
  // ✅ S'assurer que cette ligne est présente
  useACLStore.getState().initializeACL(userResponse.data)
}
```

#### 2. Hook non réactif
```tsx
// ❌ Problème : Le composant ne se met pas à jour
function MyComponent() {
  const { userPermissions } = useACL()
  const canEdit = userPermissions.includes(Permission.UPDATE_USER)
  return canEdit ? <Button>Modifier</Button> : null
}

// ✅ Solution : Utiliser les hooks réactifs
function MyComponent() {
  const canEdit = useHasPermission(Permission.UPDATE_USER)
  return canEdit ? <Button>Modifier</Button> : null
}
```

#### 3. Erreur de type avec les permissions
```tsx
// ❌ Problème : Erreur TypeScript
const permission = 'user.view' // string
const canView = useHasPermission(permission) // Erreur de type

// ✅ Solution : Utiliser l'enum
const canView = useHasPermission(Permission.VIEW_USER)
```

#### 4. Performance avec de nombreuses vérifications
```tsx
// ❌ Problème : Trop de recalculs
function ExpensiveComponent() {
  const { hasPermission } = useACL()
  
  return (
    <div>
      {hasPermission(Permission.VIEW_USER) && <UserWidget />}
      {hasPermission(Permission.VIEW_ASSIGNMENT) && <AssignmentWidget />}
      {hasPermission(Permission.VIEW_INVOICE) && <InvoiceWidget />}
      {/* ... beaucoup d'autres vérifications */}
    </div>
  )
}

// ✅ Solution : Utiliser useMemo ou les hooks réactifs
function OptimizedComponent() {
  const canViewUser = useHasPermission(Permission.VIEW_USER)
  const canViewAssignment = useHasPermission(Permission.VIEW_ASSIGNMENT)
  const canViewInvoice = useHasPermission(Permission.VIEW_INVOICE)
  
  return (
    <div>
      {canViewUser && <UserWidget />}
      {canViewAssignment && <AssignmentWidget />}
      {canViewInvoice && <InvoiceWidget />}
    </div>
  )
}
```

### Debugging

```tsx
// Utilitaire de debug pour l'ACL
function ACLDebugger() {
  const { userRole, userPermissions, isInitialized } = useACL()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-xs">
      <h4>ACL Debug</h4>
      <p>Initialisé: {isInitialized ? '✅' : '❌'}</p>
      <p>Rôle: {userRole || 'Aucun'}</p>
      <p>Permissions ({userPermissions.length}):</p>
      <ul className="text-xs">
        {userPermissions.map(p => (
          <li key={p}>• {p}</li>
        ))}
      </ul>
    </div>
  )
}

// À ajouter dans votre layout principal en développement
```

## 📚 Références

### Types principaux
- `UserRole` : Énumération des rôles utilisateur
- `Permission` : Énumération des permissions
- `ACLState` : État du store ACL
- `ACLActions` : Actions disponibles dans le store

### Services
- `aclService` : Service principal pour la logique métier
- `authService` : Service d'authentification (intègre ACL)

### Stores
- `useACLStore` : Store principal ACL
- `useAuthStore` : Store d'authentification (utilise ACL)

### Composants
- `ProtectedRoute` : Protection des routes
- `PermissionGate` : Affichage conditionnel
- Composants utilitaires : `RequirePermission`, `RequireRole`, etc.

### Hooks
- `useACL` : Hook principal unifié
- `useHasPermission` : Hook réactif pour une permission
- `useHasRole` : Hook réactif pour un rôle
- Et tous les autres hooks spécialisés

---

## 🎯 Conclusion

Ce système ACL offre une solution complète et flexible pour gérer les permissions dans Expert Auto. Il s'adapte automatiquement aux permissions assignées depuis le backoffice et fournit une API riche pour tous les cas d'usage, des plus simples aux plus complexes.

**Points clés à retenir :**
- ✅ Toujours utiliser les hooks réactifs pour les performances
- ✅ Préférer `PermissionGate` pour l'affichage conditionnel
- ✅ Utiliser `ProtectedRoute` pour la protection des routes
- ✅ Combiner permissions et rôles selon les besoins métier
- ✅ Tester toutes les combinaisons en développement

Pour toute question ou besoin spécifique, référez-vous aux exemples de ce guide ou contactez l'équipe de développement.