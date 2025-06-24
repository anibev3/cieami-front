import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { GeneralStatesDialogs } from './components/general-states-dialogs'
import { GeneralStatesPrimaryButtons } from './components/general-states-primary-buttons'
import { useGeneralStatesStore } from '@/stores/generalStatesStore'
import { GeneralState } from '@/types/administration'

export default function GeneralStatesPage() {
  const { fetchGeneralStates } = useGeneralStatesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedGeneralState, setSelectedGeneralState] = useState<GeneralState | null>(null)

  // Charger les états généraux une seule fois au montage du composant
  useEffect(() => {
    fetchGeneralStates()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedGeneralState(null)
    setIsCreateOpen(true)
  }

  const handleView = (generalState: GeneralState) => {
    setSelectedGeneralState(generalState)
    setIsViewOpen(true)
  }

  const handleEdit = (generalState: GeneralState) => {
    setSelectedGeneralState(generalState)
    setIsEditOpen(true)
  }

  const handleDelete = (generalState: GeneralState) => {
    setSelectedGeneralState(generalState)
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
            <h2 className='text-2xl font-bold tracking-tight'>États généraux</h2>
            <p className='text-muted-foreground'>
              Gérez les états généraux du système
            </p>
          </div>
          <GeneralStatesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <GeneralStatesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedGeneralState={selectedGeneralState}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
} 