import { useEffect, useState, useCallback } from 'react'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { DataTable } from './components/data-table'
import { VehicleModelMutateDialog } from './components/vehicle-model-mutate-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Header } from '@/components/layout/header'
import { useDebounce } from '@/hooks/use-debounce'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function VehicleModelsPageContent() {
  const { 
    vehicleModels, 
    loading, 
    error, 
    pagination,
    filters,
    fetchVehicleModels,
    setFilters,
    setPage
  } = useVehicleModelsStore()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.search)
  
  // Debounce pour la recherche
  const debouncedSearch = useDebounce(searchValue, 500)
  
  // Charger les données initiales
  useEffect(() => {
    fetchVehicleModels()
  }, [fetchVehicleModels])

  // Gérer la recherche debounced
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch })
      fetchVehicleModels(1, { search: debouncedSearch })
    }
  }, [debouncedSearch, filters.search, setFilters, fetchVehicleModels])

  // Gérer les erreurs
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  // Gestionnaires d'événements
  const handlePageChange = useCallback((page: number) => {
    setPage(page)
    fetchVehicleModels(page, { search: filters.search })
  }, [setPage, fetchVehicleModels, filters.search])

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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modèles de véhicules</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Rechercher un modèle..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="max-w-sm"
          />
          <VehicleModelMutateDialog open={open} onOpenChange={setOpen} />
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className='h-4 w-4' />
            Ajouter un modèle
          </Button>
        </div>
      </div>
        <DataTable 
          data={vehicleModels} 
          loading={loading}
          onPageChange={handlePageChange}
          pagination={pagination}
        />
        </div>
        </Main>
    </>
  )
}

export default function VehicleModelsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_VEHICLE_MODEL}>
      <VehicleModelsPageContent />
    </ProtectedRoute>
  )
} 