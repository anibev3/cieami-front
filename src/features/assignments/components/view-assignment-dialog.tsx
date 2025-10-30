import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Assignment } from '@/types/assignments'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { User, Car, FileText, DollarSign, Calendar, Hash } from 'lucide-react'

interface ViewAssignmentDialogProps {
  assignment: Assignment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewAssignmentDialog({ assignment, open, onOpenChange }: ViewAssignmentDialogProps) {
  if (!assignment) return null

  const getStatusVariant = (code: string) => {
    switch (code) {
      case 'active':
      case 'opened':
        return 'default'
      case 'realized':
      case 'edited':
      case 'corrected':
        return 'secondary'
      case 'closed':
      case 'in_payment':
        return 'outline'
      case 'paid':
        return 'default'
      case 'inactive':
      case 'cancelled':
      case 'deleted':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Assignation {assignment.reference}
          </DialogTitle>
          <DialogDescription>
            Détails complets de l'assignation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec statut */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{assignment.reference}</h3>
              <p className="text-sm text-muted-foreground">
                Créée le {formatDate(assignment.created_at)}
              </p>
            </div>
            <Badge variant={getStatusVariant(assignment.status.code)}>
              {assignment.status.label}
            </Badge>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{assignment.client.name}</p>
                  <p className="text-sm text-muted-foreground">{assignment.client.email}</p>
                  <p className="text-sm text-muted-foreground">{assignment.client.phone}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {assignment.client.address}
                </div>
              </CardContent>
            </Card>

            {/* Véhicule */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Car className="h-4 w-4" />
                  Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">{assignment.vehicle.license_plate}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.vehicle.brand.label} {assignment.vehicle.vehicle_model.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Couleur: {assignment.vehicle.color.label}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Type de mission */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  Type de mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-medium">{assignment.assignment_type.label}</p>
                  <p className="text-sm text-muted-foreground">{assignment.assignment_type.code}</p>
                  {assignment.assignment_type.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {assignment.assignment_type.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expert */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Expert assigné
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-medium">{assignment.expert.name}</p>
                  <p className="text-sm text-muted-foreground">{assignment.expert.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Montant et quittances */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Montant et quittances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Montant total:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(assignment.amount)}
                  </span>
                </div>
                
                {assignment.receipts && assignment.receipts.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Quittances ({assignment.receipts.length})</h4>
                    <div className="space-y-2">
                      {assignment.receipts.map((receipt) => (
                        <div key={receipt.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="font-medium">{receipt.reference}</p>
                            <p className="text-sm text-muted-foreground">{receipt.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(receipt.amount)}</p>
                            <p className="text-sm text-muted-foreground">{receipt.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="font-medium">Total quittances:</span>
                      <span className="font-bold">
                        {formatCurrency(assignment.receipts.reduce((sum, r) => sum + r.amount, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Informations temporelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Créé le</p>
                  <p className="font-medium">{formatDate(assignment.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modifié le</p>
                  <p className="font-medium">{formatDate(assignment.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 