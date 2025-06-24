import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/format-date'
import { VehicleModel } from '@/types/vehicle-models'

interface ViewVehicleModelDialogProps {
  vehicleModel: VehicleModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleModelDialog({ vehicleModel, open, onOpenChange }: ViewVehicleModelDialogProps) {
  if (!vehicleModel) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Détail du modèle de véhicule</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Code :</span> {vehicleModel.code}
          </div>
          <div>
            <span className="font-semibold">Libellé :</span> {vehicleModel.label}
          </div>
          <div>
            <span className="font-semibold">Description :</span> {vehicleModel.description}
          </div>
          <div>
            <span className="font-semibold">Marque :</span> {vehicleModel.brand.label}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> <Badge>{vehicleModel.status.label}</Badge>
          </div>
          <div>
            <span className="font-semibold">Créé le :</span> {formatDate(vehicleModel.created_at)}
          </div>
          <div>
            <span className="font-semibold">Modifié le :</span> {formatDate(vehicleModel.updated_at)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 