/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  FileText,
  Users,
  Package,
  Calculator,
  Receipt,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  List,
  Shield,
  ShieldCheck,
  ShieldX
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { assignmentService } from '@/services/assignmentService'
import { ShockWorkforceTableV2 } from '@/features/assignments/components/shock-workforce-table-v2'
import { ExpertiseSheetShockSuppliesTable } from '@/features/assignments/components/assignment/expertise-sheet/expertise-sheet-shock-supplies-table'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { ShockPointSelect } from '@/features/widgets/shock-point-select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { ShockPointCreateModal } from '@/components/modals'
import { ShockPointMutateDialog } from '@/features/expertise/points-de-choc/components/shock-point-mutate-dialog'
import { cn } from '@/lib/utils'
// dnd-kit moved into reusable component
import { ShockReorderSheet, type ShockItem } from '@/features/assignments/components/shock-reorder-sheet'
import { useACL } from '@/hooks/useACL'
import { UserRole } from '@/types/auth'
import assignmentValidationService from '@/services/assignmentValidationService'

interface Assignment {
  id: number
  reference: string
  policy_number: string | null
  claim_number: string | null
  claim_starts_at: string | null
  claim_ends_at: string | null
  expertise_date: string
  expertise_place: string | null
  received_at: string
  insurer_id: number | null
  repairer_id: number | null
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
  new_market_value: string
  depreciation_rate: string
  market_value: string
  vehicle_new_market_value_option: string | null
  work_duration: string | null
  expert_remark: string | null
  expert_report_remark: string | null
  instructions: string | null
  market_incidence_rate: string | null
  report_remark_id: number | null
  shock_amount_excluding_tax: string
  shock_amount_tax: string
  shock_amount: string
  other_cost_amount_excluding_tax: string
  other_cost_amount_tax: string
  other_cost_amount: string
  receipt_amount_excluding_tax: string | null
  receipt_amount_tax: string | null
  receipt_amount: string | null
  total_amount_excluding_tax: string
  total_amount_tax: string
  total_amount: string
  emails: string | null
  qr_codes: string | null
  insurer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
  } | null
  repairer: {
    id: number
    code: string
    name: string
    email: string
    telephone: string | null
    address: string | null
  } | null
  vehicle: {
    id: number
    license_plate: string
    type: string
    option: string
    mileage: string
    serial_number: string
    first_entry_into_circulation_date: string
    technical_visit_date: string | null
    fiscal_power: number
    nb_seats: number
    new_market_value: string
    brand: {
      id: number
      code: string
      label: string
      description: string
    }
    vehicle_model: {
      id: number
      code: string
      label: string
      description: string
    }
    color: {
      id: number
      code: string
      label: string
      description: string
    }
    bodywork: {
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
    }
  }
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
    }
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
    }
  }
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
  claim_nature: {
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
    } | null
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
    } | null
    deleted_by: any
    created_at: string
    updated_at: string
    deleted_at: string | null
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
  } | null
  client: {
    id: number
    name: string
    email: string
    phone_1: string | null
    phone_2: string | null
    address: string
  }
  status: {
    id: number
    code: string
    label: string
    description: string
  }
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
    paint_type?: {
      id: number
      code: string
      label: string
      description: string
      deleted_at: string | null
      created_at: string
      updated_at: string
    }
    hourly_rate?: {
      id: number
      value: string
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
      obsolescence: boolean
      control: boolean
      comment: string | null
      obsolescence_rate: string
      obsolescence_amount_excluding_tax: string
      obsolescence_amount_tax: string
      obsolescence_amount: string
      recovery_amount_excluding_tax: string
      recovery_amount_tax: string
      recovery_amount: string
      discount: string
      discount_amount_excluding_tax: string
      discount_amount_tax: string
      discount_amount: string
      new_amount_excluding_tax: string
      new_amount_tax: string
      new_amount: string
      amount_excluding_tax: string | null
      amount_tax: string | null
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
      with_tax: number
      discount: string
      amount_excluding_tax: string
      amount_tax: string
      amount: string
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
    }
  }>
  ascertainments: Array<{
    id: number
    ascertainment_type: {
      id: number
      code: string
      label: string
      description: string
      created_at: string
      updated_at: string
    }
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string | null
    created_at: string
    updated_at: string
  }>
  payments: Array<any>
  invoices: Array<any>
  evaluations: any
  experts: Array<any>
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
  }
  deleted_by: any
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
  } | null
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
  } | null
  validated_by: any
  closed_by: any
  cancelled_by: any
  work_sheet_established_by: any
  expertise_sheet: string | null
  expertise_report: string | null
  work_sheet: string | null
  expert_signature: string | null
  repairer_signature: string | null
  customer_signature: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string | null
  validated_at: string | null
  realized_at: string | null
  work_sheet_established_at: string | null
  edition_time_expire_at: string | null
  edition_status: string
  edition_per_cent: number
  recovery_time_expire_at: string | null
  recovery_status: string
  recovery_per_cent: number
}

interface Supply {
  id: number
  label: string
  description: string
}

interface WorkforceType {
  id: number
  code: string
  label: string
  description: string
}

interface OtherCostType {
  id: number
  code: string
  label: string
  description: string
}

export default function ExpertiseSheetPage() {
  const { id } = useParams({ strict: false }) as { id: string } 
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [showAddOtherCostModal, setShowAddOtherCostModal] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // États pour les champs d'édition
  const [circumstance, setCircumstance] = useState('')
  const [damageDeclared, setDamageDeclared] = useState('')
  const [observation, setObservation] = useState('')
  const [pointNoted, setPointNoted] = useState('')
  // Remplacer newOtherCost par un tableau newOtherCosts
  const [newOtherCosts, setNewOtherCosts] = useState([
    { other_cost_type_id: 0, amount: 0 }
  ])
  const [showMobileSheet, setShowMobileSheet] = useState(false)
  
  // États pour les informations additionnelles (selon le type d'expertise)
  const [generalStateId, setGeneralStateId] = useState<number | null>(null)
  const [technicalConclusionId, setTechnicalConclusionId] = useState<number | null>(null)
  const [claimNatureId, setClaimNatureId] = useState<number | null>(null)
  const [selectedRemarkId, setSelectedRemarkId] = useState<number | null>(null)
  const [expertRemark, setExpertRemark] = useState('')
  const [instructions, setInstructions] = useState('')
  const [marketIncidenceRate, setMarketIncidenceRate] = useState<number>(0)
  
  // États pour les dates et valeurs
  const [seenBeforeWorkDate, setSeenBeforeWorkDate] = useState<string | null>(null)
  const [seenDuringWorkDate, setSeenDuringWorkDate] = useState<string | null>(null)
  const [seenAfterWorkDate, setSeenAfterWorkDate] = useState<string | null>(null)
  const [contactDate, setContactDate] = useState<string | null>(null)
  const [expertisePlace, setExpertisePlace] = useState('')
  const [assuredValue, setAssuredValue] = useState<number>(0)
  const [salvageValue, setSalvageValue] = useState<number>(0)
  const [workDuration, setWorkDuration] = useState('')
  
  // États pour les données de référence
  const [generalStates, setGeneralStates] = useState<any[]>([])
  const [claimNatures, setClaimNatures] = useState<any[]>([])
  const [technicalConclusions, setTechnicalConclusions] = useState<any[]>([])
  const [remarks, setRemarks] = useState<Array<{id: number, label: string, description: string}>>([])
  
  // États pour les données de référence
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [workforceTypes, setWorkforceTypes] = useState<WorkforceType[]>([])
  const [otherCostTypes, setOtherCostTypes] = useState<OtherCostType[]>([])
  // Ajoute un state pour shockPoints
  const [shockPoints, setShockPoints] = useState([])
  // États pour les types de peinture et taux horaires
  const [paintTypes, setPaintTypes] = useState([])
  const [hourlyRates, setHourlyRates] = useState([])
  
  // États pour les nouveaux champs de valeur de marché
  const [newMarketValue, setNewMarketValue] = useState<number | null>(null)
  const [vehicleNewMarketValueOption, setVehicleNewMarketValueOption] = useState<string | null>(null)
  const [depreciationRate, setDepreciationRate] = useState<number | null>(null)
  const [marketValue, setMarketValue] = useState<number | null>(null)
  const [mileage, setMileage] = useState<number | null>(null)

  // États pour les champs d'évaluation
  const [vehicleAge, setVehicleAge] = useState<number | null>(null)
  const [yearDiff, setYearDiff] = useState<number | null>(null)
  const [monthDiff, setMonthDiff] = useState<number | null>(null)
  const [theoricalDepreciationRate, setTheoricalDepreciationRate] = useState<number | null>(null)
  const [theoricalVehicleMarketValue, setTheoricalVehicleMarketValue] = useState<number | null>(null)
  const [lessValueWork, setLessValueWork] = useState<number | null>(null)
  const [isUp, setIsUp] = useState<boolean | null>(null)
  const [kilometricIncidence, setKilometricIncidence] = useState<number | null>(null)
  const [marketIncidenceRateEval, setMarketIncidenceRateEval] = useState<number | null>(null)
  const [marketIncidence, setMarketIncidence] = useState<number | null>(null)
  const [vehicleMarketValue, setVehicleMarketValue] = useState<number | null>(null)

  // États pour le modal d'ajout de point de choc
  const [showShockModal, setShowShockModal] = useState(false)
  const [selectedShockPointId, setSelectedShockPointId] = useState('')
  const [showCreateShockPointModal, setShowCreateShockPointModal] = useState(false)
  const [addingShock, setAddingShock] = useState(false)
  
  // État pour gérer les chocs collapsés (par défaut tous ouverts)
  const [collapsedShocks, setCollapsedShocks] = useState<Set<number>>(new Set())
  
  // États pour la suppression de choc
  const [showDeleteShockDialog, setShowDeleteShockDialog] = useState(false)
  const [shockToDelete, setShockToDelete] = useState<number | null>(null)
  const [deletingShock, setDeletingShock] = useState(false)

  // États pour le modal d'édition de choc
  const [showEditShockWarning, setShowEditShockWarning] = useState(false)
  const [highlightedShockId, setHighlightedShockId] = useState<number | null>(null)

  // Reorder shocks sheet state
  const [showReorderSheet, setShowReorderSheet] = useState(false)
  const [reorderShocksList, setReorderShocksList] = useState<ShockItem[]>([])
  
  const [sheetFocusShockId, setSheetFocusShockId] = useState<number | null>(null)
  const { hasAnyRole } = useACL()
  const isExpert = hasAnyRole([UserRole.EXPERT, UserRole.EXPERT_MANAGER, UserRole.EXPERT_ADMIN])
  const isRepairer = hasAnyRole([UserRole.REPAIRER_ADMIN, UserRole.REPAIRER_STANDARD_USER, UserRole.REPAIRER_ADMIN])

  const [validating, setValidating] = useState(false)

  // Restreindre l'accès: si expert/réparateur et le dossier n'est pas "realized", retour arrière
  useEffect(() => {
    if (!assignment) return
    if ((isExpert || isRepairer) && assignment?.status?.code !== 'realized') {
      toast.error('Accès non autorisé: le dossier doit être réalisé')
      window.history.back()
    }
  }, [assignment?.status?.code, isExpert, isRepairer])

  const validateAssignment = async () => {
    if (!assignment) return
    setValidating(true)
    try {
      console.log("================================================");
      console.log('++++++ isExpert', isExpert)
      console.log('++++++ isRepairer', isRepairer)
      console.log("================================================");
      console.log('validateAssignment', assignment.id)
      console.log("================================================");
      
      if (isExpert) {
        console.log("================================================");
        console.log('++++++ validateByExpert ', assignment.id)
        console.log("================================================");
        await assignmentValidationService.validateByExpert(String(assignment.id))
      }
      if (isRepairer) {
        console.log("================================================");
        console.log('++++++ validateByRepairer isRepairer', assignment.id)
        console.log("================================================");
        await assignmentValidationService.validateByRepairer(String(assignment.id))
      }
      toast.success('Dossier validé')
      await refreshAssignment()
    } catch (_e) {
      console.log("================================================");
      console.log('++++++ error', _e)
      console.log("================================================");
      toast.error('Erreur lors de la validation')
    } finally {
      setValidating(false)
    }
  }

  const unvalidateAssignment = async () => {
    if (!assignment) return
    setValidating(true)
    try {
      if (isExpert) await assignmentValidationService.unvalidateByExpert(String(assignment.id))
      if (isRepairer) await assignmentValidationService.unvalidateByRepairer(String(assignment.id))
      toast.success('Validation annulée')
      await refreshAssignment()
    } catch (_e) {
      toast.error('Erreur lors de l\'annulation')
    } finally {
      setValidating(false)
    }
  }

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const changeActiveTab = (tab: string) => {
    setActiveTab(tab)
    // Mettre à jour l'URL avec le paramètre tab
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url.toString())
  }

  // Initialiser l'onglet actif depuis l'URL au chargement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl && ['overview', 'shocks', 'costs', 'receipts', 'additional-info', 'constatations', 'evaluations'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [])

  // Gérer les paramètres d'URL pour l'édition de choc et la surbrillance
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const info = urlParams.get('info')
    const shockId = urlParams.get('shock_id')

    // Gérer le modal d'avertissement d'édition de choc
    if (info === 'edit-shocks') {
      setShowEditShockWarning(true)
      // Supprimer le paramètre info de l'URL
      urlParams.delete('info')
      const newUrl = new URL(window.location.href)
      newUrl.search = urlParams.toString()
      window.history.replaceState({}, '', newUrl.toString())
    }

    // Gérer la surbrillance du choc
    if (shockId) {
      const shockIdNum = parseInt(shockId, 10)
      if (!isNaN(shockIdNum)) {
        setHighlightedShockId(shockIdNum)
        // Supprimer le paramètre shock_id de l'URL
        urlParams.delete('shock_id')
        const newUrl = new URL(window.location.href)
        newUrl.search = urlParams.toString()
        window.history.replaceState({}, '', newUrl.toString())
        setTimeout(() => {
          // S'assurer que l'onglet shocks est actif et scroller vers le choc
          if (activeTab !== 'shocks') {
            console.log("================> 1 activeTab", activeTab)
            changeActiveTab('shocks')
            // Attendre un peu plus longtemps si on a changé d'onglet
            setTimeout(() => {
              const shockElement = document.querySelector(`[data-shock-id="${shockIdNum}"]`)
              console.log("================> 2 shockElement", shockElement)
              if (shockElement) {
                console.log("================> 3 shockElement", shockElement)
                shockElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center',
                  inline: 'nearest'
                })
              }
            }, 800)
          } else {
            console.log("================> 4 activeTab", activeTab)
            // Scroll automatique vers le choc après un court délai pour laisser le DOM se mettre à jour
            setTimeout(() => {

              const shockElement = document.querySelector(`[data-shock-id="${shockIdNum}"]`)
              console.log("================> 5 shockElement", shockElement)
              if (shockElement) {
                console.log("================> 6 shockElement", shockElement)
                shockElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center',
                  inline: 'nearest'
                })
              }
            }, 500)
          }
          
          // Retirer la surbrillance après 30 secondes
          setTimeout(() => {
            console.log("================> 7 highlightedShockId", highlightedShockId)
            setHighlightedShockId(null)
          }, 30000)
        }, 4000)
      }
    }
  }, [])


  // Charger les données du dossier
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true)
        const response = await assignmentService.getAssignment(id)
        
        if (response && typeof response === 'object' && 'data' in response) {
          setAssignment(response.data as unknown as Assignment)
          // Initialiser tous les champs avec les données de l'assignation
          const assignmentData = response.data as unknown as Assignment
          initializeFields(assignmentData)
        } else {
          setAssignment(response as unknown as Assignment)
          // Initialiser tous les champs avec les données de l'assignation
          const assignmentData = response as unknown as Assignment
          initializeFields(assignmentData)
        }
      } catch (err) {
        console.log(err)
        setError('Erreur lors du chargement du dossier')
        toast.error('Erreur lors du chargement du dossier')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [id])

  // Charger les données de référence
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Charger les fournitures
        const suppliesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SUPPLIES}?per_page=5`)
        if (suppliesResponse.status === 200) {
          setSupplies((suppliesResponse.data.data || []).map((s: any) => ({
            id: String(s.id),
            label: s.label,
            description: s.description,
            code: s.code,
            price: s.price
          })))
        }

        // Charger les types de main d'œuvre
        const workforceTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.WORKFORCE_TYPES}?per_page=50`)
        if (workforceTypesResponse.data.status === 200) {
          setWorkforceTypes(workforceTypesResponse.data.data)
        }

        // Charger les types d'autres coûts
        const otherCostTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.OTHER_COST_TYPES}?per_page=50`)
        if (otherCostTypesResponse.status === 200 && Array.isArray(otherCostTypesResponse.data.data)) {
          setOtherCostTypes(otherCostTypesResponse.data.data)
        } else {
          setOtherCostTypes([])
        }

        // Charger les points de choc
        const shockPointsResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SHOCK_POINTS}?per_page=50`)

        console.log("================> shockPointsResponse", shockPointsResponse.status)
        if (shockPointsResponse.status === 200) {
          setShockPoints(shockPointsResponse.data.data)
        }

        // Charger les types de peinture
        const paintTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PAINT_TYPES}?per_page=50`)
        if (paintTypesResponse.status === 200) {
          setPaintTypes(paintTypesResponse.data.data)
        } else {
          console.error('Erreur lors du chargement des types de peinture:', paintTypesResponse.status)
        }

        // Charger les taux horaires
        const hourlyRatesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.HOURLY_RATES}?per_page=50`)
        if (hourlyRatesResponse.status === 200) {
          setHourlyRates(hourlyRatesResponse.data.data)
        } else {
          console.error('Erreur lors du chargement des taux horaires:', hourlyRatesResponse.status)
        }
        
        // Charger les données pour les informations additionnelles
        const generalStatesResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/general-states?per_page=50`)
        if (generalStatesResponse.status === 200) {
          setGeneralStates(generalStatesResponse.data.data)
        }
        
        const claimNaturesResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/claim-natures?per_page=50`)
        if (claimNaturesResponse.status === 200) {
          setClaimNatures(claimNaturesResponse.data.data)
        }
        
        const technicalConclusionsResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/technical-conclusions?per_page=50`)
        if (technicalConclusionsResponse.status === 200) {
          setTechnicalConclusions(technicalConclusionsResponse.data.data)
        }
        
        const remarksResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/remarks?per_page=50`)
        if (remarksResponse.status === 200) {
          setRemarks(remarksResponse.data.data)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données de référence:', err)
        setOtherCostTypes([])
      }
    }

    fetchReferenceData()
  }, [])

  // Prepare reorder list when opening the sheet
  useEffect(() => {
    if (showReorderSheet && assignment?.shocks) {
      setReorderShocksList(
        assignment.shocks.map((s) => ({
          id: s.id,
          label: s.shock_point?.label || `Choc ${s.id}`,
          amount: s.amount,
        }))
      )
    }
  }, [showReorderSheet, assignment?.shocks])

  const handleOpenReorderSheet = (focusShockId?: number) => {
    if (focusShockId) setSheetFocusShockId(focusShockId)
    setShowReorderSheet(true)
  }

  const handleConfirmReorderShocks = async (orderedIds?: number[]) => {
    if (!assignment) return
    try {
      await assignmentService.reorderShocks(assignment.id, (orderedIds && orderedIds.length ? orderedIds : reorderShocksList.map((s) => s.id)))
      toast.success('Ordre des chocs mis à jour')
      setShowReorderSheet(false)
      setSheetFocusShockId(null)
      await refreshAssignment()
    } catch (error) {
      console.error('Erreur réorganisation chocs:', error)
      toast.error('Erreur lors de la réorganisation des chocs')
    }
  }

  // Fonction pour rafraîchir les données du dossier
  const refreshAssignment = async () => {
    try {
      const response = await assignmentService.getAssignment(id)
      
      if (response && typeof response === 'object' && 'data' in response) {
        setAssignment(response.data as unknown as Assignment)
      } else {
        setAssignment(response as unknown as Assignment)
      }
    } catch (err) {
      console.log(err)
      toast.error('Erreur lors du rafraîchissement du dossier')
    }
  }

  // Fonction pour réorganiser les fournitures d'un choc
  const handleReorderShockWorks = async (shockId: number, shockWorkIds: number[]) => {
    try {
      await assignmentService.reorderShockWorks(shockId, shockWorkIds)
      await refreshAssignment()
      toast.success('Ordre des fournitures mis à jour')
    } catch (error) {
      console.error('Erreur lors de la réorganisation des fournitures:', error)
      toast.error('Erreur lors de la réorganisation des fournitures')
    }
  }

  // Fonction pour réorganiser les main d'œuvre d'un choc
  // const handleReorderWorkforces = async (shockId: number, workforceIds: number[]) => {
  //   try {
  //     await assignmentService.reorderWorkforces(shockId, workforceIds)
  //     await refreshAssignment()
  //     toast.success('Ordre des main d\'œuvre mis à jour')
  //   } catch (error) {
  //     console.error('Erreur lors de la réorganisation des main d\'œuvre:', error)
  //     toast.error('Erreur lors de la réorganisation des main d\'œuvre')
  //   }
  // }

  // Fonction pour ajouter un point de choc
  const handleAddShock = async (shockPointId: string) => {
    if (!assignment) return

    setAddingShock(true)
    try {
      const payload = {
        assignment_id: assignment.id.toString(),
        shocks: [
          {
            shock_point_id: String(shockPointId)
          }
        ]
      }

      await axiosInstance.post(`${API_CONFIG.ENDPOINTS.ADD_SHOCK_IN_MODIF}`, payload)
      toast.success('Point de choc ajouté avec succès')
      await refreshAssignment()
      setShowShockModal(false)
      setSelectedShockPointId('')
    } catch (error) {
      console.error('Erreur lors de l\'ajout du point de choc:', error)
      toast.error('Erreur lors de l\'ajout du point de choc')
    } finally {
      setAddingShock(false)
    }
  }

  // Fonction pour créer un nouveau point de choc
  const handleCreateShockPoint = () => {
    setShowCreateShockPointModal(true)
  }

  // Fonction appelée après création d'un point de choc
  const handleShockPointCreated = async () => {
    await refreshAssignment()
    setShowCreateShockPointModal(false)
    toast.success('Point de choc créé avec succès')
  }

  // Fonction pour toggle le collapse d'un choc
  const toggleShockCollapse = (shockId: number) => {
    setCollapsedShocks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(shockId)) {
        newSet.delete(shockId)
      } else {
        newSet.add(shockId)
      }
      return newSet
    })
  }

  // Fonction pour ouvrir le dialogue de suppression de choc
  const handleDeleteShock = (shockId: number) => {
    setShockToDelete(shockId)
    setShowDeleteShockDialog(true)
  }

  // Fonction pour confirmer la suppression de choc
  const confirmDeleteShock = async () => {
    if (!shockToDelete) return
    
    setDeletingShock(true)
    try {
      await assignmentService.deleteShock(shockToDelete)
      toast.success('Choc supprimé avec succès')
      await refreshAssignment()
    } catch (error) {
      console.error('Erreur lors de la suppression du choc:', error)
      toast.error('Erreur lors de la suppression du choc')
    } finally {
      setDeletingShock(false)
      setShowDeleteShockDialog(false)
      setShockToDelete(null)
    }
  }

  // Fonctions pour gérer le modal d'avertissement d'édition de choc
  const handleEditShockWarningClose = () => {
    setShowEditShockWarning(false)
    // Retourner en arrière
    window.history.back()
  }

  const handleEditShockWarningContinue = () => {
    setShowEditShockWarning(false)
    // L'utilisateur peut continuer à éditer
  }

  // Fonction de formatage des montants
  const formatCurrency = (amount: string | number | null) => {
    if (amount === null || amount === undefined) return '0 FCFA'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)
  }

  // Fonction de formatage des dates
  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('fr-FR', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric'
  //   })
  // }

  // // Fonction pour obtenir l'icône du statut
  // const getStatusIcon = (statusCode: string) => {
  //   switch (statusCode) {
  //     case 'pending': return <Clock className="h-4 w-4" />
  //     case 'opened': return <AlertCircle className="h-4 w-4" />
  //     case 'realized': return <CheckCircle className="h-4 w-4" />
  //     case 'edited': return <FileText className="h-4 w-4" />
  //     case 'closed': return <CheckCircle className="h-4 w-4" />
  //     case 'paid': return <CheckCircle className="h-4 w-4" />
  //     case 'cancelled': return <AlertCircle className="h-4 w-4" />
  //     default: return <Clock className="h-4 w-4" />
  //   }
  // }

  // Initialiser les valeurs de marché quand l'assignation est chargée


  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'opened': return 'bg-blue-100 text-blue-800'
      case 'realized': return 'bg-green-100 text-green-800'
      case 'edited': return 'bg-purple-100 text-purple-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'paid': return 'bg-emerald-100 text-emerald-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // // Fonction pour déterminer si c'est une évaluation
  // const isEvaluation = assignment?.expertise_type?.code === 'evaluation'
  
  // // Fonction pour gérer le changement de la note d'expert
  // const handleRemarkChange = (value: number | null) => {
  //   setSelectedRemarkId(value)
    
  //   // Quand une remarque est sélectionnée, pré-remplir le champ expert_remark
  //   if (value) {
  //     const selectedRemark = remarks.find(remark => remark.id === value)
  //     if (selectedRemark) {
  //       setExpertRemark(selectedRemark.description)
  //       toast.success(`Remarque "${selectedRemark.label}" chargée`)
  //     }
  //   } else {
  //     // Si aucune remarque n'est sélectionnée, vider le champ
  //     setExpertRemark('')
  //   }
  // }

  // Fonction pour initialiser tous les champs avec les données de l'assignation
  const initializeFields = (assignmentData: Assignment) => {
    // Champs de base
    setCircumstance(assignmentData.circumstance || '')
    setDamageDeclared(assignmentData.damage_declared || '')
    setObservation(assignmentData.observation || '')
    setPointNoted(assignmentData.point_noted || '')
    
    // Informations additionnelles
    setGeneralStateId(assignmentData.general_state?.id || null)
    setTechnicalConclusionId(assignmentData.technical_conclusion?.id || null)
    setClaimNatureId(assignmentData.claim_nature?.id || null)
    setSelectedRemarkId(assignmentData.report_remark_id || null)
    setExpertRemark(assignmentData.expert_report_remark || '')
    setInstructions(assignmentData.instructions || '')
    setMarketIncidenceRate(parseFloat(assignmentData.market_incidence_rate || '0'))
    setExpertisePlace(assignmentData.expertise_place || '')
    setAssuredValue(parseFloat(assignmentData.assured_value || '0'))
    setSalvageValue(parseFloat(assignmentData.salvage_value || '0'))
    setWorkDuration(assignmentData.work_duration || '')
    
    // Valeurs de marché
    setNewMarketValue(parseFloat(assignmentData.new_market_value || '0'))
    setDepreciationRate(parseFloat(assignmentData.depreciation_rate || '0'))
    setMarketValue(parseFloat(assignmentData.market_value || '0'))
    setVehicleNewMarketValueOption(assignmentData.vehicle_new_market_value_option || null)
    
    // Charger le kilométrage depuis le véhicule
    if ((assignmentData?.vehicle as any)?.mileage) {
      setMileage(parseInt((assignmentData.vehicle as any).mileage) || null)
    }
    
    // Dates
    if (assignmentData.seen_before_work_date) {
      setSeenBeforeWorkDate(assignmentData.seen_before_work_date)
    }
    if (assignmentData.seen_during_work_date) {
      setSeenDuringWorkDate(assignmentData.seen_during_work_date)
    }
    if (assignmentData.seen_after_work_date) {
      setSeenAfterWorkDate(assignmentData.seen_after_work_date)
    }
    if (assignmentData.contact_date) {
      setContactDate(assignmentData.contact_date)
    }

    // Champs d'évaluation (si disponibles)
    if (assignmentData.evaluations) {
      setVehicleAge(assignmentData.evaluations.vehicle_age || null)
      setYearDiff(assignmentData.evaluations.diff_year || assignmentData.evaluations.year_diff || null)
      setMonthDiff(assignmentData.evaluations.diff_month || assignmentData.evaluations.month_diff || null)
      setTheoricalDepreciationRate(parseFloat(assignmentData.evaluations.theorical_depreciation_rate || '0') || null)
      setTheoricalVehicleMarketValue(assignmentData.evaluations.theorical_vehicle_market_value || null)
      setLessValueWork(parseFloat(assignmentData.evaluations.less_value_work || '0') || null)
      setIsUp(assignmentData.evaluations.is_up || null)
      setKilometricIncidence(assignmentData.evaluations.kilometric_incidence || null)
      setMarketIncidenceRateEval(assignmentData.evaluations.market_incidence_rate || null)
      setMarketIncidence(assignmentData.evaluations.market_incidence || null)
      setVehicleMarketValue(assignmentData.evaluations.vehicle_market_value || null)
    }
  }

  // Fonction de sauvegarde
  const handleSave = async () => {
    setSaving(true)
    try {
      // Sauvegarder les modifications des champs d'édition
      if (assignment) {
        const payload: any = {
          // Champs de base (toujours envoyés)
          circumstance,
          damage_declared: damageDeclared,
          observation,
          point_noted: pointNoted,
          
          // Champs pour tous les types de dossiers (évaluation et non-évaluation)
          general_state_id: generalStateId?.toString(),
          technical_conclusion_id: technicalConclusionId?.toString(),
          claim_nature_id: claimNatureId?.toString(),
          report_remark_id: selectedRemarkId?.toString(),
          expert_report_remark: expertRemark,
          instructions: instructions,
          market_incidence_rate: marketIncidenceRate ? Number(marketIncidenceRate) : undefined,
          
          // Dates (toujours envoyées)
          seen_before_work_date: seenBeforeWorkDate,
          seen_during_work_date: seenDuringWorkDate,
          seen_after_work_date: seenAfterWorkDate,
          contact_date: contactDate,
          expertise_place: expertisePlace,
          
          // Valeurs (toujours envoyées)
          assured_value: assuredValue ? Number(assuredValue) : undefined,
          salvage_value: salvageValue ? Number(salvageValue) : undefined,
          work_duration: workDuration,
          
          // Valeurs de marché (toujours envoyées)
          new_market_value: newMarketValue ? Number(newMarketValue) : undefined,
          depreciation_rate: depreciationRate ? Number(depreciationRate) : undefined,
          market_value: marketValue ? Number(marketValue) : undefined,
          mileage: mileage ? Number(mileage) : undefined,
          vehicle_new_market_value_option: vehicleNewMarketValueOption,

          // Champs d'évaluation (toujours envoyés)
          evaluations: {
            vehicle_age: vehicleAge || 0,
            year_diff: yearDiff || 0,
            month_diff: monthDiff || 0,
            theorical_depreciation_rate: theoricalDepreciationRate || 0,
            theorical_vehicle_market_value: theoricalVehicleMarketValue || 0,
            less_value_work: lessValueWork || 0,
            is_up: isUp !== null ? isUp : false,
            kilometric_incidence: kilometricIncidence || 0,
            market_incidence_rate: marketIncidenceRateEval || 0,
            market_incidence: marketIncidence || 0,
            vehicle_market_value: vehicleMarketValue || 0
          }
        }

        // Nettoyer le payload en supprimant les valeurs undefined
        const cleanPayload = Object.fromEntries(
          Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )

        await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS_EDITE_ELEMENTS}/${assignment.id}`, cleanPayload)
      }
      toast.success('Modifications sauvegardées avec succès')
      refreshAssignment()
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  // // Fonction pour ouvrir le modal d'ajout d'autre coût
  // const handleAddOtherCost = () => {
  //   setNewOtherCosts([{ other_cost_type_id: 0, amount: 0 }])
  //   setShowAddOtherCostModal(true)
  // }

  // // Fonction pour ajouter une ligne de coût
  // const handleAddOtherCostLine = () => {
  //   setNewOtherCosts([...newOtherCosts, { other_cost_type_id: 0, amount: 0 }])
  // }

  // // Fonction pour retirer une ligne de coût
  // const handleRemoveOtherCostLine = (index: number) => {
  //   setNewOtherCosts(newOtherCosts.filter((_, i) => i !== index))
  // }

  // // Fonction pour mettre à jour une ligne
  // const handleUpdateOtherCostLine = (index: number, field: 'other_cost_type_id' | 'amount', value: any) => {
  //   setNewOtherCosts(newOtherCosts.map((cost, i) =>
  //     i === index ? { ...cost, [field]: value } : cost
  //   ))
  // }

  // // Fonction pour créer un ou plusieurs autres coûts
  // const handleCreateOtherCost = async () => {
  //   try {
  //     // Validation : au moins une ligne valide
  //     const validCosts = newOtherCosts.filter(c => c.other_cost_type_id && c.amount > 0)
  //     if (validCosts.length === 0) {
  //       toast.error('Veuillez saisir au moins un coût valide')
  //       return
  //     }
  //     // Payload conforme à l'API
  //     await axiosInstance.post(`${API_CONFIG.ENDPOINTS.OTHER_COSTS}`, {
  //       assignment_id: String(assignment?.id),
  //       other_costs: validCosts.map(c => ({
  //         other_cost_type_id: String(c.other_cost_type_id),
  //         amount: Number(c.amount)
  //       }))
  //     })
  //     toast.success(validCosts.length > 1 ? 'Coûts ajoutés avec succès' : 'Nouveau coût ajouté avec succès')
  //     setShowAddOtherCostModal(false)
  //     setNewOtherCosts([{ other_cost_type_id: 0, amount: 0 }])
  //     refreshAssignment()
  //   } catch (err) {
  //     console.error('Erreur lors de l\'ajout du coût:', err)
  //     toast.error('Erreur lors de l\'ajout du coût')
  //   }
  // }

  // // Fonctions pour gérer les constats


  // // Log de débogage pour le modal
  // if (showAddOtherCostModal) {
  //   // (On peut supprimer ce log après debug)
  //   // console.log('🔍 Modal Debug - otherCostTypes:', {
  //   //   length: otherCostTypes?.length,
  //   //   data: otherCostTypes,
  //   //   isArray: Array.isArray(otherCostTypes),
  //   //   type: typeof otherCostTypes
  //   // })
  // }

  if (loading) {
    return (
      <>
        <Header fixed>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Chargement du dossier...</span>
          </div>
        </Main>
      </>
    )
  }

  if (error || !assignment) {
    return (
      <>
        <Header fixed>
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
              <p className="text-gray-600 mb-4">{error || 'Dossier non trouvé'}</p>
              <Button onClick={() => navigate({ to: '/assignments' })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux dossiers
              </Button>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        {/* Structure responsive */}
        <div className="flex h-screen">

          <div className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed && !isMobile ? '' : ''
          }`}>
            <ScrollArea className="h-full">
              <div className={`p-6 ${isMobile ? 'pb-24' : ''}`}>

                {/* <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" onClick={() => navigate({ to: `/assignments/edit/${assignment.id}` })}>
                      Modifier le dossier
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate({ to: `/assignments/realize/${assignment.id}` }) }>
                      Modifier la réalisation
                    </Button>
                  </div>
                  <Separator />
                </div> */}


                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate({ to: `/assignments/details/${assignment.id}` })}
                        className="p-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-xl font-bold text-gray-900">Fiche de travaux</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      {(isExpert) && assignment?.status?.code === 'realized' && (
                        <>
                          <Button  onClick={validateAssignment} disabled={validating} className="bg-green-600 hover:bg-green-700">
                            {validating ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                            Valider la fiche de travaux
                          </Button>
                        </>
                      )}
                      {assignment.shocks && assignment.shocks.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const allShockIds = assignment.shocks.map(s => s.id)
                              const allCollapsed = allShockIds.every(id => collapsedShocks.has(id))
                              if (allCollapsed) {
                                // Expand all
                                setCollapsedShocks(new Set())
                              } else {
                                // Collapse all
                                setCollapsedShocks(new Set(allShockIds))
                              }
                            }}
                            className="text-xs"
                          >
                            {assignment.shocks.every(s => collapsedShocks.has(s.id)) ? (
                              <>
                                <ChevronDown className="mr-1 h-3 w-3" />
                                Tout développer
                              </>
                            ) : (
                              <>
                                <ChevronUp className="mr-1 h-3 w-3" />
                                Tout réduire
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                      {assignment.shocks && assignment.shocks.length > 1 && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReorderSheet()}
                          title="Réorganiser les chocs"
                        >
                          <List className="mr-2 h-4 w-4" />
                          Réorganiser les points de choc
                        </Button>
                      )}
                      {/* Bouton existant Ajouter un point de choc */}
                      <Button 
                        onClick={() => setShowShockModal(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un point de choc
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />


                  {assignment.shocks && assignment.shocks.length > 0 ? (
                    <div className="relative">
                      {/* Timeline verticale continue */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200" />
                      
                      {/* Liste des chocs avec timeline */}
                      <div className="space-y-6">
                          {assignment.shocks.map((shock, index) => {
                            const isCollapsed = collapsedShocks.has(shock?.id || 0)
                            const isHighlighted = highlightedShockId === shock?.id
                            const isLast = index === assignment.shocks.length - 1
                            
                            return (
                              <div
                                key={shock?.id || `shock-${index}`}
                                data-shock-id={shock?.id || ''}
                                className={cn(
                                  "relative flex gap-6 transition-all duration-200",
                                  isHighlighted && "z-10"
                                )}
                              >
                                {/* Timeline Node à gauche */}
                                <div className="relative flex-shrink-0 w-16 flex flex-col items-center">
                                  {/* Ligne de connexion vers le haut (sauf pour le premier) */}
                                  {index > 0 && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-blue-300" />
                                  )}
                                  
                                  {/* Point de la timeline */}
                                  <div className={cn(
                                    "relative z-10 w-8 h-8 rounded-full border-4 transition-all duration-200",
                                    isHighlighted
                                      ? "bg-blue-600 border-blue-600 ring-4 ring-blue-200 shadow-lg scale-110"
                                      : "bg-white border-blue-400 hover:border-blue-500 hover:scale-105",
                                    "flex items-center justify-center"
                                  )}>
                                    {isCollapsed ? (
                                      <ChevronDown className="h-3 w-3 text-blue-600" />
                                    ) : (
                                      <ChevronUp className="h-3 w-3 text-blue-600" />
                                    )}
                                  </div>
                                  
                                  {/* Numéro de choc */}
                                  <div className={cn(
                                    "mt-2 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center",
                                    isHighlighted
                                      ? "bg-blue-600 text-white"
                                      : "bg-blue-100 text-blue-700"
                                  )}>
                                    {index + 1}
                                  </div>
                                  
                                  {/* Ligne de connexion vers le bas (sauf pour le dernier) */}
                                  {!isLast && (
                                    <div className={cn(
                                      "absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 transition-all duration-200",
                                      isCollapsed ? "h-8 bg-blue-200" : "h-full bg-blue-300"
                                    )} />
                                  )}
                                </div>
                                
                                {/* Contenu du choc à droite */}
                                <div className={cn(
                                  "flex-1 border rounded-lg transition-all duration-200 overflow-hidden",
                                  isHighlighted
                                    ? "ring-2 ring-blue-500 bg-blue-50/30 shadow-lg"
                                    : "bg-white hover:bg-gray-50 hover:shadow-md",
                                  isCollapsed
                                    ? "border-gray-200"
                                    : "border-blue-200 shadow-sm"
                                )}>
                                  {/* En-tête du choc */}
                                  <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between gap-4">
                                      {/* Section gauche : Sélecteur et actions */}
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Bouton de collapse */}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => shock?.id && toggleShockCollapse(shock.id)}
                                          className="p-1.5 hover:bg-blue-100 rounded-md transition-colors shrink-0"
                                          title={isCollapsed ? "Développer" : "Réduire"}
                                        >
                                          <ChevronDown 
                                            className={cn(
                                              "h-4 w-4 text-blue-600 transition-transform duration-200",
                                              isCollapsed ? 'rotate-0' : 'rotate-180'
                                            )} 
                                          />
                                        </Button>
                                        
                                        {/* Sélecteur de point de choc */}
                                        <div className="flex-1 min-w-0">
                                          <ShockPointSelect
                                            className='w-full max-w-md'
                                            value={String(shock?.shock_point?.id || '')}  
                                            onValueChange={async (newShockPointId) => {
                                              try {
                                                await axiosInstance.put(`/shocks/${shock?.id}`, {
                                                  shock_point_id: String(newShockPointId)
                                                })
                                                toast.success('Point de choc modifié')
                                                refreshAssignment()
                                              } catch (err) {
                                                toast.error('Erreur lors de la modification du point de choc')
                                              }
                                            }}
                                            showSelectedInfo={true}
                                            onCreateNew={handleCreateShockPoint}
                                          />
                                        </div>

                                        {/* Bouton de réorganisation */}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-blue-50 shrink-0"
                                          title="Réorganiser les chocs"
                                          onClick={() => handleOpenReorderSheet(shock?.id)}
                                        >
                                          <List className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      
                                      {/* Section droite : Statistiques et actions */}
                                      <div className="flex items-center gap-4 shrink-0">
                                        {/* Statistiques */}
                                        <div className="flex items-center gap-3 text-sm">
                                          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md">
                                            <Package className="h-3.5 w-3.5 text-blue-600" />
                                            <span className="font-medium text-blue-700">{shock?.shock_works?.length || 0}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md">
                                            <Users className="h-3.5 w-3.5 text-green-600" />
                                            <span className="font-medium text-green-700">{shock?.workforces?.length || 0}</span>
                                          </div>
                                          <div className="px-3 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-md border border-purple-200">
                                            <span className="font-bold text-purple-700">
                                              {formatCurrency(shock?.amount || '0')}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Bouton de suppression */}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => shock?.id && handleDeleteShock(shock.id)}
                                          className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 shrink-0"
                                          title="Supprimer ce choc"
                                          disabled={!shock?.id}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Contenu collapsible */}
                                  <div 
                                    className={cn(
                                      "transition-all duration-300 ease-in-out overflow-hidden",
                                      isCollapsed
                                        ? 'max-h-0 opacity-0' 
                                        : 'opacity-100'
                                    )}
                                  >
                                    <div className="p-4 space-y-4">
                                      {/* Tableau des fournitures */}
                                      <div>
                                        <ExpertiseSheetShockSuppliesTable
                                          supplies={supplies.map((supply: any) => ({
                                            id: String(supply?.id),
                                            label: supply?.label || '', 
                                            code: supply?.code || '',
                                            price: supply?.price || 0
                                          }))}
                                          shockWorks={(shock.shock_works || []).map((work: any) => {
                                            // Vérification de sécurité pour work.id
                                            if (!work?.id) return null
                                            
                                            return {
                                              id: work.id, // ID réel de l'API pour la réorganisation
                                              uid: work.id?.toString() || crypto.randomUUID(),
                                              supply_id: String(work.supply?.id || ''),
                                              supply_label: work.supply?.label || work.supply_label || '',
                                              disassembly: work?.disassembly || false,
                                              replacement: work?.replacement || false,
                                              repair: work?.repair || false,
                                              paint: work?.paint || false,
                                              control: work?.control || false,
                                              obsolescence: work?.obsolescence || false,
                                              comment: work?.comment || '',
                                              obsolescence_rate: Number(work?.obsolescence_rate) || 0,
                                              recovery_amount: Number(work?.recovery_amount) || 0,
                                              discount: Number(work?.discount) || 0,
                                              amount: Number(work?.amount) || 0,
                                              obsolescence_amount_excluding_tax: Number(work?.obsolescence_amount_excluding_tax) || 0,
                                              obsolescence_amount_tax: Number(work?.obsolescence_amount_tax) || 0,
                                              obsolescence_amount: Number(work?.obsolescence_amount) || 0,
                                              recovery_amount_excluding_tax: Number(work?.recovery_amount_excluding_tax) || 0,
                                              recovery_amount_tax: Number(work?.recovery_amount_tax) || 0,
                                              new_amount_excluding_tax: Number(work?.new_amount_excluding_tax) || 0,
                                              new_amount_tax: Number(work?.new_amount_tax) || 0,
                                              new_amount: Number(work?.new_amount) || 0,
                                              discount_amount: Number(work?.discount_amount) || 0,
                                              discount_amount_excluding_tax: Number(work?.discount_amount_excluding_tax) || 0,
                                              discount_amount_tax: Number(work?.discount_amount_tax) || 0,
                                              amount_excluding_tax: Number(work?.amount_excluding_tax) || 0,
                                              amount_tax: Number(work?.amount_tax) || 0
                                            }
                                          }).filter((work): work is NonNullable<typeof work> => work !== null)}
                                          onUpdate={async (index, updatedWork) => {
                                            try {
                                              const work = shock?.shock_works?.[index]
                                              if (work && work?.id) {
                                                // On envoie tout l'objet d'un coup
                                                await axiosInstance.put(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}/${work?.id}`, {
                                                  supply_id: updatedWork?.supply_id,
                                                  disassembly: updatedWork?.disassembly,
                                                  replacement: updatedWork?.replacement,
                                                  repair: updatedWork?.repair,
                                                  paint: updatedWork?.paint,
                                                  control: updatedWork?.control,
                                                  obsolescence: updatedWork?.obsolescence,
                                                  comment: updatedWork?.comment,
                                                  obsolescence_rate: updatedWork?.obsolescence_rate,
                                                  recovery_amount: updatedWork?.recovery_amount,
                                                  discount: updatedWork?.discount,
                                                  amount: updatedWork?.amount
                                                })
                                                toast.success('Fourniture mise à jour')
                                                refreshAssignment()
                                              }
                                            } catch (err) {
                                              console.error('Erreur mise à jour fourniture:', err)
                                              toast.error('Erreur lors de la mise à jour')
                                            }
                                          }}
                                          onAdd={async (shockWorkData?: any) => {
                                            try {
                                              // Préparer le payload selon l'API
                                              const payload = {
                                                paint_type_id: "1", // Valeur par défaut - à adapter selon tes besoins
                                                shock_id: String(shock.id || 0),
                                                shock_works: [{
                                                  supply_id: String(shockWorkData?.supply_id || 0),
                                                  disassembly: Boolean(shockWorkData?.disassembly || false),
                                                  replacement: Boolean(shockWorkData?.replacement || false),
                                                  repair: Boolean(shockWorkData?.repair || false),
                                                  paint: Boolean(shockWorkData?.paint || false),
                                                  control: Boolean(shockWorkData?.control || false),
                                                  obsolescence: Boolean(shockWorkData?.obsolescence || false),
                                                  comment: shockWorkData?.comment || null,
                                                  obsolescence_rate: Number(shockWorkData?.obsolescence_rate || 0),
                                                  recovery_amount: Number(shockWorkData?.recovery_amount || 0),
                                                  discount: Number(shockWorkData?.discount || 0),
                                                  amount: Number(shockWorkData?.amount || 0)
                                                }]
                                              }
                                              
                                              await axiosInstance.post(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}`, payload)
                                              toast.success('Fourniture ajoutée')
                                              refreshAssignment()
                                            } catch (err) {
                                              console.error('Erreur lors de l\'ajout de la fourniture:', err)
                                              toast.error("Erreur lors de l'ajout de la fourniture")
                                            }
                                          }}
                                          onRemove={async (index: number) => {
                                            try {
                                              const work = shock?.shock_works[index]
                                              if (work && work?.id) {
                                                await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}/${work?.id}`)
                                                toast.success('Fourniture supprimée')
                                                refreshAssignment()
                                              }
                                            } catch (err) {
                                              console.error('Erreur suppression fourniture:', err)
                                              toast.error('Erreur lors de la suppression')
                                            }
                                          }}
                                          onValidateRow={async (index: number) => {
                                            // Validation automatique après modification
                                            toast.success('Fourniture validée')
                                          }}
                                          shockId={shock?.id}
                                          paintTypeId={shock?.paint_type?.id || 1}
                                          onReorderSave={async (shockWorkIds) => handleReorderShockWorks(shock?.id, shockWorkIds)}
                                          onAssignmentRefresh={refreshAssignment}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  ) : (
                    <Card className="shadow-none">
                      <CardContent className="p-6">
                        <div className="text-center py-8 text-gray-500">
                          Aucun point de choc enregistré
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Bottom Bar pour Mobile */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/assignments' })}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <p className="text-xs font-medium">#{assignment.reference}</p>
                  <p className="text-xs text-gray-500">{assignment.status?.label || 'Statut inconnu'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(assignment.status.code)}>
                  {formatCurrency(assignment.total_amount)}
                </Badge>
                <Sheet open={showMobileSheet} onOpenChange={setShowMobileSheet}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {/* Navigation mobile */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setActiveTab('overview')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'overview' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Vue d'ensemble</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('shocks')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'shocks' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            <span className="text-sm font-medium">Points de choc</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('costs')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'costs' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Autres coûts</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('receipts')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'receipts' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            <span className="text-sm font-medium">Quittances</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('constatations')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'constatations' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">Constatations</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('additional-info')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'additional-info' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Infos additionnelles</span>
                          </div>
                        </button>
                      </div>

                      {/* Actions rapides */}
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              handleSave()
                              setShowMobileSheet(false)
                            }}
                            disabled={saving}
                            className="flex-1"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sauvegarde...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        )}

        {/* Barre de navigation mobile */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/assignments' })}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <p className="text-xs font-medium">#{assignment.reference}</p>
                  <p className="text-xs text-gray-500">{assignment.status.label}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(assignment.status.code)}>
                  {formatCurrency(assignment.total_amount)}
                </Badge>
                <Sheet open={showMobileSheet} onOpenChange={setShowMobileSheet}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {/* Navigation mobile */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setActiveTab('overview')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'overview' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Vue d'ensemble</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('shocks')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'shocks' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            <span className="text-sm font-medium">Points de choc</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('costs')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'costs' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Autres coûts</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('receipts')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'receipts' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            <span className="text-sm font-medium">Quittances</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('constatations')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'constatations' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">Constatations</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('additional-info')
                            setShowMobileSheet(false)
                          }}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            activeTab === 'additional-info' 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Infos additionnelles</span>
                          </div>
                        </button>
                      </div>

                      {/* Actions rapides */}
                      <div className="pt-4 border-t">
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => {
                              handleSave()
                              setShowMobileSheet(false)
                            }}
                            disabled={saving}
                            className="flex-1"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sauvegarde...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        )}
      </Main>

      {/* Modal d'ajout de point de choc */}
      <ShockPointCreateModal
        open={showShockModal}
        onOpenChange={setShowShockModal}
        selectedShockPointId={selectedShockPointId}
        onSelectedShockPointIdChange={setSelectedShockPointId}
        shockPoints={shockPoints}
        shocks={assignment?.shocks?.map(shock => ({
          id: String(shock?.id || ''),
          shock_point_id: String(shock?.shock_point?.id || '')
        })) || []}
        onCreateShockPoint={handleCreateShockPoint}
        onAddShock={handleAddShock}
        loading={addingShock}
      />

      {/* Modal de création de point de choc */}
      <ShockPointMutateDialog
        open={showCreateShockPointModal}
        onOpenChange={setShowCreateShockPointModal}
        onSuccess={handleShockPointCreated}
      />

      {/* Dialogue de confirmation de suppression de choc */}
      <Dialog open={showDeleteShockDialog} onOpenChange={setShowDeleteShockDialog}>
        <DialogContent className="sm:max-w-md w-1/3">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce point de choc ? Cette action est irréversible et supprimera également toutes les fournitures et main d'œuvre associées.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteShockDialog(false)}
              disabled={deletingShock}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteShock}
              disabled={deletingShock}
            >
              {deletingShock ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'avertissement d'édition de choc */}
      <Dialog open={showEditShockWarning} onOpenChange={setShowEditShockWarning}>
        <DialogContent className="w-1/3">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Modification des informations de choc
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de modifier les informations d'un choc. Assurez-vous d'avoir sauvegardé toutes vos modifications avant de continuer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleEditShockWarningClose}
            >
              Annuler
            </Button>
            <Button
              variant="default"
              onClick={handleEditShockWarningContinue}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continuer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sheet de réorganisation des chocs */}
      <ShockReorderSheet
        open={showReorderSheet}
        onOpenChange={setShowReorderSheet}
        shocks={reorderShocksList}
        focusShockId={sheetFocusShockId}
        onConfirm={(ids) => handleConfirmReorderShocks(ids)}
        title="Réorganiser les points de choc"
      />
    </>
  )
}

