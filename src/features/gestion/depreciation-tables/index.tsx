import { useState } from 'react'
import { DataTable } from './components/data-table'
import { DepreciationTablesDialogs } from './components/depreciation-tables-dialogs'
import { DepreciationTablesPrimaryButtons } from './components/depreciation-tables-primary-buttons'
import { DepreciationTable } from '@/services/depreciationTableService'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function DepreciationTablesPageContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDepreciationTable, setSelectedDepreciationTable] = useState<DepreciationTable | null>(null)

  // Le chargement des données est géré par le composant DataTable
  // pour permettre la pagination et la recherche

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedDepreciationTable(null)
    setIsCreateOpen(true)
  }

  const handleView = (depreciationTable: DepreciationTable) => {
    setSelectedDepreciationTable(depreciationTable)
    setIsViewOpen(true)
  }

  const handleEdit = (depreciationTable: DepreciationTable) => {
    setSelectedDepreciationTable(depreciationTable)
    setIsEditOpen(true)
  }

  const handleDelete = (depreciationTable: DepreciationTable) => {
    setSelectedDepreciationTable(depreciationTable)
    setIsDeleteOpen(true)
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
            <h2 className='text-2xl font-bold tracking-tight'>Tableaux de dépréciation</h2>
            <p className='text-muted-foreground'>
              Gérez les tableaux de dépréciation des véhicules
            </p>
          </div>
          <DepreciationTablesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <DepreciationTablesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedDepreciationTable={selectedDepreciationTable}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function DepreciationTablesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_DEPRECIATION_TABLE}>
      <DepreciationTablesPageContent />
    </ProtectedRoute>
  )
} 