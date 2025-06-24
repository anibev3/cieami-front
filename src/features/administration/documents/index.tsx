import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataTable } from './components/data-table'
import { DocumentsDialogs } from './components/documents-dialogs'
import { DocumentsPrimaryButtons } from './components/documents-primary-buttons'
import { useDocumentsStore } from '@/stores/documentsStore'
import { DocumentTransmitted } from '@/types/administration'

export default function DocumentsTransmittedPage() {
  const { fetchDocuments } = useDocumentsStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentTransmitted | null>(null)

  // Charger les documents une seule fois au montage du composant
  useEffect(() => {
    fetchDocuments()
  }, []) // Dépendance vide pour éviter les boucles

  // Callbacks pour les actions
  const handleCreate = () => {
    setSelectedDocument(null)
    setIsCreateOpen(true)
  }

  const handleView = (document: DocumentTransmitted) => {
    setSelectedDocument(document)
    setIsViewOpen(true)
  }

  const handleEdit = (document: DocumentTransmitted) => {
    setSelectedDocument(document)
    setIsEditOpen(true)
  }

  const handleDelete = (document: DocumentTransmitted) => {
    setSelectedDocument(document)
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
            <h2 className='text-2xl font-bold tracking-tight'>Documents transmis</h2>
            <p className='text-muted-foreground'>
              Gérez les types de documents transmis dans le système
            </p>
          </div>
          <DocumentsPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Main>

      <DocumentsDialogs 
        isCreateOpen={isCreateOpen}
        isEditOpen={isEditOpen}
        isViewOpen={isViewOpen}
        isDeleteOpen={isDeleteOpen}
        selectedDocument={selectedDocument}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCloseEdit={() => setIsEditOpen(false)}
        onCloseView={() => setIsViewOpen(false)}
        onCloseDelete={() => setIsDeleteOpen(false)}
      />
    </>
  )
} 