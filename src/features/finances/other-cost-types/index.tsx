import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { OtherCostTypesDialogs } from './components/other-cost-types-dialogs'
import { OtherCostTypesPrimaryButtons } from './components/other-cost-types-primary-buttons'
import { useOtherCostTypesStore } from '@/stores/otherCostTypesStore'
import { OtherCostType } from '@/types/administration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function OtherCostTypesPageContent() {
  const { fetchOtherCostTypes } = useOtherCostTypesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedOtherCostType, setSelectedOtherCostType] = useState<OtherCostType | null>(null)

  useEffect(() => {
    fetchOtherCostTypes()
  }, [])

  const handleCreate = () => {
    setSelectedOtherCostType(null)
    setIsCreateOpen(true)
  }
  const handleView = (item: OtherCostType) => {
    setSelectedOtherCostType(item)
    setIsViewOpen(true)
  }
  const handleEdit = (item: OtherCostType) => {
    setSelectedOtherCostType(item)
    setIsEditOpen(true)
  }
  const handleDelete = (item: OtherCostType) => {
    setSelectedOtherCostType(item)
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
            <h2 className='text-2xl font-bold tracking-tight'>Types d&apos;autres coûts</h2>
            <p className='text-muted-foreground'>Gérez les types d&apos;autres coûts du système</p>
          </div>
          <OtherCostTypesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>
      <OtherCostTypesDialogs
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedOtherCostType={selectedOtherCostType}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function OtherCostTypesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_OTHER_COST_TYPE}>
      <OtherCostTypesPageContent />
    </ProtectedRoute>
  )
} 