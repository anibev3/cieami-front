import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { VehicleState } from '@/types/vehicle-states'

interface DeleteVehicleStateDialogProps {
  vehicleState: VehicleState | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteVehicleStateDialog({ vehicleState, open, onOpenChange, onConfirm }: DeleteVehicleStateDialogProps) {
  if (!vehicleState) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'état de véhicule</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Êtes-vous sûr de vouloir supprimer l'état de véhicule <span className="font-semibold">{vehicleState.label}</span> ? Cette action est irréversible.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 