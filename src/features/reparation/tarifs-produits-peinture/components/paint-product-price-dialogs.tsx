import { PaintProductPrice } from '@/types/paint-product-prices'
import { PaintProductPriceMutateDialog } from './paint-product-price-mutate-dialog'
import { PaintProductPriceViewDialog } from './paint-product-price-view-dialog'
import { PaintProductPriceDeleteDialog } from './paint-product-price-delete-dialog'

interface PaintProductPriceDialogsProps {
  // Dialog states
  createDialogOpen: boolean
  editDialogOpen: boolean
  viewDialogOpen: boolean
  deleteDialogOpen: boolean

  // Dialog handlers
  onCreateDialogChange: (open: boolean) => void
  onEditDialogChange: (open: boolean) => void
  onViewDialogChange: (open: boolean) => void
  onDeleteDialogChange: (open: boolean) => void

  // Data
  selectedPaintProductPrice: PaintProductPrice | null
}

export function PaintProductPriceDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedPaintProductPrice,
}: PaintProductPriceDialogsProps) {
  return (
    <>
      <PaintProductPriceMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />

      <PaintProductPriceMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        paintProductPrice={selectedPaintProductPrice}
        mode="edit"
      />

      <PaintProductPriceViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        paintProductPrice={selectedPaintProductPrice}
      />

      <PaintProductPriceDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        paintProductPrice={selectedPaintProductPrice}
      />
    </>
  )
} 