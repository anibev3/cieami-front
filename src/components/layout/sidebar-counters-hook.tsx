import { useMemo } from 'react'
import { useDashboardStore } from '@/stores/dashboard'
import { NavGroup, NavItem, NavItemCounter } from './types'

/**
 * Hook pour gérer les compteurs dynamiques dans la sidebar
 */
export function useSidebarCounters() {
  const { stats } = useDashboardStore()

  /**
   * Génère les compteurs pour les dossiers d'assignation
   */
  const getAssignmentCounters = useMemo((): NavItemCounter[] => {
    if (!stats?.assignments) return []

    return [
      {
        key: 'all',
        value: stats.assignments.total_assignments.value,
        variant: 'secondary'
      },
      {
        key: 'open',
        value: stats.assignments.open_assignments.value,
        variant: 'default'
      },
      {
        key: 'realized',
        value: stats.assignments.realized_assignments.value,
        variant: 'secondary'
      },
      {
        key: 'edited',
        value: stats.assignments.edited_assignments.value,
        variant: 'secondary'
      },
      {
        key: 'validated',
        value: stats.assignments.validated_assignments.value,
        variant: 'secondary'
      },
      {
        key: 'closed',
        value: stats.assignments.closed_assignments.value,
        variant: 'secondary'
      }
    ]
  }, [stats?.assignments])

  /**
   * Génère les compteurs pour les utilisateurs
   */
  const getUserCounters = useMemo((): NavItemCounter[] => {
    if (!stats?.users) return []

    return [
      {
        key: 'total',
        value: stats.users.total_users.value,
        variant: 'secondary'
      },
      {
        key: 'active',
        value: stats.users.active_users.value,
        variant: 'default'
      },
      {
        key: 'inactive',
        value: stats.users.inactive_users.value,
        variant: 'destructive'
      }
    ]
  }, [stats?.users])

  /**
   * Génère les compteurs pour les assureurs
   */
  const getInsurerCounters = useMemo((): NavItemCounter[] => {
    if (!stats?.insurers) return []

    return [
      {
        key: 'total',
        value: stats.insurers.total_insurers.value,
        variant: 'secondary'
      },
      {
        key: 'active',
        value: stats.insurers.active_insurers.value,
        variant: 'default'
      },
      {
        key: 'inactive',
        value: stats.insurers.inactive_insurers.value,
        variant: 'destructive'
      }
    ]
  }, [stats?.insurers])

  /**
   * Génère les compteurs pour les réparateurs
   */
  const getRepairerCounters = useMemo((): NavItemCounter[] => {
    if (!stats?.repairers) return []

    return [
      {
        key: 'total',
        value: stats.repairers.total_repairers.value,
        variant: 'secondary'
      },
      {
        key: 'active',
        value: stats.repairers.active_repairers.value,
        variant: 'default'
      },
      {
        key: 'inactive',
        value: stats.repairers.inactive_repairers.value,
        variant: 'destructive'
      }
    ]
  }, [stats?.repairers])

  /**
   * Génère les compteurs pour les véhicules
   */
  const getVehicleCounters = useMemo((): NavItemCounter[] => {
    if (!stats?.vehicles) return []

    return [
      {
        key: 'total',
        value: stats.vehicles.total_vehicles.value,
        variant: 'secondary'
      },
      {
        key: 'active',
        value: stats.vehicles.active_vehicles.value,
        variant: 'default'
      },
      {
        key: 'inactive',
        value: stats.vehicles.inactive_vehicles.value,
        variant: 'destructive'
      }
    ]
  }, [stats?.vehicles])

  /**
   * Applique les compteurs dynamiques aux éléments de navigation
   */
  const applyCountersToNavItems = (items: NavItem[]): NavItem[] => {
    return items.map(item => {
      // Gestion des éléments avec sous-éléments
      if (item.items) {
        return {
          ...item,
          items: item.items.map(subItem => {
            // Appliquer les compteurs aux sous-éléments selon leur URL
            if (subItem.url === '/assignments') {
              return {
                ...subItem,
                showCounters: true,
                dynamicCounters: getAssignmentCounters
              }
            }
            if (subItem.url === '/administration/users') {
              return {
                ...subItem,
                showCounters: true,
                dynamicCounters: getUserCounters
              }
            }
            if (subItem.url === '/gestion/assureurs') {
              return {
                ...subItem,
                showCounters: true,
                dynamicCounters: getInsurerCounters
              }
            }
            if (subItem.url === '/gestion/reparateurs') {
              return {
                ...subItem,
                showCounters: true,
                dynamicCounters: getRepairerCounters
              }
            }
            if (subItem.url === '/administration/vehicles') {
              return {
                ...subItem,
                showCounters: true,
                dynamicCounters: getVehicleCounters
              }
            }
            return subItem
          })
        }
      }

      // Gestion des éléments simples
      if (item.url === '/assignments') {
        return {
          ...item,
          showCounters: true,
          dynamicCounters: getAssignmentCounters
        }
      }
      if (item.url === '/administration/users') {
        return {
          ...item,
          showCounters: true,
          dynamicCounters: getUserCounters
        }
      }
      if (item.url === '/gestion/assureurs') {
        return {
          ...item,
          showCounters: true,
          dynamicCounters: getInsurerCounters
        }
      }
      if (item.url === '/gestion/reparateurs') {
        return {
          ...item,
          showCounters: true,
          dynamicCounters: getRepairerCounters
        }
      }
      if (item.url === '/administration/vehicles') {
        return {
          ...item,
          showCounters: true,
          dynamicCounters: getVehicleCounters
        }
      }

      return item
    })
  }

  /**
   * Applique les compteurs aux groupes de navigation
   */
  const applyCountersToNavGroups = (navGroups: NavGroup[]): NavGroup[] => {
    return navGroups.map(group => ({
      ...group,
      items: applyCountersToNavItems(group.items)
    }))
  }

  return {
    applyCountersToNavGroups,
    getAssignmentCounters,
    getUserCounters,
    getInsurerCounters,
    getRepairerCounters,
    getVehicleCounters,
    hasStats: !!stats
  }
} 