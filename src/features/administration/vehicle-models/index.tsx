import { useEffect, useState } from 'react'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { DataTable } from './components/data-table'
import { VehicleModelMutateDialog } from './components/vehicle-model-mutate-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Header } from '@/components/layout/header'

export default function VehicleModelsPage() {
  const { vehicleModels, loading, error, fetchVehicleModels } = useVehicleModelsStore()
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    fetchVehicleModels()
  }, [fetchVehicleModels])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

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
        <VehicleModelMutateDialog open={open} onOpenChange={setOpen} />
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className='h-4 w-4' />
          Ajouter un modèle
        </Button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={vehicleModels} loading={loading} />
      </div>
        </div>
        </Main>
    </>
  )
} 