/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Shield,
  Check,
  Trash2,
  Menu,
  Navigation
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { useAssignmentsStore } from '@/stores/assignments'
import { 
  ShockDetailTable, 
} from './components'
import { useACL } from '@/hooks/useACL'
import { UserRole } from '@/types/auth'
import { AssignmentStatusEnum } from '@/types/global-types'
import assignmentValidationService from '@/services/assignmentValidationService'
import { useUser } from '@/stores/authStore'

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
  shock_amount_excluding_tax: string | null
  shock_amount_tax: string | null
  shock_amount: string | null
  other_cost_amount_excluding_tax: string | null
  other_cost_amount_tax: string | null
  other_cost_amount: string | null
  receipt_amount_excluding_tax: string | null
  receipt_amount_tax: string | null
  receipt_amount: string | null
  total_amount_excluding_tax: string | null
  total_amount_tax: string | null
  total_amount: string | null
  printed_at: string | null
  expertise_sheet: string | null
  expertise_report: string | null
  created_at: string
  updated_at: string
  // Nouvelles propriétés de l'API
  insurer_id: number | null
  repairer_id: number | null
  emails: Array<{email: string}> | null
  qr_codes: string | null
  document_transmitted: Array<{
    id: number
    code: string
    label: string
  }>
  technical_conclusion: {
    id: number
    code: string
    label: string
    description: string
  } | null
  general_state: {
    id: number
    code: string
    label: string
    description: string
    status: {
      id: number
      code: string
      label: string
      description: string
    }
    created_by: {
      id: number
      hash_id: string
      email: string
      username: string
      name: string
      last_name: string
      first_name: string
      telephone: string
      photo_url: string
      pending_verification: boolean
      signature: string | null
      created_at: string
      updated_at: string
    }
    updated_by: {
      id: number
      hash_id: string
      email: string
      username: string
      name: string
      last_name: string
      first_name: string
      telephone: string
      photo_url: string
      pending_verification: boolean
      signature: string | null
      created_at: string
      updated_at: string
    }
    deleted_by: {
      id: number
      hash_id: string
      email: string
      username: string
      name: string
      last_name: string
      first_name: string
      telephone: string
      photo_url: string
      pending_verification: boolean
      signature: string | null
      created_at: string
      updated_at: string
    } | null
    created_at: string
    updated_at: string
  } | null
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
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  vehicle: {
    id: number
    license_plate: string
    type: string
    option: string
    mileage: string
    serial_number: string
    first_entry_into_circulation_date?: string
    technical_visit_date?: string
    fiscal_power: number
    nb_seats: number
    new_market_value?: string
    brand?: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    vehicle_model?: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    color?: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
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
        description: string
        deleted_at: string | null
        created_at: string
        updated_at: string
      }
      created_at: string
      updated_at: string
    }
    deleted_at: string | null
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
    created_at: string
    updated_at: string
  }
  repairer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
    created_at: string
    updated_at: string
  }
  broker: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
    created_at: string
    updated_at: string
  } | null
  additional_insurer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
    created_at: string
    updated_at: string
  } | null
  assignment_type: {
    id: number
    code: string
    label: string
    description: string
    status: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    created_at: string
    updated_at: string
  }
  expertise_type: {
    id: number
    code: string
    label: string
    description: string
    status: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    created_at: string
    updated_at: string
  }
  experts: Array<{
    id: number
    date: string | null
    observation: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
  }>
  shocks: Array<{
    id: number
    obsolescence_amount_excluding_tax: string | null
    obsolescence_amount_tax: string | null
    obsolescence_amount: string | null
    recovery_amount_excluding_tax: string | null
    recovery_amount_tax: string | null
    recovery_amount: string | null
    new_amount_excluding_tax: string | null
    new_amount_tax: string | null
    new_amount: string | null
    workforce_amount_excluding_tax: string | null
    workforce_amount_tax: string | null
    workforce_amount: string | null
    amount_excluding_tax: string | null
    amount_tax: string | null
    amount: string | null
    shock_point: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
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
      recovery_amoun: string
      recovery_amount_excluding_tax: string
      recovery_amount_tax: string
      recovery_amount: string
      new_amount_excluding_tax: string
      new_amount_tax: string
      new_amount: string
      amount_excluding_tax: string | null
      amount_tax: string | null
      amount: string | null
      supply: {
        id: number
        label: string
        description: string
        deleted_at: string | null
        created_at: string
        updated_at: string
      }
      deleted_at: string | null
      created_at: string
      updated_at: string
    }>
    workforces: Array<{
      id: number
      nb_hours: string
      work_fee: string
      discount: string
      amount_excluding_tax: string
      amount_tax: string
      amount: string
      with_tax: number | null
      workforce_type: {
        id: number
        code: string
        label: string
        description: string
        deleted_at: string | null
        created_at: string
        updated_at: string
      }
      deleted_at: string | null
      created_at: string
      updated_at: string
    }>
    deleted_at: string | null
    created_at: string
    updated_at: string
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
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    deleted_at: string | null
    created_at: string
    updated_at: string
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
      created_at: string
      updated_at: string
    }
    created_at: string
    updated_at: string
  }>
  // Informations sur les utilisateurs
  created_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  updated_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  deleted_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  } | null
  realized_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  edited_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  validated_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  }
  closed_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  } | null
  cancelled_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  } | null
  work_sheet_established_by: {
    id: number
    hash_id: string
    email: string
    username: string
    name: string
    last_name: string
    first_name: string
    telephone: string
    photo_url: string
    pending_verification: boolean
    signature: string | null
    created_at: string
    updated_at: string
  } | null
  // Dates importantes
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string | null
  validated_at: string | null
  realized_at: string | null
  work_sheet_established_at: string | null
  edition_time_expire_at: string | null
  edition_status: string | null
  edition_per_cent: number | null
  recovery_time_expire_at: string | null
  recovery_status: string | null
  recovery_per_cent: number | null
  expert_signature: string | null
  repairer_signature: string | null
  customer_signature: string | null
  work_sheet: string | null
}

export default function AssignmentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { section?: string }
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Initialiser activeSection avec le paramètre d'URL ou 'parties' par défaut
  const [activeSection, setActiveSection] = useState(() => {
    const validSections = ['parties', 'vehicle', 'photos', 'shocks', 'costs', 'receipts', 'experts', 'documents', 'tracking']
    return search.section && validSections.includes(search.section) ? search.section : 'parties'
  })
  const [pdfViewer, setPdfViewer] = useState<{ open: boolean, url: string, title?: string }>({ open: false, url: '', title: '' })
  const [validateModalOpen, setValidateModalOpen] = useState(false)
  const [unvalidateModalOpen, setUnvalidateModalOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [unvalidating, setUnvalidating] = useState(false)
  const [validatingEdition, setValidatingEdition] = useState(false)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const { generateReport, loading: loadingGenerate, currentAssignment: storeAssignment } = useAssignmentsStore()
  const { isCEO, isValidator, isExpertManager, hasAnyRole, isExpert, isInsurerAdmin, isInsurerStandardUser, isRepairerAdmin, isRepairerStandardUser, isExpertAdmin, isMainOrganization, isInsurerEntity, isRepairerEntity } = useACL()
  const currentUser = useUser()
  
  // Vérifier le type d'entité de l'utilisateur connecté
  const currentUserEntityTypeCode = currentUser?.entity?.entity_type?.code
  
  // Utilisateurs en lecture seule (chambre ou assureur) : aucun bouton, juste les informations
  const isReadOnlyUser = isMainOrganization() || isInsurerEntity() || 
    currentUserEntityTypeCode === 'main_organization' || currentUserEntityTypeCode === 'insurer'
  
  // Utilisateurs réparateurs : uniquement le bouton "Préparation de devis"
  const isRepairerUser = isRepairerEntity() || currentUserEntityTypeCode === 'repairer'


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

  // Synchroniser activeSection avec les changements d'URL
  useEffect(() => {
    const validSections = ['parties', 'vehicle', 'photos', 'shocks', 'costs', 'receipts', 'experts', 'documents', 'tracking']
    if (search.section && validSections.includes(search.section) && search.section !== activeSection) {
      setActiveSection(search.section)
    }
  }, [search.section, activeSection])

  // Synchroniser l'état local avec le store quand les données sont mises à jour
  useEffect(() => {
    if (storeAssignment && storeAssignment.id === id) {
      // Convertir les types pour assurer la compatibilité
      const assignmentDetail = storeAssignment as any as AssignmentDetail
      setAssignment(assignmentDetail)
    }
  }, [storeAssignment, id])

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

  // Fonction pour changer de section et mettre à jour l'URL
  const changeActiveSection = (sectionId: string) => {
    setActiveSection(sectionId)
    // Mettre à jour l'URL avec le paramètre section
    const url = new URL(window.location.href)
    url.searchParams.set('section', sectionId)
    window.history.pushState({}, '', url.toString())
  }

  const sidebarItems = [
    {
      id: 'parties',
      label: 'Parties',
      icon: Users,
      description: 'Client, assureur, réparateur et courtier'
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
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Documents transmis et conclusions'
    },
    {
      id: 'tracking',
      label: 'Suivi',
      icon: Clock,
      description: 'Historique et suivi du dossier'
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
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">ID Assureur</p>
                    <p className="text-sm font-semibold">{assignment.insurer_id || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">ID Réparateur</p>
                    <p className="text-sm font-semibold">{assignment.repairer_id || 'Non renseigné'}</p>
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
                {/* Informations sur les emails et QR codes */}
                {assignment.emails && assignment.emails.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Emails associés</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assignment.emails.map((email, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {email.email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {assignment.qr_codes && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">QR Codes</p>
                    <a href={assignment.qr_codes} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Voir les QR codes
                    </a>
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
                {assignment.work_sheet && (
                  <Button variant="outline" className="w-full justify-start text-xs h-8" onClick={() => setPdfViewer({ open: true, url: assignment.work_sheet!, title: 'Fiche des travaux' })}>
                    <FileDown className="h-3 w-3 mr-2" />
                    Voir la fiche des travaux
                  </Button>
                )}
                {assignment.expertise_sheet && (
                  <Button variant="outline" className="w-full justify-start text-xs h-8" onClick={() => setPdfViewer({ open: true, url: assignment.expertise_sheet!, title: 'Fiche d\'expertise' })}>
                    <FileDown className="h-3 w-3 mr-2" />
                    Voir la fiche d'expertise
                  </Button>
                )}
                  {/* expertise_report */}
                  {assignment.expertise_report && (
                    <Button variant="outline" className="w-full justify-start text-xs h-8" onClick={() => setPdfViewer({ open: true, url: assignment.expertise_report!, title: 'Rapport d\'expertise' })}>
                      <FileDown className="h-3 w-3 mr-2" />
                      Voir le rapport d'expertise
                    </Button>
                  )}

                {/* <Button variant="outline" className="w-full justify-start text-xs h-8">
                  <Eye className="h-3 w-3 mr-2" />
                  Voir les photos
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-8">
                  <Receipt className="h-3 w-3 mr-2" />
                  Gérer les quittances
                </Button> */}
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
                  {assignment.client ? (
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

                      {/* Informations système */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary border-b pb-1">Informations système</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="font-medium text-muted-foreground">Créé le</p>
                            <p className="font-semibold">{formatDate(assignment.client.created_at)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Modifié le</p>
                            <p className="font-semibold">{formatDate(assignment.client.updated_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <User className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Aucun client assigné</p>
                      <p className="text-xs text-muted-foreground">Le client n'a pas été sélectionné pour ce dossier</p>
                    </div>
                  )}
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
                  {assignment.insurer ? (
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
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Building className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Aucun assureur assigné</p>
                      <p className="text-xs text-muted-foreground">L'assureur n'a pas été sélectionné pour ce dossier</p>
                    </div>
                  )}
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
                  {assignment.repairer ? (
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
                            <Badge variant="secondary" className="text-xs">{assignment.expertise_type?.label || 'Non renseigné'}</Badge>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Type de mission</p>
                            <Badge variant="secondary" className="text-xs">{assignment.assignment_type?.label || 'Non renseigné'}</Badge>
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

                    {/* Informations système */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Informations système</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium text-muted-foreground">Créé le</p>
                          <p className="font-semibold">{formatDate(assignment.repairer.created_at)}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Modifié le</p>
                          <p className="font-semibold">{formatDate(assignment.repairer.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Wrench className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Aucun réparateur assigné</p>
                      <p className="text-xs text-muted-foreground">Le réparateur n'a pas été sélectionné pour ce dossier</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Courtier / Assureur supplémentaire */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" />
                    {assignment.additional_insurer ? 'Assureur supplémentaire' : 'Courtier'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(assignment.additional_insurer || assignment.broker) ? (
                  <div className="space-y-4">
                    {/* Informations principales */}
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">
                          {assignment.additional_insurer ? 'Informations assureur supplémentaire' : 'Informations courtier'}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {assignment.additional_insurer?.code || assignment.broker?.code}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            {assignment.additional_insurer ? 'Nom de l\'assureur' : 'Nom du courtier'}
                          </p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">
                            {assignment.additional_insurer?.name || assignment.broker?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Adresse email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">
                              {assignment.additional_insurer?.email || assignment.broker?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Coordonnées</h4>
                      <div className="space-y-2">
                        {(assignment.additional_insurer?.telephone || assignment.broker?.telephone) && (
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                              <p className="text-sm font-semibold">
                                {assignment.additional_insurer?.telephone || assignment.broker?.telephone}
                              </p>
                            </div>
                          </div>
                        )}
                        {(assignment.additional_insurer?.address || assignment.broker?.address) && (
                          <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg">
                            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Adresse</p>
                              <p className="text-xs whitespace-pre-line">
                                {assignment.additional_insurer?.address || assignment.broker?.address}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informations système */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary border-b pb-1">Informations système</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium text-muted-foreground">Créé le</p>
                          <p className="font-semibold">
                            {formatDate(assignment.additional_insurer?.created_at || assignment.broker?.created_at || null)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Modifié le</p>
                          <p className="font-semibold">
                            {formatDate(assignment.additional_insurer?.updated_at || assignment.broker?.updated_at || null)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Building className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Aucun courtier ou assureur supplémentaire assigné</p>
                      <p className="text-xs text-muted-foreground">Aucun courtier ou assureur supplémentaire n'a été sélectionné pour ce dossier</p>
                    </div>
                  )}
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
                {assignment.vehicle ? (
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
                          <p className="text-xs font-medium text-muted-foreground">Valeur neuve</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                            {assignment.vehicle.new_market_value ? formatCurrency(assignment.vehicle.new_market_value) : 'Non renseigné'}
                          </p>
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
                          <p className="text-xs font-medium text-muted-foreground">Date de première mise en circulation</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">
                            {assignment.vehicle.first_entry_into_circulation_date 
                              ? formatDate(assignment.vehicle.first_entry_into_circulation_date)
                              : 'Non renseigné'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Options</p>
                          <p className="text-sm font-semibold bg-muted/50 px-2 py-1 rounded">{assignment.vehicle.option}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Car className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Aucune information véhicule</p>
                    <p className="text-xs text-muted-foreground">Le véhicule n'a pas été assigné à ce dossier</p>
                  </div>
                )}
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
                        {/* <p className="text-xs text-muted-foreground">{assignment.vehicle.brand?.description || ''}</p> */}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.brand?.code || 'N/A'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Modèle</p>
                        <p className="text-sm font-semibold">{assignment.vehicle.vehicle_model?.label || 'Non renseigné'}</p>
                        {/* <p className="text-xs text-muted-foreground">{assignment.vehicle.vehicle_model?.description || ''}</p> */}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.vehicle_model?.code || 'N/A'}
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
                        {/* <p className="text-xs text-muted-foreground">{assignment.vehicle.color?.description || ''}</p> */}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.color?.code || 'N/A'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Carrosserie</p>
                        <p className="text-sm font-semibold">{assignment.vehicle.bodywork?.label || 'Non renseigné'}</p>
                        {/* <p className="text-xs text-muted-foreground">{assignment.vehicle.bodywork?.description || ''}</p> */}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {assignment.vehicle.bodywork?.code || 'N/A'}
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
                        {assignment.vehicle.bodywork?.status?.label || 'Non défini'}
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
          <div className="space-y-6">
            <ShockDetailTable shocks={assignment.shocks as any} assignment_status={assignment.status.code} assignment_id={assignment.id.toString()} />
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
                {assignment?.experts && assignment?.experts?.length > 0 ? (
                  <div className="space-y-2">
                    {assignment?.experts?.map((expert) => (
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

      case 'documents':
        return (
          <div className="space-y-4">
            {/* Documents transmis */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  Documents transmis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.document_transmitted && assignment.document_transmitted.length > 0 ? (
                  <div className="space-y-2">
                    {assignment.document_transmitted.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-xs">{doc.label}</p>
                            <p className="text-xs text-muted-foreground">Code: {doc.code}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Transmis</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun document transmis</h3>
                    <p className="text-muted-foreground text-sm">Aucun document n'a été transmis pour ce dossier d'expertise.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conclusion technique */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Conclusion technique
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.technical_conclusion ? (
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-primary">Conclusion</h4>
                    <Badge variant="outline" className="text-xs">{assignment.technical_conclusion.code}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Libellé</p>
                      <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.technical_conclusion.label}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Description</p>
                      <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.technical_conclusion.description}</p>
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Aucune conclusion technique</p>
                    <p className="text-xs text-muted-foreground">La conclusion technique n'a pas été définie</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* État général */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  État général
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignment.general_state ? (
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-primary">État</h4>
                    <Badge variant="outline" className="text-xs">{assignment.general_state.code}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Libellé</p>
                      <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.general_state.label}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Description</p>
                      <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.general_state.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Statut</p>
                      <Badge variant={assignment.general_state.status.code === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {assignment.general_state.status.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Aucun état général</p>
                    <p className="text-xs text-muted-foreground">L'état général n'a pas été défini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 'tracking':
        return (
          <div className="space-y-4">
            {/* Informations de création et modification */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Création et modification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Créé par */}
                  {assignment.created_by ? (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Créé par</h4>
                        <Badge variant="outline" className="text-xs">{assignment.created_by.username}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.created_by.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.created_by.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.created_by.telephone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Date de création</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(assignment.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <User className="h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-muted-foreground">Non créé</p>
                    </div>
                  )}

                  {/* Modifié par */}
                  {assignment.updated_by ? (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Modifié par</h4>
                        <Badge variant="outline" className="text-xs">{assignment.updated_by.username}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.updated_by.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.updated_by.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.updated_by.telephone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Date de modification</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(assignment.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <Edit className="h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-muted-foreground">Non modifié</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Autres intervenants */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Autres intervenants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Réalisé par */}
                  {assignment.realized_by ? (
                    <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Réalisé par</h4>
                        <Badge variant="outline" className="text-xs">{assignment.realized_by.username}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.realized_by.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.realized_by.email}</p>
                        </div>
                        {assignment.realized_at && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date de réalisation</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(assignment.realized_at)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <User className="h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-muted-foreground">Non réalisé</p>
                    </div>
                  )}

                  {/* Édité par */}
                  {assignment.edited_by ? (
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Édité par</h4>
                        <Badge variant="outline" className="text-xs">{assignment.edited_by.username}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.edited_by.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.edited_by.email}</p>
                        </div>
                        {assignment.edited_at && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date d'édition</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(assignment.edited_at)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <Edit className="h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-muted-foreground">Non édité</p>
                    </div>
                  )}

                  {/* Validé par */}
                  {assignment.validated_by ? (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-primary">Validé par</h4>
                        <Badge variant="outline" className="text-xs">{assignment.validated_by.username}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                          <p className="text-sm font-semibold bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.validated_by.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{assignment.validated_by.email}</p>
                        </div>
                        {assignment.validated_at && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Date de validation</p>
                            <p className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">{formatDate(assignment.validated_at)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <CheckCircle className="h-8 w-8 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-muted-foreground">Non validé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations complémentaires */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  Informations complémentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Observations et remarques */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Observations et remarques</h4>
                    <div className="space-y-2">
                      {assignment.observation && (
                        <div className="p-2 bg-muted/30 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">Observation générale</p>
                          <p className="text-xs">{assignment.observation}</p>
                        </div>
                      )}
                      {assignment.point_noted && (
                        <div className="p-2 bg-muted/30 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">Points notés</p>
                          <p className="text-xs">{assignment.point_noted}</p>
                        </div>
                      )}
                      {assignment.expert_remark && (
                        <div className="p-2 bg-muted/30 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground">Remarque expert</p>
                          <p className="text-xs">{assignment.expert_remark}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Valeurs et durées */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Valeurs et durées</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {assignment.assured_value && (
                        <div>
                          <p className="font-medium text-muted-foreground">Valeur assurée</p>
                          <p className="font-semibold">{formatCurrency(assignment.assured_value)}</p>
                        </div>
                      )}
                      {assignment.salvage_value && (
                        <div>
                          <p className="font-medium text-muted-foreground">Valeur de récupération</p>
                          <p className="font-semibold">{formatCurrency(assignment.salvage_value)}</p>
                        </div>
                      )}
                      {assignment.new_value && (
                        <div>
                          <p className="font-medium text-muted-foreground">Valeur neuve</p>
                          <p className="font-semibold">{formatCurrency(assignment.new_value)}</p>
                        </div>
                      )}
                      {assignment.market_value && (
                        <div>
                          <p className="font-medium text-muted-foreground">Valeur marchande</p>
                          <p className="font-semibold">{formatCurrency(assignment.market_value)}</p>
                        </div>
                      )}
                      {assignment.depreciation_rate && (
                        <div>
                          <p className="font-medium text-muted-foreground">Taux de dépréciation</p>
                          <p className="font-semibold">{assignment.depreciation_rate}%</p>
                        </div>
                      )}
                      {assignment.work_duration && (
                        <div>
                          <p className="font-medium text-muted-foreground">Durée des travaux</p>
                          <p className="font-semibold">{assignment.work_duration}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dates importantes */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary border-b pb-1">Dates importantes</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {assignment.seen_before_work_date && (
                        <div>
                          <p className="font-medium text-muted-foreground">Vu avant travaux</p>
                          <p className="font-semibold">{formatDate(assignment.seen_before_work_date)}</p>
                        </div>
                      )}
                      {assignment.seen_during_work_date && (
                        <div>
                          <p className="font-medium text-muted-foreground">Vu pendant travaux</p>
                          <p className="font-semibold">{formatDate(assignment.seen_during_work_date)}</p>
                        </div>
                      )}
                      {assignment.seen_after_work_date && (
                        <div>
                          <p className="font-medium text-muted-foreground">Vu après travaux</p>
                          <p className="font-semibold">{formatDate(assignment.seen_after_work_date)}</p>
                        </div>
                      )}
                      {assignment.contact_date && (
                        <div>
                          <p className="font-medium text-muted-foreground">Date de contact</p>
                          <p className="font-semibold">{formatDate(assignment.contact_date)}</p>
                        </div>
                      )}
                      {assignment.printed_at && (
                        <div>
                          <p className="font-medium text-muted-foreground">Imprimé le</p>
                          <p className="font-semibold">{formatDate(assignment.printed_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Fonctions de gestion des actions
  // const handleDeleteAssignment = (assignment: AssignmentDetail) => {
  //   // TODO: Implémenter la suppression
  //   console.log('Supprimer le dossier:', assignment.id)
  //   toast.info('Fonction de suppression à implémenter')
  // }

  const handleValidateAssignment = async () => {
    if (!assignment) return
    
    setValidating(true)
    try {
      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/validate/${assignment.id}`)
      toast.success('Dossier validé avec succès')
      setValidateModalOpen(false)
      
      // Mettre à jour tout le dossier avec une requête API de détail
      try {
        const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignment.id}`)
        if (response.status === 200 || response.status === 201) {
          setAssignment(response.data.data)
        }
      } catch (detailError) {
        console.error('Erreur lors de la récupération des détails:', detailError)
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error)
      toast.error('Erreur lors de la validation du dossier')
    } finally {
      setValidating(false)
    }
  }

  const handleUnvalidateAssignment = async () => {
    if (!assignment) return
    
    setUnvalidating(true)
    try {
      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/unvalidate/${assignment.id}`)
      toast.success('Validation du dossier annulée avec succès')
      setUnvalidateModalOpen(false)
      
      // Mettre à jour tout le dossier avec une requête API de détail
      try {
        const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignment.id}`)
        if (response.status === 200 || response.status === 201) {
          setAssignment(response.data.data)
        }
      } catch (detailError) {
        console.error('Erreur lors de la récupération des détails:', detailError)
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation de validation:', error)
      toast.error('Erreur lors de l\'annulation de validation du dossier')
    } finally {
      setUnvalidating(false)
    }
  }

  const handleValidateEdition = async () => {
    if (!assignment) return
    
    setValidatingEdition(true)
    try {
      await assignmentValidationService.validateEdition(String(assignment.id))
      toast.success('Édition validée avec succès')
      
      // Mettre à jour tout le dossier avec une requête API de détail
      try {
        const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignment.id}`)
        if (response.status === 200 || response.status === 201) {
          setAssignment(response.data.data)
        }
      } catch (detailError) {
        console.error('Erreur lors de la récupération des détails:', detailError)
      }
    } catch (error) {
      console.error('Erreur lors de la validation de l\'édition:', error)
      toast.error('Erreur lors de la validation de l\'édition')
    } finally {
      setValidatingEdition(false)
    }
  }

  // Fonction pour déterminer les actions disponibles selon le statut
  const getAvailableActions = (assignment: AssignmentDetail) => {
    const statusCode = assignment.status.code
    const isRestrictedRole = hasAnyRole([
      UserRole.REPAIRER_ADMIN,
      UserRole.REPAIRER_STANDARD_USER,
      UserRole.INSURER_ADMIN,
      UserRole.INSURER_STANDARD_USER
    ])

    // Ordre des statuts pour déterminer si un statut vient après un autre
    const statusOrder = [
      'pending',
      'opened',
      'realized',
      'pending_for_repairer_invoice',
      'pending_for_repairer_invoice_validation',
      'in_editing',
      'edited',
      'in_payment',
      'validated',
      'paid',
      'closed'
    ]

    const getStatusIndex = (code: string) => statusOrder.indexOf(code)
    const isAfterStatus = (currentCode: string, targetCode: string) => {
      const currentIndex = getStatusIndex(currentCode)
      const targetIndex = getStatusIndex(targetCode)
      return currentIndex >= 0 && targetIndex >= 0 && currentIndex >= targetIndex
    }

    const canEdit = !['validated', 'cancelled', 'closed', 'paid'].includes(statusCode)
    const canRealize = statusCode === 'opened'
    // Modifier la réalisation : disponible pour tous les statuts après "realized"
    const canEditRealization = isAfterStatus(statusCode, 'realized')
    const canWriteReport = statusCode === 'realized'
    // Rédiger le rapport : disponible à partir du statut "in_editing"
    const canEditReport = isAfterStatus(statusCode, 'in_editing')
    const canGenerateReport = true
    const canDelete = statusCode === 'pending'
    const canValidate = (isCEO() || isValidator() || isExpertManager()) && ['edited', 'in_payment'].includes(statusCode)
    const canUnvalidate = (isCEO() || isValidator() || isExpertManager()) && ['validated', 'paid'].includes(statusCode)

    const alwaysDisableForRestricted = (key: string) => {
      if (!isRestrictedRole) return false
      return key !== 'generate-report'
    }

    const actions = [
          {
            key: 'edit',
        label: 'Modifier le dossier',
            icon: Edit,
            onClick: () => navigate({ to: `/assignments/edit/${assignment.id}` }),
        variant: 'outline' as const,
        loading: false,
        disabled: !canEdit || alwaysDisableForRestricted('edit')
      },
          {
            key: 'realize',
            label: 'Réaliser le dossier',
            icon: CheckCircle,
            onClick: () => navigate({ to: `/assignments/realize/${assignment.id}` }),
        variant: 'default' as const,
        loading: false,
        disabled: !canRealize || alwaysDisableForRestricted('realize')
      },
          {
            key: 'edit-realization',
            label: 'Modifier la réalisation',
            icon: Edit,
            onClick: () => navigate({ to: `/assignments/realize/${assignment.id}` }),
        variant: 'outline' as const,
        loading: false,
        disabled: !canEditRealization || alwaysDisableForRestricted('edit-realization')
          },
      //     {
      //       key: 'write-report',
      //       label: 'Rédiger le rapport',
      //       icon: FileText,
      //       onClick: () => navigate({ to: `/assignments/edite-report/${assignment.id}` }),
      //   variant: 'default' as const,
      //   loading: false,
      //   disabled: !canWriteReport || alwaysDisableForRestricted('write-report')
      // },
          {
            key: 'edit-report',
            label: 'Rédiger le rapport',
            icon: Edit,
            onClick: () => navigate({ to: `/assignments/edit-report/${assignment.id}` }),
        variant: 'outline' as const,
        loading: false,
        disabled: !canEditReport || alwaysDisableForRestricted('edit-report')
      },
          {
            key: 'generate-report',
            label: 'Générer le rapport',
            icon: Download,
            onClick: async () => {
              await generateReport(assignment.id)
            },
            variant: 'default' as const,
        loading: loadingGenerate,
        disabled: !canGenerateReport
      },
      {
            key: 'validate',
            label: 'Valider le dossier',
            icon: Shield,
            onClick: () => setValidateModalOpen(true),
            variant: 'default' as const,
        className: 'bg-green-600 hover:bg-green-700',
        loading: false,
        disabled: !canValidate || alwaysDisableForRestricted('validate')
      },
      {
        key: 'unvalidate',
        label: 'Annuler la validation',
        icon: AlertTriangle,
        onClick: () => setUnvalidateModalOpen(true),
        variant: 'destructive' as const,
        className: 'bg-red-600 hover:bg-red-700',
        loading: false,
        disabled: !canUnvalidate || alwaysDisableForRestricted('unvalidate')
      },
      // {
      //   key: 'delete',
      //   label: 'Supprimer',
      //   icon: Trash2,
      //   onClick: () => handleDeleteAssignment(assignment),
      //   variant: 'destructive' as const,
      //   loading: false,
      //   disabled: !canDelete || alwaysDisableForRestricted('delete')
      // }
    ]

    return actions
  }

  // Barre d'actions: affichage propre, groupé et responsive sur plusieurs lignes si nécessaire
  const renderActionsToolbar = (actions: any[]) => {
    // Filtrer les actions pour ne garder que celles qui ne sont pas désactivées
    const enabledActions = actions.filter(action => !(action.loading || action.disabled))
    
    // Si aucune action n'est disponible, ne rien afficher
    if (enabledActions.length === 0) {
      return null
    }
    
    const primaryKeys = new Set(['generate-report', 'validate', 'realize', 'write-report'])
    const secondaryKeys = new Set(['edit', 'edit-realization', 'edit-report'])
    const dangerKeys = new Set(['unvalidate', 'delete'])

    const sortOrder: Record<string, number> = {
      'validate': 1,
      'generate-report': 2,
      'realize': 3,
      'write-report': 4,
      'edit': 5,
      'edit-realization': 6,
      'edit-report': 7,
      'unvalidate': 8,
      'delete': 9,
    }

    const primary = enabledActions.filter(a => primaryKeys.has(a.key)).sort((a, b) => (sortOrder[a.key] ?? 99) - (sortOrder[b.key] ?? 99))
    const secondary = enabledActions.filter(a => secondaryKeys.has(a.key)).sort((a, b) => (sortOrder[a.key] ?? 99) - (sortOrder[b.key] ?? 99))
    const danger = enabledActions.filter(a => dangerKeys.has(a.key)).sort((a, b) => (sortOrder[a.key] ?? 99) - (sortOrder[b.key] ?? 99))

    const renderButton = (action: any) => {
      const IconComponent = action.icon
      return (
        <Button
          key={action.key}
          variant={action.variant}
          onClick={action.onClick}
          disabled={action.loading}
          className={action.className}
          size="sm"
          title={action.label}
          aria-label={action.label}
        >
          <IconComponent className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{action.loading ? 'Chargement...' : action.label}</span>
          <span className="sm:hidden">{action.loading ? '...' : action.label.split(' ')[0]}</span>
        </Button>
      )
    }

    return (
      <>
        {/* Actions primaires */}
        {primary.map(renderButton)}
        
        {/* Séparateur après primaires si nécessaire */}
        {primary.length > 0 && (secondary.length > 0 || danger.length > 0) && (
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
        )}
        
        {/* Actions secondaires */}
        {secondary.map(renderButton)}
        
        {/* Séparateur avant danger si nécessaire */}
        {secondary.length > 0 && danger.length > 0 && (
          <Separator orientation="vertical" className="h-6 hidden lg:block" />
        )}
        
        {/* Actions de danger */}
        {danger.map(renderButton)}
      </>
    )
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
            <div className="w-full space-y-4 lg:space-y-6 pb-28 lg:pb-0">
          {/* En-tête */}
          <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate({ to: '/assignments' })}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">Dossier {assignment.reference}</h1>
                <p className="text-xs text-muted-foreground">Détails complets du dossier d'expertise</p>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Statut : </p>
              </div>
                <Badge className={getStatusColor(assignment.status.code) + ' text-lg'}>
                {assignment.status.label}
              </Badge>
            </div>
             
            </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
            {/* Gestion des boutons selon le type d'entité */}
            {!isReadOnlyUser && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="flex items-center gap-2 flex-nowrap min-w-max">
                  {isRepairerUser ? (
                    // Utilisateurs réparateurs : uniquement le bouton "Préparation de devis"
                    // Masquer ce bouton aux statuts : 'in_editing', 'edited', 'in_payment', 'validated', 'paid', 'closed'
                    !['in_editing', 'edited', 'in_payment', 'validated', 'paid', 'closed'].includes(assignment.status.code) ? (
                      <Button variant="outline" size="sm" onClick={() => navigate({ to: `/assignments/quote-preparation/${assignment.id}` })}>
                        <FileDown className="h-3 w-3 mr-2" />
                        Préparation de devis
                      </Button>
                    ) : null
                  ) : (
                    // Autres utilisateurs : tous les boutons disponibles
                    <>
                      {isExpertAdmin() && (assignment?.status?.code === AssignmentStatusEnum.REALIZED) && (
                        <Button variant="outline" size="sm" onClick={() => navigate({ to: `/assignments/expertise-sheet/${assignment.id}` })}>
                          <FileDown className="h-3 w-3 mr-2" />
                          Redaction de la fiche de traveaux
                        </Button>
                      )}

                      {isExpertAdmin() && assignment?.status?.code === AssignmentStatusEnum.IN_EDITING && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={handleValidateEdition}
                          disabled={validatingEdition}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {validatingEdition ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Validation...
                            </>
                          ) : (
                            <>
                              <Shield className="h-3 w-3 mr-2" />
                              Valider l'édition
                            </>
                          )}
                        </Button>
                      )}
                      
                      {/* Bouton "Préparation de devis" : masquer aux statuts 'in_editing', 'edited', 'in_payment', 'validated', 'paid', 'closed' */}
                      {!['in_editing', 'edited', 'in_payment', 'validated', 'paid', 'closed'].includes(assignment.status.code) && (
                        <Button variant="outline" size="sm" onClick={() => navigate({ to: `/assignments/quote-preparation/${assignment.id}` })}>
                          <FileDown className="h-3 w-3 mr-2" />
                          Préparation de devis
                        </Button>
                      )}
                      
                      {/* Actions basées sur le statut */}
                      {renderActionsToolbar(getAvailableActions(assignment))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Layout avec sidebar et contenu */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <Card className="shadow-none">
                <CardHeader className="pb-3 px-3 sm:px-6">
                  <CardTitle className="text-sm lg:text-xs">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-3 sm:px-6">
                  <nav className="space-y-0.5">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => changeActiveSection(item.id)}
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
              <Card className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 shadow-none py-2 ${assignment.status.code === 'validated' ? 'bg-green-50' : ''}`}>
                <CardContent className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-center px-3 sm:px-6">
                  {/* Si l'un des statuts est "done", afficher seulement "Validé" */}
                  {(assignment.edition_status === 'done' || assignment.recovery_status === 'done') ? (
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r text-white px-4 sm:px-6 border-2 border-green-500 rounded-lg">
                          <div className="flex items-center gap-2 text-green-500">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="font-bold text-base sm:text-lg">Validé</span>
                          </div>
                      </div>
                      <Badge className={getStatusColor(assignment.status.code) + ' bg-green-50 text-green-500 border-green-500'}>
                        {assignment.status.label}
                      </Badge>
                      {/* {assignment.validated_at && (
                        <span className="text-xs text-green-700 font-medium mt-2">
                          {formatDate(assignment.validated_at)}
                        </span>
                      )} */}
                    </div>
                  ) : (
                    <>
                      {/* Statut d'édition */}
                      {assignment.edition_status && (
                        <div className="flex flex-col items-center">
                          <Badge variant={assignment.edition_status === 'in_progress' ? 'default' : 'secondary'} className="mb-1 text-xs">
                            <span className="hidden sm:inline">Délai de redaction: </span>
                            <span className="sm:hidden">Rédaction: </span>
                            {assignment.edition_status === 'in_progress' ? 'En cours' : assignment.edition_status}
                          </Badge>
                          {assignment.edition_time_expire_at && (
                            <span className="text-xs text-blue-700 font-medium text-center">
                              Expire le {formatDate(assignment.edition_time_expire_at)}
                            </span>
                          )}
                          {typeof assignment.edition_per_cent === 'number' && (
                            <span className="text-xs text-blue-900 font-semibold">
                              Progression : {Math.min(assignment.edition_per_cent, 100)}%
                            </span>
                          )}
                        </div>
                      )}
                      {/* Statut de récupération */}
                      {assignment.recovery_status && (
                        <div className="flex flex-col items-center">
                          <Badge variant={assignment.recovery_status === 'in_progress' ? 'default' : 'secondary'} className="mb-1 bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                            <span className="hidden sm:inline">Délai de recouvrement: </span>
                            <span className="sm:hidden">Recouvrement: </span>
                            {assignment.recovery_status === 'in_progress' ? 'En cours' : assignment.recovery_status}
                          </Badge>
                          {assignment.recovery_time_expire_at && (
                            <span className="text-xs text-yellow-700 font-medium text-center">
                              Expire le {formatDate(assignment.recovery_time_expire_at)}
                            </span>
                          )}
                          {typeof assignment.recovery_per_cent === 'number' && (
                            <span className="text-xs text-yellow-900 font-semibold">
                              Progression : {Math.min(assignment.recovery_per_cent, 100)}%
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {/* Validation */}
                  {assignment.validated_at && (
                    <div className="flex flex-col items-center">
                      {/* <Badge variant="success" className="mb-1 bg-green-100 text-green-800 border-green-300">
                        Validé
                      </Badge> */}
                      <span className="text-base sm:text-lg text-green-700 font-medium">
                        {formatDate(assignment.validated_at)}
                      </span>
                    </div>
                  )}
                  {/* Clôture, annulation, etc. */}
                  {assignment.closed_at && (
                    <div className="flex flex-col items-center">
                      <Badge variant="secondary" className="mb-1 bg-gray-200 text-gray-800 border-gray-300 text-xs">
                        Clôturé
                      </Badge>
                      <span className="text-xs text-gray-700 font-medium">
                        {formatDate(assignment.closed_at)}
                      </span>
                    </div>
                  )}
                  {assignment.cancelled_at && (
                    <div className="flex flex-col items-center">
                      <Badge variant="destructive" className="mb-1 bg-red-100 text-red-800 border-red-300 text-xs">
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
                    <div className="flex flex-wrap gap-2 justify-center">
                      {assignment.expert_signature && (
                        <a href={assignment.expert_signature} target="_blank" rel="noopener noreferrer" title="Signature expert">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Expert</Badge>
                        </a>
                      )}
                      {assignment.repairer_signature && (
                        <a href={assignment.repairer_signature} target="_blank" rel="noopener noreferrer" title="Signature réparateur">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">Réparateur</Badge>
                        </a>
                      )}
                      {assignment.customer_signature && (
                        <a href={assignment.customer_signature} target="_blank" rel="noopener noreferrer" title="Signature client">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">Client</Badge>
                        </a>
                      )}
                    </div>
                  </div>
                  {/* QR code et emails */}
                  {assignment.qr_codes && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">QR Code</span>
                      <a href={assignment.qr_codes} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300 text-xs">Voir</Badge>
                      </a>
                    </div>
                  )}
                  {/* {assignment.emails && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-muted-foreground mb-1">Emails</span>
                      <span className="text-xs text-blue-900 font-semibold">{assignment.emails.map(email => email.email).join(', ')}</span>
                    </div>
                  )} */}
                  {/* Décompte dynamique (alerte si proche de l'expiration) - seulement si pas done */}
                  <div>
                    {assignment.edition_time_expire_at && assignment.edition_status !== 'done' && (
                      <CountdownAlert label="Redaction" expireAt={assignment.edition_time_expire_at} />
                    )}
                    <div className='mt-2'></div>
                    {assignment.edition_time_expire_at && assignment.edition_status !== 'done' && (
                      <CountdownAlert label="Recouvrement" expireAt={assignment.recovery_time_expire_at!} />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="shadow-none mt-4">
                <ScrollArea className="h-[500px] sm:h-[600px] mb-30">
                  {renderSection()}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </Main>


      {/* Modal de validation */}

        <Dialog open={validateModalOpen} onOpenChange={setValidateModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-5 w-5 text-green-600" />
                Valider le dossier
              </DialogTitle>
              <DialogDescription className="text-sm">
                Êtes-vous sûr de vouloir valider le dossier <strong>{assignment?.reference}</strong> ?
                <br />
                Cette action ne peut pas être annulée.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setValidateModalOpen(false)} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button 
                onClick={handleValidateAssignment} 
                disabled={validating}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                {validating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Validation...</span>
                    <span className="sm:hidden">Validation...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Valider le dossier</span>
                    <span className="sm:hidden">Valider</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Modal d'annulation de validation */}
      <Dialog open={unvalidateModalOpen} onOpenChange={setUnvalidateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Annuler la validation
            </DialogTitle>
            <DialogDescription className="text-sm">
              Êtes-vous sûr de vouloir annuler la validation du dossier <strong>{assignment?.reference}</strong> ?
              <br />
              Le dossier repassera au statut "Édité" et pourra être modifié à nouveau.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setUnvalidateModalOpen(false)} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button 
              onClick={handleUnvalidateAssignment} 
              disabled={unvalidating}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              {unvalidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Annulation...</span>
                  <span className="sm:hidden">Annulation...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Annuler la validation</span>
                  <span className="sm:hidden">Annuler</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Sticky Timeline Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/60 shadow-lg ml-70">
        <div className="px-10 sm:px-10 py-10"> 
          <div className="flex items-center gap-3">
            <div className="flex-1">
                {(() => {
                const steps = [
                  { code: 'pending', label: 'Création' },
                  { code: 'opened', label: 'Ouvert' },
                  { code: 'realized', label: 'Réalisé' },
                  { code: 'pending_for_repairer_invoice', label: 'En attente facture réparateur' },
                  { code: 'pending_for_repairer_invoice_validation', label: 'Facture réparateur validée' },
                  { code: 'in_editing', label: 'En édition' },
                  { code: 'edited', label: 'Rédigé' },
                  // { code: 'in_payment', label: 'En paiement' },
                  { code: 'validated', label: 'Validé' },
                  { code: 'paid', label: 'Payé' },
                  { code: 'closed', label: 'Clôturé' }
                ]
                const currentIndex = Math.max(0, steps.findIndex(s => s.code === assignment.status.code))
                return (
                  <div className="w-full">
                    <div className="flex items-start gap-0.5 sm:gap-1">
                      {steps.map((step, index) => {
                        const reached = index <= currentIndex
                        const isCurrent = index === currentIndex
                        const isLast = index === steps.length - 1
                        return (
                          <div key={step.code} className="flex-1 flex items-center min-w-0">
                            {/* Conteneur de l'étape avec point et label */}
                            <div className="flex flex-col items-center w-full min-w-0">
                              {/* Ligne de connexion horizontale - positionnée en haut */}
                              <div className="flex items-center w-full mb-1">
                                {/* Ligne avant le point (sauf pour le premier) */}
                                {index > 0 && (
                                  <div className={cn(
                                    'h-0.5 sm:h-1 rounded-full flex-1 min-w-[4px] mr-0.5 sm:mr-1',
                                    index <= currentIndex ? 'bg-primary' : 'bg-muted/50'
                                  )} />
                                )}
                                {/* Point de l'étape */}
                                <div className={cn(
                                  'h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border shrink-0 relative z-10',
                                  reached ? 'bg-primary border-primary' : 'bg-muted border-muted-foreground/20',
                                  isCurrent ? 'ring-2 ring-primary/40' : ''
                                )} />
                                {/* Ligne après le point (sauf pour le dernier) */}
                                {!isLast && (
                                  <div className={cn(
                                    'h-0.5 sm:h-1 rounded-full flex-1 min-w-[4px] ml-0.5 sm:ml-1',
                                    index < currentIndex ? 'bg-primary' : 'bg-muted/50'
                                  )} />
                                )}
                              </div>
                              {/* Label de l'étape */}
                              <span className={cn(
                                'text-[9px] sm:text-[10px] text-center leading-tight px-0.5',
                                reached ? 'text-primary font-medium' : 'text-muted-foreground',
                                'truncate w-full'
                              )} title={step.label}>{step.label}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {/* {(assignment.edition_status || assignment.recovery_status) && (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {assignment.edition_status && (
                          <div className="flex items-center gap-2">
                            <Badge variant={assignment.edition_status === 'in_progress' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                              Rédaction: {assignment.edition_status === 'in_progress' ? 'En cours' : assignment.edition_status}
                            </Badge>
                            {typeof assignment.edition_per_cent === 'number' && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground">{Math.min(assignment.edition_per_cent, 100)}%</span>
                            )}
                          </div>
                        )}
                        {assignment.recovery_status && (
                          <div className="flex items-center gap-2">
                            <Badge variant={assignment.recovery_status === 'in_progress' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                              Recouvrement: {assignment.recovery_status === 'in_progress' ? 'En cours' : assignment.recovery_status}
                            </Badge>
                            {typeof assignment.recovery_per_cent === 'number' && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground">{Math.min(assignment.recovery_per_cent, 100)}%</span>
                            )}
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                )
              })()}
            </div>
            {/* <div className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBottomSheetOpen(true)}
            >
              <Menu className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Navigation</span>
              <span className="sm:hidden">Menu</span>
            </Button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Sheet - Mobile Navigation */}
      <Sheet open={bottomSheetOpen} onOpenChange={setBottomSheetOpen}>
        <SheetContent side="bottom" className="h-[60vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Navigation du dossier
            </SheetTitle>
            <SheetDescription>
              Sélectionnez une section pour naviguer dans le dossier
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      changeActiveSection(item.id)
                      setBottomSheetOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 text-left transition-colors rounded-lg hover:bg-muted/50",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {activeSection === item.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* PDF Viewer */}
      <PdfViewer open={pdfViewer.open} onOpenChange={open => setPdfViewer(v => ({ ...v, open }))} url={pdfViewer.url} title={pdfViewer.title} />
    </>
  )
} 