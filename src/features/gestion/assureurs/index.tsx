import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssureursDataTable } from './data-table'
import { AssureursDialogs } from './components/assureurs-dialogs'
import { AssureursPrimaryButtons } from './components/assureurs-primary-buttons'
import AssureursProvider from './context/assureurs-context'
import { useAssureursStore } from './store'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function AssureursPageContent() {
  const { fetchAssureurs, assureurs, loading } = useAssureursStore()

  useEffect(() => {
    fetchAssureurs()
  }, [fetchAssureurs])

  return (
    <AssureursProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Assureurs</h2>
            <p className='text-muted-foreground'>Gérez les assureurs du système</p>
          </div>
          <AssureursPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <AssureursDataTable data={assureurs} loading={loading} />
        </div>
      </Main>

      <AssureursDialogs />
    </AssureursProvider>
  )
}

export default function AssureursPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ENTITY}>
      <AssureursPageContent />
    </ProtectedRoute>
  )
} 