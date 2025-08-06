import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useSuppliesStore } from '@/stores/supplies'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/format-date'
import { 
  Package, 
  FileText, 
  Tag, 
  Clock, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface SupplyViewDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function SupplyViewDialog({ id, onOpenChange }: SupplyViewDialogProps) {
  const { supplies } = useSuppliesStore()
  const supply = supplies.find((s) => s.id === id)

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Détail de la fourniture
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la fourniture
          </DialogDescription>
        </DialogHeader>

        {supply ? (
          <div className="space-y-6">
            {/* En-tête avec libellé et statut */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-green-900">{supply.label}</h2>
                    {supply.description && (
                      <p className="text-green-700 mt-1 line-clamp-2">{supply.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={supply.status?.code === 'active' ? 'default' : 'secondary'} 
                      className="text-sm"
                    >
                      {supply.status?.label || 'Statut inconnu'}
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
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Libellé</p>
                        <p className="text-lg font-semibold">{supply.label}</p>
                      </div>
                    </div>
                    
                    {supply.description && (
                      <div className="flex items-start gap-3 pt-2 border-t">
                        <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm leading-relaxed">{supply.description}</p>
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
                    {supply.status?.code === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Statut</p>
                      <p className="text-sm font-semibold">{supply.status?.label || 'Non défini'}</p>
                      {supply.status?.description && (
                        <p className="text-xs text-muted-foreground">{supply.status.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Créé le</p>
                        <p className="text-sm">{formatDate(supply.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Modifié le</p>
                        <p className="text-sm">{formatDate(supply.updated_at)}</p>
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
              <p className="text-muted-foreground">Fourniture introuvable.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 