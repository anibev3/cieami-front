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
import { PaintProductPrice } from '@/types/paint-product-prices'
import { usePaintProductPricesStore } from '@/stores/paint-product-prices'

interface PaintProductPriceDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintProductPrice: PaintProductPrice | null
}

export function PaintProductPriceDeleteDialog({
  open,
  onOpenChange,
  paintProductPrice,
}: PaintProductPriceDeleteDialogProps) {
  const { deletePaintProductPrice, loading } = usePaintProductPricesStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!paintProductPrice) return

    setIsDeleting(true)
    try {
      const success = await deletePaintProductPrice(paintProductPrice.id)
      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error deleting paint product price:', error)
      toast.error('Une erreur est survenue lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!paintProductPrice) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement
            le tarif pour {paintProductPrice.paint_type.label} - {paintProductPrice.number_paint_element.label} de la base de données.
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