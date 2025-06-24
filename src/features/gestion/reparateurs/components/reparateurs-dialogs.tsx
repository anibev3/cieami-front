import { ConfirmDialog } from '@/components/confirm-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useReparateurs } from '../context/reparateurs-context'
import { useReparateursStore } from '../store'
import { ReparateursMutateDrawer } from './reparateurs-mutate-drawer'
import { toast } from 'sonner'

export function ReparateursDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useReparateurs()
  const { deleteReparateur } = useReparateursStore()

  const handleDelete = async () => {
    if (!currentRow) return
    try {
      await deleteReparateur(currentRow.id)
      toast.success('Réparateur supprimé avec succès')
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    } catch (_error) {
      toast.error('Une erreur est survenue lors de la suppression')
    }
  }

  return (
    <>
      <ReparateursMutateDrawer
        key='reparateur-create'
        open={open === 'create'}
        onOpenChange={(open) => setOpen(open ? 'create' : null)}
      />

      {currentRow && (
        <>
          <ReparateursMutateDrawer
            key={`reparateur-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(open) => {
              setOpen(open ? 'update' : null)
              if (!open) {
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />

          <Dialog
            key='reparateur-view'
            open={open === 'view'}
            onOpenChange={(open) => {
              setOpen(open ? 'view' : null)
              if (!open) {
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Détail du réparateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <div><b>Nom :</b> {currentRow.name}</div>
                <div><b>Code :</b> {currentRow.code}</div>
                <div><b>Email :</b> {currentRow.email}</div>
                <div><b>Téléphone :</b> {currentRow.telephone || '-'}</div>
                <div><b>Adresse :</b> {currentRow.address || '-'}</div>
                <div><b>Statut :</b> {currentRow.status.label}</div>
                <div><b>Type d'entité :</b> {currentRow.entity_type.label}</div>
                <div><b>Créé le :</b> {new Date(currentRow.created_at).toLocaleString()}</div>
                <div><b>Modifié le :</b> {new Date(currentRow.updated_at).toLocaleString()}</div>
              </div>
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            key='reparateur-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(open) => {
              setOpen(open ? 'delete' : null)
              if (!open) {
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Supprimer ce réparateur : ${currentRow.name} ?`}
            desc={
              <>
                Vous êtes sur le point de supprimer le réparateur{' '}
                <strong>{currentRow.name}</strong>. <br />
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