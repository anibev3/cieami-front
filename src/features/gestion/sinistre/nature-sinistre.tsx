import { useEffect, useState } from 'react'
import { DataTable } from './components/data-table'
import { ClaimNatureDialogs } from './components/claim-nature-dialogs'
import { useClaimNatureStore } from '@/stores/claimNatureStore'
import { ClaimNature } from '@/types/administration'

import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'

export default function ClaimNaturePage() {
  const { fetchClaimNatures } = useClaimNatureStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedClaimNature, setSelectedClaimNature] = useState<ClaimNature | null>(null)

  // Charger les natures de sinistres une seule fois au montage du composant
  useEffect(() => {
    fetchClaimNatures()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedClaimNature(null)
    setIsCreateOpen(true)
  }

  const handleView = (claimNature: ClaimNature) => {
    setSelectedClaimNature(claimNature)
    setIsViewOpen(true)
  }

  const handleEdit = (claimNature: ClaimNature) => {
    setSelectedClaimNature(claimNature)
    setIsEditOpen(true)
  }

  const handleDelete = (claimNature: ClaimNature) => {
    setSelectedClaimNature(claimNature)
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
            <h2 className='text-2xl font-bold tracking-tight'>Natures de sinistres</h2>
            <p className='text-muted-foreground'>
              Gérez les natures de sinistres du système
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
          />
        </div>
      </Main>

      <ClaimNatureDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedClaimNature={selectedClaimNature}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}
