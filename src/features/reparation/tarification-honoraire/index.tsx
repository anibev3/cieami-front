import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TarificationHonoraireDataTable } from './data-table'
import { TarificationHonoraireDialogs } from './components/tarification-honoraire-dialogs'
import { TarificationHonorairePrimaryButtons } from './components/tarification-honoraire-primary-buttons'
import { useWorkFeesStore } from './store'
import { WorkFee } from './types'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function TarificationHonorairePageContent() {
  const { fetchWorkFees, workFees, loading } = useWorkFeesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedWorkFee, setSelectedWorkFee] = useState<WorkFee | null>(null)

  useEffect(() => {
    fetchWorkFees()
  }, [fetchWorkFees])

  const handleCreate = () => {
    setSelectedWorkFee(null)
    setIsCreateOpen(true)
  }

  const handleView = (workFee: WorkFee) => {
    setSelectedWorkFee(workFee)
    setIsViewOpen(true)
  }

  const handleEdit = (workFee: WorkFee) => {
    setSelectedWorkFee(workFee)
    setIsEditOpen(true)
  }

  const handleDelete = (workFee: WorkFee) => {
    setSelectedWorkFee(workFee)
    setIsDeleteOpen(true)
  }

  const handleSuccess = () => {
    fetchWorkFees()
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
            <h2 className='text-2xl font-bold tracking-tight'>Tarification Honoraire</h2>
            <p className='text-muted-foreground'>Gérez les tarifications d'honoraires</p>
          </div>
          <TarificationHonorairePrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <TarificationHonoraireDataTable
            data={workFees}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <TarificationHonoraireDialogs
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedWorkFee={selectedWorkFee}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}

export default function TarificationHonorairePage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_WORK_FEE}>
      <TarificationHonorairePageContent />
    </ProtectedRoute>
  )
} 