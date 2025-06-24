import { PaintType } from '@/types/paint-types'
import { PaintTypeMutateDialog } from './paint-type-mutate-dialog'
import { PaintTypeViewDialog } from './paint-type-view-dialog'
import { PaintTypeDeleteDialog } from './paint-type-delete-dialog'

interface PaintTypeDialogsProps {
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
  selectedPaintType: PaintType | null
}

export function PaintTypeDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedPaintType,
}: PaintTypeDialogsProps) {
  return (
    <>
      <PaintTypeMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />

      <PaintTypeMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        paintType={selectedPaintType}
        mode="edit"
      />

      <PaintTypeViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        paintType={selectedPaintType}
      />

      <PaintTypeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        paintType={selectedPaintType}
      />
    </>
  )
} 