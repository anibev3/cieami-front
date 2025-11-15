import { useACLStore, useHasPermission, useHasAnyPermission, useHasAllPermissions, useHasRole, useHasAnyRole, useHasAllRoles, useHasEntityType, useHasAnyEntityType, useUserEntityType, Permission, UserRole, EntityTypeEnum } from '@/stores/aclStore'

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
    userEntityType: aclStore.userEntityType,
    isInitialized: aclStore.isInitialized,
    
    // Actions
    setUserRole: aclStore.setUserRole,
    setUserPermissions: aclStore.setUserPermissions,
    setUserEntityType: aclStore.setUserEntityType,
    clearACL: aclStore.clearACL,
    initializeACL: aclStore.initializeACL,
    
    // Méthodes de vérification
    hasPermission: aclStore.hasPermission,
    hasAnyPermission: aclStore.hasAnyPermission,
    hasAllPermissions: aclStore.hasAllPermissions,
    hasRole: aclStore.hasRole,
    hasAnyRole: aclStore.hasAnyRole,
    hasAllRoles: aclStore.hasAllRoles,
    hasEntityType: aclStore.hasEntityType,
    hasAnyEntityType: aclStore.hasAnyEntityType,
    
    // Hooks réactifs
    useHasPermission,
    useHasAnyPermission,
    useHasAllPermissions,
    useHasRole,
    useHasAnyRole,
    useHasAllRoles,
    useHasEntityType,
    useHasAnyEntityType,
    useUserEntityType,
    
    // Utilitaires
    isSystemAdmin: () => aclStore.hasRole(UserRole.SYSTEM_ADMIN),
    isAdmin: () => aclStore.hasRole(UserRole.ADMIN),
    isExpertAdmin: () => aclStore.hasRole(UserRole.EXPERT_ADMIN),
    isExpert: () => aclStore.hasRole(UserRole.EXPERT),
    isExpertManager: () => aclStore.hasRole(UserRole.EXPERT_MANAGER),
    isEditorManager: () => aclStore.hasRole(UserRole.EDITOR_MANAGER),
    isAccountant: () => aclStore.hasRole(UserRole.ACCOUNTANT),
    isAccountantManager: () => aclStore.hasRole(UserRole.ACCOUNTANT_MANAGER),
    isValidator: () => aclStore.hasRole(UserRole.VALIDATOR),
    isEditor: () => aclStore.hasRole(UserRole.EDITOR),
    isOpener: () => aclStore.hasRole(UserRole.OPENER),
    isCEO: () => aclStore.hasRole(UserRole.CEO),
    isBusinessDeveloper: () => aclStore.hasRole(UserRole.BUSINESS_DEVELOPER),
    isInsurerAdmin: () => aclStore.hasRole(UserRole.INSURER_ADMIN),
    isInsurerStandardUser: () => aclStore.hasRole(UserRole.INSURER_STANDARD_USER),
    isRepairerAdmin: () => aclStore.hasRole(UserRole.REPAIRER_ADMIN),
    isRepairerStandardUser: () => aclStore.hasRole(UserRole.REPAIRER_STANDARD_USER),
    isClient: () => aclStore.hasRole(UserRole.CLIENT),
    isUnassigned: () => aclStore.hasRole(UserRole.UNASSIGNED),
    
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
    
    canViewAssignmentRequests: () => aclStore.hasPermission(Permission.VIEW_ASSIGNMENT_REQUEST),
    canAcceptAssignmentRequests: () => aclStore.hasPermission(Permission.ACCEPT_ASSIGNMENT_REQUEST),
    canRejectAssignmentRequests: () => aclStore.hasPermission(Permission.REJECT_ASSIGNMENT_REQUEST),
    
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
      UserRole.EXPERT_MANAGER,
      UserRole.EXPERT_ADMIN
    ]),

    isInsurerRole: () => aclStore.hasAnyRole([
      UserRole.INSURER_ADMIN,
      UserRole.INSURER_STANDARD_USER,
    ]),

    isRepairerRole: () => aclStore.hasAnyRole([
      UserRole.REPAIRER_ADMIN,
      UserRole.REPAIRER_STANDARD_USER,
    ]),
    
    isFinancialRole: () => aclStore.hasAnyRole([
      UserRole.ACCOUNTANT,
      UserRole.ADMIN
    ]),
    
    // Les rôles en lecture seule (ex: pas de création de dossier)
    isReadOnlyRole: () => aclStore.hasAnyRole([
      UserRole.INSURER_ADMIN,
      UserRole.REPAIRER_ADMIN
    ]),
    
    // Vérifications de types d'entités
    isMainOrganization: () => aclStore.hasEntityType(EntityTypeEnum.MAIN_ORGANIZATION),
    isOrganization: () => aclStore.hasEntityType(EntityTypeEnum.ORGANIZATION),
    isInsurerEntity: () => aclStore.hasEntityType(EntityTypeEnum.INSURER),
    isRepairerEntity: () => aclStore.hasEntityType(EntityTypeEnum.REPAIRER),
    
    // Vérifications combinées de types d'entités
    isExpertEntity: () => aclStore.hasAnyEntityType([
      EntityTypeEnum.MAIN_ORGANIZATION,
      EntityTypeEnum.ORGANIZATION
    ]),
    
    isExternalEntity: () => aclStore.hasAnyEntityType([
      EntityTypeEnum.INSURER,
      EntityTypeEnum.REPAIRER
    ])
  }
}

// Re-exports pour faciliter l'import
export { Permission, UserRole, EntityTypeEnum } from '@/stores/aclStore' 