import { useEffect } from 'react'
import { useBrandsStore } from '@/stores/brands'
import { DataTable } from './components/data-table'
import { BrandMutateDialog } from './components/brand-mutate-dialog'
import { toast } from 'sonner'

export default function BrandsPage() {
  const { brands, loading, error, fetchBrands } = useBrandsStore()

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marques</h1>
        <BrandMutateDialog />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={brands} loading={loading} />
      </div>
    </div>
  )
} 