import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { ReceiptsDialogs } from './components/receipts-dialogs'
import { ReceiptsPrimaryButtons } from './components/receipts-primary-buttons'
import { ReceiptModalStandalone } from './components/receipt-modal-standalone'
import { useReceiptsStore } from '@/stores/receiptsStore'
import { Receipt } from '@/types/administration'

function ReceiptsPage() {
  const { fetchReceipts } = useReceiptsStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)

  useEffect(() => {
    fetchReceipts()
  }, [fetchReceipts])

  const handleCreate = () => {
    setSelectedReceipt(null)
    setIsCreateModalOpen(true)
  }
  const handleView = (item: Receipt) => {
    setSelectedReceipt(item)
    setIsViewOpen(true)
  }
  const handleEdit = (item: Receipt) => {
    setSelectedReceipt(item)
    setIsEditModalOpen(true)
  }
  const handleDelete = (item: Receipt) => {
    setSelectedReceipt(item)
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
            <h2 className='text-2xl font-bold tracking-tight'>Quittances</h2>
            <p className='text-muted-foreground'>Gérez les quittances du système</p>
          </div>
          <ReceiptsPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>
          <ReceiptModalStandalone
            isOpen={isCreateModalOpen}
            mode="create"
            onSave={() => {
              setIsCreateModalOpen(false)
              fetchReceipts() // Recharger la liste
            }}
            onClose={() => setIsCreateModalOpen(false)}
          />
          
          <ReceiptModalStandalone
            isOpen={isEditModalOpen}
            mode="edit"
            selectedReceipt={selectedReceipt}
            onSave={() => {
              setIsEditModalOpen(false)
              fetchReceipts() // Recharger la liste
            }}
            onClose={() => setIsEditModalOpen(false)}
          />
          
          <ReceiptsDialogs
            isCreateOpen={false} // Désactivé car on utilise le modal standalone
            isEditOpen={false} // Désactivé car on utilise le modal standalone
            isViewOpen={isViewOpen}
            isDeleteOpen={isDeleteOpen}
            selectedReceipt={selectedReceipt}
            onCloseCreate={() => setIsCreateModalOpen(false)}
            onCloseEdit={() => setIsEditModalOpen(false)}
            onCloseView={() => setIsViewOpen(false)}
            onCloseDelete={() => setIsDeleteOpen(false)}
          />
    </>
  )
}

export default ReceiptsPage;
