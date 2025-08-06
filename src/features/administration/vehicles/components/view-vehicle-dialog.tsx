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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Car, 
  Calendar, 
  Gauge, 
  Hash, 
  Palette, 
  Settings, 
  Tag, 
  Users, 
  Weight, 
  Zap,
  Clock,
  FileText,
  MapPin,
  Star
} from 'lucide-react'

interface ViewVehicleDialogProps {
  vehicle: Vehicle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVehicleDialog({ vehicle, open, onOpenChange }: ViewVehicleDialogProps) {
  if (!vehicle) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Détails du véhicule
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur le véhicule {vehicle.license_plate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec plaque d'immatriculation */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">{vehicle.license_plate}</h2>
                  <p className="text-blue-700 mt-1">
                    {vehicle?.brand?.label} {vehicle?.vehicle_model?.label}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-sm">
                      {vehicle?.vehicle_genre?.label}
                  </Badge>
                  {vehicle?.vehicle_energy && (
                    <Badge variant="outline" className="ml-2 text-sm">
                      {vehicle?.vehicle_energy?.label}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations techniques */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Informations techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Kilométrage</p>
                      <p className="text-lg font-semibold">{vehicle?.mileage?.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Puissance fiscale</p>
                      <p className="text-lg font-semibold">{vehicle?.fiscal_power} CV</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Places</p>
                      <p className="text-lg font-semibold">{vehicle?.nb_seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Charge utile</p>
                      <p className="text-lg font-semibold">{vehicle?.payload ? `${vehicle?.payload} kg` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {vehicle.serial_number && (
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Numéro de série</p>
                      <p className="text-sm font-mono">{vehicle?.serial_number}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations commerciales */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5" />
                  Informations commerciales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Valeur neuve</p>
                      <p className="text-lg font-semibold">
                        {vehicle?.new_market_value ? `${vehicle?.new_market_value.toLocaleString()} FCFA` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Usage</p>
                      <p className="text-sm">{vehicle?.usage || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {vehicle.type && (
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm">{vehicle?.type}</p>
                    </div>
                  </div>
                )}
                
                {vehicle.option && (
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Option</p>
                      <p className="text-sm">{vehicle?.option}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates importantes */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Dates importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicle.first_entry_into_circulation_date && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Première mise en circulation</p>
                      <p className="text-sm">{formatDate(vehicle?.first_entry_into_circulation_date)}</p>
                    </div>
                  </div>
                )}
                {vehicle.technical_visit_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Visite technique</p>
                      <p className="text-sm">{formatDate(vehicle?.technical_visit_date)}</p>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Créé le</p>
                    <p className="text-sm">{formatDate(vehicle?.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Modifié le</p>
                    <p className="text-sm">{formatDate(vehicle?.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apparence */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marque</p>
                    <div className="mt-1">
                      <p className="font-semibold">{vehicle?.brand?.label}</p>
                      {vehicle?.brand?.description && (
                        <p className="text-xs text-muted-foreground">{vehicle?.brand?.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modèle</p>
                    <div className="mt-1">
                      <p className="font-semibold">{vehicle?.vehicle_model?.label}</p>
                      {vehicle?.vehicle_model?.description && (
                        <p className="text-xs text-muted-foreground">{vehicle?.vehicle_model?.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Couleur</p>
                    <div className="mt-1">
                      <p className="font-semibold">{vehicle?.color?.label}</p>
                      {vehicle?.color?.description && (
                        <p className="text-xs text-muted-foreground">{vehicle?.color?.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {vehicle?.bodywork && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Carrosserie</p>
                      <div className="mt-1">
                        <p className="font-semibold">{vehicle?.bodywork?.label}</p>
                        {vehicle?.bodywork?.description && (
                          <p className="text-xs text-muted-foreground">{vehicle?.bodywork?.description}</p>
                        )}
                        <Badge variant="outline" className="mt-1">
                          {vehicle?.bodywork?.status?.label}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 