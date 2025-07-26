import { useACL } from '@/hooks/useACL'
import { NavGroup, NavItem, NavCollapsible } from './types'

/**
 * Hook pour filtrer les éléments de navigation en fonction des permissions ACL
 */
export function useACLNavFilter() {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isInitialized
  } = useACL()

  /**
   * Vérifie si un élément de navigation est accessible selon les permissions ACL
   */
  const checkNavItemAccess = (item: NavItem | NavGroup): boolean => {
    // Si l'ACL n'est pas initialisé, ne pas afficher les éléments protégés
    if (!isInitialized) {
      return !item.requiredPermission && 
             !item.requiredPermissions && 
             !item.requiredRole && 
             !item.requiredRoles
    }

    // Vérification des permissions
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false
    }

    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      if (item.requireAllPermissions && !hasAllPermissions(item.requiredPermissions)) {
        return false
      }
      if (!item.requireAllPermissions && !hasAnyPermission(item.requiredPermissions)) {
        return false
      }
    }

    // Vérification des rôles
    if (item.requiredRole && !hasRole(item.requiredRole)) {
      return false
    }

    if (item.requiredRoles && item.requiredRoles.length > 0) {
      if (item.requireAllRoles && !hasAllRoles(item.requiredRoles)) {
        return false
      }
      if (!item.requireAllRoles && !hasAnyRole(item.requiredRoles)) {
        return false
      }
    }

    return true
  }

  /**
   * Filtre récursivement les éléments de navigation
   */
  const filterNavItem = (item: NavItem): NavItem | null => {
    // Vérifier l'accès à l'élément principal
    if (!checkNavItemAccess(item)) {
      return null
    }

    // Si c'est un élément collapsible, filtrer ses sous-éléments
    if ('items' in item && item.items) {
      const filteredSubItems = item.items
        .map(subItem => {
          // Vérifier l'accès au sous-élément
          if (!checkNavItemAccess(subItem)) {
            return null
          }
          return subItem
        })
        .filter(Boolean) as (NavItem & { url: string })[]

      // Si aucun sous-élément n'est accessible, masquer l'élément parent
      if (filteredSubItems.length === 0) {
        return null
      }

      return {
        ...item,
        items: filteredSubItems
      } as NavCollapsible
    }

    return item
  }

  /**
   * Filtre un groupe de navigation
   */
  const filterNavGroup = (group: NavGroup): NavGroup | null => {
    // Vérifier l'accès au groupe
    if (!checkNavItemAccess(group)) {
      return null
    }

    // Filtrer les éléments du groupe
    const filteredItems = group.items
      .map(filterNavItem)
      .filter(Boolean) as NavItem[]

    // Si aucun élément n'est accessible, masquer le groupe
    if (filteredItems.length === 0) {
      return null
    }

    return {
      ...group,
      items: filteredItems
    }
  }

  /**
   * Filtre tous les groupes de navigation
   */
  const filterNavGroups = (navGroups: NavGroup[]): NavGroup[] => {
    return navGroups
      .map(filterNavGroup)
      .filter(Boolean) as NavGroup[]
  }

  return {
    filterNavGroups,
    checkNavItemAccess,
    isInitialized
  }
} 