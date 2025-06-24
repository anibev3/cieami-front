import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { VehicleModel } from '@/types/vehicle-models'

interface DeleteVehicleModelDialogProps {
  vehicleModel: VehicleModel | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteVehicleModelDialog({ vehicleModel, open, onOpenChange, onConfirm }: DeleteVehicleModelDialogProps) {
  if (!vehicleModel) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le modèle de véhicule</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Êtes-vous sûr de vouloir supprimer le modèle de véhicule <span className="font-semibold">{vehicleModel.label}</span> ? Cette action est irréversible.
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