import { ConfirmDialog } from '@/components/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WorkFee } from '../types'
import { useWorkFeesStore } from '../store'
import { TarificationHonoraireMutateDialog } from './tarification-honoraire-mutate-dialog'
import { toast } from 'sonner'

interface Props {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedWorkFee: WorkFee | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
  onSuccess: () => void
}

export function TarificationHonoraireDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedWorkFee,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
  onSuccess,
}: Props) {
  const { deleteWorkFee } = useWorkFeesStore()

  const handleDelete = async () => {
    if (!selectedWorkFee) return
    try {
      await deleteWorkFee(selectedWorkFee.id)
      toast.success('Tarification supprimée')
      onCloseDelete()
      onSuccess()
    } catch (_error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <>
      <TarificationHonoraireMutateDialog
        key='workfee-create'
        open={isCreateOpen}
        onOpenChange={onCloseCreate}
        onSuccess={onSuccess}
      />

      {selectedWorkFee && (
        <>
          <TarificationHonoraireMutateDialog
            key={`workfee-update-${selectedWorkFee.id}`}
            open={isEditOpen}
            onOpenChange={onCloseEdit}
            currentRow={selectedWorkFee}
            onSuccess={onSuccess}
          />

          <Dialog
            key='workfee-view'
            open={isViewOpen}
            onOpenChange={onCloseView}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Détail de la tarification</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <div><b>Paramètre 1 :</b> {selectedWorkFee.param_1}</div>
                <div><b>Paramètre 2 :</b> {selectedWorkFee.param_2}</div>
                <div><b>Paramètre 3 :</b> {selectedWorkFee.param_3}</div>
                <div><b>Paramètre 4 :</b> {selectedWorkFee.param_4}</div>
                <div><b>Statut :</b> {selectedWorkFee.status.label}</div>
                <div><b>Créé le :</b> {new Date(selectedWorkFee.created_at).toLocaleString()}</div>
                <div><b>Modifié le :</b> {new Date(selectedWorkFee.updated_at).toLocaleString()}</div>
              </div>
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            key='workfee-delete'
            destructive
            open={isDeleteOpen}
            onOpenChange={onCloseDelete}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Supprimer cette tarification ?`}
            desc={
              <>
                Vous êtes sur le point de supprimer cette tarification.<br />
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