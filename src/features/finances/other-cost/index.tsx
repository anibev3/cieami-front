import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { OtherCostsDialogs } from './components/other-costs-dialogs'
import { OtherCostsPrimaryButtons } from './components/other-costs-primary-buttons'
import { useOtherCostsStore } from '@/stores/otherCostsStore'
import { OtherCost } from '@/types/administration'

function OtherCostsPage() {
  const { fetchOtherCosts } = useOtherCostsStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedOtherCost, setSelectedOtherCost] = useState<OtherCost | null>(null)

  useEffect(() => {
    fetchOtherCosts()
  }, [])

  const handleCreate = () => {
    setSelectedOtherCost(null)
    setIsCreateOpen(true)
  }
  const handleView = (item: OtherCost) => {
    setSelectedOtherCost(item)
    setIsViewOpen(true)
  }
  const handleEdit = (item: OtherCost) => {
    setSelectedOtherCost(item)
    setIsEditOpen(true)
  }
  const handleDelete = (item: OtherCost) => {
    setSelectedOtherCost(item)
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
            <h2 className='text-2xl font-bold tracking-tight'>Autres coûts</h2>
            <p className='text-muted-foreground'>Gérez les autres coûts du système</p>
          </div>
          {/* <OtherCostsPrimaryButtons onCreate={handleCreate} /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>
      <OtherCostsDialogs
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedOtherCost={selectedOtherCost}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default OtherCostsPage;
