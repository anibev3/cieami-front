import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { EntitiesDialogs } from './components/entities-dialogs'
import { EntitiesPrimaryButtons } from './components/entities-primary-buttons'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { Entity } from '@/types/administration'
import { useNavigate } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function EntitiesPageContent() {
  const navigate = useNavigate()
  const { fetchEntities } = useEntitiesStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)

  // Charger les entités une seule fois au montage du composant
  useEffect(() => {
    fetchEntities()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    // setSelectedEntity(null)
    // setIsCreateOpen(true)
    navigate({ to: '/administration/entities/new' })
  }

  const handleView = (entity: Entity) => {
    setSelectedEntity(entity)
    setIsViewOpen(true)
  }

  const handleEdit = (entity: Entity) => {
    navigate({ to: `/administration/entities/${String(entity.id)}/edit` })
  }

  const handleDelete = (entity: Entity) => {
    setSelectedEntity(entity)
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
            <h2 className='text-2xl font-bold tracking-tight'>Entités</h2>
            <p className='text-muted-foreground'>
              Gérez les entités du système
            </p>
          </div>
          <EntitiesPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <EntitiesDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedEntity={selectedEntity}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function EntitiesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_ENTITY}>
      <EntitiesPageContent />
    </ProtectedRoute>
  )
} 