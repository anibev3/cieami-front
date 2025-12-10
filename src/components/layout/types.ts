import { LinkProps } from '@tanstack/react-router'
import { Permission, UserRole } from '@/types/auth'

interface User {
  name: string
  email: string
  avatar: string
}

interface Team {
  name: string
  logo: React.ElementType
  plan: string
}

// Types pour les compteurs dynamiques
export interface NavItemCounter {
  key: string // Clé unique pour identifier le compteur
  value: number // Valeur du compteur
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' // Style du badge
}

interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
  // ACL properties
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAllRoles?: boolean
  // Dynamic counters
  dynamicCounters?: NavItemCounter[]
  showCounters?: boolean // Afficher ou non les compteurs pour cet élément
}

type NavLink = BaseNavItem & {
  url: LinkProps['to']
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
  title: string
  items: NavItem[]
  // ACL properties for groups
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAllRoles?: boolean
  // Dynamic counters for groups
  dynamicCounters?: NavItemCounter[]
  showCounters?: boolean
}

interface SidebarData {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

// Types pour la sidebar à deux panneaux
export interface SidebarMenuItem {
  title: string
  url: LinkProps['to']
  icon?: React.ElementType
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAllRoles?: boolean
}

export interface SidebarSection {
  title: string
  items: SidebarMenuItem[]
}

export interface SidebarMainCategory {
  id: string
  title: string
  icon: React.ElementType
  sections?: SidebarSection[]
  url?: LinkProps['to']
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAllRoles?: boolean
}

export interface SidebarTwoPanelData {
  mainCategories: SidebarMainCategory[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
