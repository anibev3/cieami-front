import { useEffect, useState } from 'react'
import { DataTable } from '../../vehicle-energies/components/data-table'
import { VehicleEnergiesDialogs } from '../../vehicle-energies/components/vehicle-energies-dialogs'
import { VehicleEnergiesPrimaryButtons } from '../../vehicle-energies/components/vehicle-energies-primary-buttons'
import { useVehicleEnergiesStore } from '@/stores/vehicleEnergiesStore'
import { VehicleEnergy } from '@/services/vehicleEnergyService'
import { useDebounce } from '@/hooks/use-debounce'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function VehicleEnergiePageContent() {
  const { 
    fetchVehicleEnergies, 
    pagination, 
    setFilters 
  } = useVehicleEnergiesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicleEnergy, setSelectedVehicleEnergy] = useState<VehicleEnergy | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Effet pour déclencher la recherche quand la requête change
  useEffect(() => {
    const newFilters = {
      search: debouncedSearchQuery,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    }
    setFilters(newFilters)
    fetchVehicleEnergies(newFilters)
  }, [debouncedSearchQuery])

  // Effet initial pour charger les données
  useEffect(() => {
    fetchVehicleEnergies()
  }, [])

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedVehicleEnergy(null)
    setIsCreateOpen(true)
  }

  const handleView = (vehicleEnergy: VehicleEnergy) => {
    setSelectedVehicleEnergy(vehicleEnergy)
    setIsViewOpen(true)
  }

  const handleEdit = (vehicleEnergy: VehicleEnergy) => {
    setSelectedVehicleEnergy(vehicleEnergy)
    setIsEditOpen(true)
  }

  const handleDelete = (vehicleEnergy: VehicleEnergy) => {
    setSelectedVehicleEnergy(vehicleEnergy)
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
    fetchVehicleEnergies(newFilters)
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Énergies de véhicules</h2>
            <p className='text-muted-foreground'>
              Gérez les énergies de véhicules du système
            </p>
          </div>
          <VehicleEnergiesPrimaryButtons onCreate={handleCreate} />
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

      <VehicleEnergiesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedVehicleEnergy={selectedVehicleEnergy}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function VehicleEnergiePage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_VEHICLE_ENERGY}>
      <VehicleEnergiePageContent />
    </ProtectedRoute>
  )
} 