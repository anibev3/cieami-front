/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Car, 
  Building, 
  Wrench, 
  Calendar, 
  MapPin, 
  DollarSign, 
  FileDown,
  Eye,
  Edit,
  Printer,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Receipt,
  Hammer,
  Palette,
  Zap,
  Settings
} from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface AssignmentDetail {
  id: number
  reference: string
  policy_number: string | null
  claim_number: string | null
  claim_starts_at: string | null
  claim_ends_at: string | null
  expertise_date: string | null
  expertise_place: string | null
  received_at: string
  administrator: string | null
  circumstance: string | null
  damage_declared: string | null
  observation: string | null
  point_noted: string | null
  seen_before_work_date: string | null
  seen_during_work_date: string | null
  seen_after_work_date: string | null
  contact_date: string | null
  assured_value: string | null
  salvage_value: string | null
  new_value: string | null
  depreciation_rate: string | null
  market_value: string | null
  work_duration: string | null
  expert_remark: string | null
  shock_amount_excluding_tax: string
  shock_amount_tax: string
  shock_amount: string
  other_cost_amount_excluding_tax: string
  other_cost_amount_tax: string
  other_cost_amount: string
  receipt_amount_excluding_tax: string
  receipt_amount_tax: string
  receipt_amount: string
  total_amount_excluding_tax: string
  total_amount_tax: string
  total_amount: string
  printed_at: string | null
  expertise_sheet: string | null
  expertise_report: string | null
  created_at: string
  updated_at: string
  status: {
    id: number
    code: string
    label: string
    description: string
  }
  client: {
    id: number
    name: string
    email: string
    phone_1: string | null
    phone_2: string | null
    address: string | null
  }
  vehicle: {
    id: number
    license_plate: string
    usage: string
    type: string
    option: string
    mileage: string
    serial_number: string
    fiscal_power: number
    energy: string
    nb_seats: number
  }
  insurer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
  }
  repairer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
  }
  assignment_type: {
    id: number
    code: string
    label: string
    description: string
  }
  expertise_type: {
    id: number
    code: string
    label: string
    description: string
  }
  document_transmitted: {
    id: number
    code: string
    label: string
    description: string
  }
  experts: Array<{
    id: number
    date: string | null
    observation: string | null
  }>
  shocks: Array<{
    id: number
    workforce_amount_excluding_tax: string
    workforce_amount_tax: string
    workforce_amount: string
    amount_excluding_tax: string
    amount_tax: string
    amount: string
    workforces: Array<{
      id: number
      nb_hours: string
      work_fee: string
      discount: string
      amount_excluding_tax: string
      amount_tax: string
      amount: string
      workforce_type_label: string
      workforce_type: {
        id: number
        code: string
        label: string
        description: string
      }
    }>
  }>
  other_costs: Array<{
    id: number
    amount_excluding_tax: string
    amount_tax: string
    amount: string
    other_cost_type_label: string
    other_cost_type: {
      id: number
      code: string
      label: string
      description: string
    }
  }>
  receipts: Array<{
    id: number
    amount_excluding_tax: string
    amount_tax: string
    amount: string
    receipt_type: {
      id: number
      code: string
      label: string
      description: string
    }
  }>
}

export default function AssignmentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${id}`)
        setAssignment(response.data.data)
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [id])

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non renseigné'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'edited':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement du dossier...</p>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dossier non trouvé</h3>
          <p className="text-muted-foreground mb-4">Le dossier demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate({ to: '/assignments' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux dossiers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate({ to: '/assignments' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dossier {assignment.reference}</h1>
            <p className="text-muted-foreground">Détails complets du dossier d'expertise</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(assignment.status.code)}>
            {assignment.status.label}
          </Badge>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Référence</p>
                <p className="font-semibold">{assignment.reference}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de réception</p>
                <p className="font-semibold">{formatDate(assignment.received_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date d'expertise</p>
                <p className="font-semibold">{formatDate(assignment.expertise_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lieu d'expertise</p>
                <p className="font-semibold">{assignment.expertise_place || 'Non renseigné'}</p>
              </div>
            </div>
            {assignment.circumstance && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Circonstances</p>
                <p className="text-sm">{assignment.circumstance}</p>
              </div>
            )}
            {assignment.damage_declared && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dégâts déclarés</p>
                <p className="text-sm">{assignment.damage_declared}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Montants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Montants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Chocs (HT)</span>
                <span className="font-semibold">{formatCurrency(assignment.shock_amount_excluding_tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Autres coûts (HT)</span>
                <span className="font-semibold">{formatCurrency(assignment.other_cost_amount_excluding_tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Honoraires (HT)</span>
                <span className="font-semibold">{formatCurrency(assignment.receipt_amount_excluding_tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total (HT)</span>
                <span>{formatCurrency(assignment.total_amount_excluding_tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total (TTC)</span>
                <span>{formatCurrency(assignment.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignment.expertise_sheet && (
              <Button variant="outline" className="w-full justify-start">
                <FileDown className="h-4 w-4 mr-2" />
                Télécharger la fiche
              </Button>
            )}
            {assignment.expertise_report && (
              <Button variant="outline" className="w-full justify-start">
                <FileDown className="h-4 w-4 mr-2" />
                Télécharger le rapport
              </Button>
            )}
            <Button variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              Voir les photos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Receipt className="h-4 w-4 mr-2" />
              Gérer les quittances
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Onglets détaillés */}
      <Tabs defaultValue="parties" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="vehicle">Véhicule</TabsTrigger>
          <TabsTrigger value="shocks">Chocs</TabsTrigger>
          <TabsTrigger value="costs">Coûts</TabsTrigger>
          <TabsTrigger value="receipts">Quittances</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
        </TabsList>

        {/* Onglet Parties */}
        <TabsContent value="parties" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p className="font-semibold">{assignment.client.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{assignment.client.email}</p>
                </div>
                {assignment.client.phone_1 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-sm">{assignment.client.phone_1}</p>
                  </div>
                )}
                {assignment.client.address && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                    <p className="text-sm whitespace-pre-line">{assignment.client.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assureur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Assureur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p className="font-semibold">{assignment.insurer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Code</p>
                  <p className="text-sm font-mono">{assignment.insurer.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{assignment.insurer.email}</p>
                </div>
                {assignment.policy_number && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Numéro de police</p>
                    <p className="text-sm">{assignment.policy_number}</p>
                  </div>
                )}
                {assignment.claim_number && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Numéro de sinistre</p>
                    <p className="text-sm">{assignment.claim_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Réparateur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Réparateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p className="font-semibold">{assignment.repairer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Code</p>
                  <p className="text-sm font-mono">{assignment.repairer.code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{assignment.repairer.email}</p>
                </div>
                {assignment.repairer.telephone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-sm">{assignment.repairer.telephone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Véhicule */}
        <TabsContent value="vehicle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Informations du véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plaque d'immatriculation</p>
                  <p className="font-semibold text-lg">{assignment.vehicle.license_plate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Numéro de série</p>
                  <p className="font-semibold">{assignment.vehicle.serial_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kilométrage</p>
                  <p className="font-semibold">{assignment.vehicle.mileage} km</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Puissance fiscale</p>
                  <p className="font-semibold">{assignment.vehicle.fiscal_power} CV</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Énergie</p>
                  <p className="font-semibold">{assignment.vehicle.energy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre de places</p>
                  <p className="font-semibold">{assignment.vehicle.nb_seats}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="font-semibold">{assignment.vehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usage</p>
                  <p className="font-semibold">{assignment.vehicle.usage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Chocs */}
        <TabsContent value="shocks" className="space-y-6">
          {assignment.shocks.map((shock, index) => (
            <Card key={shock.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Choc #{index + 1}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total choc</p>
                      <p className="font-semibold">{formatCurrency(shock.amount)}</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Main d'œuvre (HT)</p>
                      <p className="font-semibold">{formatCurrency(shock.workforce_amount_excluding_tax)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Total (HT)</p>
                      <p className="font-semibold">{formatCurrency(shock.amount_excluding_tax)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Total (TTC)</p>
                      <p className="font-semibold">{formatCurrency(shock.amount)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Détail des travaux</h4>
                    <div className="space-y-2">
                      {shock.workforces.map((workforce) => (
                        <div key={workforce.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {workforce.workforce_type.code === 'paint' && <Palette className="h-4 w-4" />}
                            {workforce.workforce_type.code === 'electricity' && <Zap className="h-4 w-4" />}
                            {workforce.workforce_type.code === 'metalworking' && <Hammer className="h-4 w-4" />}
                            <div>
                              <p className="font-medium">{workforce.workforce_type_label}</p>
                              <p className="text-sm text-muted-foreground">
                                {workforce.nb_hours}h × {formatCurrency(workforce.work_fee)}/h
                                {parseFloat(workforce.discount) > 0 && ` (-${workforce.discount}%)`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(workforce.amount)}</p>
                            <p className="text-sm text-muted-foreground">HT: {formatCurrency(workforce.amount_excluding_tax)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Onglet Coûts */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Autres coûts</CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.other_costs.length > 0 ? (
                <div className="space-y-3">
                  {assignment.other_costs.map((cost) => (
                    <div key={cost.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{cost.other_cost_type_label}</p>
                        <p className="text-sm text-muted-foreground">{cost.other_cost_type.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(cost.amount)}</p>
                        <p className="text-sm text-muted-foreground">HT: {formatCurrency(cost.amount_excluding_tax)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucun autre coût enregistré</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Quittances */}
        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quittances</CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.receipts.length > 0 ? (
                <div className="space-y-3">
                  {assignment.receipts.map((receipt) => (
                    <div key={receipt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{receipt.receipt_type.label}</p>
                        <p className="text-sm text-muted-foreground">{receipt.receipt_type.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(receipt.amount)}</p>
                        <p className="text-sm text-muted-foreground">HT: {formatCurrency(receipt.amount_excluding_tax)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucune quittance enregistrée</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Experts */}
        <TabsContent value="experts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experts assignés</CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.experts.length > 0 ? (
                <div className="space-y-3">
                  {assignment.experts.map((expert) => (
                    <div key={expert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Expert #{expert.id}</p>
                        {expert.date && (
                          <p className="text-sm text-muted-foreground">
                            Date: {formatDate(expert.date)}
                          </p>
                        )}
                        {expert.observation && (
                          <p className="text-sm text-muted-foreground">
                            Observation: {expert.observation}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">Assigné</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Aucun expert assigné</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 