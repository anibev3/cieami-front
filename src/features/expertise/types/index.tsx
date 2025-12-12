import { useEffect } from 'react'
import { useExpertiseTypesStore } from '@/stores/expertise-types'
import { DataTable } from './components/data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ExpertiseTypesPageContent() {
  const { expertiseTypes, loading, error, fetchExpertiseTypes } = useExpertiseTypesStore()

  useEffect(() => {
    fetchExpertiseTypes()
  }, [fetchExpertiseTypes])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

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
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Types d'expertise</h1>
            <DataTableToolbar />
          </div>
          <div className="bg-white rounded border p-4">
            <DataTable data={expertiseTypes} loading={loading} />
          </div>
        </div>
      </Main>
    </>
  )
}

export default function ExpertiseTypesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_EXPERTISE_TYPE}>
      <ExpertiseTypesPageContent />
    </ProtectedRoute>
  )
} 