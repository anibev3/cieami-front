import { useEffect } from 'react'
import { useShockPointsStore } from '@/stores/shock-points'
import { DataTable } from './components/data-table'
import { DataTableToolbar } from './components/data-table-toolbar'
import { toast } from 'sonner'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ShockPointsPageContent() {
  const { shockPoints, loading, error, fetchShockPoints } = useShockPointsStore()

  useEffect(() => {
    fetchShockPoints()
  }, [fetchShockPoints])

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
        <h1 className="text-2xl font-bold">Points de choc</h1>
        <DataTableToolbar />
      </div>
      <div className="bg-white rounded shadow p-4">
        <DataTable data={shockPoints} loading={loading} />
      </div>
        </div>
        </Main>
        </>
  )
}

export default function ShockPointsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_SHOCK_POINT}>
      <ShockPointsPageContent />
    </ProtectedRoute>
  )
} 