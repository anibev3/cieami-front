import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/format-date'
import { VehicleState } from '@/types/vehicle-states'

interface ViewVehicleStateDialogProps {
  vehicleState: VehicleState | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleStateDialog({ vehicleState, open, onOpenChange }: ViewVehicleStateDialogProps) {
  if (!vehicleState) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Détail de l'état de véhicule</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Code :</span> {vehicleState.code}
          </div>
          <div>
            <span className="font-semibold">Libellé :</span> {vehicleState.label}
          </div>
          <div>
            <span className="font-semibold">Description :</span> {vehicleState.description}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> <Badge>{vehicleState.status.label}</Badge>
          </div>
          <div>
            <span className="font-semibold">Créé le :</span> {formatDate(vehicleState.created_at)}
          </div>
          <div>
            <span className="font-semibold">Modifié le :</span> {formatDate(vehicleState.updated_at)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 