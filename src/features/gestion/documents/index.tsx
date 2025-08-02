import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SearchProvider } from '@/context/search-context'
import { DocumentsTransmisDataTable } from './data-table'
import { DocumentsDialogs } from './components/documents-dialogs'
import { DocumentsPrimaryButtons } from './components/documents-primary-buttons'
import { useDocumentsTransmisStore } from './store'
import { DocumentTransmis } from './types'

export default function DocumentsTransmisPage() {
  const { fetchDocuments, documents, loading } = useDocumentsTransmisStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentTransmis | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleCreate = () => {
    setSelectedDocument(null)
    setIsCreateOpen(true)
  }

  const handleView = (document: DocumentTransmis) => {
    setSelectedDocument(document)
    setIsViewOpen(true)
  }

  const handleEdit = (document: DocumentTransmis) => {
    setSelectedDocument(document)
    setIsEditOpen(true)
  }

  const handleDelete = (document: DocumentTransmis) => {
    setSelectedDocument(document)
    setIsDeleteOpen(true)
  }

  const handleSuccess = () => {
    fetchDocuments()
  }

  return (
    <SearchProvider>
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
            <p className='text-muted-foreground'>Gérez les documents transmis du système</p>
          </div>
          <DocumentsPrimaryButtons onCreate={handleCreate} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DocumentsTransmisDataTable
            data={documents}
            loading={loading}
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
        onSuccess={handleSuccess}
      />
    </SearchProvider>
  )
} 