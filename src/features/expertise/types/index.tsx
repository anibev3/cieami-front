import { useEffect } from 'react'
import { useExpertiseTypesStore } from '@/stores/expertise-types'
import { DataTable } from './components/data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { toast } from 'sonner'

export default function ExpertiseTypesPage() {
  const { expertiseTypes, loading, error, fetchExpertiseTypes } = useExpertiseTypesStore()

  useEffect(() => {
    fetchExpertiseTypes()
  }, [fetchExpertiseTypes])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Types d'expertise</h1>
        <DataTableToolbar />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={expertiseTypes} loading={loading} />
      </div>
    </div>
  )
} 