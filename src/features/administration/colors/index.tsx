import { useEffect, useState } from 'react'
import { useColorsStore } from '@/stores/colors'
import { DataTable } from './components/data-table'
import { ColorMutateDialog } from './components/color-mutate-dialog'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/use-debounce'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export default function ColorsPage() {
  const { 
    colors, 
    loading, 
    error, 
    fetchColors, 
    pagination, 
    setFilters 
  } = useColorsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Effet pour déclencher la recherche quand la requête change
  useEffect(() => {
    const newFilters = {
      search: debouncedSearchQuery,
      page: 1 // Reset à la première page lors d'une nouvelle recherche
    }
    setFilters(newFilters)
    fetchColors(newFilters)
  }, [debouncedSearchQuery])

  // Effet initial pour charger les données
  useEffect(() => {
    fetchColors()
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
    fetchColors(newFilters)
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
            <h2 className='text-2xl font-bold tracking-tight'>Couleurs</h2>
            <p className='text-muted-foreground'>Gérez les couleurs du système</p>
          </div>
          <ColorMutateDialog />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            data={colors} 
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