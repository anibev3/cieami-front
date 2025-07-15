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
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  FileText, 
  Car, 
  User, 
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
  ChevronRight
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
import { OtherCostTypeSelect, SelectedItemInfo } from '@/features/widgets/reusable-selects'  
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { ReceiptManagement } from '@/features/assignments/components/receipt-management'
import { ShockPointSelect } from '@/features/widgets/shock-point-select'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

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
  work_duration: string | null
  expert_remark: string | null
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
    shock_works: Array<{
      id: number
      disassembly: boolean
      replacement: boolean
      repair: boolean
      paint: boolean
      control: boolean
      comment: string | null
      obsolescence_rate: string
      obsolescence_amount_excluding_tax: string
      obsolescence_amount_tax: string
      obsolescence_amount: string
      recovery_rate: string
      recovery_amount_excluding_tax: string
      recovery_amount_tax: string
      recovery_amount: string
      discount: string
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
  // Remplacer newOtherCost par un tableau newOtherCosts
  const [newOtherCosts, setNewOtherCosts] = useState([
    { other_cost_type_id: 0, amount: 0 }
  ])
  
  // États pour les données de référence
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [workforceTypes, setWorkforceTypes] = useState<WorkforceType[]>([])
  const [otherCostTypes, setOtherCostTypes] = useState<OtherCostType[]>([])
  // Ajoute un state pour shockPoints
  const [shockPoints, setShockPoints] = useState([])

  // Charger les données du dossier
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true)
        const response = await assignmentService.getAssignment(Number(id))
        
        if (response && typeof response === 'object' && 'data' in response) {
          setAssignment(response.data as unknown as Assignment)
          // Initialiser les champs d'édition
          const assignmentData = response.data as unknown as Assignment
          setCircumstance(assignmentData.circumstance || '')
          setDamageDeclared(assignmentData.damage_declared || '')
          setObservation(assignmentData.observation || '')
        } else {
          setAssignment(response as unknown as Assignment)
          // Initialiser les champs d'édition
          const assignmentData = response as unknown as Assignment
          setCircumstance(assignmentData.circumstance || '')
          setDamageDeclared(assignmentData.damage_declared || '')
          setObservation(assignmentData.observation || '')
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
        const suppliesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SUPPLIES}`)
        if (suppliesResponse.status === 200) {
          setSupplies(suppliesResponse.data.data)
        }

        // Charger les types de main d'œuvre
        const workforceTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.WORKFORCE_TYPES}`)
        if (workforceTypesResponse.data.status === 200) {
          setWorkforceTypes(workforceTypesResponse.data.data)
        }

        // Charger les types d'autres coûts
        const otherCostTypesResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.OTHER_COST_TYPES}`)
        if (otherCostTypesResponse.status === 200 && Array.isArray(otherCostTypesResponse.data.data)) {
          setOtherCostTypes(otherCostTypesResponse.data.data)
        } else {
          setOtherCostTypes([])
        }

        // Charger les points de choc
        const shockPointsResponse = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.SHOCK_POINTS}`)

        console.log("================> shockPointsResponse", shockPointsResponse.status)
        if (shockPointsResponse.status === 200) {
          setShockPoints(shockPointsResponse.data.data)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données de référence:', err)
        setOtherCostTypes([])
      }
    }

    fetchReferenceData()
  }, [])

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

  // Fonction de sauvegarde
  const handleSave = async () => {
    setSaving(true)
    try {
      // Sauvegarder les modifications des champs d'édition
      if (assignment) {
        await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignment.id}`, {
          circumstance,
          damage_declared: damageDeclared,
          observation
        })
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
        <div className="flex h-screen">
          {/* Sidebar rétractable */}
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
                  onClick={() => setActiveTab('overview')}
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
                  onClick={() => setActiveTab('shocks')}
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
                  onClick={() => setActiveTab('costs')}
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
                  onClick={() => setActiveTab('receipts')}
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
              </nav>
            </ScrollArea>
          </div>

          {/* Contenu principal avec marge adaptative */}
          <div className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? '' : ''
          }`}>
            <ScrollArea className="h-full">
              <div className="p-6">

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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Informations générales */}
                      <Card className="shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            Informations générales
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
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
                              value={assignment.point_noted || ''}
                              onChange={(value) => {
                                console.log('Points notés modifiés:', value)
                              }}
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
                            <div className="grid grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-gray-600">Marque</label>
                                <p className="text-base font-semibold">{assignment.vehicle.brand.label}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Modèle</label>
                                <p className="text-base font-semibold">{assignment.vehicle.vehicle_model.label}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Couleur</label>
                                <p className="text-base font-semibold">{assignment.vehicle.color.label}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Carrosserie</label>
                                <p className="text-base font-semibold">{assignment.vehicle.bodywork.label}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <div className="grid grid-cols-2 gap-4">
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
                          <div className="grid grid-cols-2 gap-4">
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
                          <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {assignment.shocks && assignment.shocks.length > 0 ? (
                      assignment.shocks.map((shock) => (
                        <div key={shock.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  {/* Sélecteur de point de choc modifiable */}
                                  <ShockPointSelect
                                    value={shock.shock_point.id}
                                    onValueChange={async (newShockPointId) => {
                                      try {
                                        await axiosInstance.put(`/shocks/${shock.id}`, {
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
                                <div className="text-xs text-gray-600 mt-1">
                                  {shock.shock_works?.length || 0} fourniture(s) • {shock.workforces?.length || 0} main d'œuvre • Total: {formatCurrency(shock.amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            {/* Tableau des fournitures */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Fournitures</h4>
                              <ShockSuppliesEditTable
                                supplies={supplies.map((supply: any) => ({
                                  id: supply.id,
                                  label: supply.label,
                                  code: supply.code || '',
                                  price: supply.price || 0
                                }))}
                                shockWorks={(shock.shock_works || []).map((work: any) => ({
                                  uid: work.id?.toString() || crypto.randomUUID(),
                                  supply_id: work.supply?.id || 0,
                                  supply_label: work.supply?.label || '',
                                  disassembly: work.disassembly || false,
                                  replacement: work.replacement || false,
                                  repair: work.repair || false,
                                  paint: work.paint || false,
                                  control: work.control || false,
                                  comment: work.comment || '',
                                  obsolescence_rate: Number(work.obsolescence_rate) || 0,
                                  recovery_rate: Number(work.recovery_rate) || 0,
                                  amount: Number(work.amount) || 0,
                                  obsolescence_amount_excluding_tax: Number(work.obsolescence_amount_excluding_tax) || 0,
                                  obsolescence_amount_tax: Number(work.obsolescence_amount_tax) || 0,
                                  obsolescence_amount: Number(work.obsolescence_amount) || 0,
                                  recovery_amount_excluding_tax: Number(work.recovery_amount_excluding_tax) || 0,
                                  recovery_amount_tax: Number(work.recovery_amount_tax) || 0,
                                  recovery_amount: Number(work.recovery_amount) || 0,
                                  new_amount_excluding_tax: Number(work.new_amount_excluding_tax) || 0,
                                  new_amount_tax: Number(work.new_amount_tax) || 0,
                                  new_amount: Number(work.new_amount) || 0
                                }))}
                                onUpdate={async (index, updatedWork) => {
                                  try {
                                    const work = shock.shock_works[index]
                                    if (work && work.id) {
                                      // On envoie tout l'objet d'un coup
                                      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}/${work.id}`, {
                                        supply_id: updatedWork.supply_id,
                                        disassembly: updatedWork.disassembly,
                                        replacement: updatedWork.replacement,
                                        repair: updatedWork.repair,
                                        paint: updatedWork.paint,
                                        control: updatedWork.control,
                                        comment: updatedWork.comment,
                                        obsolescence_rate: updatedWork.obsolescence_rate,
                                        recovery_rate: updatedWork.recovery_rate,
                                        amount: updatedWork.amount
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
                                      shock_id: String(shock.id),
                                      shock_works: [{
                                        supply_id: String(shockWorkData?.supply_id || 0),
                                        disassembly: Boolean(shockWorkData?.disassembly || false),
                                        replacement: Boolean(shockWorkData?.replacement || false),
                                        repair: Boolean(shockWorkData?.repair || false),
                                        paint: Boolean(shockWorkData?.paint || false),
                                        control: Boolean(shockWorkData?.control || false),
                                        comment: shockWorkData?.comment || null,
                                        obsolescence_rate: Number(shockWorkData?.obsolescence_rate || 0),
                                        recovery_rate: Number(shockWorkData?.recovery_rate || 0),
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
                                    const work = shock.shock_works[index]
                                    if (work && work.id) {
                                      await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}/${work.id}`)
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
                              />
                            </div>
                            
                            {/* Section Main d'œuvre */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Main d'œuvre</h4>
                              <ShockWorkforceTableV2
                                shockId={shock.id}
                                workforces={(shock.workforces || []).filter(w => w.id !== undefined).map(w => ({
                                  id: w.id!,
                                  workforce_type: w.workforce_type,
                                  nb_hours: w.nb_hours,
                                  work_fee: w.work_fee,
                                  discount: w.discount,
                                  amount_excluding_tax: w.amount_excluding_tax,
                                  amount_tax: w.amount_tax,
                                  amount: w.amount
                                })) as any}
                                onUpdate={(updatedWorkforces) => {
                                  // Mettre à jour les données locales
                                  const updatedAssignment = { ...assignment }
                                  const shockIndex = updatedAssignment.shocks.findIndex(s => s.id === shock.id)
                                  if (shockIndex !== -1) {
                                    updatedAssignment.shocks[shockIndex].workforces = updatedWorkforces as any
                                    setAssignment(updatedAssignment)
                                  }
                                }}
                                onAdd={async (workforceData?: any) => {
                                  try {
                                    // Préparer le payload selon l'API
                                    const payload = {
                                      shock_id: String(shock.id),
                                      hourly_rate_id: "1", // Valeur par défaut
                                      paint_type_id: "1", // Valeur par défaut
                                      workforces: [{
                                        workforce_type_id: String(workforceData?.workforce_type_id || 0),
                                        nb_hours: Number(workforceData?.nb_hours || 0),
                                        discount: Number(workforceData?.discount || 0)
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
                              />
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

                {/* Quittances */}
                {activeTab === 'receipts' && (
                  <ReceiptManagement
                    assignmentId={assignment.id}
                    receipts={assignment.receipts || []}
                    onRefresh={refreshAssignment}
                  />
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
      </Main>
    </>
  )
}

// Composant pour les fournitures
function ShockWorkItem({ 
  work, 
  supplies, 
  onUpdate, 
  onDelete 
}: {
  work: any
  supplies: Supply[]
  onUpdate: (field: string, value: any) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    supply_id: work.supply.id,
    disassembly: work.disassembly,
    replacement: work.replacement,
    repair: work.repair,
    paint: work.paint,
    control: work.control,
    comment: work.comment || '',
    obsolescence_rate: work.obsolescence_rate,
    recovery_rate: work.recovery_rate
  })

  const handleSave = async () => {
    try {
      await onUpdate('supply_id', formData.supply_id)
      await onUpdate('disassembly', formData.disassembly)
      await onUpdate('replacement', formData.replacement)
      await onUpdate('repair', formData.repair)
      await onUpdate('paint', formData.paint)
      await onUpdate('control', formData.control)
      await onUpdate('comment', formData.comment)
      await onUpdate('obsolescence_rate', formData.obsolescence_rate)
      await onUpdate('recovery_rate', formData.recovery_rate)
      setEditing(false)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
    }
  }

  return (
    <Card className="shadow-none border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-semibold">{work.supply.label}</h5>
            <p className="text-xs text-gray-600">{work.supply.description}</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <Label>Fourniture</Label>
              <Select 
                value={formData.supply_id.toString()} 
                onValueChange={(value) => setFormData({...formData, supply_id: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supplies.map((supply) => (
                    <SelectItem key={supply.id} value={supply.id.toString()}>
                      {supply.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="disassembly"
                  checked={formData.disassembly}
                  onChange={(e) => setFormData({...formData, disassembly: e.target.checked})}
                />
                <Label htmlFor="disassembly">Démontage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="replacement"
                  checked={formData.replacement}
                  onChange={(e) => setFormData({...formData, replacement: e.target.checked})}
                />
                <Label htmlFor="replacement">Remplacement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="repair"
                  checked={formData.repair}
                  onChange={(e) => setFormData({...formData, repair: e.target.checked})}
                />
                <Label htmlFor="repair">Réparation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="paint"
                  checked={formData.paint}
                  onChange={(e) => setFormData({...formData, paint: e.target.checked})}
                />
                <Label htmlFor="paint">Peinture</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Taux d'obsolescence (%)</Label>
                <Input
                  type="number"
                  value={formData.obsolescence_rate}
                  onChange={(e) => setFormData({...formData, obsolescence_rate: e.target.value})}
                />
              </div>
              <div>
                <Label>Taux de récupération (%)</Label>
                <Input
                  type="number"
                  value={formData.recovery_rate}
                  onChange={(e) => setFormData({...formData, recovery_rate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Commentaire</Label>
              <Input
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                placeholder="Commentaire optionnel"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Taux d'obsolescence:</span>
              <p className="font-semibold">{work.obsolescence_rate}%</p>
            </div>
            <div>
              <span className="text-gray-600">Taux de récupération:</span>
              <p className="font-semibold">{work.recovery_rate}%</p>
            </div>
            <div>
              <span className="text-gray-600">Montant obsolescence:</span>
              <p className="font-semibold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(Number(work.obsolescence_amount) || 0)}</p>
            </div>
            <div>
              <span className="text-gray-600">Montant récupération:</span>
              <p className="font-semibold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(Number(work.recovery_amount) || 0)}</p>
            </div>
            {work.comment && (
              <div className="col-span-2">
                <span className="text-gray-600">Commentaire:</span>
                <p className="font-semibold">{work.comment}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Composant pour les mains d'œuvre
function WorkforceItem({ 
  workforce, 
  workforceTypes, 
  onUpdate, 
  onDelete 
}: {
  workforce: any
  workforceTypes: WorkforceType[]
  onUpdate: (field: string, value: any) => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    workforce_type_id: workforce.workforce_type.id,
    nb_hours: workforce.nb_hours,
    work_fee: workforce.work_fee,
    discount: workforce.discount,
  })

  const handleSave = async () => {
    try {
      await onUpdate('workforce_type_id', formData.workforce_type_id)
      await onUpdate('nb_hours', formData.nb_hours)
      await onUpdate('work_fee', formData.work_fee)
      await onUpdate('discount', formData.discount)
      setEditing(false)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <Card className="shadow-none border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h5 className="font-semibold">{workforce.workforce_type.label}</h5>
            <p className="text-xs text-gray-600">{workforce.workforce_type.description}</p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={handleSave}><Save className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Annuler</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>
        {editing ? (
          <div className="space-y-4">
            <div>
              <Label>Type de main d'œuvre</Label>
              <Select
                value={formData.workforce_type_id.toString()}
                onValueChange={v => setFormData({ ...formData, workforce_type_id: Number(v) })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {workforceTypes.map(type => (
                    <SelectItem key={type.id} value={type.id.toString()}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nombre d'heures</Label>
              <Input
                type="number"
                value={formData.nb_hours}
                onChange={e => setFormData({ ...formData, nb_hours: e.target.value })}
              />
            </div>
            <div>
              <Label>Tarif</Label>
              <Input
                type="number"
                value={formData.work_fee}
                onChange={e => setFormData({ ...formData, work_fee: e.target.value })}
              />
            </div>
            <div>
              <Label>Remise (%)</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Heures :</span>
              <p className="font-semibold">{workforce.nb_hours}</p>
            </div>
            <div>
              <span className="text-gray-600">Tarif :</span>
              <p className="font-semibold">{workforce.work_fee}</p>
            </div>
            <div>
              <span className="text-gray-600">Remise :</span>
              <p className="font-semibold">{workforce.discount}%</p>
            </div>
            <div>
              <span className="text-gray-600">Montant :</span>
              <p className="font-semibold">{workforce.amount} FCFA</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
          <div className="grid grid-cols-2 gap-2 text-xs">
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