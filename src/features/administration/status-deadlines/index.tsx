import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { StatusDeadlinesDialogs } from './components/status-deadlines-dialogs'
import { StatusDeadlinesPrimaryButtons } from './components/status-deadlines-primary-buttons'
import { useStatusDeadlinesStore } from '@/stores/statusDeadlinesStore'
import { StatusDeadline } from '@/types/administration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function StatusDeadlinesPageContent() {
  const { fetchStatusDeadlines, enableStatusDeadline, disableStatusDeadline } = useStatusDeadlinesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeadline, setSelectedDeadline] = useState<StatusDeadline | null>(null)

  // Charger les délais de statuts une seule fois au montage du composant
  useEffect(() => {
    fetchStatusDeadlines()
  }, [fetchStatusDeadlines])

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedDeadline(null)
    setIsCreateOpen(true)
  }

  const handleView = (deadline: StatusDeadline) => {
    setSelectedDeadline(deadline)
    setIsViewOpen(true)
  }

  const handleEdit = (deadline: StatusDeadline) => {
    setSelectedDeadline(deadline)
    setIsEditOpen(true)
  }

  const handleDelete = (deadline: StatusDeadline) => {
    setSelectedDeadline(deadline)
    setIsDeleteOpen(true)
  }

  const handleEnable = async (deadline: StatusDeadline) => {
    try {
      await enableStatusDeadline(deadline.id)
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDisable = async (deadline: StatusDeadline) => {
    try {
      await disableStatusDeadline(deadline.id)
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Délais de statuts</h2>
            <p className='text-muted-foreground'>
              Gérez les délais de statuts du système
            </p>
          </div>
          <StatusDeadlinesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEnable={handleEnable}
            onDisable={handleDisable}
          />
        </div>
      </Main>

      <StatusDeadlinesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedDeadline={selectedDeadline}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function StatusDeadlinesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_GENERAL_STATE}>
      <StatusDeadlinesPageContent />
    </ProtectedRoute>
  )
}
