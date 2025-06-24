import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { ReceiptTypesDialogs } from './components/receipt-types-dialogs'
import { ReceiptTypesPrimaryButtons } from './components/receipt-types-primary-buttons'
import { useReceiptTypesStore } from '@/stores/receiptTypesStore'
import { ReceiptType } from '@/types/administration'

function ReceiptTypesPage() {
  const { fetchReceiptTypes } = useReceiptTypesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedReceiptType, setSelectedReceiptType] = useState<ReceiptType | null>(null)

  useEffect(() => {
    fetchReceiptTypes()
  }, [])

  const handleCreate = () => {
    setSelectedReceiptType(null)
    setIsCreateOpen(true)
  }
  const handleView = (item: ReceiptType) => {
    setSelectedReceiptType(item)
    setIsViewOpen(true)
  }
  const handleEdit = (item: ReceiptType) => {
    setSelectedReceiptType(item)
    setIsEditOpen(true)
  }
  const handleDelete = (item: ReceiptType) => {
    setSelectedReceiptType(item)
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
            <h2 className='text-2xl font-bold tracking-tight'>Types de quittances</h2>
            <p className='text-muted-foreground'>Gérez les types de quittances du système</p>
          </div>
          <ReceiptTypesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>
      <ReceiptTypesDialogs
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedReceiptType={selectedReceiptType}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default ReceiptTypesPage; 