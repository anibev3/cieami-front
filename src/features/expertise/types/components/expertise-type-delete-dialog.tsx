/* eslint-disable no-console */
import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useExpertiseTypesStore } from '@/stores/expertise-types'
import { toast } from 'sonner'

interface ExpertiseTypeDeleteDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function ExpertiseTypeDeleteDialog({ id, onOpenChange }: ExpertiseTypeDeleteDialogProps) {
  const { deleteExpertiseType, loading, error } = useExpertiseTypesStore()

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteExpertiseType(id)
      toast.success('Type d\'expertise supprimé avec succès')
      onOpenChange?.()
    } catch (err) {
      console.error(err)
      // handled by store
    }
  }

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le type d'expertise</DialogTitle>
        </DialogHeader>
        <div>Êtes-vous sûr de vouloir supprimer ce type d'expertise ? Cette action est irréversible.</div>
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