import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { AssignmentTypeMutateDialog } from './components/assignment-type-mutate-dialog'
import { AssignmentTypesPrimaryButtons } from './components/assignment-types-primary-buttons'
import { useAssignmentTypesStore } from '@/stores/assignmentTypes'

export default function AssignmentTypesPage() {
  const { fetchAssignmentTypes } = useAssignmentTypesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Charger les types d'affectation une seule fois au montage du composant
  useEffect(() => {
    fetchAssignmentTypes()
  }, [fetchAssignmentTypes])

  // Callback pour la création
  const handleCreate = () => {
    setIsCreateOpen(true)
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
            <h2 className='text-2xl font-bold tracking-tight'>Types de missions</h2>
            <p className='text-muted-foreground'>
              Gérez les types de missions du système
            </p>
          </div>
          <AssignmentTypesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable />
        </div>
      </Main>

      {/* Dialog de création */}
      <AssignmentTypeMutateDialog 
        id={null}
        assignmentType={null}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  )
} 