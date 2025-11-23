
import { useEffect, useState } from 'react'
import { DataTable } from './components/data-table'
import { RemarkDialogs } from './components/remark-dialogs'
import { useRemarkStore } from '@/stores/remarkStore'
import { Remark } from '@/types/administration'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'
import { PermissionGate } from '@/components/ui/permission-gate'

function RemarquePageContent() {
  const { fetchRemarks } = useRemarkStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedRemark, setSelectedRemark] = useState<Remark | null>(null)

  // Charger les remarques une seule fois au montage du composant
  useEffect(() => {
    fetchRemarks()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedRemark(null)
    setIsCreateOpen(true)
  }

  const handleView = (remark: Remark) => {
    setSelectedRemark(remark)
    setIsViewOpen(true)
  }

  const handleEdit = (remark: Remark) => {
    setSelectedRemark(remark)
    setIsEditOpen(true)
  }

  const handleDelete = (remark: Remark) => {
    setSelectedRemark(remark)
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
            <h2 className='text-2xl font-bold tracking-tight'>Remarques experts</h2>
            <p className='text-muted-foreground'>
              Gérez les remarques des experts
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </div>
      </Main>

      <PermissionGate permissions={[Permission.VIEW_REMARK, Permission.CREATE_REMARK, Permission.UPDATE_REMARK, Permission.DELETE_REMARK]}>
        <RemarkDialogs 
          isCreateOpen={isCreateOpen}
          isEditOpen={isEditOpen}
          isViewOpen={isViewOpen}
          isDeleteOpen={isDeleteOpen}
          selectedRemark={selectedRemark}
          onCloseCreate={() => setIsCreateOpen(false)}
          onCloseEdit={() => setIsEditOpen(false)}
          onCloseView={() => setIsViewOpen(false)}
          onCloseDelete={() => setIsDeleteOpen(false)}
        />
      </PermissionGate>
    </>
  )
}

export default function RemarquePage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_REMARK}>
      <RemarquePageContent />
    </ProtectedRoute>
  )
}
