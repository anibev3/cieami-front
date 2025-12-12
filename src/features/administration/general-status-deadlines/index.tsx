import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { GeneralStatusDeadlinesDialogs } from './components/general-status-deadlines-dialogs'
import { GeneralStatusDeadlinesPrimaryButtons } from './components/general-status-deadlines-primary-buttons'
import { useGeneralStatusDeadlinesStore } from '@/stores/generalStatusDeadlinesStore'
import { GeneralStatusDeadline } from '@/types/administration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function GeneralStatusDeadlinesPageContent() {
  const { fetchGeneralStatusDeadlines, enableGeneralStatusDeadline, disableGeneralStatusDeadline } = useGeneralStatusDeadlinesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeadline, setSelectedDeadline] = useState<GeneralStatusDeadline | null>(null)

  // Charger les délais de statuts généraux une seule fois au montage du composant
  useEffect(() => {
    fetchGeneralStatusDeadlines()
  }, [fetchGeneralStatusDeadlines])

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedDeadline(null)
    setIsCreateOpen(true)
  }

  const handleView = (deadline: GeneralStatusDeadline) => {
    setSelectedDeadline(deadline)
    setIsViewOpen(true)
  }

  const handleEdit = (deadline: GeneralStatusDeadline) => {
    setSelectedDeadline(deadline)
    setIsEditOpen(true)
  }

  const handleDelete = (deadline: GeneralStatusDeadline) => {
    setSelectedDeadline(deadline)
    setIsDeleteOpen(true)
  }

  const handleEnable = async (deadline: GeneralStatusDeadline) => {
    try {
      await enableGeneralStatusDeadline(deadline.id)
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDisable = async (deadline: GeneralStatusDeadline) => {
    try {
      await disableGeneralStatusDeadline(deadline.id)
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
            <h2 className='text-2xl font-bold tracking-tight'>Délais de statuts généraux</h2>
            <p className='text-muted-foreground'>
              Gérez les délais de statuts généraux du système
            </p>
          </div>
          <GeneralStatusDeadlinesPrimaryButtons onCreate={handleCreate} />
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

      <GeneralStatusDeadlinesDialogs 
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

export default function GeneralStatusDeadlinesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_GENERAL_STATE}>
      <GeneralStatusDeadlinesPageContent />
    </ProtectedRoute>
  )
}
