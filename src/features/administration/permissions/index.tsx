import { useEffect, useState } from 'react'
import { usePermissionsStore } from '@/stores/permissionsStore'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { OverviewTab } from './components/overview-tab'
import { RolesTab } from './components/roles-tab'
import { UsersPermissionsTab } from './components/users-permissions-tab'
import { PermissionsSidebarNav } from './components/sidebar-nav'
import { OverviewStatsSkeleton } from './components/skeletons/overview-stats-skeleton'
import { LayoutDashboard, Shield, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const sidebarItems = [
  {
    value: 'overview',
    title: 'Vue d\'ensemble',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    value: 'roles',
    title: 'Rôles',
    icon: <Shield className="h-4 w-4" />,
  },
  {
    value: 'users',
    title: 'Permissions utilisateurs',
    icon: <Users className="h-4 w-4" />,
  },
]

export default function PermissionsPage() {
  const { fetchPermissions, fetchRoles, loading } = usePermissionsStore()
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPermissions(), fetchRoles()])
    }
    loadData()
  }, [fetchPermissions, fetchRoles])

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewTab />
      case 'roles':
        return <RolesTab />
      case 'users':
        return <UsersPermissionsTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <ProtectedRoute>
      <>
        <Header fixed>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold">Gestion des Permissions</h1>
                {/* <p className="text-sm text-muted-foreground">
                  Gérez les rôles et permissions du système
                </p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Search />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </Header>

        <Main>
          <div className="flex gap-6 h-full">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <Card className="p-4 border-2 h-fit sticky top-20 shadow-none">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Navigation
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choisissez une section
                  </p>
                </div>
                <Separator className="mb-4" />
                <PermissionsSidebarNav
                  items={sidebarItems}
                  activeValue={activeSection}
                  onValueChange={setActiveSection}
                />
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                activeSection === 'overview' ? (
                  <div className="space-y-6">
                    <OverviewStatsSkeleton />
                  </div>
                ) : (
                  renderContent()
                )
              ) : (
                renderContent()
              )}
            </div>
          </div>
        </Main>
      </>
    </ProtectedRoute>
  )
}

