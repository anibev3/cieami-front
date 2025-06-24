import { useEffect } from 'react'
import { useShockPointsStore } from '@/stores/shock-points'
import { DataTable } from './components/data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { toast } from 'sonner'

export default function ShockPointsPage() {
  const { shockPoints, loading, error, fetchShockPoints } = useShockPointsStore()

  useEffect(() => {
    fetchShockPoints()
  }, [fetchShockPoints])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Points de choc</h1>
        <DataTableToolbar />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={shockPoints} loading={loading} />
      </div>
    </div>
  )
} 