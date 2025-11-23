// Types pour les permissions
export interface Permission {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface PermissionApiResponse {
  data: Permission[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

// Types pour les rôles
export interface RolePermission {
  id: string | null
  name: string
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  label: string
  description: string
  permissions: RolePermission[]
  created_at: string
  updated_at: string
}

export interface RoleApiResponse {
  data: Role[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

// Types pour les requêtes
export interface GivePermissionToRolePayload {
  permissions: string[]
}

export interface RevokePermissionFromRolePayload {
  permissions: string[]
}

export interface GivePermissionToUserPayload {
  permissions: string[]
}

export interface RevokePermissionFromUserPayload {
  permissions: string[]
}

// Types pour le groupement des permissions
export interface GroupedPermission {
  resource: string
  actions: Permission[]
}

// Types pour les statistiques
export interface PermissionsStats {
  totalPermissions: number
  totalRoles: number
  permissionsByResource: Record<string, number>
  rolesWithMostPermissions: Array<{
    role: Role
    count: number
  }>
}

