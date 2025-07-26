import { Button } from '@/components/ui/button'
import { PermissionGate } from '@/components/ui/permission-gate'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useACL, Permission, UserRole } from '@/hooks/useACL'

/**
 * Exemples d'utilisation des permissions ACL dans les composants
 */

// Exemple 1: Utilisation du hook useACL directement
export function ExampleWithHook() {
  const { hasPermission, hasRole, userRole, userPermissions } = useACL()

  return (
    <div className="space-y-4">
      <h3>Informations utilisateur</h3>
      <p>Rôle: {userRole}</p>
      <p>Permissions: {userPermissions.length}</p>
      
      {/* Affichage conditionnel basé sur les permissions */}
      {hasPermission(Permission.CREATE_USER) && (
        <Button>Créer un utilisateur</Button>
      )}
      
      {hasRole(UserRole.ADMIN) && (
        <Button variant="destructive">Action d'admin</Button>
      )}
    </div>
  )
}

// Exemple 2: Utilisation du composant PermissionGate
export function ExampleWithPermissionGate() {
  return (
    <div className="space-y-4">
      <h3>Contrôle d'accès avec PermissionGate</h3>
      
      {/* Affichage basé sur une permission */}
      <PermissionGate permission={Permission.VIEW_USER}>
        <Button>Voir les utilisateurs</Button>
      </PermissionGate>
      
      {/* Affichage basé sur plusieurs permissions (ANY) */}
      <PermissionGate 
        permissions={[Permission.CREATE_USER, Permission.UPDATE_USER]}
        requireAllPermissions={false}
      >
        <Button>Gérer les utilisateurs</Button>
      </PermissionGate>
      
      {/* Affichage basé sur plusieurs permissions (ALL) */}
      <PermissionGate 
        permissions={[Permission.DELETE_USER, Permission.VIEW_USER]}
        requireAllPermissions={true}
      >
        <Button variant="destructive">Supprimer des utilisateurs</Button>
      </PermissionGate>
      
      {/* Affichage basé sur un rôle */}
      <PermissionGate role={UserRole.SYSTEM_ADMIN}>
        <Button>Configuration système</Button>
      </PermissionGate>
      
      {/* Affichage basé sur plusieurs rôles */}
      <PermissionGate 
        roles={[UserRole.ADMIN, UserRole.SYSTEM_ADMIN]}
        requireAllRoles={false}
      >
        <Button>Administration</Button>
      </PermissionGate>
      
      {/* Avec fallback */}
      <PermissionGate 
        permission={Permission.MANAGE_APP}
        fallback={<p className="text-muted-foreground">Accès non autorisé</p>}
      >
        <Button>Gérer l'application</Button>
      </PermissionGate>
    </div>
  )
}

// Exemple 3: Utilisation du composant ProtectedRoute
export function ExampleWithProtectedRoute() {
  return (
    <div className="space-y-4">
      <h3>Protection de routes avec ProtectedRoute</h3>
      
      {/* Route protégée par permission */}
      <ProtectedRoute requiredPermission={Permission.VIEW_ASSIGNMENT}>
        <div>Contenu accessible aux utilisateurs avec permission VIEW_ASSIGNMENT</div>
      </ProtectedRoute>
      
      {/* Route protégée par rôle */}
      <ProtectedRoute requiredRole={UserRole.EXPERT}>
        <div>Contenu accessible aux experts</div>
      </ProtectedRoute>
      
      {/* Route protégée par plusieurs permissions */}
      <ProtectedRoute 
        requiredPermissions={[Permission.CREATE_INVOICE, Permission.VIEW_INVOICE]}
        requireAllPermissions={false}
      >
        <div>Contenu accessible aux utilisateurs pouvant créer OU voir les factures</div>
      </ProtectedRoute>
      
      {/* Route avec fallback personnalisé */}
      <ProtectedRoute 
        requiredRole={UserRole.ACCOUNTANT}
        fallback={<div className="text-red-500">Vous devez être comptable pour accéder à ce contenu</div>}
      >
        <div>Interface comptable</div>
      </ProtectedRoute>
    </div>
  )
}

// Exemple 4: Combinaison complexe de permissions
export function ExampleComplexPermissions() {
  const { hasAnyPermission, hasAllPermissions, isSystemAdmin } = useACL()
  
  const canManageFinances = hasAnyPermission([
    Permission.VIEW_PAYMENT,
    Permission.CREATE_PAYMENT,
    Permission.VIEW_INVOICE,
    Permission.CREATE_INVOICE
  ])
  
  const canFullyManageUsers = hasAllPermissions([
    Permission.VIEW_USER,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER
  ])
  
  return (
    <div className="space-y-4">
      <h3>Permissions complexes</h3>
      
      {canManageFinances && (
        <Button>Accéder aux finances</Button>
      )}
      
      {canFullyManageUsers && (
        <Button>Gestion complète des utilisateurs</Button>
      )}
      
      {isSystemAdmin() && (
        <Button variant="destructive">Actions système critiques</Button>
      )}
      
      {/* Logique métier complexe */}
      <PermissionGate
        permissions={[Permission.VIEW_ASSIGNMENT, Permission.ASSIGNMENT_STATISTICS]}
        requireAllPermissions={true}
        fallback={
          <PermissionGate permission={Permission.VIEW_ASSIGNMENT}>
            <Button disabled>Statistiques (accès limité)</Button>
          </PermissionGate>
        }
      >
        <Button>Statistiques complètes des dossiers</Button>
      </PermissionGate>
    </div>
  )
}

// Exemple 5: Utilisation dans les menus contextuels
export function ExampleContextualMenus() {
  return (
    <div className="space-y-4">
      <h3>Menus contextuels avec ACL</h3>
      
      <div className="flex gap-2">
        <PermissionGate permission={Permission.CREATE_ASSIGNMENT}>
          <Button size="sm">Nouveau dossier</Button>
        </PermissionGate>
        
        <PermissionGate permission={Permission.UPDATE_ASSIGNMENT}>
          <Button size="sm" variant="outline">Modifier</Button>
        </PermissionGate>
        
        <PermissionGate permission={Permission.DELETE_ASSIGNMENT}>
          <Button size="sm" variant="destructive">Supprimer</Button>
        </PermissionGate>
        
        <PermissionGate 
          roles={[UserRole.EXPERT, UserRole.EXPERT_MANAGER]}
          requireAllRoles={false}
        >
          <Button size="sm" variant="secondary">Actions d'expert</Button>
        </PermissionGate>
      </div>
    </div>
  )
} 