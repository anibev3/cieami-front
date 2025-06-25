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
import { Assignment } from '@/types/assignments'
import { Trash2 } from 'lucide-react'

interface DeleteAssignmentDialogProps {
  assignment: Assignment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteAssignmentDialog({ 
  assignment, 
  open, 
  onOpenChange, 
  onConfirm 
}: DeleteAssignmentDialogProps) {
  if (!assignment) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Supprimer l'assignation
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'assignation <strong>{assignment.reference}</strong> ?
            <br />
            <br />
            Cette action est irréversible et supprimera définitivement :
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>L'assignation et toutes ses données</li>
              <li>Toutes les quittances associées</li>
              <li>L'historique des modifications</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 