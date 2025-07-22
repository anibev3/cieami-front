import { useEffect, useState } from 'react'
import { DataTable } from './components/data-table'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { useUsersStore } from '@/stores/usersStore'
import { User } from '@/types/administration'



import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'

export default function UsersPage() {
  const { fetchUsers, enableUser, disableUser, resetUser } = useUsersStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Charger les utilisateurs une seule fois au montage du composant
  useEffect(() => {
    fetchUsers()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedUser(null)
    setIsCreateOpen(true)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setIsViewOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleEnable = async (user: User) => {
    try {
      await enableUser(user.id)
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleDisable = async (user: User) => {
    try {
      await disableUser(user.id)
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleReset = async (user: User) => {
    try {
      await resetUser(user.id)
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
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
            <h2 className='text-2xl font-bold tracking-tight'>Utilisateurs</h2>
            <p className='text-muted-foreground'>
              Gérez les utilisateurs du système
            </p>
          </div>
          <UsersPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEnable={handleEnable}
            onDisable={handleDisable}
            onReset={handleReset}
          />
        </div>
      </Main>

      <UsersDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedUser={selectedUser}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
} 