import { useEffect } from 'react'
import { useColorsStore } from '@/stores/colors'
import { DataTable } from './components/data-table'
import { ColorMutateDialog } from './components/color-mutate-dialog'
import { toast } from 'sonner'

export default function ColorsPage() {
  const { colors, loading, error, fetchColors } = useColorsStore()

  useEffect(() => {
    fetchColors()
  }, [fetchColors])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Couleurs</h1>
        <ColorMutateDialog />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={colors} loading={loading} />
      </div>
    </div>
  )
} 