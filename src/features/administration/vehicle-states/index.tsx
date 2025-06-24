import { useEffect } from 'react'
import { useVehicleStatesStore } from '@/stores/vehicle-states'
import { DataTable } from './components/data-table'
import { VehicleStateMutateDialog } from './components/vehicle-state-mutate-dialog'
import { toast } from 'sonner'

export default function VehicleStatesPage() {
  const { vehicleStates, loading, error, fetchVehicleStates } = useVehicleStatesStore()

  useEffect(() => {
    fetchVehicleStates()
  }, [fetchVehicleStates])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">États de véhicules</h1>
        <VehicleStateMutateDialog />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={vehicleStates} loading={loading} />
      </div>
    </div>
  )
} 