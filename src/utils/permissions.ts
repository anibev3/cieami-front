import { Permission, GroupedPermission } from '@/types/permissions'

/**
 * Groupe les permissions par ressource (première partie du nom avant le point)
 */
export function groupPermissionsByResource(
  permissions: Permission[]
): GroupedPermission[] {
  const grouped: Record<string, Permission[]> = {}

  permissions.forEach((permission) => {
    const [resource] = permission.name.split('.')
    if (!grouped[resource]) {
      grouped[resource] = []
    }
    grouped[resource].push(permission)
  })

  return Object.entries(grouped)
    .map(([resource, actions]) => ({
      resource,
      actions: actions.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.resource.localeCompare(b.resource))
}

/**
 * Extrait le nom de l'action depuis le nom complet de la permission
 * Ex: "user.create" -> "create"
 */
export function getActionName(permissionName: string): string {
  const parts = permissionName.split('.')
  return parts[parts.length - 1] || permissionName
}

/**
 * Formate le nom de la ressource pour l'affichage
 * Ex: "assignment_request" -> "Assignment Request"
 */
export function formatResourceName(resource: string): string {
  return resource
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formate le nom de l'action pour l'affichage
 * Ex: "create" -> "Créer"
 */
export function formatActionName(action: string): string {
  const actionMap: Record<string, string> = {
    create: 'Créer',
    view: 'Voir',
    update: 'Modifier',
    edit: 'Modifier',
    delete: 'Supprimer',
    enable: 'Activer',
    disable: 'Désactiver',
    cancel: 'Annuler',
    validate: 'Valider',
    accept: 'Accepter',
    reject: 'Rejeter',
    generate: 'Générer',
    realize: 'Réaliser',
    statistics: 'Statistiques',
    reset: 'Réinitialiser',
    create_worksheet: 'Créer une feuille de travail',
    create_quote: 'Créer un devis',
    validate_quote: 'Valider un devis',
    cancel_quote: 'Annuler un devis',
  }

  return actionMap[action] || action.charAt(0).toUpperCase() + action.slice(1)
}

/**
 * Vérifie si une permission est assignée à un rôle
 */
export function isPermissionAssignedToRole(
  permissionId: string,
  role: { permissions: Array<{ id: string | null; name: string }> }
): boolean {
  return role.permissions.some(
    (p) => p.id === permissionId || p.name === permissionId
  )
}

/**
 * Vérifie si une permission est assignée à un utilisateur
 */
export function isPermissionAssignedToUser(
  permissionId: string,
  userPermissions: Array<{ id: string | null; name: string }>
): boolean {
  return userPermissions.some(
    (p) => p.id === permissionId || p.name === permissionId
  )
}

/**
 * Calcule les statistiques des permissions
 */
export function calculatePermissionsStats(
  permissions: Permission[],
  roles: Array<{ permissions: Array<{ id: string | null; name: string }> }>
) {
  const permissionsByResource: Record<string, number> = {}
  const rolePermissionCounts: Array<{ role: any; count: number }> = []

  permissions.forEach((permission) => {
    const [resource] = permission.name.split('.')
    permissionsByResource[resource] = (permissionsByResource[resource] || 0) + 1
  })

  roles.forEach((role) => {
    rolePermissionCounts.push({
      role,
      count: role.permissions.length,
    })
  })

  rolePermissionCounts.sort((a, b) => b.count - a.count)

  return {
    totalPermissions: permissions.length,
    totalRoles: roles.length,
    permissionsByResource,
    rolesWithMostPermissions: rolePermissionCounts.slice(0, 5),
  }
}

