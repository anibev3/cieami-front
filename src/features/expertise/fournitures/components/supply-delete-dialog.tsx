import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSuppliesStore } from '@/stores/supplies'
import { toast } from 'sonner'

interface SupplyDeleteDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function SupplyDeleteDialog({ id, onOpenChange }: SupplyDeleteDialogProps) {
  const { deleteSupply, loading, error } = useSuppliesStore()

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteSupply(id)
      toast.success('Fourniture supprimée avec succès')
      onOpenChange?.()
    } catch (err) {
      // handled by store
    }
  }

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la fourniture</DialogTitle>
        </DialogHeader>
        <div>Êtes-vous sûr de vouloir supprimer cette fourniture ? Cette action est irréversible.</div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange} disabled={loading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 