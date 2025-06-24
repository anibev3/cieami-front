import { useEffect } from 'react'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { DataTable } from './components/data-table'
import { VehicleModelMutateDialog } from './components/vehicle-model-mutate-dialog'
import { toast } from 'sonner'

export default function VehicleModelsPage() {
  const { vehicleModels, loading, error, fetchVehicleModels } = useVehicleModelsStore()

  useEffect(() => {
    fetchVehicleModels()
  }, [fetchVehicleModels])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modèles de véhicules</h1>
        <VehicleModelMutateDialog />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={vehicleModels} loading={loading} />
      </div>
    </div>
  )
} 