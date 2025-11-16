import { useEffect, useState } from 'react'
import { useBrandsStore } from '@/stores/brands'
import { DataTable } from './components/data-table'
import { BrandMutateDialog } from './components/brand-mutate-dialog'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debounce'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function BrandsPageContent() {
  const { 
    brands, 
    loading, 
    error, 
    fetchBrands, 
    pagination, 
    setFilters 
  } = useBrandsStore()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Effet pour déclencher la recherche quand la requête change
  useEffect(() => {
    const newFilters = {
      search: debouncedSearchQuery,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    }
    setFilters(newFilters)
    fetchBrands(newFilters)
  }, [debouncedSearchQuery])

  // Effet initial pour charger les données
  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  // Handler pour la recherche
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Handler pour le changement de page
  const handlePageChange = (page: number) => {
    const newFilters = {
      search: searchQuery,
      page
    }
    setFilters(newFilters)
    fetchBrands(newFilters)
  }

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
          <BrandMutateDialog open={open} onOpenChange={setOpen} />
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className='h-4 w-4' />
            Ajouter une marque
          </Button>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            data={brands} 
            loading={loading}
            pagination={pagination}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onPageChange={handlePageChange}
          />
        </div>
      </Main>
    </>
  )
}

export default function BrandsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_BRAND}>
      <BrandsPageContent />
    </ProtectedRoute>
  )
} 