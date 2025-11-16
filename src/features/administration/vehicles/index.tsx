import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { useVehiclesStore } from '@/stores/vehicles'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function VehiclesPageContent() {
  const { fetchVehicles } = useVehiclesStore()

  // Charger les véhicules une seule fois au montage du composant
  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Véhicules</h2>
            <p className='text-muted-foreground'>
              Gérez les véhicules du système
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable />
        </div>
      </Main>
    </>
  )
}

export default function VehiclesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_VEHICLE}>
      <VehiclesPageContent />
    </ProtectedRoute>
  )
} 