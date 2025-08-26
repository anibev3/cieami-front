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
  Printer,
  Eye,
  Users
} from 'lucide-react'
import { formatDate } from '@/utils/format-date'
import { formatCurrency } from '@/utils/format-currency'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface AssignmentPreviewModalProps {
  assignment: Assignment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewDetail: (assignmentId: number) => void
  onOpenReceiptModal: (assignmentId: number, totalAmount: number) => void
}

export function AssignmentPreviewModal({
  assignment,
  open,
  onOpenChange,
  onViewDetail,
  onOpenReceiptModal
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
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Informations générales</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Référence</Label>
                        <p className="font-medium">{assignment.reference}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <p className="font-semibold">{assignment.assignment_type?.label || 'Non renseigné'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Montant</Label>
                        <p className="font-semibold text-green-600">
                          {assignment.total_amount ? formatCurrency(parseFloat(assignment.total_amount)) : 'Non renseigné'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Créé le</Label>
                        <p className="text-sm">{formatDate(assignment.created_at)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Dernière modification</Label>
                        <p className="text-sm">{formatDate(assignment.updated_at)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quittances */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5" />
                        <span>Quittances</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label>Total reçu</Label>
                          <span className="font-semibold">
                            {assignment.receipts && assignment.receipts.length > 0
                              ? formatCurrency(assignment.receipts.reduce((sum, receipt) => sum + parseFloat(receipt.amount), 0))
                              : '0,00 €'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <Label>Nombre</Label>
                          <span className="font-semibold">{assignment.receipts?.length || 0} quittance(s)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Parties */}
              <TabsContent value="parties" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Client */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Client</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assignment.client ? (
                        <div className="space-y-3">
                          <div>
                            <Label>Nom</Label>
                            <p className="font-medium">{assignment.client.name}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="text-sm">{assignment.client.email}</p>
                          </div>
                          {assignment.client.phone_1 && (
                            <div>
                              <Label>Téléphone</Label>
                              <p className="text-sm text-muted-foreground">{assignment.client.phone_1}</p>
                            </div>
                          )}
                          {assignment.client.address && (
                            <div>
                              <Label>Adresse</Label>
                              <p className="text-sm text-muted-foreground">{assignment.client.address}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">Aucune information client disponible</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Assureur */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>Assureur</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label>Nom</Label>
                          <p className="font-medium">{assignment.insurer?.name || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm">{assignment.insurer?.email || ''}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Réparateur */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Wrench className="h-5 w-5" />
                        <span>Réparateur</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label>Nom</Label>
                          <p className="font-medium">{assignment.repairer?.name || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="text-sm">{assignment.repairer?.email || ''}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Véhicule */}
              <TabsContent value="vehicle" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="h-5 w-5" />
                      <span>Informations du véhicule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assignment.vehicle ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label>Plaque</Label>
                          <p className="font-semibold text-lg">{assignment.vehicle.license_plate}</p>
                        </div>
                        <div>
                          <Label>Usage</Label>
                          <p className="font-semibold">{assignment.vehicle.usage || 'Non renseigné'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Aucune information véhicule disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financier */}
              <TabsContent value="financial" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Informations financières</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label>Montant total</Label>
                        <p className="font-semibold text-lg text-green-600">
                          {assignment.total_amount ? formatCurrency(parseFloat(assignment.total_amount)) : 'Non renseigné'}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Label>Total reçu</Label>
                        <p className="font-semibold">
                          {assignment.receipts && assignment.receipts.length > 0 
                            ? formatCurrency(assignment.receipts.reduce((sum, receipt) => sum + parseFloat(receipt.amount), 0))
                            : '0,00 €'
                          }
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <Label>Reste à payer</Label>
                        <p className="font-semibold text-orange-600">
                          {assignment.total_amount && assignment.receipts
                            ? formatCurrency(parseFloat(assignment.total_amount) - assignment.receipts.reduce((sum, receipt) => sum + parseFloat(receipt.amount), 0))
                            : 'Non calculable'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Documents disponibles</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button 
              onClick={() => onOpenReceiptModal(assignment.id, assignment.total_amount ? parseFloat(assignment.total_amount) : 0)}
              className="flex items-center space-x-2"
            >
              <Receipt className="h-4 w-4" />
              <span>Gérer les quittances</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 