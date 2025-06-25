/* eslint-disable @typescript-eslint/no-unused-vars */
import { Assignment } from '@/types/assignments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  User,
  Car,
  Building,
  Wrench,
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Download,
  Printer
} from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { useNavigate } from '@tanstack/react-router'

interface AssignmentPreviewModalProps {
  assignment: Assignment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewDetail: (assignmentId: number) => void
}

export function AssignmentPreviewModal({
  assignment,
  open,
  onOpenChange,
  onViewDetail
}: AssignmentPreviewModalProps) {
  const navigate = useNavigate()

  if (!assignment) return null

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'edited':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'opened':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'realized':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'opened':
        return <AlertCircle className="h-4 w-4" />
      case 'realized':
        return <CheckCircle className="h-4 w-4" />
      case 'edited':
        return <FileText className="h-4 w-4" />
      case 'closed':
        return <CheckCircle className="h-4 w-4" />
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Dossier {assignment.reference}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Aperçu rapide du dossier d'expertise
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(assignment.status.code)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(assignment.status.code)}
                  {assignment.status.label}
                </div>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Actions rapides */}
          <div className="flex items-center gap-2 mb-6 p-4 bg-muted/30 rounded-lg">
            <Button
              onClick={() => onViewDetail(assignment.id)}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Voir le détail complet
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
          </div>

          {/* Contenu principal */}
          <ScrollArea className="flex-1 pr-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="vehicle">Véhicule</TabsTrigger>
                <TabsTrigger value="financial">Financier</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Vue d'ensemble */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations générales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informations générales
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Référence</span>
                        <span className="font-semibold">{assignment.reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Type</span>
                        <span className="font-semibold">{assignment.assignment_type.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Montant</span>
                        <span className="font-semibold text-green-600">{formatCurrency(assignment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Créé le</span>
                        <span className="font-semibold">{formatDate(assignment.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quittances */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Quittances
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Total reçu</span>
                        <span className="font-semibold">
                          {formatCurrency(assignment.receipts?.reduce((sum, receipt) => sum + receipt.amount, 0) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Nombre</span>
                        <span className="font-semibold">{assignment.receipts?.length || 0} quittance(s)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Parties */}
              <TabsContent value="parties" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Client */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Client
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{assignment.client.name}</p>
                        <p className="text-sm text-muted-foreground">{assignment.client.email}</p>
                      </div>
                      {assignment.client.phone && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                          <p className="text-sm">{assignment.client.phone}</p>
                        </div>
                      )}
                      {assignment.client.address && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                          <p className="text-sm">{assignment.client.address}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assureur */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Assureur
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{assignment.insurer?.name || 'Non renseigné'}</p>
                        <p className="text-sm text-muted-foreground">{assignment.insurer?.email || ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Réparateur */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Réparateur
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{assignment.repairer?.name || 'Non renseigné'}</p>
                        <p className="text-sm text-muted-foreground">{assignment.repairer?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Véhicule */}
              <TabsContent value="vehicle" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Informations du véhicule
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plaque</p>
                      <p className="font-semibold text-lg">{assignment.vehicle.license_plate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Marque</p>
                      <p className="font-semibold">{assignment.vehicle.brand?.label || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Modèle</p>
                      <p className="font-semibold">{assignment.vehicle.vehicle_model?.label || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Couleur</p>
                      <p className="font-semibold">{assignment.vehicle.color?.label || 'Non renseigné'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Financier */}
              <TabsContent value="financial" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Informations financières
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Montant total</span>
                        <span className="font-semibold text-lg text-green-600">{formatCurrency(assignment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Total reçu</span>
                        <span className="font-semibold">
                          {formatCurrency(assignment.receipts?.reduce((sum, receipt) => sum + receipt.amount, 0) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Reste à payer</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(assignment.amount - (assignment.receipts?.reduce((sum, receipt) => sum + receipt.amount, 0) || 0))}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Détail des quittances</h4>
                      {assignment.receipts && assignment.receipts.length > 0 ? (
                        <div className="space-y-2">
                          {assignment.receipts.map((receipt, index) => (
                            <div key={receipt.id} className="flex justify-between text-sm">
                              <span>{receipt.type}</span>
                              <span className="font-medium">{formatCurrency(receipt.amount)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucune quittance enregistrée</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">Fiche d'expertise</p>
                          <p className="text-sm text-muted-foreground">Document principal</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium">Rapport d'expertise</p>
                          <p className="text-sm text-muted-foreground">Rapport détaillé</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
} 