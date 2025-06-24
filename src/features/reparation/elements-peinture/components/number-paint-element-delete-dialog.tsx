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
import { NumberPaintElement } from '@/types/number-paint-elements'
import { useNumberPaintElementsStore } from '@/stores/number-paint-elements'

interface NumberPaintElementDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  numberPaintElement: NumberPaintElement | null
}

export function NumberPaintElementDeleteDialog({
  open,
  onOpenChange,
  numberPaintElement,
}: NumberPaintElementDeleteDialogProps) {
  const { deleteNumberPaintElement, loading } = useNumberPaintElementsStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!numberPaintElement) return

    setIsDeleting(true)
    try {
      const success = await deleteNumberPaintElement(numberPaintElement.id)
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

  if (!numberPaintElement) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement
            l'élément "{numberPaintElement.label}" de la base de données.
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