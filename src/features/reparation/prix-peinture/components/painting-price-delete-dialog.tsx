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
import { PaintingPrice } from '@/types/painting-prices'
import { usePaintingPricesStore } from '@/stores/painting-prices'

interface PaintingPriceDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintingPrice: PaintingPrice | null
}

export function PaintingPriceDeleteDialog({
  open,
  onOpenChange,
  paintingPrice,
}: PaintingPriceDeleteDialogProps) {
  const { deletePaintingPrice, loading } = usePaintingPricesStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!paintingPrice) return

    setIsDeleting(true)
    try {
      const success = await deletePaintingPrice(paintingPrice.id)
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

  if (!paintingPrice) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement
            le prix de peinture (ID: {paintingPrice.id}) de la base de données.
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