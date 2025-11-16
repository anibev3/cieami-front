import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { StatusesDialogs } from './components/statuses-dialogs'
import { StatusesPrimaryButtons } from './components/statuses-primary-buttons'
import { useStatusesStore } from '@/stores/statusesStore'
import { Status } from '@/types/administration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function StatusesPageContent() {
  const { fetchStatuses } = useStatusesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null)

  // Charger les statuts une seule fois au montage du composant
  useEffect(() => {
    fetchStatuses()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedStatus(null)
    setIsCreateOpen(true)
  }

  const handleView = (status: Status) => {
    setSelectedStatus(status)
    setIsViewOpen(true)
  }

  const handleEdit = (status: Status) => {
    setSelectedStatus(status)
    setIsEditOpen(true)
  }

  const handleDelete = (status: Status) => {
    setSelectedStatus(status)
    setIsDeleteOpen(true)
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
            <h2 className='text-2xl font-bold tracking-tight'>Statuts</h2>
            <p className='text-muted-foreground'>
              Gérez les statuts du système
            </p>
          </div>
          <StatusesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <StatusesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedStatus={selectedStatus}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function StatusesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_STATUS}>
      <StatusesPageContent />
    </ProtectedRoute>
  )
} 