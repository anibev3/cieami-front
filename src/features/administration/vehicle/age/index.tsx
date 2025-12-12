import { useEffect, useState } from 'react'
import { DataTable } from '../../vehicle-ages/components/data-table'
import { VehicleAgesDialogs } from '../../vehicle-ages/components/vehicle-ages-dialogs'
import { VehicleAgesPrimaryButtons } from '../../vehicle-ages/components/vehicle-ages-primary-buttons'
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'
import { VehicleAge } from '@/services/vehicleAgeService'
import { useDebounce } from '@/hooks/use-debounce'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function VehicleAgePageContent() {
  const { 
    fetchVehicleAges, 
    pagination, 
    setFilters 
  } = useVehicleAgesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicleAge, setSelectedVehicleAge] = useState<VehicleAge | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Effet pour déclencher la recherche quand la requête change
  useEffect(() => {
    const newFilters = {
      search: debouncedSearchQuery,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    }
    setFilters(newFilters)
    fetchVehicleAges(newFilters)
  }, [debouncedSearchQuery])

  // Effet initial pour charger les données
  useEffect(() => {
    fetchVehicleAges()
  }, [])

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedVehicleAge(null)
    setIsCreateOpen(true)
  }

  const handleView = (vehicleAge: VehicleAge) => {
    setSelectedVehicleAge(vehicleAge)
    setIsViewOpen(true)
  }

  const handleEdit = (vehicleAge: VehicleAge) => {
    setSelectedVehicleAge(vehicleAge)
    setIsEditOpen(true)
  }

  const handleDelete = (vehicleAge: VehicleAge) => {
    setSelectedVehicleAge(vehicleAge)
    setIsDeleteOpen(true)
  }

  // Handler pour la recherche
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Handler pour le changement de page
  const handlePageChange = (page: number) => {
    const newFilters = {
      search: searchQuery,
      page
    }
    setFilters(newFilters)
    fetchVehicleAges(newFilters)
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Âges de véhicules</h2>
            <p className='text-muted-foreground'>
              Gérez les âges de véhicules du système
            </p>
          </div>
          <VehicleAgesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onPageChange={handlePageChange}
          />
        </div>
      </Main>

      <VehicleAgesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedVehicleAge={selectedVehicleAge}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function VehicleAgePage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_VEHICLE_AGE}>
      <VehicleAgePageContent />
    </ProtectedRoute>
  )
} 