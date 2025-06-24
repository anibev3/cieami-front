import { Bodywork } from '@/types/bodyworks'
import { BodyworkMutateDialog } from './bodywork-mutate-dialog'
import { BodyworkViewDialog } from './bodywork-view-dialog'
import { BodyworkDeleteDialog } from './bodywork-delete-dialog'

interface BodyworkDialogsProps {
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
  selectedBodywork: Bodywork | null
}

export function BodyworkDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedBodywork,
}: BodyworkDialogsProps) {
  return (
    <>
      <BodyworkMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />

      <BodyworkMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        bodywork={selectedBodywork}
        mode="edit"
      />

      <BodyworkViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        bodywork={selectedBodywork}
      />

      <BodyworkDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        bodywork={selectedBodywork}
      />
    </>
  )
} 