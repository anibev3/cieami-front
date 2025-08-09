import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useShockPointsStore } from '@/stores/shock-points'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/format-date'
import { 
  MapPin, 
  FileText, 
  Tag, 
  Clock, 
  Hash,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface ShockPointViewDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function ShockPointViewDialog({ id, onOpenChange }: ShockPointViewDialogProps) {
  const { shockPoints } = useShockPointsStore()
  const shockPoint = shockPoints.find((sp) => sp.id === id)

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Détail du point de choc
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur le point de choc
          </DialogDescription>
        </DialogHeader>

        {shockPoint ? (
          <div className="space-y-6">
            {/* En-tête avec code et statut */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-orange-900">{shockPoint.code}</h2>
                    <p className="text-orange-700 mt-1">{shockPoint.label}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={shockPoint.status?.code === 'active' ? 'default' : 'secondary'} 
                      className="text-sm"
                    >
                      {shockPoint.status?.label || 'Statut inconnu'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
              {/* Informations principales */}
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Informations principales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Code</p>
                        <p className="text-lg font-semibold font-mono">{shockPoint.code}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Libellé</p>
                        <p className="text-lg font-semibold">{shockPoint.label}</p>
                      </div>
                    </div>
                    
                    {shockPoint.description && (
                      <div className="flex items-start gap-3 pt-2 border-t">
                        <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm leading-relaxed">{shockPoint.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Statut et dates */}
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Statut et historique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {shockPoint.status?.code === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Statut</p>
                      <p className="text-sm font-semibold">{shockPoint.status?.label || 'Non défini'}</p>
                      {shockPoint.status?.description && (
                        <p className="text-xs text-muted-foreground">{shockPoint.status.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Créé le</p>
                        <p className="text-sm">{formatDate(shockPoint.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Modifié le</p>
                        <p className="text-sm">{formatDate(shockPoint.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Point de choc introuvable.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 