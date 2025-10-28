import { ConfirmDialog } from '@/components/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
            <DialogContent className="sm:max-w-[720px]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Détail de la tarification</span>
                  <Badge
                    variant="secondary"
                    className={
                      selectedWorkFee.status.code === 'active'
                        ? 'bg-green-100 text-green-800'
                        : selectedWorkFee.status.code === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {selectedWorkFee.status.label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>ID: {selectedWorkFee.id}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Paramètre 1</div>
                    <div className="text-sm font-medium break-words">{selectedWorkFee.param_1}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Paramètre 2</div>
                    <div className="text-sm break-words">{selectedWorkFee.param_2}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Paramètre 3</div>
                    <div className="text-sm break-words">{selectedWorkFee.param_3}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Paramètre 4</div>
                    <div className="text-sm break-words">{selectedWorkFee.param_4}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Créé le</div>
                    <div className="text-sm">{new Date(selectedWorkFee.created_at).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Modifié le</div>
                    <div className="text-sm">{new Date(selectedWorkFee.updated_at).toLocaleString()}</div>
                  </div>
                  {selectedWorkFee.created_by && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Créé par</div>
                      <div className="text-sm">{selectedWorkFee.created_by.name || selectedWorkFee.created_by.username}</div>
                    </div>
                  )}
                  {selectedWorkFee.updated_by && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Modifié par</div>
                      <div className="text-sm">{selectedWorkFee.updated_by.name || selectedWorkFee.updated_by.username}</div>
                    </div>
                  )}
                </div>
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