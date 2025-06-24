import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useEffect } from 'react'
import { useSuppliesStore } from '@/stores/supplies'
import { DataTable } from './components/data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { toast } from 'sonner'

export default function FournituresPage() {
  const { supplies, loading, error, fetchSupplies } = useSuppliesStore()

  useEffect(() => {
    fetchSupplies()
  }, [fetchSupplies])

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
            <h2 className='text-2xl font-bold tracking-tight'>Statuts</h2>
            <p className='text-muted-foreground'>
              Gérez les statuts du système
            </p>
          </div>
          {/* <StatusesPrimaryButtons onCreate={handleCreate} /> */}
          <DataTableToolbar />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={supplies} loading={loading} />
        </div>
      </Main>


    </>
  )
} 



