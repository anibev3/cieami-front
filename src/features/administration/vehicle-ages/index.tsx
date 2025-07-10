import { useEffect, useState } from 'react'
import { DataTable } from './components/data-table'
import { VehicleAgesDialogs } from './components/vehicle-ages-dialogs'
import { VehicleAgesPrimaryButtons } from './components/vehicle-ages-primary-buttons'
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'
import { VehicleAge } from '@/services/vehicleAgeService'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'

export default function VehicleAgesPage() {
  const { fetchVehicleAges } = useVehicleAgesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicleAge, setSelectedVehicleAge] = useState<VehicleAge | null>(null)

  // Charger les âges de véhicules une seule fois au montage du composant
  useEffect(() => {
    fetchVehicleAges()
  }, []) // Dépendance vide pour éviter les boucles

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