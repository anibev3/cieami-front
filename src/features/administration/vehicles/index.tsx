import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { VehicleMutateDialog } from './components/vehicle-mutate-dialog'
import { ViewVehicleDialog } from './components/view-vehicle-dialog'
import { DeleteVehicleDialog } from './components/delete-vehicle-dialog'
import { VehiclesPrimaryButtons } from './components/vehicles-primary-buttons'
import { useVehiclesStore } from '@/stores/vehicles'
import { Vehicle } from '@/types/vehicles'

export default function VehiclesPage() {
  const { fetchVehicles } = useVehiclesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  // Charger les véhicules une seule fois au montage du composant
  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Callback pour la création
  const handleCreate = () => {
    setSelectedVehicle(null)
    setIsCreateOpen(true)
  }

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsViewOpen(true)
  }

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsEditOpen(true)
  }

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteOpen(true)
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
            <h2 className='text-2xl font-bold tracking-tight'>Véhicules</h2>
            <p className='text-muted-foreground'>
              Gérez les véhicules du système
            </p>
          </div>
          <VehiclesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable />
        </div>
      </Main>

      {/* Dialogs */}
      <VehicleMutateDialog 
        id={null}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      
      <VehicleMutateDialog 
        id={selectedVehicle?.id || null}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
      
      <ViewVehicleDialog 
        vehicle={selectedVehicle}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />
      
      <DeleteVehicleDialog 
        vehicle={selectedVehicle}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => {
          // La suppression est gérée dans le DataTable
          setIsDeleteOpen(false)
        }}
      />
    </>
  )
} 