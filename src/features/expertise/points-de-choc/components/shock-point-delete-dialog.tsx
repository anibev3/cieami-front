import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useShockPointsStore } from '@/stores/shock-points'
import { toast } from 'sonner'

interface ShockPointDeleteDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function ShockPointDeleteDialog({ id, onOpenChange }: ShockPointDeleteDialogProps) {
  const { deleteShockPoint, loading, error } = useShockPointsStore()

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteShockPoint(id)
      toast.success('Point de choc supprimé avec succès')
      onOpenChange?.()
    } catch (err) {
      // handled by store
    }
  }

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le point de choc</DialogTitle>
        </DialogHeader>
        <div>Êtes-vous sûr de vouloir supprimer ce point de choc ? Cette action est irréversible.</div>
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