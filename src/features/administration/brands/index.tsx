import { useEffect } from 'react'
import { useBrandsStore } from '@/stores/brands'
import { DataTable } from './components/data-table'
import { BrandMutateDialog } from './components/brand-mutate-dialog'
import { toast } from 'sonner'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'

export default function BrandsPage() {
  const { brands, loading, error, fetchBrands } = useBrandsStore()

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

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
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Marques</h2>
            <p className='text-muted-foreground'>
              Gérez les marques de véhicules
            </p>
          </div>
          <BrandMutateDialog />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            data={brands} 
            loading={loading}
          />
        </div>
      </Main>
    </>
  )
} 