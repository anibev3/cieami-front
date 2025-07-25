import { useACLStore, useHasPermission, useHasAnyPermission, useHasAllPermissions, useHasRole, useHasAnyRole, useHasAllRoles, Permission, UserRole } from '@/stores/aclStore'

/**
 * Hook personnalisé pour gérer l'ACL (Access Control List)
 * Combine toutes les fonctionnalités ACL dans un seul hook
 */
export const useACL = () => {
  const aclStore = useACLStore()
  
  return {
    // État
    userRole: aclStore.userRole,
    userPermissions: aclStore.userPermissions,
    isInitialized: aclStore.isInitialized,
    
    // Actions
    setUserRole: aclStore.setUserRole,
    setUserPermissions: aclStore.setUserPermissions,
    clearACL: aclStore.clearACL,
    initializeACL: aclStore.initializeACL,
    
    // Méthodes de vérification
    hasPermission: aclStore.hasPermission,
    hasAnyPermission: aclStore.hasAnyPermission,
    hasAllPermissions: aclStore.hasAllPermissions,
    hasRole: aclStore.hasRole,
    hasAnyRole: aclStore.hasAnyRole,
    hasAllRoles: aclStore.hasAllRoles,
    
    // Hooks réactifs
    useHasPermission,
    useHasAnyPermission,
    useHasAllPermissions,
    useHasRole,
    useHasAnyRole,
    useHasAllRoles,
    
    // Utilitaires
    isSystemAdmin: () => aclStore.hasRole(UserRole.SYSTEM_ADMIN),
    isAdmin: () => aclStore.hasRole(UserRole.ADMIN),
    isExpert: () => aclStore.hasRole(UserRole.EXPERT),
    isExpertManager: () => aclStore.hasRole(UserRole.EXPERT_MANAGER),
    isAccountant: () => aclStore.hasRole(UserRole.ACCOUNTANT),
    isValidator: () => aclStore.hasRole(UserRole.VALIDATOR),
    isEditor: () => aclStore.hasRole(UserRole.EDITOR),
    isOpener: () => aclStore.hasRole(UserRole.OPENER),
    
    // Vérifications de permissions courantes
    canViewUsers: () => aclStore.hasPermission(Permission.VIEW_USER),
    canCreateUsers: () => aclStore.hasPermission(Permission.CREATE_USER),
    canUpdateUsers: () => aclStore.hasPermission(Permission.UPDATE_USER),
    canDeleteUsers: () => aclStore.hasPermission(Permission.DELETE_USER),
    
    canViewAssignments: () => aclStore.hasPermission(Permission.VIEW_ASSIGNMENT),
    canCreateAssignments: () => aclStore.hasPermission(Permission.CREATE_ASSIGNMENT),
    canUpdateAssignments: () => aclStore.hasPermission(Permission.UPDATE_ASSIGNMENT),
    canDeleteAssignments: () => aclStore.hasPermission(Permission.DELETE_ASSIGNMENT),
    canGenerateAssignments: () => aclStore.hasPermission(Permission.GENERATE_ASSIGNMENT),
    
    canViewInvoices: () => aclStore.hasPermission(Permission.VIEW_INVOICE),
    canCreateInvoices: () => aclStore.hasPermission(Permission.CREATE_INVOICE),
    canUpdateInvoices: () => aclStore.hasPermission(Permission.UPDATE_INVOICE),
    canDeleteInvoices: () => aclStore.hasPermission(Permission.DELETE_INVOICE),
    canGenerateInvoices: () => aclStore.hasPermission(Permission.GENERATE_INVOICE),
    canCancelInvoices: () => aclStore.hasPermission(Permission.CANCEL_INVOICE),
    
    canViewPayments: () => aclStore.hasPermission(Permission.VIEW_PAYMENT),
    canCreatePayments: () => aclStore.hasPermission(Permission.CREATE_PAYMENT),
    canUpdatePayments: () => aclStore.hasPermission(Permission.UPDATE_PAYMENT),
    canDeletePayments: () => aclStore.hasPermission(Permission.DELETE_PAYMENT),
    canCancelPayments: () => aclStore.hasPermission(Permission.CANCEL_PAYMENT),
    
    canManageApp: () => aclStore.hasPermission(Permission.MANAGE_APP),
    
    // Vérifications de rôles courantes
    isManagementRole: () => aclStore.hasAnyRole([
      UserRole.SYSTEM_ADMIN,
      UserRole.ADMIN,
      UserRole.CEO,
      UserRole.EXPERT_MANAGER
    ]),
    
    isExpertRole: () => aclStore.hasAnyRole([
      UserRole.EXPERT,
      UserRole.EXPERT_MANAGER
    ]),
    
    isFinancialRole: () => aclStore.hasAnyRole([
      UserRole.ACCOUNTANT,
      UserRole.ADMIN
    ]),
    
    isReadOnlyRole: () => aclStore.hasAnyRole([
      UserRole.INSURER_ADMIN,
      UserRole.REPAIRER_ADMIN
    ])
  }
}

// Re-exports pour faciliter l'import
export { Permission, UserRole } from '@/stores/aclStore' 