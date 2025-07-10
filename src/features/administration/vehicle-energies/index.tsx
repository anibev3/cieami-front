import { useEffect, useState } from 'react'
import { DataTable } from './components/data-table'
import { VehicleEnergiesDialogs } from './components/vehicle-energies-dialogs'
import { VehicleEnergiesPrimaryButtons } from './components/vehicle-energies-primary-buttons'
import { useVehicleEnergiesStore } from '@/stores/vehicleEnergiesStore'
import { VehicleEnergy } from '@/services/vehicleEnergyService'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'

export default function VehicleEnergiesPage() {
  const { fetchVehicleEnergies } = useVehicleEnergiesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicleEnergy, setSelectedVehicleEnergy] = useState<VehicleEnergy | null>(null)

  // Charger les énergies de véhicules une seule fois au montage du composant
  useEffect(() => {
    fetchVehicleEnergies()
  }, []) // Dépendance vide pour éviter les boucles

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