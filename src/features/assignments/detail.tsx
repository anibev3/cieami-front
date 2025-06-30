/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
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
  Settings,
  Users,
  Zap as Lightning,
  Calculator,
  FileCheck,
  Camera,
  Mail,
  Phone,
  AlertTriangle,
  Shield
} from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { Search } from '@/components/search'
import { CountdownAlert } from '@/components/countdown-alert'
import { AssignmentPhotos } from './detail/components/AssignmentPhotos'
import { PdfViewer } from '@/components/ui/PdfViewer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

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
    brand?: {
      id: number
      code: string
      label: string
      description: string
    }
    vehicle_model?: {
      id: number
      code: string
      label: string
      description: string
    }
    color?: {
      id: number
      code: string
      label: string
      description: string
    }
    bodywork?: {
      id: number
      code: string
      label: string
      description: string
      status?: {
        id: number
        code: string
        label: string
      }
    }
    first_entry_into_circulation_date?: string
    technical_visit_date?: string
    created_at: string
    updated_at: string
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
    shock_point: {
      id: number
      code: string
      label: string
      description: string
    }
    shock_works: Array<{
      id: number
      disassembly: boolean
      replacement: boolean
      repair: boolean
      paint: boolean
      control: boolean
      comment: string
      obsolescence_rate: string
      obsolescence_amount_excluding_tax: string
      obsolescence_amount_tax: string
      obsolescence_amount: string
      recovery_rate: string
      recovery_amount_excluding_tax: string
      recovery_amount_tax: string
      recovery_amount: string
      new_amount_excluding_tax: string
      new_amount_tax: string
      new_amount: string
      amount_excluding_tax: string
      amount_tax: string
      amount: string
      supply: {
        id: number
        label: string
        description: string
      }
    }>
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
  edition_status: string | null
  edition_time_expire_at: string | null
  edition_per_cent: number | null
  recovery_status: string | null
  recovery_time_expire_at: string | null
  recovery_per_cent: number | null
  validated_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  expert_signature: string | null
  repairer_signature: string | null
  customer_signature: string | null
  qr_codes: string | null
  emails: Array<{email: string}> | null
}

export default function AssignmentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('parties')
  const [pdfViewer, setPdfViewer] = useState<{ open: boolean, url: string, title?: string }>({ open: false, url: '', title: '' })
  const [validateModalOpen, setValidateModalOpen] = useState(false)
  const [validating, setValidating] = useState(false)

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

  const formatCurrency = (amount: string | null | undefined) => {
    const value = amount === null || amount === undefined ? 0 : parseFloat(amount)
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(isNaN(value) ? 0 : value)
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

  const sidebarItems = [
    {
      id: 'parties',
      label: 'Parties',
      icon: Users,
      description: 'Client, assureur et réparateur'
    },
    {
      id: 'vehicle',
      label: 'Véhicule',
      icon: Car,
      description: 'Informations du véhicule'
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: Camera,
      description: 'Photos de l\'assignation'
    },
    {
      id: 'shocks',
      label: 'Chocs',
      icon: Lightning,
      description: 'Détail des chocs et travaux'
    },
    {
      id: 'costs',
      label: 'Coûts',
      icon: Calculator,
      description: 'Autres coûts associés'
    },
    {
      id: 'receipts',
      label: 'Quittances',
      icon: Receipt,
      description: 'Honoraires et quittances'
    },
    {
      id: 'experts',
      label: 'Experts',
      icon: FileCheck,
      description: 'Experts assignés'
    }
  ]

  const renderSection = () => {
    if (!assignment) return null
    
    switch (activeSection) {
      case 'parties':
        return (
          <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Informations générales */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xs">
                  <FileText className="h-4 w-4" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Référence</p>
                    <p className="text-sm font-semibold">{assignment.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Date de réception</p>
                    <p className="text-sm font-semibold">{formatDate(assignment.received_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Date d'expertise</p>
                    <p className="text-sm font-semibold">{formatDate(assignment.expertise_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Lieu d'expertise</p>
                    <p className="text-sm font-semibold">{assignment.expertise_place || 'Non renseigné'}</p>
                  </div>
                </div>
                {assignment.circumstance && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Circonstances</p>
                    <p className="text-xs">{assignment.circumstance}</p>
                  </div>
                )}
                {assignment.damage_declared && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Dégâts déclarés</p>
                    <p className="text-xs">{assignment.damage_declared}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Montants */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xs">
                  <DollarSign className="h-4 w-4" />
                  Montants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Chocs (HT)</span>
                    <span className="text-sm font-semibold">{formatCurrency(assignment.shock_amount_excluding_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Chocs (TVA)</span>
                    <span className="text-sm font-semibold">{formatCurrency(assignment.shock_amount_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Autres coûts (HT)</span>
                    <span className="text-sm font-semibold">{formatCurrency(assignment.other_cost_amount_excluding_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Autres coûts (TVA)</span>
                    <span className="text-sm font-semibold">{formatCurrency(assignment.other_cost_amount_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Honoraires (HT)</span>
                    <span className="text-sm font-semibold">{formatCurrency(assignment.receipt_amount_excluding_tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Honoraires (TVA)</span>
                    <span className="text-sm font-semibold">{formatCurrency(assignment.receipt_amount_tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total (HT)</span>
                    <span>{formatCurrency(assignment.total_amount_excluding_tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total (TVA)</span>
                    <span>{formatCurrency(assignment.total_amount_tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary">
                    <span>Total (TTC)</span>
                    <span>{formatCurrency(assignment.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignment.expertise_sheet && (
                  <Button variant="outline" className="w-full justify-start text-xs h-8" onClick={() => setPdfViewer({ open: true, url: assignment.expertise_sheet!, title: 'Fiche d\'expertise' })}>
                    <FileDown className="h-3 w-3 mr-2" />
                    Voir la fiche
                  </Button>
                )}
                {assignment.expertise_report && (
                  <Button variant="outline" className="w-full justify-start text-xs h-8" onClick={() => setPdfViewer({ open: true, url: assignment.expertise_report!, title: 'Rapport d\'expertise' })}>
                    <FileDown className="h-3 w-3 mr-2" />
                    Voir le rapport
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start text-xs h-8">
                  <Eye className="h-3 w-3 mr-2" />
                  Voir les photos
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-8">
                  <Receipt className="h-3 w-3 mr-2" />
                  Gérer les quittances
                </Button>
              </CardContent>
            </Card>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Client */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations principales */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Informations personnelles</h4>
                        <Badge variant="outline" className="text-xs">ID: {assignment.client.id}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.client.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.client.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                      <div className="space-y-2">
                        {assignment.client.phone_1 && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone principal</p>
                              <p className="text-sm font-semibold">{assignment.client.phone_1}</p>
                            </div>
                          </div>
                        )}
                        {assignment.client.phone_2 && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone secondaire</p>
                              <p className="text-sm font-semibold">{assignment.client.phone_2}</p>
                            </div>
                          </div>
                        )}
                        {assignment.client.address && (
                          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                              <p className="text-xs whitespace-pre-line">{assignment.client.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assureur */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    Assureur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations principales */}
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Informations société</h4>
                        <Badge variant="outline" className="text-xs">{assignment.insurer.code}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom de la société</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.insurer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.insurer.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                      <div className="space-y-2">
                        {assignment.insurer.telephone && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                              <p className="text-sm font-semibold">{assignment.insurer.telephone}</p>
                            </div>
                          </div>
                        )}
                        {assignment.insurer.address && (
                          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                              <p className="text-xs whitespace-pre-line">{assignment.insurer.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations d'assurance */}
                    {(assignment.policy_number || assignment.claim_number) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary border-b pb-1">Informations d'assurance</h4>
                        <div className="space-y-2">
                          {assignment.policy_number && (
                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Numéro de police</p>
                                <p className="text-sm font-semibold font-mono">{assignment.policy_number}</p>
                              </div>
                            </div>
                          )}
                          {assignment.claim_number && (
                            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                              <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Numéro de sinistre</p>
                                <p className="text-sm font-semibold font-mono">{assignment.claim_number}</p>
                              </div>
                            </div>
                          )}
                          {(assignment.claim_starts_at || assignment.claim_ends_at) && (
                            <div className="grid grid-cols-2 gap-2">
                              {assignment.claim_starts_at && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Début sinistre</p>
                                  <p className="text-xs font-semibold">{formatDate(assignment.claim_starts_at)}</p>
                                </div>
                              )}
                              {assignment.claim_ends_at && (
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Fin sinistre</p>
                                  <p className="text-xs font-semibold">{formatDate(assignment.claim_ends_at)}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Réparateur */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4" />
                    Réparateur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations principales */}
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Informations garage</h4>
                        <Badge variant="outline" className="text-xs">{assignment.repairer.code}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom du garage</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.repairer.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.repairer.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                      <div className="space-y-2">
                        {assignment.repairer.telephone && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                              <p className="text-sm font-semibold">{assignment.repairer.telephone}</p>
                            </div>
                          </div>
                        )}
                        {assignment.repairer.address && (
                          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                              <p className="text-xs whitespace-pre-line">{assignment.repairer.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations d'expertise */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Informations d'expertise</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Type d'expertise</p>
                            <Badge variant="secondary" className="text-xs">{assignment.expertise_type.label}</Badge>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Type d'assignation</p>
                            <Badge variant="secondary" className="text-xs">{assignment.assignment_type.label}</Badge>
                          </div>
                        </div>
                        {assignment.administrator && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Administrateur</p>
                              <p className="text-sm font-semibold">{assignment.administrator}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'vehicle':
        return (
          <div className="space-y-4">
            {/* Informations principales du véhicule */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4" />
                  Informations du véhicule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Identité du véhicule */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Identité</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Plaque d'immatriculation</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.license_plate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Numéro de série</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded font-mono">{assignment.vehicle.serial_number}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Kilométrage</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.mileage} km</p>
                      </div>
                    </div>
                  </div>

                  {/* Caractéristiques techniques */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Caractéristiques</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Puissance fiscale</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.fiscal_power} CV</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Énergie</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.energy}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Nombre de places</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.nb_seats} places</p>
                      </div>
                    </div>
                  </div>

                  {/* Classification */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Classification</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Type</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.type}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Usage</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.usage}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Options</p>
                        <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.option}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marque, modèle et caractéristiques visuelles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Marque et modèle */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    Marque et modèle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Marque</p>
                        <p className="text-sm font-semibold">{assignment.vehicle.brand?.label || 'Non renseigné'}</p>
                        <p className="text-xs text-muted-foreground">{assignment.vehicle.brand?.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.brand?.code}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Modèle</p>
                        <p className="text-sm font-semibold">{assignment.vehicle.vehicle_model?.label || 'Non renseigné'}</p>
                        <p className="text-xs text-muted-foreground">{assignment.vehicle.vehicle_model?.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.vehicle_model?.code}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Couleur et carrosserie */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4" />
                    Apparence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Couleur</p>
                        <p className="text-sm font-semibold">{assignment.vehicle.color?.label || 'Non renseigné'}</p>
                        <p className="text-xs text-muted-foreground">{assignment.vehicle.color?.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.color?.code}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Carrosserie</p>
                        <p className="text-sm font-semibold">{assignment.vehicle.bodywork?.label || 'Non renseigné'}</p>
                        <p className="text-xs text-muted-foreground">{assignment.vehicle.bodywork?.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.bodywork?.code}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informations complémentaires */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  Informations complémentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Date de première mise en circulation</p>
                      <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                        {assignment.vehicle.first_entry_into_circulation_date 
                          ? formatDate(assignment.vehicle.first_entry_into_circulation_date)
                          : 'Non renseigné'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Date de visite technique</p>
                      <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                        {assignment.vehicle.technical_visit_date 
                          ? formatDate(assignment.vehicle.technical_visit_date)
                          : 'Non renseigné'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Statut de la carrosserie</p>
                      <Badge variant={assignment.vehicle.bodywork?.status?.code === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {assignment.vehicle.bodywork?.status?.label || 'Non renseigné'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Date de création</p>
                      <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                        {formatDate(assignment.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'photos':
        return (
          <AssignmentPhotos 
            assignmentId={assignment.id.toString()} 
            assignmentReference={assignment.reference} 
          />
        )

      case 'shocks':
        return (
          <div className="space-y-4">
            {assignment.shocks.map((shock, index) => (
              <Card key={shock.id} className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>Choc #{index + 1} - {shock.shock_point.label}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total choc (TTC)</p>
                        <p className="text-sm font-semibold">{formatCurrency(shock.amount)}</p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Résumé des montants du choc */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="font-medium text-muted-foreground">Main d'œuvre (HT)</p>
                        <p className="text-sm font-semibold">{formatCurrency(shock.workforce_amount_excluding_tax)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Main d'œuvre (TVA)</p>
                        <p className="text-sm font-semibold">{formatCurrency(shock.workforce_amount_tax)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Main d'œuvre (TTC)</p>
                        <p className="text-sm font-semibold">{formatCurrency(shock.workforce_amount)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">Total (TTC)</p>
                        <p className="text-sm font-semibold">{formatCurrency(shock.amount)}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Détail des travaux (shock_works) */}
                    {shock.shock_works && shock.shock_works.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-sm">Détail des fournitures</h4>
                        <div className="space-y-3">
                          {shock.shock_works.map((work) => (
                            <div key={work.id} className="border rounded-lg p-3 bg-muted/30">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium text-sm">{work.supply.label}</p>
                                  <p className="text-xs text-muted-foreground">{work.supply.description}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {work.replacement ? 'Remplacement' : work.repair ? 'Réparation' : 'Démontage'}
                                </Badge>
                              </div>
                              
                              {/* Types de travaux */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {work.disassembly && <Badge variant="secondary" className="text-xs">Démontage</Badge>}
                                {work.replacement && <Badge variant="secondary" className="text-xs">Remplacement</Badge>}
                                {work.repair && <Badge variant="secondary" className="text-xs">Réparation</Badge>}
                                {work.paint && <Badge variant="secondary" className="text-xs">Peinture</Badge>}
                                {work.control && <Badge variant="secondary" className="text-xs">Contrôle</Badge>}
                              </div>

                              {/* Montants détaillés */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <p className="font-medium text-muted-foreground">Vetusté (HT)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.obsolescence_amount_excluding_tax)}</p>
                                  <p className="text-xs text-muted-foreground">Taux: {work.obsolescence_rate}%</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Vetusté (TVA)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.obsolescence_amount_tax)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Vetusté (TTC)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.obsolescence_amount)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Récupération (HT)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.recovery_amount_excluding_tax)}</p>
                                  <p className="text-xs text-muted-foreground">Taux: {work.recovery_rate}%</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Récupération (TVA)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.recovery_amount_tax)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Récupération (TTC)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.recovery_amount)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Neuf (HT)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.new_amount_excluding_tax)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Neuf (TVA)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.new_amount_tax)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Neuf (TTC)</p>
                                  <p className="text-sm font-semibold text-primary">{formatCurrency(work.new_amount)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Total (HT)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.amount_excluding_tax)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Total (TVA)</p>
                                  <p className="text-sm font-semibold">{formatCurrency(work.amount_tax)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-muted-foreground">Total (TTC)</p>
                                  <p className="text-sm font-semibold text-primary">{formatCurrency(work.amount)}</p>
                                </div>
                              </div>

                              {/* Commentaire */}
                              {work.comment && (
                                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                                  <p className="font-medium text-blue-700 dark:text-blue-300">Commentaire:</p>
                                  <p className="text-blue-600 dark:text-blue-400">{work.comment}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {/* Détail des travaux (workforces) */}
                    {shock.workforces && shock.workforces.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Détail des travaux</h4>
                        <div className="space-y-2">
                          {shock.workforces.map((workforce) => (
                            <div key={workforce.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {workforce.workforce_type.code === 'paint' && <Palette className="h-3 w-3" />}
                                {workforce.workforce_type.code === 'electricity' && <Zap className="h-3 w-3" />}
                                {workforce.workforce_type.code === 'metalworking' && <Hammer className="h-3 w-3" />}
                                {workforce.workforce_type.code === 'saddlery' && <Wrench className="h-3 w-3" />}
                                <div>
                                  <p className="font-medium text-xs">{workforce.workforce_type.label}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {workforce.nb_hours}h × {formatCurrency(workforce.work_fee)}/h
                                    {parseFloat(workforce.discount) > 0 && ` (-${workforce.discount}%)`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">{formatCurrency(workforce.amount)}</p>
                                <p className="text-xs text-muted-foreground">HT: {formatCurrency(workforce.amount_excluding_tax)} | TVA: {formatCurrency(workforce.amount_tax)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Résumé final du choc */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-3 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">Résumé du choc #{index + 1}</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="font-medium text-muted-foreground">Total fournitures</p>
                          <p className="text-sm font-semibold">{formatCurrency(shock.amount_excluding_tax)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Total main d'œuvre</p>
                          <p className="text-sm font-semibold">{formatCurrency(shock.workforce_amount)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">TVA</p>
                          <p className="text-sm font-semibold">{formatCurrency(shock.amount_tax)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Total TTC</p>
                          <p className="text-sm font-semibold text-primary">{formatCurrency(shock.amount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 'costs':
        return (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs">Autres coûts</CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.other_costs.length > 0 ? (
                  <div className="space-y-2">
                    {assignment.other_costs.map((cost) => (
                      <div key={cost.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-xs">{cost.other_cost_type_label}</p>
                          <p className="text-xs text-muted-foreground">{cost.other_cost_type.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(cost.amount)}</p>
                          <p className="text-xs text-muted-foreground">HT: {formatCurrency(cost.amount_excluding_tax)} | TVA: {formatCurrency(cost.amount_tax)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6 text-sm">Aucun autre coût enregistré</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 'receipts':
        return (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs">Quittances</CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.receipts.length > 0 ? (
                  <div className="space-y-2">
                    {assignment.receipts.map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-xs">{receipt.receipt_type.label}</p>
                          <p className="text-xs text-muted-foreground">{receipt.receipt_type.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(receipt.amount)}</p>
                          <p className="text-xs text-muted-foreground">HT: {formatCurrency(receipt.amount_excluding_tax)} | TVA: {formatCurrency(receipt.amount_tax)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6 text-sm">Aucune quittance enregistrée</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 'experts':
        return (
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs">Experts assignés</CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.experts.length > 0 ? (
                  <div className="space-y-2">
                    {assignment.experts.map((expert) => (
                      <div key={expert.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-xs">Expert #{expert.id}</p>
                          {expert.date && (
                            <p className="text-xs text-muted-foreground">
                              Date: {formatDate(expert.date)}
                            </p>
                          )}
                          {expert.observation && (
                            <p className="text-xs text-muted-foreground">
                              Observation: {expert.observation}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">Assigné</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6 text-sm">Aucun expert assigné</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const handleValidateAssignment = async () => {
    if (!assignment) return
    
    setValidating(true)
    try {
      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/validate/${assignment.id}`)
      toast.success('Dossier validé avec succès')
      setValidateModalOpen(false)
      
      // Mettre à jour le statut localement
      setAssignment(prev => prev ? {
        ...prev,
        status: {
          ...prev.status,
          code: 'validated',
          label: 'Validé'
        },
        validated_at: new Date().toISOString()
      } : null)
    } catch (error) {
      console.error('Erreur lors de la validation:', error)
      toast.error('Erreur lors de la validation du dossier')
    } finally {
      setValidating(false)
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
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="w-full space-y-6">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate({ to: '/assignments' })}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Dossier {assignment.reference}</h1>
                <p className="text-xs text-muted-foreground">Détails complets du dossier d'expertise</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(assignment.status.code)}>
                {assignment.status.label}
              </Badge>
              {assignment.status.code === 'edited' && (
                <Button 
                  onClick={() => setValidateModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Valider le dossier
                </Button>
              )}
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

          {/* Layout avec sidebar et contenu */}
          <div className="flex gap-4">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-0.5">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/50 text-xs",
                            activeSection === item.id
                              ? "bg-primary/10 text-primary border-r-2 border-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <div className="flex-1">
                            <p className="font-medium text-xs">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="flex-1">
              {/* Suivi & Statuts */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 shadow-none">
                <CardContent className="flex flex-wrap gap-6 items-center">
                  {/* Statut d'édition */}
                  {assignment.edition_status && (
                    <div className="flex flex-col items-center">
                      <Badge variant={assignment.edition_status === 'in_progress' ? 'default' : 'secondary'} className="mb-1">
                        Délai de redaction: {assignment.edition_status === 'in_progress' ? 'En cours' : assignment.edition_status}
                      </Badge>
                      {assignment.edition_time_expire_at && (
                        <span className="text-xs text-blue-700 font-medium">
                          Expire le {formatDate(assignment.edition_time_expire_at)}
                        </span>
                      )}
                      {typeof assignment.edition_per_cent === 'number' && (
                        <span className="text-xs text-blue-900 font-semibold">
                          Progression : {assignment.edition_per_cent}%
                        </span>
                      )}
                    </div>
                  )}
                  {/* Statut de récupération */}
                  {assignment.recovery_status && (
                    <div className="flex flex-col items-center">
                      <Badge variant={assignment.recovery_status === 'in_progress' ? 'default' : 'secondary'} className="mb-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                        Délai de recouvrement: {assignment.recovery_status === 'in_progress' ? 'En cours' : assignment.recovery_status}
                      </Badge>
                      {assignment.recovery_time_expire_at && (
                        <span className="text-xs text-yellow-700 font-medium">
                          Expire le {formatDate(assignment.recovery_time_expire_at)}
                        </span>
                      )}
                      {typeof assignment.recovery_per_cent === 'number' && (
                        <span className="text-xs text-yellow-900 font-semibold">
                          Progression : {assignment.recovery_per_cent}%
                        </span>
                      )}
                    </div>
                  )}
                  {/* Validation */}
                  {assignment.validated_at && (
                    <div className="flex flex-col items-center">
                      <Badge variant="success" className="mb-1 bg-green-100 text-green-800 border-green-300">
                        Validé
                      </Badge>
                      <span className="text-xs text-green-700 font-medium">
                        {formatDate(assignment.validated_at)}
                      </span>
                    </div>
                  )}
                  {/* Clôture, annulation, etc. */}
                  {assignment.closed_at && (
                    <div className="flex flex-col items-center">
                      <Badge variant="secondary" className="mb-1 bg-gray-200 text-gray-800 border-gray-300">
                        Clôturé
                      </Badge>
                      <span className="text-xs text-gray-700 font-medium">
                        {formatDate(assignment.closed_at)}
                      </span>
                    </div>
                  )}
                  {assignment.cancelled_at && (
                    <div className="flex flex-col items-center">
                      <Badge variant="destructive" className="mb-1 bg-red-100 text-red-800 border-red-300">
                        Annulé
                      </Badge>
                      <span className="text-xs text-red-700 font-medium">
                        {formatDate(assignment.cancelled_at)}
                      </span>
                    </div>
                  )}
                  {/* Signatures */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">Signatures</span>
                    <div className="flex gap-2">
                      {assignment.expert_signature && (
                        <a href={assignment.expert_signature} target="_blank" rel="noopener noreferrer" title="Signature expert">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Expert</Badge>
                        </a>
                      )}
                      {assignment.repairer_signature && (
                        <a href={assignment.repairer_signature} target="_blank" rel="noopener noreferrer" title="Signature réparateur">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Réparateur</Badge>
                        </a>
                      )}
                      {assignment.customer_signature && (
                        <a href={assignment.customer_signature} target="_blank" rel="noopener noreferrer" title="Signature client">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Client</Badge>
                        </a>
                      )}
                    </div>
                  </div>
                  {/* QR code et emails */}
                  {assignment.qr_codes && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">QR Code</span>
                      <a href={assignment.qr_codes} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">Voir</Badge>
                      </a>
                    </div>
                  )}
                  {assignment.emails && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">Emails</span>
                      <span className="text-xs text-blue-900 font-semibold">{assignment.emails.map(email => email.email).join(', ')}</span>
                    </div>
                  )}
                  {/* Décompte dynamique (alerte si proche de l'expiration) */}
                  <div>
                    {assignment.edition_time_expire_at && (
                      <CountdownAlert label="Redaction" expireAt={assignment.edition_time_expire_at} />
                    )}
                    <div className='mt-2'></div>
                    {assignment.recovery_time_expire_at && (
                      <CountdownAlert label="Recouvrement" expireAt={assignment.recovery_time_expire_at} />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="shadow-none mt-4">
                <ScrollArea className="h-[600px]">
                  {renderSection()}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </Main>

      {/* Modal de validation */}
      <Dialog open={validateModalOpen} onOpenChange={setValidateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Valider le dossier
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir valider le dossier <strong>{assignment?.reference}</strong> ?
              <br />
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidateModalOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleValidateAssignment} 
              disabled={validating}
              className="bg-green-600 hover:bg-green-700"
            >
              {validating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validation...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Valider le dossier
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      <PdfViewer open={pdfViewer.open} onOpenChange={open => setPdfViewer(v => ({ ...v, open }))} url={pdfViewer.url} title={pdfViewer.title} />
    </>
  )
} 