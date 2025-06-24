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
import { HourlyRate } from '@/types/hourly-rates'
import { useHourlyRatesStore } from '@/stores/hourly-rates'

interface HourlyRateDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hourlyRate: HourlyRate | null
}

export function HourlyRateDeleteDialog({
  open,
  onOpenChange,
  hourlyRate,
}: HourlyRateDeleteDialogProps) {
  const { deleteHourlyRate, loading } = useHourlyRatesStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!hourlyRate) return

    setIsDeleting(true)
    try {
      const success = await deleteHourlyRate(hourlyRate.id)
      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error deleting hourly rate:', error)
      toast.error('Une erreur est survenue lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!hourlyRate) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement
            l'horaire "{hourlyRate.label}" de la base de données.
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