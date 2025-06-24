import { WorkforceType } from '@/types/workforce-types'
import { WorkforceTypeMutateDialog } from './workforce-type-mutate-dialog'
import { WorkforceTypeViewDialog } from './workforce-type-view-dialog'
import { WorkforceTypeDeleteDialog } from './workforce-type-delete-dialog'

interface WorkforceTypeDialogsProps {
  createDialogOpen: boolean
  editDialogOpen: boolean
  viewDialogOpen: boolean
  deleteDialogOpen: boolean
  onCreateDialogChange: (open: boolean) => void
  onEditDialogChange: (open: boolean) => void
  onViewDialogChange: (open: boolean) => void
  onDeleteDialogChange: (open: boolean) => void
  selectedWorkforceType: WorkforceType | null
}

export function WorkforceTypeDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedWorkforceType,
}: WorkforceTypeDialogsProps) {
  return (
    <>
      <WorkforceTypeMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />
      <WorkforceTypeMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        workforceType={selectedWorkforceType}
        mode="edit"
      />
      <WorkforceTypeViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        workforceType={selectedWorkforceType}
      />
      <WorkforceTypeDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        workforceType={selectedWorkforceType}
      />
    </>
  )
} 