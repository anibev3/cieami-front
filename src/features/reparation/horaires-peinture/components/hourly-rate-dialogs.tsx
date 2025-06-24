import { HourlyRate } from '@/types/hourly-rates'
import { HourlyRateMutateDialog } from './hourly-rate-mutate-dialog'
import { HourlyRateViewDialog } from './hourly-rate-view-dialog'
import { HourlyRateDeleteDialog } from './hourly-rate-delete-dialog'

interface HourlyRateDialogsProps {
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
  selectedHourlyRate: HourlyRate | null
}

export function HourlyRateDialogs({
  createDialogOpen,
  editDialogOpen,
  viewDialogOpen,
  deleteDialogOpen,
  onCreateDialogChange,
  onEditDialogChange,
  onViewDialogChange,
  onDeleteDialogChange,
  selectedHourlyRate,
}: HourlyRateDialogsProps) {
  return (
    <>
      <HourlyRateMutateDialog
        open={createDialogOpen}
        onOpenChange={onCreateDialogChange}
        mode="create"
      />

      <HourlyRateMutateDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogChange}
        hourlyRate={selectedHourlyRate}
        mode="edit"
      />

      <HourlyRateViewDialog
        open={viewDialogOpen}
        onOpenChange={onViewDialogChange}
        hourlyRate={selectedHourlyRate}
      />

      <HourlyRateDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={onDeleteDialogChange}
        hourlyRate={selectedHourlyRate}
      />
    </>
  )
} 