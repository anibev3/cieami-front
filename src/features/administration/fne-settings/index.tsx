import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { FNESettingsDialogs } from './components/fne-settings-dialogs'
import { FNESettingsPrimaryButtons } from './components/fne-settings-primary-buttons'
import { useFNESettingsStore } from '@/stores/fneSettingsStore'
import { FNESetting } from '@/types/administration'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function FNESettingsPageContent() {
  const { fetchFNESettings, enableFNESetting, disableFNESetting } = useFNESettingsStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<FNESetting | null>(null)

  // Charger les paramètres FNE une seule fois au montage du composant
  useEffect(() => {
    fetchFNESettings()
  }, [fetchFNESettings])

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedSetting(null)
    setIsCreateOpen(true)
  }

  const handleView = (setting: FNESetting) => {
    setSelectedSetting(setting)
    setIsViewOpen(true)
  }

  const handleEdit = (setting: FNESetting) => {
    setSelectedSetting(setting)
    setIsEditOpen(true)
  }

  const handleDelete = (setting: FNESetting) => {
    setSelectedSetting(setting)
    setIsDeleteOpen(true)
  }

  const handleEnable = async (setting: FNESetting) => {
    try {
      await enableFNESetting(setting.id)
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDisable = async (setting: FNESetting) => {
    try {
      await disableFNESetting(setting.id)
    } catch (_error) {
      // Erreur gérée par le store
    }
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
            <h2 className='text-2xl font-bold tracking-tight'>Paramètres FNE</h2>
            <p className='text-muted-foreground'>
              Gérez les paramètres FNE du système
            </p>
          </div>
          <FNESettingsPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEnable={handleEnable}
            onDisable={handleDisable}
          />
        </div>
      </Main>

      <FNESettingsDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedSetting={selectedSetting}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
}

export default function FNESettingsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_GENERAL_STATE}>
      <FNESettingsPageContent />
    </ProtectedRoute>
  )
}
