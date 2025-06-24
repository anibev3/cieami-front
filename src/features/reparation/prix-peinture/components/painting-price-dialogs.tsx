import { PaintingPrice } from '@/types/painting-prices'
import { PaintingPriceMutateDialog } from './painting-price-mutate-dialog'
import { PaintingPriceViewDialog } from './painting-price-view-dialog'
import { PaintingPriceDeleteDialog } from './painting-price-delete-dialog'

interface PaintingPriceDialogsProps {
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
  selectedPaintingPrice: PaintingPrice | null
}

export function PaintingPriceDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedPaintingPrice,
}: PaintingPriceDialogsProps) {
  return (
    <>
      <PaintingPriceMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />

      <PaintingPriceMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        paintingPrice={selectedPaintingPrice}
        mode="edit"
      />

      <PaintingPriceViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        paintingPrice={selectedPaintingPrice}
      />

      <PaintingPriceDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        paintingPrice={selectedPaintingPrice}
      />
    </>
  )
} 