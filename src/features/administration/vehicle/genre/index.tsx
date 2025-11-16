import { useEffect, useState } from 'react'
import { DataTable } from '@/features/administration/vehicle/genre/components/data-table'
import { VehicleGenresDialogs } from '@/features/administration/vehicle/genre/components/vehicle-genres-dialogs'
import { VehicleGenresPrimaryButtons } from '@/features/administration/vehicle/genre/components/vehicle-genres-primary-buttons'
import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'
import { VehicleGenre } from '@/services/vehicleGenreService'
import { useDebounce } from '@/hooks/use-debounce'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function VehicleGenresPageContent() {
  const { 
    fetchVehicleGenres, 
    pagination, 
    setFilters 
  } = useVehicleGenresStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicleGenre, setSelectedVehicleGenre] = useState<VehicleGenre | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Effet pour déclencher la recherche quand la requête change
  useEffect(() => {
    const newFilters = {
      search: debouncedSearchQuery,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    }
    setFilters(newFilters)
    fetchVehicleGenres(newFilters)
  }, [debouncedSearchQuery])

  // Effet initial pour charger les données
  useEffect(() => {
    fetchVehicleGenres()
  }, [])

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedVehicleGenre(null)
    setIsCreateOpen(true)
  }

  const handleView = (vehicleGenre: VehicleGenre) => {
    setSelectedVehicleGenre(vehicleGenre)
    setIsViewOpen(true)
  }

  const handleEdit = (vehicleGenre: VehicleGenre) => {
    setSelectedVehicleGenre(vehicleGenre)
    setIsEditOpen(true)
  }

  const handleDelete = (vehicleGenre: VehicleGenre) => {
    setSelectedVehicleGenre(vehicleGenre)
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
    fetchVehicleGenres(newFilters)
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
            <h2 className='text-2xl font-bold tracking-tight'>Genres de véhicules</h2>
            <p className='text-muted-foreground'>
              Gérez les genres de véhicules du système
            </p>
          </div>
          <VehicleGenresPrimaryButtons onCreate={handleCreate} />
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

      <VehicleGenresDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedVehicleGenre={selectedVehicleGenre}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function VehicleGenresPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_VEHICLE_GENRE}>
      <VehicleGenresPageContent />
    </ProtectedRoute>
  )
} 