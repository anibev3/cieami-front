import { UserRole, Permission } from '@/types/auth'

class ACLService {
  /**
   * Vérifier si un utilisateur a une permission spécifique
   */
  hasPermission(userPermissions: Permission[], permission: Permission): boolean {
    return userPermissions.includes(permission)
  }

  /**
   * Vérifier si un utilisateur a au moins une des permissions
   */
  hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean {
    return permissions.some(permission => userPermissions.includes(permission))
  }

  /**
   * Vérifier si un utilisateur a toutes les permissions
   */
  hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean {
    return permissions.every(permission => userPermissions.includes(permission))
  }

  /**
   * Vérifier si un utilisateur a un rôle spécifique
   */
  hasRole(userRole: UserRole | null, role: UserRole): boolean {
    return userRole === role
  }

  /**
   * Vérifier si un utilisateur a au moins un des rôles
   */
  hasAnyRole(userRole: UserRole | null, roles: UserRole[]): boolean {
    return userRole ? roles.includes(userRole) : false
  }

  /**
   * Vérifier si un utilisateur a tous les rôles
   */
  hasAllRoles(userRole: UserRole | null, roles: UserRole[]): boolean {
    return userRole ? roles.includes(userRole) : false
  }

  /**
   * Obtenir toutes les permissions disponibles
   */
  getAllPermissions(): Permission[] {
    return Object.values(Permission)
  }

  /**
   * Obtenir tous les rôles disponibles
   */
  getAllRoles(): UserRole[] {
    return Object.values(UserRole)
  }

  /**
   * Obtenir le label d'un rôle
   */
  getRoleLabel(role: UserRole): string {
    const roleLabels: Record<UserRole, string> = {
      [UserRole.SYSTEM_ADMIN]: 'Administrateur système',
      [UserRole.ADMIN]: 'Administrateur plateforme',
      [UserRole.CEO]: 'Directeur général',
      [UserRole.EXPERT_ADMIN]: 'Administrateur expert',
      [UserRole.EXPERT_MANAGER]: 'Responsable expert',
      [UserRole.EXPERT]: 'Expert',
      [UserRole.OPENER]: 'Ouvreur',
      [UserRole.EDITOR_MANAGER]: 'Responsable édition',
      [UserRole.EDITOR]: 'Éditeur',
      [UserRole.VALIDATOR]: 'Validateur',
      [UserRole.ACCOUNTANT_MANAGER]: 'Responsable comptable',
      [UserRole.ACCOUNTANT]: 'Comptable',
      [UserRole.BUSINESS_DEVELOPER]: 'Développeur business',
      [UserRole.INSURER_ADMIN]: 'Administrateur assureur',
      [UserRole.INSURER_STANDARD_USER]: 'Utilisateur assureur',
      [UserRole.REPAIRER_ADMIN]: 'Administrateur réparateur',
      [UserRole.REPAIRER_STANDARD_USER]: 'Utilisateur réparateur',
      [UserRole.CLIENT]: 'Client',
      [UserRole.UNASSIGNED]: 'Non assigné'
    }
    return roleLabels[role] || role
  }

  /**
   * Obtenir le label d'une permission
   */
  getPermissionLabel(permission: Permission): string {
    const permissionLabels: Record<Permission, string> = {
      // User permissions
      [Permission.VIEW_USER]: 'Voir les utilisateurs',
      [Permission.CREATE_USER]: 'Créer un utilisateur',
      [Permission.UPDATE_USER]: 'Modifier un utilisateur',
      [Permission.DELETE_USER]: 'Supprimer un utilisateur',
      [Permission.ENABLE_USER]: 'Activer un utilisateur',
      [Permission.DISABLE_USER]: 'Désactiver un utilisateur',
      [Permission.RESET_USER]: 'Réinitialiser un utilisateur',

      // Assignment permissions
      [Permission.VIEW_ASSIGNMENT]: 'Voir les dossiers',
      [Permission.CREATE_ASSIGNMENT]: 'Créer un dossier',
      [Permission.UPDATE_ASSIGNMENT]: 'Modifier un dossier',
      [Permission.REALIZE_ASSIGNMENT]: 'Réaliser un dossier',
      [Permission.EDIT_ASSIGNMENT]: 'Éditer un dossier',
      [Permission.VALIDATE_ASSIGNMENT]: 'Valider un dossier',
      [Permission.CLOSE_ASSIGNMENT]: 'Clôturer un dossier',
      [Permission.CANCEL_ASSIGNMENT]: 'Annuler un dossier',
      [Permission.GENERATE_ASSIGNMENT]: 'Générer un rapport',
      [Permission.DELETE_ASSIGNMENT]: 'Supprimer un dossier',
      [Permission.ASSIGNMENT_STATISTICS]: 'Voir les statistiques des dossiers',

      // Invoice permissions
      [Permission.VIEW_INVOICE]: 'Voir les factures',
      [Permission.CREATE_INVOICE]: 'Créer une facture',
      [Permission.UPDATE_INVOICE]: 'Modifier une facture',
      [Permission.CANCEL_INVOICE]: 'Annuler une facture',
      [Permission.GENERATE_INVOICE]: 'Générer une facture',
      [Permission.DELETE_INVOICE]: 'Supprimer une facture',
      [Permission.INVOICE_STATISTICS]: 'Voir les statistiques des factures',

      // Payment permissions
      [Permission.VIEW_PAYMENT]: 'Voir les paiements',
      [Permission.CREATE_PAYMENT]: 'Créer un paiement',
      [Permission.UPDATE_PAYMENT]: 'Modifier un paiement',
      [Permission.CANCEL_PAYMENT]: 'Annuler un paiement',
      [Permission.DELETE_PAYMENT]: 'Supprimer un paiement',
      [Permission.PAYMENT_STATISTICS]: 'Voir les statistiques des paiements',

      // App permissions
      [Permission.MANAGE_APP]: 'Gérer l\'application'
    }
    return permissionLabels[permission] || permission
  }

  /**
   * Obtenir les permissions par groupe pour l'affichage
   */
  getPermissionsByGroup(): Record<string, Permission[]> {
    return {
      'Utilisateurs': [
        Permission.VIEW_USER,
        Permission.CREATE_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,
        Permission.ENABLE_USER,
        Permission.DISABLE_USER,
        Permission.RESET_USER
      ],
      'Dossiers': [
        Permission.VIEW_ASSIGNMENT,
        Permission.CREATE_ASSIGNMENT,
        Permission.UPDATE_ASSIGNMENT,
        Permission.REALIZE_ASSIGNMENT,
        Permission.EDIT_ASSIGNMENT,
        Permission.VALIDATE_ASSIGNMENT,
        Permission.CLOSE_ASSIGNMENT,
        Permission.CANCEL_ASSIGNMENT,
        Permission.GENERATE_ASSIGNMENT,
        Permission.DELETE_ASSIGNMENT,
        Permission.ASSIGNMENT_STATISTICS
      ],
      'Factures': [
        Permission.VIEW_INVOICE,
        Permission.CREATE_INVOICE,
        Permission.UPDATE_INVOICE,
        Permission.CANCEL_INVOICE,
        Permission.GENERATE_INVOICE,
        Permission.DELETE_INVOICE,
        Permission.INVOICE_STATISTICS
      ],
      'Paiements': [
        Permission.VIEW_PAYMENT,
        Permission.CREATE_PAYMENT,
        Permission.UPDATE_PAYMENT,
        Permission.CANCEL_PAYMENT,
        Permission.DELETE_PAYMENT,
        Permission.PAYMENT_STATISTICS
      ],
      'Application': [
        Permission.MANAGE_APP
      ]
    }
  }
}

// Export d'une instance singleton
export const aclService = new ACLService()
export default aclService 