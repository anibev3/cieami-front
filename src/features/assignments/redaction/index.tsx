/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Car, 
  User, 
  Users,
  Package,
  Building2, 
  Calculator,
  Receipt,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Hash,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  GripVertical,
  List
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { assignmentService } from '@/services/assignmentService'
import { ShockWorkforceTableV2 } from '@/features/assignments/components/shock-workforce-table-v2'
import { ShockSuppliesEditTable } from '@/features/assignments/components/shock-supplies-edit-table'
import { OtherCostTypeSelect, WorkforceTypeSelect } from '@/features/widgets/reusable-selects'  
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { ReceiptManagement } from '@/features/assignments/components/receipt-management'
import { ShockPointSelect } from '@/features/widgets/shock-point-select'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Textarea } from '@/components/ui/textarea'

import { GeneralStateSelect } from '@/features/widgets/general-state-select'
import { TechnicalConclusionSelect } from '@/features/widgets/technical-conclusion-select'
import { ClaimNatureSelect } from '@/features/widgets/claim-nature-select'
import { RemarkSelect } from '@/features/widgets/remark-select'
import { SupplySelect } from '@/features/widgets/supply-select'
import AscertainmentEdit from '@/features/assignments/components/ascertainment-edit'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { ShockPointCreateModal } from '@/components/modals'
import { ShockPointMutateDialog } from '@/features/expertise/points-de-choc/components/shock-point-mutate-dialog'
import { cn } from '@/lib/utils'
// dnd-kit moved into reusable component
import { ShockReorderSheet, type ShockItem } from '@/features/assignments/components/shock-reorder-sheet'

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

export default function EditReportPage() {
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

  // États pour le modal d'ajout de point de choc
  const [showShockModal, setShowShockModal] = useState(false)
  const [selectedShockPointId, setSelectedShockPointId] = useState(0)
  const [showCreateShockPointModal, setShowCreateShockPointModal] = useState(false)
  
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
    if (tabFromUrl && ['overview', 'shocks', 'costs', 'receipts', 'additional-info', 'constatations'].includes(tabFromUrl)) {
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
        const response = await assignmentService.getAssignment(Number(id))
        
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
        const suppliesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SUPPLIES}?per_page=100000`)
        if (suppliesResponse.status === 200) {
          setSupplies(suppliesResponse.data.data)
        }

        // Charger les types de main d'œuvre
        const workforceTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.WORKFORCE_TYPES}?per_page=100000`)
        if (workforceTypesResponse.data.status === 200) {
          setWorkforceTypes(workforceTypesResponse.data.data)
        }

        // Charger les types d'autres coûts
        const otherCostTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.OTHER_COST_TYPES}?per_page=100000`)
        if (otherCostTypesResponse.status === 200 && Array.isArray(otherCostTypesResponse.data.data)) {
          setOtherCostTypes(otherCostTypesResponse.data.data)
        } else {
          setOtherCostTypes([])
        }

        // Charger les points de choc
        const shockPointsResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SHOCK_POINTS}?per_page=100000`)

        console.log("================> shockPointsResponse", shockPointsResponse.status)
        if (shockPointsResponse.status === 200) {
          setShockPoints(shockPointsResponse.data.data)
        }

        // Charger les types de peinture
        const paintTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.PAINT_TYPES}?per_page=100`)
        if (paintTypesResponse.status === 200) {
          setPaintTypes(paintTypesResponse.data.data)
        } else {
          console.error('Erreur lors du chargement des types de peinture:', paintTypesResponse.status)
        }

        // Charger les taux horaires
        const hourlyRatesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.HOURLY_RATES}?per_page=100`)
        if (hourlyRatesResponse.status === 200) {
          setHourlyRates(hourlyRatesResponse.data.data)
        } else {
          console.error('Erreur lors du chargement des taux horaires:', hourlyRatesResponse.status)
        }
        
        // Charger les données pour les informations additionnelles
        const generalStatesResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/general-states?per_page=100000`)
        if (generalStatesResponse.status === 200) {
          setGeneralStates(generalStatesResponse.data.data)
        }
        
        const claimNaturesResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/claim-natures?per_page=100000`)
        if (claimNaturesResponse.status === 200) {
          setClaimNatures(claimNaturesResponse.data.data)
        }
        
        const technicalConclusionsResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/technical-conclusions?per_page=100000`)
        if (technicalConclusionsResponse.status === 200) {
          setTechnicalConclusions(technicalConclusionsResponse.data.data)
        }
        
        const remarksResponse = await axiosInstance.get(`${API_CONFIG.BASE_URL}/remarks?per_page=100000`)
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
      const response = await assignmentService.getAssignment(Number(id))
      
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
  const handleReorderWorkforces = async (shockId: number, workforceIds: number[]) => {
    try {
      await assignmentService.reorderWorkforces(shockId, workforceIds)
      await refreshAssignment()
      toast.success('Ordre des main d\'œuvre mis à jour')
    } catch (error) {
      console.error('Erreur lors de la réorganisation des main d\'œuvre:', error)
      toast.error('Erreur lors de la réorganisation des main d\'œuvre')
    }
  }

  // Fonction pour ajouter un point de choc
  const handleAddShock = async (shockPointId: number) => {
    if (!assignment) return

    try {
      const payload = {
        assignment_id: assignment.id.toString(),
        shocks: [
          {
            shock_point_id: shockPointId.toString()
          }
        ]
      }

      await axiosInstance.post(`${API_CONFIG.ENDPOINTS.ADD_SHOCK_IN_MODIF}`, payload)
      await refreshAssignment()
      toast.success('Point de choc ajouté avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'ajout du point de choc:', error)
      toast.error('Erreur lors de l\'ajout du point de choc')
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'opened': return <AlertCircle className="h-4 w-4" />
      case 'realized': return <CheckCircle className="h-4 w-4" />
      case 'edited': return <FileText className="h-4 w-4" />
      case 'closed': return <CheckCircle className="h-4 w-4" />
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

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

  // Fonction pour déterminer si c'est une évaluation
  const isEvaluation = assignment?.expertise_type?.code === 'evaluation'
  
  // Fonction pour gérer le changement de la note d'expert
  const handleRemarkChange = (value: number | null) => {
    setSelectedRemarkId(value)
    
    // Quand une remarque est sélectionnée, pré-remplir le champ expert_remark
    if (value) {
      const selectedRemark = remarks.find(remark => remark.id === value)
      if (selectedRemark) {
        setExpertRemark(selectedRemark.description)
        toast.success(`Remarque "${selectedRemark.label}" chargée`)
      }
    } else {
      // Si aucune remarque n'est sélectionnée, vider le champ
      setExpertRemark('')
    }
  }

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
          vehicle_new_market_value_option: vehicleNewMarketValueOption
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

  // Fonction pour ouvrir le modal d'ajout d'autre coût
  const handleAddOtherCost = () => {
    setNewOtherCosts([{ other_cost_type_id: 0, amount: 0 }])
    setShowAddOtherCostModal(true)
  }

  // Fonction pour ajouter une ligne de coût
  const handleAddOtherCostLine = () => {
    setNewOtherCosts([...newOtherCosts, { other_cost_type_id: 0, amount: 0 }])
  }

  // Fonction pour retirer une ligne de coût
  const handleRemoveOtherCostLine = (index: number) => {
    setNewOtherCosts(newOtherCosts.filter((_, i) => i !== index))
  }

  // Fonction pour mettre à jour une ligne
  const handleUpdateOtherCostLine = (index: number, field: 'other_cost_type_id' | 'amount', value: any) => {
    setNewOtherCosts(newOtherCosts.map((cost, i) =>
      i === index ? { ...cost, [field]: value } : cost
    ))
  }

  // Fonction pour créer un ou plusieurs autres coûts
  const handleCreateOtherCost = async () => {
    try {
      // Validation : au moins une ligne valide
      const validCosts = newOtherCosts.filter(c => c.other_cost_type_id && c.amount > 0)
      if (validCosts.length === 0) {
        toast.error('Veuillez saisir au moins un coût valide')
        return
      }
      // Payload conforme à l'API
      await axiosInstance.post(`${API_CONFIG.ENDPOINTS.OTHER_COSTS}`, {
        assignment_id: String(assignment?.id),
        other_costs: validCosts.map(c => ({
          other_cost_type_id: String(c.other_cost_type_id),
          amount: Number(c.amount)
        }))
      })
      toast.success(validCosts.length > 1 ? 'Coûts ajoutés avec succès' : 'Nouveau coût ajouté avec succès')
      setShowAddOtherCostModal(false)
      setNewOtherCosts([{ other_cost_type_id: 0, amount: 0 }])
      refreshAssignment()
    } catch (err) {
      console.error('Erreur lors de l\'ajout du coût:', err)
      toast.error('Erreur lors de l\'ajout du coût')
    }
  }

  // Fonctions pour gérer les constats


  // Log de débogage pour le modal
  if (showAddOtherCostModal) {
    // (On peut supprimer ce log après debug)
    // console.log('🔍 Modal Debug - otherCostTypes:', {
    //   length: otherCostTypes?.length,
    //   data: otherCostTypes,
    //   isArray: Array.isArray(otherCostTypes),
    //   type: typeof otherCostTypes
    // })
  }

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
          {/* Sidebar - Desktop seulement */}
          {!isMobile && (
            <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
              sidebarCollapsed ? 'w-16' : 'w-64'
            }`}>
            {/* Header de la sidebar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/assignments' })}
                  className="hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {!sidebarCollapsed && (
                  <div>
                    <h1 className="text-sm font-bold">Modifier la redaction</h1>
                    <p className="text-xs text-gray-500">#{assignment.reference}</p>
                  </div>
                )}
              </div>
              
              {/* Bouton toggle sidebar */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-full mb-3"
              >
                {sidebarCollapsed ? (
                  // <ChevronRight className="h-4 w-4" />

                  <>
                  
                  <ChevronLeft className="h-4 w-4" />
                  </>
                 
                ) : (
                   <>
                    Fermer la sidebar
                  </>
                )}
              </Button>
              
              {/* Statut */}
              {!sidebarCollapsed && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(assignment.status.code)}
                    <Badge className={getStatusColor(assignment.status.code)}>
                      {assignment.status.label}
                    </Badge>
                  </div>

                  {/* Montant total */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Montant total</div>
                    <div className="text-sm font-bold text-green-600">
                      {formatCurrency(assignment.total_amount)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => changeActiveTab('overview')}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    activeTab === 'overview' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {!sidebarCollapsed && <span>Vue d'ensemble</span>}
                  </div>
                </button>

                <button
                  onClick={() => changeActiveTab('shocks')}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    activeTab === 'shocks' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    {!sidebarCollapsed && <span>Points de choc</span>}
                  </div>
                </button>

                <button
                  onClick={() => changeActiveTab('costs')}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    activeTab === 'costs' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {!sidebarCollapsed && <span>Autres coûts</span>}
                  </div>
                </button>

                <button
                  onClick={() => changeActiveTab('receipts')}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    activeTab === 'receipts' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    {!sidebarCollapsed && <span>Quittances</span>}
                  </div>
                </button>

                <button
                  onClick={() => changeActiveTab('additional-info')}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    activeTab === 'additional-info' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {!sidebarCollapsed && <span>Informations additionnelles</span>}
                  </div>
                </button>

                <button
                  onClick={() => changeActiveTab('constatations')}
                  className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                    activeTab === 'constatations' 
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {!sidebarCollapsed && <span>Constatations</span>}
                  </div>
                </button>
              </nav>
            </ScrollArea>
          </div>

          )}

          {/* Contenu principal avec marge adaptative */}
          <div className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed && !isMobile ? '' : ''
          }`}>
            <ScrollArea className="h-full">
              <div className={`p-6 ${isMobile ? 'pb-24' : ''}`}>

                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" onClick={() => navigate({ to: `/assignments/edit/${assignment.id}` })}>
                      Modifier le dossier
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate({ to: `/assignments/realize/${assignment.id}` }) }>
                      Modifier la réalisation
                    </Button>
                  </div>
                  <Separator />
                </div>

                {/* Vue d'ensemble */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Vue d'ensemble</h2>
                      <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black hover:bg-gray-800"
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
                    {/* Statuts et progression */}
                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Statuts et progression
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Statut édition</div>
                            <div className="text-sm font-bold text-blue-600">{assignment.edition_status}</div>
                            <div className="text-xs text-gray-500">{assignment.edition_per_cent}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Statut récupération</div>
                            <div className="text-sm font-bold text-green-600">{assignment.recovery_status}</div>
                            <div className="text-xs text-gray-500">{assignment.recovery_per_cent}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Expire édition</div>
                            <div className="text-sm font-bold text-orange-600">
                              {assignment.edition_time_expire_at ? formatDate(assignment.edition_time_expire_at) : 'Non défini'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Expire récupération</div>
                            <div className="text-sm font-bold text-red-600">
                              {assignment.recovery_time_expire_at ? formatDate(assignment.recovery_time_expire_at) : 'Non défini'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Récapitulatif financier */}
                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle>Récapitulatif financier</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Chocs</div>
                            <div className="text-xl font-bold text-blue-600">
                              {formatCurrency(assignment.shock_amount)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Autres coûts</div>
                            <div className="text-xl font-bold text-orange-600">
                              {formatCurrency(assignment.other_cost_amount)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Quittances</div>
                            <div className="text-xl font-bold text-green-600">
                              {formatCurrency(assignment.receipt_amount)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 mb-1">Total</div>
                            <div className="text-xl font-bold text-purple-600">
                              {formatCurrency(assignment.total_amount)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                      {/* Informations générales */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            Informations générales
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Référence</label>
                              <p className="text-base font-semibold">{assignment.reference}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Numéro de police</label>
                              <p className="text-base font-semibold">{assignment.policy_number || 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Numéro de sinistre</label>
                              <p className="text-base font-semibold">{assignment.claim_number || 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Date d'expertise</label>
                              <p className="text-base font-semibold">{formatDate(assignment.expertise_date)}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Lieu d'expertise</label>
                              <p className="text-base font-semibold">{assignment.expertise_place || 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Date de réception</label>
                              <p className="text-base font-semibold">{formatDate(assignment.received_at)}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Début de sinistre</label>
                              <p className="text-base font-semibold">{assignment.claim_starts_at ? formatDate(assignment.claim_starts_at) : 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Fin de sinistre</label>
                              <p className="text-base font-semibold">{assignment.claim_ends_at ? formatDate(assignment.claim_ends_at) : 'Non renseigné'}</p>
                            </div>
                          </div>
                        
                        </CardContent>
                      </Card>

                      {/* Véhicule */}
                      {assignment.vehicle && (
                        <Card className="shadow-none">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Car className="h-5 w-5" />
                              Véhicule
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-600">Plaque</label>
                                <p className="text-base font-semibold">{assignment.vehicle.license_plate}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Numéro de série</label>
                                <p className="text-base font-semibold">{assignment.vehicle.serial_number}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Type</label>
                                <p className="text-base font-semibold">{assignment.vehicle.type}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Option</label>
                                <p className="text-base font-semibold">{assignment.vehicle.option}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Kilométrage</label>
                                <p className="text-base font-semibold">{assignment.vehicle.mileage} km</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Puissance fiscale</label>
                                <p className="text-base font-semibold">{assignment.vehicle.fiscal_power} CV</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Places</label>
                                <p className="text-base font-semibold">{assignment.vehicle.nb_seats}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Valeur neuve</label>
                                <p className="text-base font-semibold">{formatCurrency(assignment.vehicle.new_market_value)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Date première circulation</label>
                                <p className="text-base font-semibold">{formatDate(assignment.vehicle.first_entry_into_circulation_date)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Visite technique</label>
                                <p className="text-base font-semibold">{assignment.vehicle.technical_visit_date ? formatDate(assignment.vehicle.technical_visit_date) : 'Non renseigné'}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Informations détaillées du véhicule */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-600">Marque</label>
                                <p className="text-base font-semibold">{assignment?.vehicle?.brand?.label}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Modèle</label>
                                <p className="text-base font-semibold">{assignment?.vehicle?.vehicle_model?.label}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Couleur</label>
                                <p className="text-base font-semibold">{assignment?.vehicle?.color?.label}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Carrosserie</label>
                                <p className="text-base font-semibold">{assignment?.vehicle?.bodywork?.label}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                      {/* Client */}
                      {assignment.client && (
                        <Card className="shadow-none">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Client
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Nom</label>
                              <p className="text-base font-semibold">{assignment.client.name}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{assignment.client.email}</span>
                            </div>
                            
                            {assignment.client.phone_1 && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{assignment.client.phone_1}</span>
                              </div>
                            )}

                            {assignment.client.phone_2 && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{assignment.client.phone_2}</span>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                              <span className="text-sm whitespace-pre-line">{assignment.client.address}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Assureur et Réparateur */}
                      {(assignment.insurer || assignment.repairer) && (
                        <Card className="shadow-none">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building2 className="h-5 w-5" />
                              Assureur & Réparateur
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {assignment.insurer && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Assureur</h4>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="font-semibold">{assignment.insurer.name}</p>
                                  <p className="text-xs text-gray-600">{assignment.insurer.code}</p>
                                  <p className="text-xs text-gray-600">{assignment.insurer.email}</p>
                                  {assignment.insurer.telephone && (
                                    <p className="text-xs text-gray-600">{assignment.insurer.telephone}</p>
                                  )}
                                  {assignment.insurer.address && (
                                    <p className="text-xs text-gray-600">{assignment.insurer.address}</p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {assignment.repairer && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Réparateur</h4>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="font-semibold">{assignment.repairer.name}</p>
                                  <p className="text-xs text-gray-600">{assignment.repairer.code}</p>
                                  <p className="text-xs text-gray-600">{assignment.repairer.email}</p>
                                  {assignment.repairer.telephone && (
                                    <p className="text-xs text-gray-600">{assignment.repairer.telephone}</p>
                                  )}
                                  {assignment.repairer.address && (
                                    <p className="text-xs text-gray-600">{assignment.repairer.address}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Types et Documents */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Types et Documents
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Type de dossier</label>
                              <p className="text-base font-semibold">{assignment.assignment_type.label}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Type d'expertise</label>
                              <p className="text-base font-semibold">{assignment.expertise_type.label}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Conclusion technique</label>
                              <p className="text-base font-semibold">{assignment.technical_conclusion?.label || 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">État général</label>
                              <p className="text-base font-semibold">{assignment.general_state?.label || 'Non renseigné'}</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-2">Documents transmis</label>
                            {assignment.document_transmitted && assignment.document_transmitted.length > 0 ? (
                              <div className="space-y-2">
                                {assignment.document_transmitted.map((doc) => (
                                  <div key={doc.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{doc.label}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">Aucun document transmis</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Valeurs et estimations */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Valeurs et estimations
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Valeur assurée</label>
                              <p className="text-base font-semibold">{assignment.assured_value ? formatCurrency(assignment.assured_value) : 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Valeur de récupération</label>
                              <p className="text-base font-semibold">{assignment.salvage_value ? formatCurrency(assignment.salvage_value) : 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Valeur neuve</label>
                              <p className="text-base font-semibold">{formatCurrency(assignment.new_market_value)}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Taux de dépréciation</label>
                              <p className="text-base font-semibold">{assignment.depreciation_rate}%</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Valeur marchande</label>
                              <p className="text-base font-semibold">{formatCurrency(assignment.market_value)}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Durée des travaux</label>
                              <p className="text-base font-semibold">{assignment.work_duration || 'Non renseigné'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Dates importantes */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Dates importantes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-600">Vu avant travaux</label>
                              <p className="text-base font-semibold">{assignment.seen_before_work_date ? formatDate(assignment.seen_before_work_date) : 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Vu pendant travaux</label>
                              <p className="text-base font-semibold">{assignment.seen_during_work_date ? formatDate(assignment.seen_during_work_date) : 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Vu après travaux</label>
                              <p className="text-base font-semibold">{assignment.seen_after_work_date ? formatDate(assignment.seen_after_work_date) : 'Non renseigné'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Date de contact</label>
                              <p className="text-base font-semibold">{assignment.contact_date ? formatDate(assignment.contact_date) : 'Non renseigné'}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Informations sur les utilisateurs */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informations sur les utilisateurs
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-gray-600">Créé par</label>
                            <p className="text-base font-semibold">{assignment.created_by.name}</p>
                            <p className="text-xs text-gray-600">{assignment.created_by.email}</p>
                          </div>
                          
                          {assignment.realized_by && (
                            <div>
                              <label className="text-xs font-medium text-gray-600">Réalisé par</label>
                              <p className="text-base font-semibold">{assignment.realized_by.name}</p>
                              <p className="text-xs text-gray-600">{assignment.realized_by.email}</p>
                            </div>
                          )}

                          {assignment.edited_by && (
                            <div>
                              <label className="text-xs font-medium text-gray-600">Modifié par</label>
                              <p className="text-base font-semibold">{assignment.edited_by.name}</p>
                              <p className="text-xs text-gray-600">{assignment.edited_by.email}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>


                  </div>
                )}

                {/* Points de choc */}
                {activeTab === 'shocks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Points de choc</h2>
                      <div className="flex items-center gap-3">
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

                    {assignment.shocks && assignment.shocks.length > 0 ? (
                      assignment.shocks.map((shock, index) => (
                        <div 
                          key={shock?.id || `shock-${index}`}
                          data-shock-id={shock?.id || ''}
                          className={cn(
                            "border rounded-lg transition-all duration-200",
                            highlightedShockId === shock?.id
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "bg-white hover:bg-gray-50",
                            collapsedShocks.has(shock?.id || 0)
                              ? "border-gray-200"
                              : "border-blue-200"
                          )}
                        >
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                {/* Bouton de collapse */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => shock?.id && toggleShockCollapse(shock.id)}
                                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                  title={collapsedShocks.has(shock?.id || 0) ? "Développer" : "Réduire"}
                                >
                                  <ChevronDown 
                                    className={cn(
                                      "h-4 w-4 transition-transform duration-200",
                                      collapsedShocks.has(shock?.id || 0) ? 'rotate-0' : 'rotate-0'
                                    )} 
                                  />
                                </Button>
                                
                                {/* Sélecteur de point de choc modifiable */}
                                <div className="flex-1">
                                  <ShockPointSelect
                                    className='w-1/2'
                                    value={shock?.shock_point?.id || 0}  
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
                                    shockPoints={shockPoints}
                                    showSelectedInfo={true}
                                  />
                                </div>

                                {/* Bouton discret pour ouvrir la réorganisation centré sur ce choc */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 text-gray-600 hover:text-gray-900"
                                  title="Réorganiser (centrer sur ce choc)"
                                  onClick={() => handleOpenReorderSheet(shock?.id)}
                                >
                                  <List className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Résumé à droite */}
                              <div className="text-sm text-gray-600 ml-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                  <span className="inline-flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    {shock.shock_works?.length || 0}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {shock.workforces?.length || 0}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(shock.amount)}
                                  </span>
                                  {/* Bouton de suppression */}
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() => shock?.id && handleDeleteShock(shock.id)}
                                    className="p-1 hover:bg-red-50 text-xs bg-red-100 hover:text-red-600 transition-all duration-200 rounded-md"
                                    title="Supprimer ce choc"
                                    disabled={!shock?.id}
                                  >
                                    <Trash2 className="h-1 w-1" /> Supprimer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Body collapsible avec animation */}
                          <div 
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              shock?.id && collapsedShocks.has(shock.id)
                                ? 'max-h-0 opacity-0 border-t-0' 
                                : 'opacity-100 border-t border-gray-100'
                            }`}
                          >
                            <div className={`space-y-4 ${
                              shock?.id && collapsedShocks.has(shock.id) ? 'p-0' : 'p-4'
                            } transition-all duration-300`}>
                            {/* Tableau des fournitures */}
                            <div>
                              <ShockSuppliesEditTable
                                supplies={supplies.map((supply: any) => ({
                                  id: supply?.id,
                                  label: supply?.label || '**ND**',
                                  code: supply?.code || '**ND**',
                                  price: supply?.price || 0
                                }))}
                                shockWorks={(shock.shock_works || []).map((work: any) => {
                                  // Vérification de sécurité pour work.id
                                  if (!work?.id) return null
                                  
                                  return {
                                    id: work.id, // ID réel de l'API pour la réorganisation
                                    uid: work.id?.toString() || crypto.randomUUID(),
                                    supply_id: work.supply?.id || 0,
                                    supply_label: work.supply?.label || '',
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

                            <Separator />
                            
                            {/* Section Main d'œuvre */}
                            <div>
                              {/* Vérifier que les données de référence sont chargées */}
                              {/* Debug: Afficher l'état des données */}
                              {/* <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                                <div>Debug - paintTypes: {paintTypes.length} | hourlyRates: {hourlyRates.length}</div>
                                <div>shock.paint_type.id: {shock?.paint_type?.id || 'undefined'}</div>
                                <div>shock.hourly_rate.id: {shock?.hourly_rate?.id || 'undefined'}</div>
                              </div> */}
                              
                              {/* Permettre l'affichage même si les données ne sont pas complètement chargées */}
                              {/* Le composant peut s'afficher avec des données partielles */}
                              <ShockWorkforceTableV2
                                shockId={shock?.id}
                                workforces={(shock.workforces || []).filter(w => w.id !== undefined).map((w: any) => ({
                                  id: w.id!, // ID réel de l'API pour la réorganisation
                                  uid: w.id?.toString() || crypto.randomUUID(), // UID pour le drag & drop
                                  workforce_type: w?.workforce_type,
                                  workforce_type_id: w?.workforce_type?.id || 0,
                                  nb_hours: w?.nb_hours,
                                  work_fee: w?.work_fee,
                                  discount: w?.discount,
                                  with_tax: w?.with_tax === 1 || w?.with_tax === true, // Convertir 1/0 en boolean
                                  amount_excluding_tax: w?.amount_excluding_tax,
                                  amount_tax: w?.amount_tax,
                                  amount: w?.amount,
                                  all_paint: w?.all_paint === 1 || w?.all_paint === true,
                                  // Ajouter les IDs pour la synchronisation
                                  paint_type_id: shock?.paint_type?.id,
                                  hourly_rate_id: shock?.hourly_rate?.id
                                }))}
                                paintTypes={paintTypes || []}
                                hourlyRates={hourlyRates || []}
                                onUpdate={(updatedWorkforces) => {
                                  // Mettre à jour les données locales
                                  const updatedAssignment = { ...assignment }
                                  const shockIndex = updatedAssignment?.shocks?.findIndex(s => s?.id === shock?.id)
                                  if (shockIndex !== -1) {
                                    updatedAssignment.shocks[shockIndex].workforces = updatedWorkforces as any
                                    setAssignment(updatedAssignment)
                                  }
                                }}
                                onAdd={async (workforceData?: any) => {
                                  try {
                                    // Préparer le payload selon l'API
                                    const payload = {
                                      shock_id: String(shock?.id || 0),
                                      hourly_rate_id: String(shock?.hourly_rate?.id || 1), // Utiliser le taux du shock
                                      paint_type_id: String(shock?.paint_type?.id || 1), // Utiliser le type du shock
                                      workforces: [{
                                        workforce_type_id: String(workforceData?.workforce_type_id || 0),
                                        nb_hours: Number(workforceData?.nb_hours || 0),
                                        discount: Number(workforceData?.discount || 0),
                                        with_tax: workforceData?.with_tax !== undefined ? workforceData.with_tax : true,
                                        all_paint: workforceData?.all_paint || false
                                      }]
                                    }
                                    
                                    await axiosInstance.post(`${API_CONFIG.ENDPOINTS.WORKFORCES}`, payload)
                                    toast.success('Main d\'œuvre ajoutée')
                                    refreshAssignment()
                                  } catch (err) {
                                    toast.error("Erreur lors de l'ajout de la main d'œuvre")
                                  }
                                }}
                                onAssignmentRefresh={refreshAssignment}
                                // Props pour type de peinture et taux horaire - utiliser les valeurs du shock
                                paintTypeId={shock?.paint_type?.id}
                                hourlyRateId={shock?.hourly_rate?.id}
                                // Prop withTax basée sur la première workforce du shock
                                withTax={Boolean(shock?.workforces?.[0]?.with_tax)}
                                onPaintTypeChange={async (value: number) => {
                                  try {
                                    // Mettre à jour le type de peinture pour ce shock
                                    // Note: Cette mise à jour se fait via le composant ShockWorkforceTableV2
                                    // qui gère déjà la mise à jour via l'API workforce
                                    console.log('Type de peinture changé:', value, 'pour shock:', shock?.id || 'unknown')
                                  } catch (err) {
                                    toast.error('Erreur lors de la mise à jour du type de peinture')
                                  }
                                }}
                                onHourlyRateChange={async (value: number) => {
                                  try {
                                    // Mettre à jour le taux horaire pour ce shock
                                    // Note: Cette mise à jour se fait via le composant ShockWorkforceTableV2
                                    // qui gère déjà la mise à jour via l'API workforce
                                    console.log('Taux horaire changé:', value, 'pour shock:', shock?.id || 'unknown')
                                  } catch (err) {
                                    toast.error('Erreur lors de la mise à jour du taux horaire')
                                  }
                                }}
                                onReorderSave={async (workforceIds) => {
                                  if (shock?.id) {
                                    await handleReorderWorkforces(shock.id, workforceIds)
                                  }
                                }}
                              />
                            </div>
                          </div>
                          </div>
                        </div>
                      ))
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
                )}

                {/* Autres coûts */}
                {activeTab === 'costs' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-purple-600" />
                        Autres coûts
                      </h2>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleAddOtherCost}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un coût
                        </Button>
                      </div>
                    </div>

                    {assignment.other_costs && assignment.other_costs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {assignment.other_costs.map((cost) => (
                          <OtherCostItem
                            key={cost.id}
                            cost={cost}
                            otherCostTypes={otherCostTypes}
                            onUpdate={async (field, value) => {
                              try {
                                await axiosInstance.put(`${API_CONFIG.ENDPOINTS.OTHER_COSTS}/${cost.id}`, {
                                  assignment_id: String(assignment.id),
                                  other_cost_type_id: String(field === 'other_cost_type_id' ? value : cost.other_cost_type?.id),
                                  amount: Number(field === 'amount' ? value : cost.amount)
                                })
                                toast.success('Coût mis à jour')
                                refreshAssignment()
                              } catch (err) {
                                console.error('Erreur mise à jour coût:', err)
                                toast.error('Erreur lors de la mise à jour')
                              }
                            }}
                            onDelete={async () => {
                              try {
                                await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.OTHER_COSTS}/${cost.id}`)
                                toast.success('Coût supprimé')
                                refreshAssignment()
                              } catch (err) {
                                console.error('Erreur suppression coût:', err)
                                toast.error('Erreur lors de la suppression')
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                          <Calculator className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                          <h3 className="text-base font-semibold text-gray-700 mb-2">Aucun coût autre</h3>
                          <p className="text-sm text-gray-500 mb-4">Ajoutez des coûts supplémentaires si nécessaire</p>
                          <Button 
                            onClick={handleAddOtherCost}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un coût autre
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Récapitulatif des autres coûts */}
                    {assignment.other_costs && assignment.other_costs.length > 0 && (
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-purple-600" />
                            Récapitulatif des autres coûts
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-xs text-gray-600 mb-1">Nombre de coûts</div>
                              <div className="text-xl font-bold text-purple-600">{assignment.other_costs.length}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600 mb-1">Total HT</div>
                              <div className="text-xl font-bold text-blue-600">
                                {formatCurrency(assignment.other_cost_amount_excluding_tax)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600 mb-1">Total TTC</div>
                              <div className="text-xl font-bold text-green-600">
                                {formatCurrency(assignment.other_cost_amount)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Constats */}
                {activeTab === 'constatations' && (
                  <AscertainmentEdit
                    ascertainments={assignment.ascertainments || []}
                    onUpdate={(updatedAscertainments) => {
                      // Mettre à jour les constatations dans l'état local
                      setAssignment(prev => prev ? {
                        ...prev,
                        ascertainments: updatedAscertainments
                      } : null)
                    }}
                  />
                )}

                {/* Quittances */}
                {activeTab === 'receipts' && (
                  <ReceiptManagement
                    assignmentId={assignment.id}
                    receipts={assignment.receipts || []}
                    onRefresh={refreshAssignment}
                  />
                )}

                {/* Informations additionnelles */}
                {activeTab === 'additional-info' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Informations additionnelles</h2>
                      <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black hover:bg-gray-800"
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

                    <Card className="shadow-none">
                      <CardHeader>
                        <CardTitle>Informations complémentaires</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                               <Label htmlFor="general-state">État général *</Label>
                               <GeneralStateSelect
                                 value={generalStateId || 0}
                                 onValueChange={setGeneralStateId}
                                 generalStates={generalStates}
                                 placeholder="Sélectionner un état général"
                               />
                             </div>

                                <div className="space-y-2">
                                 <Label htmlFor="technical-conclusion">Conclusion technique *</Label>
                                 <TechnicalConclusionSelect
                                   value={technicalConclusionId || 0}
                                   onValueChange={setTechnicalConclusionId}
                                   technicalConclusions={technicalConclusions}
                                   placeholder="Sélectionner une conclusion technique"
                                 />
                               </div>

                                <div className="space-y-2">
                                 <Label htmlFor="claim-nature">Nature du sinistre *</Label>
                                 <ClaimNatureSelect
                                   value={claimNatureId}
                                   onValueChange={setClaimNatureId}
                                   placeholder="Sélectionner une nature de sinistre"
                                 />
                               </div>

                                <div className="space-y-2">
                                 <Label htmlFor="remark">Note d'expert *</Label>
                                 <RemarkSelect
                                   value={selectedRemarkId}
                                   onValueChange={handleRemarkChange}
                                   placeholder="Sélectionner une note d'expert"
                                 />
                               </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="expert-remark">Remarque d'expert dans le rapport *</Label>
                              <RichTextEditor
                                value={expertRemark}
                                onChange={setExpertRemark}
                                placeholder="Saisir la remarque d'expert dans le rapport..."
                                className="min-h-[120px]"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="seen-before-work">Date de visite avant les travaux</Label>
                                <Input
                                  id="seen-before-work"
                                  type="date"
                                  value={seenBeforeWorkDate || ''}
                                  onChange={(e) => setSeenBeforeWorkDate(e.target.value || null)}
                                  className="w-full"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="seen-during-work">Date de visite pendant les travaux</Label>
                                <Input
                                  id="seen-during-work"
                                  type="date"
                                  value={seenDuringWorkDate || ''}
                                  onChange={(e) => setSeenDuringWorkDate(e.target.value || null)}
                                  className="w-full"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="seen-after-work">Date de visite après les travaux</Label>
                                <Input
                                  id="seen-after-work"
                                  type="date"
                                  value={seenAfterWorkDate || ''}
                                  onChange={(e) => setSeenAfterWorkDate(e.target.value || null)}
                                  className="w-full"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="contact-date">Date de contact</Label>
                                <Input
                                  id="contact-date"
                                  type="date"
                                  value={contactDate || ''}
                                  onChange={(e) => setContactDate(e.target.value || null)}
                                  className="w-full"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="expertise-place">Lieu de l'expertise</Label>
                                <Input
                                  id="expertise-place"
                                  value={expertisePlace}
                                  onChange={(e) => setExpertisePlace(e.target.value)}
                                  placeholder="Saisir le lieu de l'expertise"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="assured-value">Valeur assurée (FCFA)</Label>
                                <Input
                                  id="assured-value"
                                  type="number"
                                  value={assuredValue}
                                  onChange={(e) => setAssuredValue(parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="salvage-value">Valeur de sauvetage (FCFA)</Label>
                                <Input
                                  id="salvage-value"
                                  type="number"
                                  value={salvageValue}
                                  onChange={(e) => setSalvageValue(parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="work-duration">Durée des travaux</Label>
                                <Input
                                  id="work-duration"
                                  value={workDuration}
                                  onChange={(e) => setWorkDuration(e.target.value)}
                                  placeholder="Ex: 5 jours"
                                />
                              </div>
                            </div>
                          {/* </>
                        // ) : (
                        //   // Champs pour les dossiers d'évaluation
                        //   <> */}
                            <div className="space-y-2">
                              <Label htmlFor="instructions">Instructions de l'expert</Label>
                              <RichTextEditor
                                value={instructions}
                                onChange={setInstructions}
                                placeholder="Saisir les instructions de l'expert..."
                                className="min-h-[120px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="market-incidence-rate">Taux d'incidence marché (%)</Label>
                              <Input
                                id="market-incidence-rate"
                                type="number"
                                value={marketIncidenceRate}
                                onChange={(e) => setMarketIncidenceRate(parseFloat(e.target.value) || 0)}
                                placeholder="0"
                              />
                        </div>
                        
                                              {/* Section de modification des valeurs de marché */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            Modifier les valeurs de marché
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="vehicle-new-market-value-option">
                                Option de la valeur neuve du véhicule
                              </Label>
                              <Select 
                                value={vehicleNewMarketValueOption || ''} 
                                onValueChange={(value) => {
                                  setVehicleNewMarketValueOption(value)
                                  // Reset de la valeur neuve lors du changement d'option
                                  setNewMarketValue(null)
                                }}
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder="Sélectionner l'état de commercialisation..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fa">Fabrication abandonnée</SelectItem>
                                  <SelectItem value="nc">Non commercialisé</SelectItem>
                                  <SelectItem value="value">Valeur neuve</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* {vehicleNewMarketValueOption === 'value' && ( */}
                              <div className="space-y-2">
                                <Label htmlFor="new-market-value">
                                  Valeur neuve du véhicule (FCFA)
                                </Label>
                                <Input
                                  id="new-market-value"
                                  type="number"
                                  min="0"
                                  step="1000"
                                  value={newMarketValue || ''}
                                  onChange={(e) => setNewMarketValue(parseFloat(e.target.value) || null)}
                                  placeholder="Saisir la nouvelle valeur de marché"
                                />
                              </div>
                            {/* // )} */}

                            {/* Champs supplémentaires de valeur de marché */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="depreciation-rate">
                                  Taux de dépréciation (%)
                                </Label>
                                <Input
                                  id="depreciation-rate"
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={depreciationRate || ''}
                                  onChange={(e) => setDepreciationRate(parseFloat(e.target.value) || null)}
                                  placeholder="Saisir le taux de dépréciation"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="market-value">
                                  Valeur vénale (FCFA)
                                </Label>
                                <Input
                                  id="market-value"
                                  type="number"
                                  min="0"
                                  step="1000"
                                  value={marketValue || ''}
                                  onChange={(e) => setMarketValue(parseFloat(e.target.value) || null)}
                                  placeholder="Saisir la valeur vénale"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                          {/* </>
                        )} */}

                                                  <Separator />
                          
                          <div>
                            <RichTextEditor
                              label="Circonstances"
                              value={circumstance}
                              onChange={setCircumstance}
                              placeholder="Décrivez les circonstances de l'accident..."
                              className="mb-4"
                            />
                          </div>
                          
                          <div>
                            <RichTextEditor
                              label="Dégâts déclarés"
                              value={damageDeclared}
                              onChange={setDamageDeclared}
                              placeholder="Décrivez les dégâts déclarés..."
                              className="mb-4"
                            />
                          </div>
                          
                          <div>
                            <RichTextEditor
                              label="Points notés"
                              value={pointNoted}
                              onChange={setPointNoted}
                              placeholder="Ajoutez des points notés..."
                              className="mb-4"
                            />
                          </div>
                          
                          <div>
                            <RichTextEditor
                              label="Observation générale"
                              value={observation}
                              onChange={setObservation}
                              placeholder="Ajoutez vos observations générales..."
                              className="mb-4"
                            />
                          </div>

                        {/* Message d'aide pour les champs requis */}
                        {!isEvaluation && (
                          <>
                            {(!claimNatureId || !expertRemark.trim()) && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm text-yellow-800">
                                    Veuillez remplir tous les champs obligatoires marqués d'un *
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}



                
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Modal d'ajout d'autre coût */}
        <Dialog open={showAddOtherCostModal} onOpenChange={setShowAddOtherCostModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-6 w-6 text-purple-600" />
                Ajouter un autre coût
              </DialogTitle>
              <DialogDescription className="text-sm">
                Ajoutez un coût supplémentaire au dossier d'expertise
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Liste des coûts à ajouter */}
              {newOtherCosts.map((cost, idx) => (
                <div key={idx} className="flex gap-2 items-end mb-2">
                  <div className="flex-1">
                    <OtherCostTypeSelect
                      value={cost.other_cost_type_id}
                      onValueChange={value => handleUpdateOtherCostLine(idx, 'other_cost_type_id', value)}
                      required={true}
                      showError={!cost.other_cost_type_id}
                    />
                  </div>
                  <div className="w-40">
                    <Label className="text-xs font-medium text-gray-700 mb-1">Montant (FCFA) *</Label>
                    <Input
                      type="number"
                      value={cost.amount}
                      onChange={e => handleUpdateOtherCostLine(idx, 'amount', Number(e.target.value))}
                      placeholder="0"
                      className={`w-full ${(!cost.amount || cost.amount <= 0) ? 'border-red-300 bg-red-50' : ''}`}
                    />
                  </div>
                  <div>
                    {newOtherCosts.length > 1 && (
                      <Button size="icon" variant="ghost" onClick={() => handleRemoveOtherCostLine(idx)} className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOtherCostLine}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter une ligne
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowAddOtherCostModal(false)}
                className="px-6"
              >
                Annuler
              </Button>
              <Button 
                disabled={newOtherCosts.filter(c => c.other_cost_type_id && c.amount > 0).length === 0}
                onClick={handleCreateOtherCost}
                className="px-6 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                {newOtherCosts.length > 1 ? 'Ajouter les coûts' : 'Ajouter le coût'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
          id: shock?.id || 0,
          shock_point_id: shock?.shock_point?.id || 0
        })) || []}
        onCreateShockPoint={handleCreateShockPoint}
        onAddShock={handleAddShock}
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

// Composant pour les autres coûts
function OtherCostItem({
  cost,
  otherCostTypes,
  onUpdate,
  onDelete,
}: {
  cost: any
  otherCostTypes: OtherCostType[]
  onUpdate: (field: string, value: any) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    other_cost_type_id: cost.other_cost_type?.id || 0,
    amount: cost.amount || 0,
  })

  const handleSave = async () => {
    try {
      await onUpdate('other_cost_type_id', formData.other_cost_type_id)
      await onUpdate('amount', formData.amount)
      setEditing(false)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const formatCurrency = (amount: string | number | null) => {
    if (amount === null || amount === undefined) return '0 FCFA'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-purple-600" />
          {editing ? 'Modifier le coût' : 'Coût supplémentaire'}
        </h4>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setEditing(false)}
              >
                Annuler
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
        {editing ? (
          <div className="space-y-4">
            <OtherCostTypeSelect
              value={formData.other_cost_type_id}
              onValueChange={(value) => setFormData({ ...formData, other_cost_type_id: value })}
              label="Type de coût"
              showError={!formData.other_cost_type_id}
            />
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-2">Montant (FCFA)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
              placeholder="0"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-200"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {cost.other_cost_type?.label || 'Type non défini'}
                </p>
                <p className="text-xs text-gray-600">
                  {cost.other_cost_type?.code || 'Code non défini'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(cost.amount)}
                </div>
                <div className="text-xs text-gray-600">
                  HT: {formatCurrency(cost.amount_excluding_tax)}
                </div>
                <div className="text-xs text-gray-600">
                  TVA: {formatCurrency(cost.amount_tax)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="text-center bg-blue-50 rounded p-2">
              <div className="text-blue-600 font-medium">Montant HT</div>
              <div className="font-semibold">{formatCurrency(cost.amount_excluding_tax)}</div>
            </div>
            <div className="text-center bg-green-50 rounded p-2">
              <div className="text-green-600 font-medium">Montant TTC</div>
              <div className="font-semibold">{formatCurrency(cost.amount)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// SortableShockRow moved into reusable sheet component


