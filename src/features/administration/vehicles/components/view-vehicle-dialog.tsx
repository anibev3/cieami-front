import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Vehicle } from '@/types/vehicles'
import { formatDate } from '@/utils/format-date'
import { Badge } from '@/components/ui/badge'

interface ViewVehicleDialogProps {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleDialog({ vehicle, open, onOpenChange }: ViewVehicleDialogProps) {
  if (!vehicle) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du véhicule</DialogTitle>
          <DialogDescription>
            Informations complètes sur le véhicule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations principales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Plaque d'immatriculation
                </label>
                <p className="text-sm">{vehicle.license_plate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Usage
                </label>
                <p className="text-sm">{vehicle.usage}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type
                </label>
                <p className="text-sm">{vehicle.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Option
                </label>
                <p className="text-sm">{vehicle.option}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Kilométrage
                </label>
                <p className="text-sm">{vehicle.mileage} km</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Numéro de série
                </label>
                <p className="text-sm">{vehicle.serial_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Puissance fiscale
                </label>
                <p className="text-sm">{vehicle.fiscal_power} CV</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre de places
                </label>
                <p className="text-sm">{vehicle.nb_seats}</p>
              </div>
              {vehicle.energy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Énergie
                  </label>
                  <p className="text-sm">{vehicle.energy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              {vehicle.first_entry_into_circulation_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Première mise en circulation
                  </label>
                  <p className="text-sm">{formatDate(vehicle.first_entry_into_circulation_date)}</p>
                </div>
              )}
              {vehicle.technical_visit_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Visite technique
                  </label>
                  <p className="text-sm">{formatDate(vehicle.technical_visit_date)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Marque et modèle */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Marque et modèle</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Marque
                </label>
                <p className="text-sm">{vehicle?.brand?.label}</p>
                <p className="text-xs text-muted-foreground">{vehicle?.brand?.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Modèle
                </label>
                <p className="text-sm">{vehicle?.vehicle_model?.label}</p>
                <p className="text-xs text-muted-foreground">{vehicle?.vehicle_model?.description}</p>
              </div>
            </div>
          </div>

          {/* Couleur et carrosserie */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Apparence</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Couleur
                </label>
                <p className="text-sm">{vehicle?.color?.label}</p>
                <p className="text-xs text-muted-foreground">{vehicle?.color?.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Carrosserie
                </label>
                <p className="text-sm">{vehicle?.bodywork?.label}</p>
                <p className="text-xs text-muted-foreground">{vehicle?.bodywork?.description}</p>
                <Badge variant="outline" className="mt-1">
                  {vehicle?.bodywork?.status?.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Créé le
                </label>
                <p className="text-sm">{formatDate(vehicle.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Modifié le
                </label>
                <p className="text-sm">{formatDate(vehicle.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 