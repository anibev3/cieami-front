import { ConfirmDialog } from '@/components/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDocumentsTransmisStore } from '../store'
import { DocumentsMutateDrawer } from './documents-mutate-drawer'
import { DocumentTransmis } from '../types'
import { toast } from 'sonner'

interface DocumentsDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedDocument: DocumentTransmis | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
  onSuccess: () => void
}

export function DocumentsDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedDocument,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
  onSuccess,
}: DocumentsDialogsProps) {
  const { deleteDocument } = useDocumentsTransmisStore()

  const handleDelete = async () => {
    if (!selectedDocument) return
    try {
      await deleteDocument(selectedDocument.id)
      toast.success('Document supprimé avec succès')
      onCloseDelete()
      onSuccess()
    } catch (_error) {
      toast.error('Une erreur est survenue lors de la suppression')
    }
  }

  return (
    <>
      <DocumentsMutateDrawer
        key='document-create'
        open={isCreateOpen}
        onOpenChange={onCloseCreate}
        onSuccess={onSuccess}
      />

      {selectedDocument && (
        <>
          <DocumentsMutateDrawer
            key={`document-update-${selectedDocument.id}`}
            open={isEditOpen}
            onOpenChange={onCloseEdit}
            currentRow={selectedDocument}
            onSuccess={onSuccess}
          />

          <Dialog
            key='document-view'
            open={isViewOpen}
            onOpenChange={onCloseView}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Détail du document</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <div><b>Code :</b> {selectedDocument.code}</div>
                <div><b>Label :</b> {selectedDocument.label}</div>
                <div><b>Description :</b> {selectedDocument.description || '-'}</div>
                <div><b>Statut :</b> {selectedDocument.status.label}</div>
                <div><b>Créé le :</b> {new Date(selectedDocument.created_at).toLocaleString()}</div>
                <div><b>Modifié le :</b> {new Date(selectedDocument.updated_at).toLocaleString()}</div>
              </div>
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            key='document-delete'
            destructive
            open={isDeleteOpen}
            onOpenChange={onCloseDelete}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Supprimer ce document : ${selectedDocument.label} ?`}
            desc={
              <>
                Vous êtes sur le point de supprimer le document{' '}
                <strong>{selectedDocument.label}</strong>. <br />
                Cette action ne peut pas être annulée.
              </>
            }
            confirmText='Supprimer'
          />
        </>
      )}
    </>
  )
} 