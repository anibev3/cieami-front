import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PaintType } from '@/types/paint-types'
import { usePaintTypesStore } from '@/stores/paint-types'

interface PaintTypeDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintType: PaintType | null
}

export function PaintTypeDeleteDialog({
  open,
  onOpenChange,
  paintType,
}: PaintTypeDeleteDialogProps) {
  const { deletePaintType, loading } = usePaintTypesStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!paintType) return

    setIsDeleting(true)
    try {
      const success = await deletePaintType(paintType.id)
      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!paintType) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement
            le type "{paintType.label}" de la base de données.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 