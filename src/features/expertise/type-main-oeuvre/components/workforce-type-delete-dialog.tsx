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
import { WorkforceType } from '@/types/workforce-types'
import { useWorkforceTypesStore } from '@/stores/workforce-types'

interface WorkforceTypeDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workforceType: WorkforceType | null
}

export function WorkforceTypeDeleteDialog({
  open,
  onOpenChange,
  workforceType,
}: WorkforceTypeDeleteDialogProps) {
  const { deleteWorkforceType, loading } = useWorkforceTypesStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!workforceType) return

    setIsDeleting(true)
    try {
      const success = await deleteWorkforceType(workforceType.id)
      if (success) {
        onOpenChange(false)
      }
    } catch (_error) {
      toast.error('Une erreur est survenue lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!workforceType) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement
            le type main d'oeuvre "{workforceType.label}" de la base de données.
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