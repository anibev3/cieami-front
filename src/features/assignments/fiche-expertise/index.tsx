/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  Users,
  Package,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  List,
  ShieldCheck
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'
import { assignmentService } from '@/services/assignmentService'
import { ExpertiseSheetShockSuppliesTable } from '@/features/assignments/components/assignment/expertise-sheet/expertise-sheet-shock-supplies-table'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { ShockPointSelect } from '@/features/widgets/shock-point-select'
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

function ExpertiseSheetPageContent() {
  const { id } = useParams({ strict: false }) as { id: string } 
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // États pour les données de référence
  const [supplies, setSupplies] = useState<Supply[]>([])
  // Ajoute un state pour shockPoints
  const [shockPoints, setShockPoints] = useState([])

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
  }, [assignment, isExpert, isRepairer])

  const validateAssignment = async () => {
    if (!assignment) return
    setValidating(true)
    try {
      if (isExpert) {
        await assignmentValidationService.validateByExpert(String(assignment.id))
      }
      if (isRepairer) {
        await assignmentValidationService.validateByRepairer(String(assignment.id))
      }
      toast.success('Dossier validé')
      navigate({ to: `/assignments/details/${assignment.id}` })
    } catch (_e) {
      toast.error('Erreur lors de la validation')
    } finally {
      setValidating(false)
    }
  }

  // Gérer les paramètres d'URL pour l'édition de choc et la surbrillance
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const info = urlParams.get('info')
    const shockId = urlParams.get('shock_id')

    // Gérer le modal d'avertissement d'édition de choc
    if (info === 'edit-shocks') {
      setShowEditShockWarning(true)
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
        urlParams.delete('shock_id')
        const newUrl = new URL(window.location.href)
        newUrl.search = urlParams.toString()
        window.history.replaceState({}, '', newUrl.toString())
            setTimeout(() => {
              const shockElement = document.querySelector(`[data-shock-id="${shockIdNum}"]`)
              if (shockElement) {
                shockElement.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center',
                  inline: 'nearest'
                })
              }
            setTimeout(() => {
            setHighlightedShockId(null)
          }, 30000)
        }, 500)
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
        } else {
          setAssignment(response as unknown as Assignment)
        }
      } catch (_err) {
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

        // Charger les points de choc
        const shockPointsResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SHOCK_POINTS}?per_page=50`)
        if (shockPointsResponse.status === 200) {
          setShockPoints(shockPointsResponse.data.data)
        }
      } catch (_err) {
        // Erreur silencieuse lors du chargement des données de référence
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

  const handleConfirmReorderShocks = async (orderedIds?: Array<string>) => {
    if (!assignment) return
    try {
      await assignmentService.reorderShocks(String(assignment.id), (orderedIds && orderedIds.length ? orderedIds.map(String) : reorderShocksList.map((s) => String(s.id))))
      toast.success('Ordre des chocs mis à jour')
      setShowReorderSheet(false)
      setSheetFocusShockId(null)
      await refreshAssignment()
    } catch (_error) {
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
    } catch (_err) {
      toast.error('Erreur lors du rafraîchissement du dossier')
    }
  }

  // Fonction pour réorganiser les fournitures d'un choc
  const handleReorderShockWorks = async (shockId: string, shockWorkIds: string[]) => {
    try {
      await assignmentService.reorderShockWorks(shockId, shockWorkIds.map(String))
      await refreshAssignment()
      toast.success('Ordre des fournitures mis à jour')
    } catch (_error) {
      toast.error('Erreur lors de la réorganisation des fournitures')
    }
  }


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
    } catch (_error) {
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
      await assignmentService.deleteShock(String(shockToDelete))
      toast.success('Choc supprimé avec succès')
      await refreshAssignment()
    } catch (_error) {
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

          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className={`p-6 ${isMobile ? 'pb-24' : ''}`}>



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
                                              } catch (_err) {
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
                                            } catch (_err) {
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
                                            } catch (_err) {
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
                                            } catch (_err) {
                                              toast.error('Erreur lors de la suppression')
                                            }
                                          }}
                                          onValidateRow={async (_index: number) => {
                                            // Validation automatique après modification
                                            toast.success('Fourniture validée')
                                          }}
                                          shockId={String(shock?.id || '')}
                                          paintTypeId={String(shock?.paint_type?.id || 1)}
                                          onReorderSave={async (shockWorkIds) => handleReorderShockWorks(String(shock?.id || ''), shockWorkIds)}
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
        onConfirm={(ids) => handleConfirmReorderShocks(ids.map(String))}
        title="Réorganiser les points de choc"
      />
    </>
  )
}

export default function ExpertiseSheetPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.CREATE_WORKSHEET_ASSIGNMENT}>
      <ExpertiseSheetPageContent />
    </ProtectedRoute>
  )
}
