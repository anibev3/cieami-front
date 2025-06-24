import { NumberPaintElement } from '@/types/number-paint-elements'
import { NumberPaintElementMutateDialog } from './number-paint-element-mutate-dialog'
import { NumberPaintElementViewDialog } from './number-paint-element-view-dialog'
import { NumberPaintElementDeleteDialog } from './number-paint-element-delete-dialog'

interface NumberPaintElementDialogsProps {
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
  selectedNumberPaintElement: NumberPaintElement | null
}

export function NumberPaintElementDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedNumberPaintElement,
}: NumberPaintElementDialogsProps) {
  return (
    <>
      <NumberPaintElementMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />

      <NumberPaintElementMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        numberPaintElement={selectedNumberPaintElement}
        mode="edit"
      />

      <NumberPaintElementViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        numberPaintElement={selectedNumberPaintElement}
      />

      <NumberPaintElementDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        numberPaintElement={selectedNumberPaintElement}
      />
    </>
  )
} 