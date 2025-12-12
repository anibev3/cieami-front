import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useEffect, useState, useCallback } from 'react'
import { useSuppliesStore } from '@/stores/supplies'
import { DataTable } from './components/data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from 'sonner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function FournituresPageContent() {
  const { 
    supplies, 
    loading, 
    error, 
    pagination,
    filters,
    fetchSupplies,
    setFilters,
    setPage
  } = useSuppliesStore()
  
  const [searchValue, setSearchValue] = useState(filters.search)
  
  // Debounce pour la recherche
  const debouncedSearch = useDebounce(searchValue, 500)
  
  // Charger les données initiales
  useEffect(() => {
    fetchSupplies()
  }, [fetchSupplies])

  // Gérer la recherche debounced
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch })
      fetchSupplies(1, { search: debouncedSearch })
    }
  }, [debouncedSearch, filters.search, setFilters, fetchSupplies])

  // Gérer les erreurs
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  // Gestionnaires d'événements
  const handlePageChange = useCallback((page: number) => {
    setPage(page)
    fetchSupplies(page, { search: filters.search })
  }, [setPage, fetchSupplies, filters.search])

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Fournitures</h2>
            <p className='text-muted-foreground'>
              Gérez les fournitures du système
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Rechercher une fourniture..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="max-w-sm"
            />
            <DataTableToolbar />
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            data={supplies} 
            loading={loading}
            onPageChange={handlePageChange}
            pagination={pagination}
          />
        </div>
      </Main>


    </>
  )
}

export default function FournituresPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_SUPPLY}>
      <FournituresPageContent />
    </ProtectedRoute>
  )
}

