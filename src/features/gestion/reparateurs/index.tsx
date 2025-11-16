import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReparateursDataTable } from './data-table'
import { ReparateursDialogs } from './components/reparateurs-dialogs'
import { ReparateursPrimaryButtons } from './components/reparateurs-primary-buttons'
import ReparateursProvider from './context/reparateurs-context'
import { useReparateursStore } from './store'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function ReparateursPageContent() {
  const { fetchReparateurs, reparateurs, loading } = useReparateursStore()

  useEffect(() => {
    fetchReparateurs()
  }, [fetchReparateurs])

  return (
    <ReparateursProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Réparateurs</h2>
            <p className='text-muted-foreground'>Gérez les réparateurs du système</p>
          </div>
          <ReparateursPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ReparateursDataTable data={reparateurs} loading={loading} />
        </div>
      </Main>

      <ReparateursDialogs />
    </ReparateursProvider>
  )
}

export default function ReparateursPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ENTITY}>
      <ReparateursPageContent />
    </ProtectedRoute>
  )
} 