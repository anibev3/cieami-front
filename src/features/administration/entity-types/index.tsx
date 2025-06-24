import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { EntityTypesDialogs } from './components/entity-types-dialogs'
import { EntityTypesPrimaryButtons } from './components/entity-types-primary-buttons'
import { useEntityTypesStore } from '@/stores/entityTypesStore'
import { EntityType } from '@/types/administration'

export default function EntityTypesPage() {
  const { fetchEntityTypes } = useEntityTypesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | null>(null)

  // Charger les types d'entité une seule fois au montage du composant
  useEffect(() => {
    fetchEntityTypes()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedEntityType(null)
    setIsCreateOpen(true)
  }

  const handleView = (entityType: EntityType) => {
    setSelectedEntityType(entityType)
    setIsViewOpen(true)
  }

  const handleEdit = (entityType: EntityType) => {
    setSelectedEntityType(entityType)
    setIsEditOpen(true)
  }

  const handleDelete = (entityType: EntityType) => {
    setSelectedEntityType(entityType)
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
            <h2 className='text-2xl font-bold tracking-tight'>Types d'entité</h2>
            <p className='text-muted-foreground'>
              Gérez les types d'entité du système
            </p>
          </div>
          <EntityTypesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <EntityTypesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedEntityType={selectedEntityType}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
} 