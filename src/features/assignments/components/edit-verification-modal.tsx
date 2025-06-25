import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertTriangle, 
  CheckCircle, 
  Package, 
  Users, 
  DollarSign,
  Save,
  Loader2
} from 'lucide-react'

interface EditVerificationModalProps {
  isOpen: boolean
  payload: any
  assignmentId: number
  onClose: () => void
  onConfirm: (payload: any) => void
  isSubmitting?: boolean
}

export function EditVerificationModal({
  isOpen,
  payload,
  assignmentId,
  onClose,
  onConfirm,
  isSubmitting = false
}: EditVerificationModalProps) {
  if (!payload) return null

  const shocksCount = payload.shocks?.length || 0
  const otherCostsCount = payload.other_costs?.length || 0
  const totalShockWorks = payload.shocks?.reduce((sum: number, shock: any) => 
    sum + (shock.shock_works?.length || 0), 0) || 0
  const totalWorkforces = payload.shocks?.reduce((sum: number, shock: any) => 
    sum + (shock.workforces?.length || 0), 0) || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Confirmer la sauvegarde
          </DialogTitle>
          <DialogDescription>
            Voulez-vous sauvegarder définitivement les modifications du dossier {assignmentId} ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Résumé des modifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé des modifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">{shocksCount}</p>
                    <p className="text-sm text-muted-foreground">Point(s) de choc</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold">{otherCostsCount}</p>
                    <p className="text-sm text-muted-foreground">Coût(s) autre(s)</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Détail des éléments :</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fournitures :</span>
                    <span className="font-semibold">{totalShockWorks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Main d'œuvre :</span>
                    <span className="font-semibold">{totalWorkforces}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avertissement */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800">Attention</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Cette action va sauvegarder définitivement toutes les modifications. 
                    Les données précédentes seront remplacées.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button 
              onClick={() => onConfirm(payload)} 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Confirmer la sauvegarde
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 