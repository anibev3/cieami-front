/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowLeft, Save, Loader2, FileText, Wrench, ClipboardCheck, Plus, Trash2, ArrowRight, User, Car, Building, FileType, Info, Search, Edit, ChevronLeft, ChevronRight } from 'lucide-react'
import { ClientSelect } from '@/features/widgets/client-select'
import { VehicleSelect } from '@/features/widgets/vehicle-select'
import { InsurerSelect } from '@/features/widgets/insurer-select'
import { RepairerSelect } from '@/features/widgets/repairer-select'
import { BrokerSelect } from '@/features/widgets/broker-select'
import { UserSelect } from '@/features/widgets/user-select'
import { useAssignmentsStore } from '@/stores/assignments'
import { useUsersStore } from '@/stores/usersStore'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAssignmentTypesStore } from '@/stores/assignmentTypesStore'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { useExpertiseTypesStore } from '@/stores/expertise-types'
import { useDocumentsStore } from '@/stores/documentsStore'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Vehicle } from '@/types/vehicles'
import { User as UserType } from '@/types/administration'
import { Entity as EntityType, DocumentTransmitted } from '@/types/administration'
import { ExpertiseType } from '@/types/expertise-types'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { useClientsStore } from '../gestion/clients/store'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useColorsStore } from '@/stores/colors'
import { useBodyworksStore } from '@/stores/bodyworks'
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'
import { VehicleEnergySelect } from '@/features/widgets/vehicle-energy-select'
import { BrandSelect } from '@/features/widgets'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { HtmlContent } from '@/components/ui/html-content'
import { VehicleModelSelect } from '@/features/assignments/cost-of-supply/components/vehicle-model-select'
import { useBrandsStore } from '@/stores/brands'
import { ColorSelect } from '@/features/widgets/color-select'
import { BodyworkSelect } from '@/features/widgets/bodywork-select'
import { CreateRepairer } from '@/features/assignments/components/create-repairer'

// Types pour les experts
interface Expert {
  expert_id: string
  date: string
  observation: string | null
}

// Type local pour AssignmentType (basé sur le store)
interface AssignmentType {
  id: number
  code: string
  label: string
  description: string
  created_at: string
  updated_at: string
}

// Types pour les modèles et couleurs
interface VehicleModel {
  id: number
  label: string
  code: string
}

interface Color {
  id: number
  label: string
  code: string
}

interface Bodywork {
  id: number
  label: string
  code: string
}

// Type local pour le payload de création d'assignation
interface AssignmentCreatePayload {
  client_id: number
  vehicle_id: number
  vehicle_mileage: number | null
  insurer_id: number | null
  repairer_id: number | null
  broker_id: number | null
  assignment_type_id: number
  expertise_type_id: number
  document_transmitted_id: any[]
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
  experts: {
    expert_id: number
    date: string
    observation: string | null
  }[]
}

// Type local pour le payload de mise à jour d'assignation
interface AssignmentUpdatePayload extends AssignmentCreatePayload {
  id: number
}

// Schéma de validation
const assignmentSchema = z.object({
  client_id: z.string().min(1, 'Le client est requis'),
  vehicle_id: z.string().min(1, 'Le véhicule est requis'),
  vehicle_mileage: z.string().optional(),
  insurer_id: z.string().optional(),
  repairer_id: z.string().optional(),
  broker_id: z.string().optional(),
  assignment_type_id: z.string().min(1, 'Le type d\'assignation est requis'),
  expertise_type_id: z.string().min(1, 'Le type d\'expertise est requis'),
  document_transmitted_id: z.array(z.string()).optional(),
  policy_number: z.string().optional(),
  claim_number: z.string().optional(),
  claim_starts_at: z.string().optional(),
  claim_ends_at: z.string().optional(),
  expertise_date: z.string().optional(),
  expertise_place: z.string().optional(),
  received_at: z.string().min(1, 'La date de réception est requise'),
  administrator: z.string().optional(),
  circumstance: z.string().optional(),
  damage_declared: z.string().optional(),
  observation: z.string().optional(),
  experts: z.array(z.object({
    expert_id: z.string().optional(),
    date: z.string().optional(),
    observation: z.string().optional()
  })).optional()
})

export default function CreateAssignmentPage() {
  const navigate = useNavigate()
    const { id } = useParams({ strict: false }) as { id: string }
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [experts, setExperts] = useState<Expert[]>([
    { expert_id: '', date: '', observation: null }
  ])
  
  // États pour les modals
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showInsurerModal, setShowInsurerModal] = useState(false)
  const [showRepairerModal, setShowRepairerModal] = useState(false)
  const [showBrokerModal, setShowBrokerModal] = useState(false)
  const [showAssignmentTypeModal, setShowAssignmentTypeModal] = useState(false)
  const [showExpertiseTypeModal, setShowExpertiseTypeModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  
  // États pour les modals de création
  const [showCreateClientModal, setShowCreateClientModal] = useState(false)
  const [showCreateVehicleModal, setShowCreateVehicleModal] = useState(false)
  const [showCreateInsurerModal, setShowCreateInsurerModal] = useState(false)
  const [showCreateRepairerModal, setShowCreateRepairerModal] = useState(false)
  const [showCreateDocumentModal, setShowCreateDocumentModal] = useState(false)
  const [showCreateBrandModal, setShowCreateBrandModal] = useState(false)
  // Ajout de l'état pour la modal de création de modèle de véhicule
  const [showCreateVehicleModelModal, setShowCreateVehicleModelModal] = useState(false)
  const [showCreateColorModal, setShowCreateColorModal] = useState(false)
  const [showCreateBodyworkModal, setShowCreateBodyworkModal] = useState(false)
  
  // États pour les formulaires de création rapide
  const [createClientForm, setCreateClientForm] = useState({
    name: '',
    email: '',
    phone_1: '',
    phone_2: '',
    address: '',
  })
  
  const [createVehicleForm, setCreateVehicleForm] = useState({
    license_plate: '',
    usage: '',
    type: '',
    option: '',
    mileage: '',
    serial_number: '',
    fiscal_power: 0,
    nb_seats: 0,
    new_market_value: 0,
    payload: 0,
    vehicle_model_id: '',
    color_id: '',
    bodywork_id: '',
    vehicle_genre_id: '',
    vehicle_energy_id: '',
    first_entry_into_circulation_date: '',
    technical_visit_date: '',
  })
  
  const [createInsurerForm, setCreateInsurerForm] = useState({
    name: '',
    code: '',
    email: '',
    telephone: '',
    address: '',
  })
  

  
  const [createDocumentForm, setCreateDocumentForm] = useState({
    code: '',
    label: '',
    description: '',
  })
  
  const [createBrandForm, setCreateBrandForm] = useState({
    code: '',
    label: '',
    description: '',
  })
  
  const [createVehicleModelForm, setCreateVehicleModelForm] = useState({
    code: '',
    label: '',
    description: '',
    brand_id: '',
  })
  
  const [createColorForm, setCreateColorForm] = useState({
    code: '',
    label: '',
    description: '',
  })
  
  const [createBodyworkForm, setCreateBodyworkForm] = useState({
    code: '',
    label: '',
    description: '',
  })
  
  // État pour la marque sélectionnée dans la création de véhicule
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  
  // États pour les entités sélectionnées
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedClient, setSelectedClient] = useState<UserType | null>(null)
  const [selectedInsurer, setSelectedInsurer] = useState<EntityType | null>(null)
  const [selectedRepairer, setSelectedRepairer] = useState<EntityType | null>(null)
  const [selectedBroker, setSelectedBroker] = useState<EntityType | null>(null)
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<AssignmentType | null>(null)
  const [selectedExpertiseType, setSelectedExpertiseType] = useState<ExpertiseType | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentTransmitted[]>([])
  
  // Mode édition
  const isEditMode = !!id
  const assignmentId = id ? parseInt(id) : null
  
  const { createAssignment } = useAssignmentsStore()
  const { users, fetchUsers } = useUsersStore()
  const { clients, fetchClients, createClient } = useClientsStore()
  const { vehicles, fetchVehicles, createVehicle } = useVehiclesStore()
  const { assignmentTypes, fetchAssignmentTypes } = useAssignmentTypesStore()
  const { entities, fetchEntities, createEntity } = useEntitiesStore()
  const { expertiseTypes, fetchExpertiseTypes } = useExpertiseTypesStore()
  const { documents, fetchDocuments, createDocument } = useDocumentsStore()
  const { vehicleModels, fetchVehicleModels, createVehicleModel, loading: loadingVehicleModels } = useVehicleModelsStore()
  const { colors, fetchColors, createColor, loading: loadingColors } = useColorsStore()
  const { bodyworks, fetchBodyworks, createBodywork, loading: loadingBodyworks } = useBodyworksStore()
  const { createBrand, brands, fetchBrands, loading: loadingBrands } = useBrandsStore()

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      client_id: '',
      vehicle_id: '',
      vehicle_mileage: '',
      insurer_id: '',
      repairer_id: '',
      assignment_type_id: '',
      expertise_type_id: '',
      document_transmitted_id: [],
      policy_number: '',
      claim_number: '',
      claim_starts_at: '',
      claim_ends_at: '',
      expertise_date: '',
      expertise_place: '',
      received_at: new Date().toISOString().split('T')[0],
      administrator: '',
      circumstance: '',
      damage_declared: '',
      observation: '',
      experts: [{ expert_id: '', date: '', observation: '' }]
    }
  })

  // Charger les données existantes en mode édition
  useEffect(() => {
    const loadAssignmentData = async () => {
      if (isEditMode && assignmentId) {
        try {
          setLoadingData(true)
          const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
          const assignment = response.data.data
          
          console.log('Données du dossier chargées:', assignment)
          
          // Pré-remplir le formulaire avec les données existantes
          const formData = {
            client_id: assignment.client?.id?.toString() || '',
            vehicle_id: assignment.vehicle?.id?.toString() || '',
            vehicle_mileage: assignment.vehicle?.mileage?.toString() || '',
            insurer_id: assignment.insurer?.id?.toString() || '',
            repairer_id: assignment.repairer?.id?.toString() || '',
            assignment_type_id: assignment.assignment_type?.id?.toString() || '',
            expertise_type_id: assignment.expertise_type?.id?.toString() || '',
            document_transmitted_id: assignment.document_transmitted?.map((doc: any) => doc.id.toString()) || [],
            policy_number: assignment.policy_number || '',
            claim_number: assignment.claim_number || '',
            claim_starts_at: assignment.claim_starts_at || '',
            claim_ends_at: assignment.claim_ends_at || '',
            expertise_date: assignment.expertise_date || '',
            expertise_place: assignment.expertise_place || '',
            received_at: assignment.received_at || new Date().toISOString().split('T')[0],
            administrator: assignment.administrator || '',
            circumstance: assignment.circumstance || '',
            damage_declared: assignment.damage_declared || '',
            observation: assignment.observation || '',
            experts: assignment.experts?.map((expert: { expert_id: number; date: string; observation: string | null }) => ({
              expert_id: expert.expert_id?.toString() || '',
              date: expert.date || '',
              observation: expert.observation || ''
            })) || [{ expert_id: '', date: '', observation: '' }]
          }
          
          console.log('Données du formulaire à pré-remplir:', formData)
          form.reset(formData)

          // Mettre à jour les états des entités sélectionnées
          if (assignment.client) {
            setSelectedClient(assignment.client)
            console.log('Client sélectionné:', assignment.client)
          }
          if (assignment.vehicle) {
            setSelectedVehicle(assignment.vehicle)
            console.log('Véhicule sélectionné:', assignment.vehicle)
          }
          if (assignment.insurer) {
            setSelectedInsurer(assignment.insurer)
            console.log('Assureur sélectionné:', assignment.insurer)
          }
          if (assignment.repairer) {
            setSelectedRepairer(assignment.repairer)
            console.log('Réparateur sélectionné:', assignment.repairer)
          }
          if (assignment.assignment_type) {
            setSelectedAssignmentType(assignment.assignment_type)
            console.log('Type d\'assignation sélectionné:', assignment.assignment_type)
          }
          if (assignment.expertise_type) {
            setSelectedExpertiseType(assignment.expertise_type)
            console.log('Type d\'expertise sélectionné:', assignment.expertise_type)
          }
          if (assignment.document_transmitted) {
            setSelectedDocuments(assignment.document_transmitted)
            console.log('Documents sélectionnés:', assignment.document_transmitted)
          }

          // Mettre à jour la liste des experts
          const expertsData = assignment.experts?.map((expert: { expert_id: number; date: string; observation: string | null }) => ({
            expert_id: expert.expert_id?.toString() || '',
            date: expert.date || '',
            observation: expert.observation || ''
          })) || [{ expert_id: '', date: '', observation: '' }]
          
          setExperts(expertsData)
          console.log('Experts mis à jour:', expertsData)

          console.log('Formulaire pré-rempli avec succès')

        } catch (error) {
          console.error('Erreur lors du chargement du dossier:', error)
          toast.error('Erreur lors du chargement du dossier')
        } finally {
          setLoadingData(false)
        }
      }
    }

    loadAssignmentData()
  }, [isEditMode, assignmentId, form])

  // Charger les données de base (utilisateurs, véhicules, etc.)
  useEffect(() => {
    fetchUsers()
    fetchClients()
    fetchVehicles()
    fetchAssignmentTypes()
    fetchEntities()
    fetchExpertiseTypes()
    fetchDocuments()
    fetchVehicleModels()
    fetchColors()
    fetchBodyworks()
    fetchBrands()
  }, [fetchUsers, fetchClients, fetchVehicles, fetchAssignmentTypes, fetchEntities, fetchExpertiseTypes, fetchDocuments, fetchVehicleModels, fetchColors, fetchBodyworks, fetchBrands])

  // Réinitialiser le modèle quand la marque change
  useEffect(() => {
    if (selectedBrandId !== '') {
      setCreateVehicleForm(prev => ({ ...prev, vehicle_model_id: '' }))
    }
  }, [selectedBrandId])

  // Validations par étape
  const stepValidations = {
    1: () => {
      const values = form.getValues()
      const mileage = values.vehicle_mileage
      const isMileageValid = mileage !== null && mileage !== undefined && !isNaN(Number(mileage)) && Number(mileage) >= 0
      
      return (
        values.client_id?.toString().length > 0 &&
        values.vehicle_id?.toString().length > 0 &&
        isMileageValid
      )
    },
    2: () => {
      const values = form.getValues()
      const hasAssignmentType = values.assignment_type_id && values.assignment_type_id.toString().length > 0
      const hasExpertiseType = values.expertise_type_id && values.expertise_type_id.toString().length > 0
      // Les documents sont maintenant optionnels
      
      return hasAssignmentType && hasExpertiseType
    },
    3: () => {
      const values = form.getValues()
      return true // Les experts sont maintenant optionnels
    },
    4: () => true,
  }

  const canProceed = stepValidations[step as keyof typeof stepValidations]()

  const nextStep = () => {
    if (step < totalSteps && canProceed) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Fonctions pour les experts
  const addExpert = () => {
    const currentExperts = form.getValues('experts') || []
    form.setValue('experts', [...currentExperts, {
      expert_id: '',
      date: new Date().toISOString().split('T')[0],
      observation: '',
    }])
  }

  const removeExpert = (index: number) => {
    const currentExperts = form.getValues('experts') || []
    if (currentExperts.length > 1) {
      form.setValue('experts', currentExperts.filter((_, i) => i !== index))
    }
  }

  // Fonction pour pré-remplir le kilométrage quand un véhicule est sélectionné
  const handleVehicleSelection = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id.toString() === vehicleId)
    if (vehicle) {
      setSelectedVehicle(vehicle)
      // Pré-remplir le kilométrage avec la valeur du véhicule
      const mileage = vehicle.mileage
      if (mileage !== null && mileage !== undefined) {
        form.setValue('vehicle_mileage', mileage.toString())
      }
    }
  }

  // Fonction pour ouvrir le modal des détails du véhicule
  const openVehicleDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleModal(true)
  }

  // Fonction pour gérer la sélection du client
  const handleClientSelection = (clientId: string) => {
    const client = users.find(u => u.id.toString() === clientId)
    if (client) {
      setSelectedClient(client)
    }
  }

  // Fonction pour ouvrir le modal des détails du client
  const openClientDetails = (client: UserType) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  // Fonction pour gérer la sélection de l'assureur
  const handleInsurerSelection = (insurerId: string) => {
    const insurer = entities.find(e => e.id.toString() === insurerId)
    if (insurer) {
      setSelectedInsurer(insurer)
    }
  }

  // Fonction pour ouvrir le modal des détails de l'assureur
  const openInsurerDetails = (insurer: EntityType) => {
    setSelectedInsurer(insurer)
    setShowInsurerModal(true)
  }

  // Fonction pour gérer la sélection du réparateur
  const handleRepairerSelection = (repairerId: string) => {
    const repairer = entities.find(e => e.id.toString() === repairerId)
    if (repairer) {
      setSelectedRepairer(repairer)
    }
  }

  // Fonction pour ouvrir le modal des détails du réparateur
  const openRepairerDetails = (repairer: EntityType) => {
    setSelectedRepairer(repairer)
    setShowRepairerModal(true)
  }

  // Fonction pour gérer la sélection du courtier
  const handleBrokerSelection = (brokerId: string) => {
    const broker = entities.find(e => e.id.toString() === brokerId)
    if (broker) {
      setSelectedBroker(broker)
    }
  }

  // Fonction pour ouvrir le modal des détails du courtier
  const openBrokerDetails = (broker: EntityType) => {
    setSelectedBroker(broker)
    setShowBrokerModal(true)
  }

  // Fonction pour gérer la sélection du type d'assignation
  const handleAssignmentTypeSelection = (assignmentTypeId: string) => {
    const assignmentType = assignmentTypes.find(at => at.id.toString() === assignmentTypeId)
    if (assignmentType) {
      setSelectedAssignmentType(assignmentType)
    }
  }

  // Fonction pour ouvrir le modal des détails du type d'assignation
  const openAssignmentTypeDetails = (assignmentType: AssignmentType) => {
    setSelectedAssignmentType(assignmentType)
    setShowAssignmentTypeModal(true)
  }

  // Fonction pour gérer la sélection du type d'expertise
  const handleExpertiseTypeSelection = (expertiseTypeId: string) => {
    const expertiseType = expertiseTypes.find(et => et.id.toString() === expertiseTypeId)
    if (expertiseType) {
      setSelectedExpertiseType(expertiseType)
    }
  }

  // Fonction pour ouvrir le modal des détails du type d'expertise
  const openExpertiseTypeDetails = (expertiseType: ExpertiseType) => {
    setSelectedExpertiseType(expertiseType)
    setShowExpertiseTypeModal(true)
  }

  // Fonction pour gérer la sélection des documents transmis
  const handleDocumentSelection = (documentIds: string[]) => {
    const selectedDocs = documents.filter(d => documentIds.includes(d.id.toString()))
    setSelectedDocuments(selectedDocs)
  }

  // Fonction pour ouvrir le modal des détails du document transmis
  const openDocumentDetails = (document: DocumentTransmitted) => {
    setSelectedDocuments([document])
    setShowDocumentModal(true)
  }

  // Fonctions pour les titres et descriptions des étapes
  const getStepTitle = (step: number): string => {
    const titles: Record<number, string> = {
      1: 'Informations générales',
      2: 'Type d\'assignation',
      3: 'Experts',
      4: 'Récapitulatif',
    }
    return titles[step] || ''
  }

  const getStepDescription = (step: number): string => {
    const descriptions: Record<number, string> = {
      1: 'Renseignez les informations du client, véhicule, assureur et réparateur.',
      2: 'Sélectionnez le type d\'assignation et d\'expertise.',
      3: 'Configurez les experts assignés au dossier.',
      4: 'Vérifiez et validez les informations du dossier.',
    }
    return descriptions[step] || ''
  }

  const onSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setLoading(true)
    
    try {
      console.log('Données du formulaire à soumettre:', values)
      
      // Préparer les données pour l'API
      const assignmentData = {
        client_id: parseInt(values.client_id),
        vehicle_id: parseInt(values.vehicle_id),
        vehicle_mileage: values.vehicle_mileage ? parseInt(values.vehicle_mileage) : null,
        insurer_id: values.insurer_id ? parseInt(values.insurer_id) : null,
        repairer_id: values.repairer_id ? parseInt(values.repairer_id) : null,
        broker_id: values.broker_id ? parseInt(values.broker_id) : null,
        assignment_type_id: parseInt(values.assignment_type_id),
        expertise_type_id: parseInt(values.expertise_type_id),
        document_transmitted_id: values.document_transmitted_id?.map(id => parseInt(id)) || [],
        policy_number: values.policy_number || null,
        claim_number: values.claim_number || null,
        claim_starts_at: values.claim_starts_at || null,
        claim_ends_at: values.claim_ends_at || null,
        expertise_date: values.expertise_date || null,
        expertise_place: values.expertise_place || null,
        received_at: values.received_at,
        administrator: values.administrator || null,
        circumstance: values.circumstance || null,
        damage_declared: values.damage_declared || null,
        observation: values.observation || null,
        experts: (values.experts || []).filter(expert => expert.expert_id && expert.date).map((expert) => ({
          expert_id: parseInt(expert.expert_id!),
          date: expert.date!,
          observation: expert.observation || null,
        })),
      } as AssignmentCreatePayload

      console.log('Données préparées pour l\'API:', assignmentData)

      if (isEditMode && assignmentId) {
        // Mode modification
        const updateData: AssignmentUpdatePayload = {
          ...assignmentData,
          id: assignmentId
        }
        
        console.log('Mise à jour du dossier avec les données:', updateData)
        const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/update/${assignmentId}`, updateData)
        console.log('Réponse de la mise à jour:', response.data)
        toast.success('Dossier modifié avec succès')
        navigate({ to: `/assignments/${assignmentId}` })
      } else {
        // Mode création
        console.log('Création du dossier avec les données:', assignmentData)
        const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}`, assignmentData)
        console.log('Réponse de la création:', response.data)
        toast.success('Dossier créé avec succès')
        navigate({ to: `/assignments/${response.data.data.id}` })
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde du dossier')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/assignments' })
  }

  // Handlers pour les formulaires de création rapide
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createClientForm.name) {
      toast.error('Le nom est obligatoire')
      return
    }
    try {
      await createClient(createClientForm)
      toast.success('Client créé avec succès')
      setShowCreateClientModal(false)
      setCreateClientForm({ name: '', email: '', phone_1: '', phone_2: '', address: '' })
      fetchClients() // Recharger la liste
    } catch (error) {
      toast.error('Erreur lors de la création du client')
    }
  }

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createVehicleForm.license_plate || !createVehicleForm.vehicle_model_id || !createVehicleForm.color_id || !createVehicleForm.vehicle_energy_id || !createVehicleForm.vehicle_genre_id) {
      toast.error('Numéro d\'immatriculation, modèle, couleur, énergie et genre de véhicule obligatoires')
      return
    }
    try {
      await createVehicle({
        ...createVehicleForm,
        fiscal_power: Number(createVehicleForm.fiscal_power),
        nb_seats: Number(createVehicleForm.nb_seats),
        new_market_value: Number(createVehicleForm.new_market_value),
        payload: Number(createVehicleForm.payload),
        bodywork_id: createVehicleForm.bodywork_id,
        first_entry_into_circulation_date: createVehicleForm.first_entry_into_circulation_date || undefined,
        technical_visit_date: createVehicleForm.technical_visit_date || undefined,
      })
      toast.success('Véhicule créé avec succès')
      setShowCreateVehicleModal(false)
              setCreateVehicleForm({
          license_plate: '', usage: '', type: '', option: '', mileage: '',
          serial_number: '', fiscal_power: 0, nb_seats: 0, new_market_value: 0, payload: 0,
          vehicle_model_id: '', color_id: '', bodywork_id: '',
          vehicle_genre_id: '', vehicle_energy_id: '',
          first_entry_into_circulation_date: '', technical_visit_date: '',
        })
        setSelectedBrandId('')
      fetchVehicles() // Recharger la liste
    } catch (error) {
      toast.error('Erreur lors de la création du véhicule')
    }
  }

  const handleCreateInsurer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createInsurerForm.name || !createInsurerForm.code) {
      toast.error('Nom et code obligatoires')
      return
    }
    try {
      await createEntity({
        ...createInsurerForm,
        entity_type_code: 'insurer', // Code pour assureur
      })
      toast.success('Assureur créé avec succès')
      setShowCreateInsurerModal(false)
      setCreateInsurerForm({ name: '', code: '', email: '', telephone: '', address: '' })
      fetchEntities() // Recharger la liste
    } catch (error) {
      toast.error('Erreur lors de la création de l\'assureur')
    }
  }



  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createDocumentForm.code || !createDocumentForm.label) {
      toast.error('Code et label obligatoires')
      return
    }
    try {
      await createDocument(createDocumentForm)
      toast.success('Document créé avec succès')
      setShowCreateDocumentModal(false)
      setCreateDocumentForm({ code: '', label: '', description: '' })
      fetchDocuments() // Recharger la liste
    } catch (error) {
      toast.error('Erreur lors de la création du document')
    }
  }

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createBrandForm.code || !createBrandForm.label) {
      toast.error('Code et nom obligatoires')
      return
    }
    try {
      await createBrand(createBrandForm)
      await fetchBrands() // Rafraîchir la liste
      // Sélection automatique de la nouvelle marque
      const newBrand = brands.find(b => b.code === createBrandForm.code && b.label === createBrandForm.label)
      if (newBrand) {
        setSelectedBrandId(newBrand.id.toString())
      }
      toast.success('Marque créée avec succès')
      setShowCreateBrandModal(false)
      setCreateBrandForm({ code: '', label: '', description: '' })
    } catch (error) {
      toast.error('Erreur lors de la création de la marque')
    }
  }

  // Handler création rapide de modèle de véhicule
  const handleCreateVehicleModel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createVehicleModelForm.code || !createVehicleModelForm.label || !selectedBrandId) {
      toast.error('Code, nom et marque obligatoires')
      return
    }
    try {
      await createVehicleModel({ ...createVehicleModelForm, brand_id: selectedBrandId })
      await fetchVehicleModels(1, { brand_id: selectedBrandId }) // Rafraîchir la liste pour la marque
      // Sélection automatique du nouveau modèle
      const newModel = vehicleModels.find(m => m.code === createVehicleModelForm.code && m.label === createVehicleModelForm.label && m.brand.id.toString() === selectedBrandId)
      if (newModel) {
        setCreateVehicleForm(f => ({ ...f, vehicle_model_id: newModel.id.toString() }))
      }
      toast.success('Modèle créé avec succès')
      setShowCreateVehicleModelModal(false)
      setCreateVehicleModelForm({ code: '', label: '', description: '', brand_id: '' })
    } catch (error) {
      toast.error('Erreur lors de la création du modèle')
    }
  }

  const handleCreateColor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createColorForm.code || !createColorForm.label) {
      toast.error('Code et nom obligatoires')
      return
    }
    try {
      await createColor(createColorForm)
      await fetchColors() // Rafraîchir la liste
      // Sélection automatique de la nouvelle couleur
      const newColor = colors.find(c => c.code === createColorForm.code && c.label === createColorForm.label)
      if (newColor) {
        setCreateVehicleForm(f => ({ ...f, color_id: newColor.id.toString() }))
      }
      toast.success('Couleur créée avec succès')
      setShowCreateColorModal(false)
      setCreateColorForm({ code: '', label: '', description: '' })
    } catch (error) {
      toast.error('Erreur lors de la création de la couleur')
    }
  }

  const handleCreateBodywork = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createBodyworkForm.code || !createBodyworkForm.label) {
      toast.error('Code et nom obligatoires')
      return
    }
    try {
      await createBodywork(createBodyworkForm)
      await fetchBodyworks() // Rafraîchir la liste
      // Sélection automatique de la nouvelle carrosserie
      const newBodywork = bodyworks.find(b => b.code === createBodyworkForm.code && b.label === createBodyworkForm.label)
      if (newBodywork) {
        setCreateVehicleForm(f => ({ ...f, bodywork_id: newBodywork.id.toString() }))
      }
      toast.success('Carrosserie créée avec succès')
      setShowCreateBodyworkModal(false)
      setCreateBodyworkForm({ code: '', label: '', description: '' })
    } catch (error) {
      toast.error('Erreur lors de la création de la carrosserie')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button type="button" variant="outline" size="icon" onClick={handleCancel} className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate">
                {isEditMode ? 'Modifier le dossier' : 'Nouveau dossier'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {isEditMode ? 'Modifiez les informations du dossier' : 'Créez un nouveau dossier d\'expertise'}
              </p>
              {isEditMode && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Mode édition
                  </Badge>
                  <span className="text-xs text-gray-500">ID: {assignmentId}</span>
                  {loadingData && (
                    <div className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                      <span className="text-xs text-blue-600">Chargement...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button type="button" variant="outline" size="sm" className="hidden sm:inline-flex" onClick={handleCancel}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="text-white flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Enregistrement...</span>
                  <span className="sm:hidden">Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{isEditMode ? 'Mettre à jour' : 'Créer le dossier'}</span>
                  <span className="sm:hidden">{isEditMode ? 'Mettre à jour' : 'Créer'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={`flex flex-col lg:flex-row gap-4 lg:gap-6 px-2 sm:px-4 lg:px-6 py-4 lg:py-6 ${loadingData ? 'pointer-events-none opacity-50' : ''}`}>
            {/* Sidebar */}
            <div className="w-full lg:w-80 lg:shrink-0 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Progress Overview */}
                <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none hidden sm:block">
                  <CardHeader className="pb-4 px-3 sm:px-6">
                    <CardTitle className="text-lg font-semibold">
                      {isEditMode ? 'Vue d\'ensemble' : 'Progression'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-3 sm:px-6">
                    {[
                      { id: 1, title: 'Informations générales', icon: FileText, color: 'text-blue-600' },
                      { id: 2, title: 'Types et documents', icon: FileType, color: 'text-green-600' },
                      { id: 3, title: 'Experts', icon: User, color: 'text-purple-600' },
                      { id: 4, title: 'Récapitulatif', icon: ClipboardCheck, color: 'text-orange-600' }
                    ].map((section) => {
                      const Icon = section.icon
                      const isCompleted = section.id === 1 ? 
                        (form.watch('client_id') && form.watch('vehicle_id')) :
                        section.id === 2 ?
                        (form.watch('assignment_type_id') && form.watch('expertise_type_id')) :
                        section.id === 3 ?
                        (form.watch('received_at')) :
                        true
                      
                      return (
                        <div key={section.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isEditMode ? 'bg-blue-50/50 border-blue-200/40' : 'bg-gray-50/50 border-gray-200/40'}`}>
                          <div className={`p-2 rounded-lg bg-white shadow-sm ${section.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {section.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {isEditMode ? 'Disponible' : (isCompleted ? 'Complété' : 'À remplir')}
                            </p>
                          </div>
                          {isCompleted && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Navigation */}
                {!isEditMode && (
                  <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none hidden sm:block">
                    <CardHeader className="pb-4 px-3 sm:px-6">
                      <CardTitle className="text-lg font-semibold">Navigation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-3 sm:px-6">
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          onClick={prevStep}
                          disabled={step === 1}
                          className="flex-1"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Retour</span>
                          <span className="sm:hidden">Précédent</span>
                        </Button>
                        <Button 
                          type="button"
                          variant="default" 
                          size="sm" 
                          onClick={nextStep}
                          disabled={!canProceed || step === totalSteps}
                          className="flex-1"
                        >
                          <span className="hidden sm:inline">Suivant</span>
                          <span className="sm:hidden">Suivant</span>
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                      <div className="text-center text-sm text-gray-500">
                        Étape {step} sur {totalSteps}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation mobile flottante */}
                {!isEditMode && (
                  <div className="lg:hidden fixed bottom-2 left-2 right-2 z-50">
                    <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-lg p-3">
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          onClick={prevStep}
                          disabled={step === 1}
                          className="flex-1"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Précédent
                        </Button>
                        <Button 
                          type="button"
                          variant="default" 
                          size="sm" 
                          onClick={nextStep}
                          disabled={!canProceed || step === totalSteps}
                          className="flex-1"
                        >
                          Suivant
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-2">
                        Étape {step} sur {totalSteps}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {/* <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowCreateClientModal(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau client
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowCreateVehicleModal(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau véhicule
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowCreateInsurerModal(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvel assureur
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowCreateRepairerModal(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau réparateur
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => setShowCreateDocumentModal(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau document
                    </Button>
                  </CardContent>
                </Card> */}
        </div>
      </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4 lg:space-y-6 order-1 lg:order-2">
              {/* Section 1: Informations générales */}
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none">
                <CardHeader className="px-3 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Informations générales
                  </CardTitle>
                  <CardDescription>
                    Renseignez les informations du client, véhicule, assureur et réparateur.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6 px-3 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {/* Client et Véhicule */}
                  <div className="space-y-4">
                      <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <User className="h-5 w-5 text-blue-500" />
                          Client et Véhicule
                        </h3>
                    <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="client_id"
                            render={({ field }) => (
                              <FormItem>
                              <div className="flex items-center gap-2 justify-between">
                                <FormLabel>Client <span className="text-red-500">*</span></FormLabel>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateClientModal(true)} className="shrink-0 w-6 h-6">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                                <div className="flex gap-2">
                                  <ClientSelect
                                    value={field.value ? Number(field.value) : null}
                                    onValueChange={(value: number | null) => {
                                      field.onChange(value?.toString())
                                      if (value) {
                                        handleClientSelection(value.toString())
                                      }
                                    }}
                                    placeholder="Sélectionner un client"
                                    className="flex-1"
                                  />
                                  {selectedClient && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openClientDetails(selectedClient)}
                                      className="shrink-0"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  )}
                      </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="vehicle_id"
                            render={({ field }) => (
                              <FormItem>
                              <div className="flex items-center gap-2 justify-between">
                                <FormLabel>Véhicule <span className="text-red-500">*</span></FormLabel>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateVehicleModal(true)} className="shrink-0 w-6 h-6">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                                <div className="flex gap-2">
                                  <VehicleSelect
                                    value={field.value}
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleVehicleSelection(value)
                                    }}
                                    placeholder="Sélectionner un véhicule"
                                  />
                                  {/* {selectedVehicle && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openVehicleDetails(selectedVehicle)}
                                      className="shrink-0"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  )} */}
                      </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="vehicle_mileage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kilométrage du véhicule</FormLabel>
                                <FormControl>
                        <Input
                                  // type="number"
                                    placeholder="Kilométrage"
                                    value={field.value || ''}
                                  // onChange={(e) => {
                                  //   const value = e.target.value
                                  //   if (value === '') {
                                  //     field.onChange(null)
                                  //   } else {
                                  //     const numValue = parseFloat(value)
                                  //     field.onChange(isNaN(numValue) ? null : numValue)
                                  //   }
                                  // }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                    </div>
                                              <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800 mt-6">
                        <Info className="h-5 w-5 text-gray-500" />
                        Informations complémentaires
                      </h3>
                      <div className="space-y-4">
                        <FormField control={form.control} name="policy_number" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de police</FormLabel>
                            <FormControl>
                              <Input placeholder="Numéro de police" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="claim_number" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de sinistre</FormLabel>
                            <FormControl>
                              <Input placeholder="Numéro de sinistre" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField control={form.control} name="claim_starts_at" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de sinistre</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          {/* <FormField control={form.control} name="claim_ends_at" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fin du sinistre</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} /> */}
                        </div>
                      </div>
                  </div>

                    {/* Assureur et Réparateur + Date de réception */}
                  <div className="space-y-4 mb-15">
                    <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <Building className="h-5 w-5 text-green-500" />
                          Assureur et Réparateur
                        </h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="insurer_id"
                            render={({ field }) => (
                              <FormItem>
                              <div className="flex items-center gap-2 justify-between">
                                <FormLabel>Assureur</FormLabel>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateInsurerModal(true)} className="shrink-0 w-6 h-6">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                                <div className="flex gap-2">
                                  <InsurerSelect
                                    value={field.value ? Number(field.value) : null}
                                    onValueChange={(value: number | null) => {
                                      field.onChange(value?.toString())
                                      if (value) {
                                        handleInsurerSelection(value.toString())
                                      }
                                    }}
                                    placeholder="Sélectionner un assureur"
                                    className="flex-1"
                                    showStatus={true}
                                  />
                                  {selectedInsurer && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openInsurerDetails(selectedInsurer)}
                                      className="shrink-0"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="repairer_id"
                            render={({ field }) => (
                              <FormItem>
                              <div className="flex items-center gap-2 justify-between">
                                <FormLabel>Réparateur</FormLabel>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateRepairerModal(true)} className="shrink-0 w-6 h-6">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                                <div className="flex gap-2">
                                  <RepairerSelect
                                    value={field.value ? Number(field.value) : null}
                                    onValueChange={(value: number | null) => {
                                      field.onChange(value?.toString())
                                      if (value) {
                                        handleRepairerSelection(value.toString())
                                      }
                                    }}
                                    placeholder="Sélectionner un réparateur"
                                    className="flex-1"
                                    showStatus={true}
                                  />
                                  {selectedRepairer && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openRepairerDetails(selectedRepairer)}
                                      className="shrink-0"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  )}
                      </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                      <FormField
                        control={form.control}
                        name="broker_id"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2 justify-between">
                              <FormLabel>Courtier</FormLabel>
                            </div>
                            <div className="flex gap-2">
                              <BrokerSelect
                                value={field.value ? Number(field.value) : null}
                                onValueChange={(value: number | null) => {
                                  field.onChange(value?.toString())
                                  if (value) {
                                    handleBrokerSelection(value.toString())
                                  }
                                }}
                                placeholder="Sélectionner un courtier"
                                className="flex-1"
                                showStatus={true}
                              />
                              {selectedBroker && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openBrokerDetails(selectedBroker)}
                                  className="shrink-0"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="received_at" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date de réception</FormLabel>
                                <FormControl>
                            <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Types et Documents */}
              {(step >= 2 || isEditMode) && (
                <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none mb-20">
                  <CardHeader className="px-3 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <FileType className="h-5 w-5 text-green-600" />
                      Types et Documents
                    </CardTitle>
                    <CardDescription>
                      Sélectionnez les types d'assignation et d'expertise, ainsi que les documents transmis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6 px-3 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {/* Types */}
                      <div className="space-y-4">
                        <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800">
                          <FileText className="h-5 w-5 text-purple-500" />
                          Types
                        </h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="assignment_type_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type de mission <span className="text-red-500">*</span></FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleAssignmentTypeSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un type d'assignation" />
                            </SelectTrigger>
                                    </FormControl>
                            <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {assignmentTypes.map((type) => (
                                          <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.label}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                                  {selectedAssignmentType && (
                        <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openAssignmentTypeDetails(selectedAssignmentType)}
                                      className="shrink-0"
                                    >
                                      <Info className="h-4 w-4" />
                        </Button>
                                  )}
                      </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="expertise_type_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type d'expertise <span className="text-red-500">*</span></FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleExpertiseTypeSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un type d'expertise" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {expertiseTypes.map((type) => (
                                          <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.label}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
                                  {selectedExpertiseType && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openExpertiseTypeDetails(selectedExpertiseType)}
                                      className="shrink-0"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  )}
                          </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Documents transmis */}
                      <div className="space-y-4">
                        {/* <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                          <FileText className="h-5 w-5 text-indigo-500" />
                          Documents transmis
                        </h3>  */}
                        <div className="flex items-center gap-2 justify-between">
                                                        <FormLabel>Documents transmis</FormLabel>
                          <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateDocumentModal(true)} className="shrink-0 w-6 h-6">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="document_transmitted_id"
                            render={({ field }) => (
                              <FormItem>
                                {/* <FormLabel>Documents transmis</FormLabel> */}
                                <div className="space-y-2">
                                  <ScrollArea className="border rounded-md p-2">
                                        {documents.map((document) => (
                                      <div key={document.id} className="flex items-center space-x-2 py-2">
                                        <Checkbox
                                          id={`document-${document.id}`}
                                          checked={field.value?.includes(document.id.toString())}
                                          onCheckedChange={(checked) => {
                                            const currentIds = field.value || []
                                            if (checked) {
                                              field.onChange([...currentIds, document.id.toString()])
                                              handleDocumentSelection([...currentIds, document.id.toString()])
                                            } else {
                                              const newIds = currentIds.filter(id => id !== document.id.toString())
                                              field.onChange(newIds)
                                              handleDocumentSelection(newIds)
                                            }
                                          }}
                                        />
                                        <Label htmlFor={`document-${document.id}`} className="text-sm cursor-pointer">
                                            {document.label}
                                        </Label>
                                      </div>
                                        ))}
                                      </ScrollArea>
                                  {selectedDocuments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {selectedDocuments.map((doc) => (
                                        <Badge key={doc.id} variant="secondary" className="text-xs">
                                          {doc.label}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                          </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Ajout d'une section bien visible pour les informations d'expertise et observations */}
                    <div className="mt-8 p-6 rounded-lg border bg-gray-50">
                                              <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4">
                        <Info className="h-5 w-5 text-gray-500" />
                        Informations d'expertise et observations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <FormField control={form.control} name="expertise_date" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date d'expertise</FormLabel>
                                <FormControl>
                              <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                        )} />
                        <FormField control={form.control} name="expertise_place" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lieu d'expertise</FormLabel>
                                <FormControl>
                              <Input placeholder="Lieu d'expertise" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                        )} />
                        <FormField control={form.control} name="administrator" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gestionnaire</FormLabel>
                                <FormControl>
                              <Input placeholder="Gestionnaire" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                        <FormField control={form.control} name="circumstance" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Circonstance</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="Décrivez les circonstances de l'accident..."
                                  className="min-h-[120px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="damage_declared" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dégâts déclarés</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="Décrivez les dégâts déclarés par le client..."
                                  className="min-h-[120px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="observation" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Observation générale</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="Ajoutez vos observations générales..."
                                  className="min-h-[120px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )} />
                          </div>
                </div>
                  </CardContent>
                </Card>
              )}

              {/* Section 3: Experts */}
              {(step >= 3 || isEditMode) && (
                <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none">
                  <CardHeader className="px-3 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <User className="h-5 w-5 text-purple-600" />
                      Experts
                    </CardTitle>
                    <CardDescription>
                      Configurez les experts assignés au dossier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6 px-3 sm:px-6">
                <div className="space-y-4">
                      {(form.watch('experts') || []).map((expert, idx) => (
                        <div key={idx} className="space-y-4 border-b pb-4 mb-4">
                          <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <FormField
                              control={form.control}
                            name={`experts.${idx}.expert_id` as const}
                              render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Expert</FormLabel>
                                <UserSelect
                                  value={field.value ? Number(field.value) : null}
                                  onValueChange={(value: number | null) => {
                                    field.onChange(value?.toString())
                                  }}
                                  placeholder="Sélectionner un expert"
                                  filterRole="expert"
                                  showStatus={true}
                                />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                            name={`experts.${idx}.date` as const}
                              render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeExpert(idx)}
                              disabled={(form.watch('experts') || []).length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <FormField
                            control={form.control}
                            name={`experts.${idx}.observation` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observation</FormLabel>
                                <FormControl>
                                  <RichTextEditor
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    placeholder="Ajoutez vos observations sur cet expert..."
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addExpert}>
                        <Plus className="mr-2 h-4 w-4" /> Ajouter un expert
                      </Button>
                </div>
                  </CardContent>
                </Card>
            )}

              {/* Section 4: Récapitulatif */}
            {(step === 4 || isEditMode) && (
                <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none">
                  <CardHeader className="px-3 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <ClipboardCheck className="h-5 w-5 text-orange-600" />
                      Récapitulatif du dossier
                    </CardTitle>
                    <CardDescription>
                      {isEditMode 
                        ? 'Vérifiez et validez toutes les informations avant la mise à jour du dossier'
                        : 'Vérifiez et validez toutes les informations avant la création du dossier'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 lg:space-y-8 px-3 sm:px-6">
                  {/* Informations générales */}
                  <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Informations générales</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-gray-700">Client</span>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="font-semibold text-blue-900">
                              {clients.find(c => c.id.toString() === form.watch('client_id'))?.name || 'Non sélectionné'}
                            </div>
                            <div className="text-sm text-blue-700 mt-1">
                              {clients.find(c => c.id.toString() === form.watch('client_id'))?.email || ''}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-gray-700">Véhicule</span>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="font-semibold text-green-900">
                              {vehicles.find(v => v.id.toString() === form.watch('vehicle_id'))?.license_plate || 'Non sélectionné'}
                            </div>
                            <div className="text-sm text-green-700 mt-1">
                              {(() => {
                                const vehicle = vehicles.find(v => v.id.toString() === form.watch('vehicle_id'))
                                return vehicle ? `${vehicle.brand?.label || ''} ${vehicle.vehicle_model?.label || ''}` : ''
                              })()}
                            </div>
                            {form.watch('vehicle_mileage') && (
                              <div className="text-xs text-green-600 mt-1">
                                Kilométrage: {form.watch('vehicle_mileage')} km
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-500" />
                            <span className="font-medium text-gray-700">Assureur</span>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="font-semibold text-purple-900">
                              {entities.find(e => e.id.toString() === form.watch('insurer_id'))?.name || 'Non sélectionné'}
                            </div>
                            <div className="text-sm text-purple-700 mt-1">
                              {entities.find(e => e.id.toString() === form.watch('insurer_id'))?.email || ''}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-gray-700">Réparateur</span>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="font-semibold text-orange-900">
                              {entities.find(e => e.id.toString() === form.watch('repairer_id'))?.name || 'Non sélectionné'}
                            </div>
                            <div className="text-sm text-orange-700 mt-1">
                              {entities.find(e => e.id.toString() === form.watch('repairer_id'))?.email || ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Types et Documents */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <FileType className="h-4 w-4 text-indigo-600" />
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Types et Documents</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-indigo-500" />
                              <span className="font-medium text-gray-700">Type d'assignation</span>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                              <div className="font-semibold text-indigo-900">
                                {assignmentTypes.find(t => t.id.toString() === form.watch('assignment_type_id'))?.label || 'Non sélectionné'}
                              </div>
                              <div className="text-sm text-indigo-700 mt-1">
                                {assignmentTypes.find(t => t.id.toString() === form.watch('assignment_type_id'))?.description || ''}
                              </div>
                              <Badge variant="outline" className="mt-2 bg-indigo-100 text-indigo-800 border-indigo-300">
                                {assignmentTypes.find(t => t.id.toString() === form.watch('assignment_type_id'))?.code || ''}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-teal-500" />
                              <span className="font-medium text-gray-700">Type d'expertise</span>
                            </div>
                            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                              <div className="font-semibold text-teal-900">
                                {expertiseTypes.find(t => t.id.toString() === form.watch('expertise_type_id'))?.label || 'Non sélectionné'}
                              </div>
                              <div className="text-sm text-teal-700 mt-1">
                                {expertiseTypes.find(t => t.id.toString() === form.watch('expertise_type_id'))?.description || ''}
                              </div>
                              <Badge variant="outline" className="mt-2 bg-teal-100 text-teal-800 border-teal-300">
                                {expertiseTypes.find(t => t.id.toString() === form.watch('expertise_type_id'))?.code || ''}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-amber-500" />
                            <span className="font-medium text-gray-700">Documents transmis</span>
                            <Badge variant="secondary" className="ml-auto">
                              {selectedDocuments.length} document(s)
                            </Badge>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            {selectedDocuments.length > 0 ? (
                      <div className="space-y-2">
                                {selectedDocuments.map((doc) => (
                                  <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div>
                                      <div className="font-medium text-amber-900">{doc.label}</div>
                                      <div className="text-xs text-amber-700">{doc.code}</div>
                        </div>
                                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                      ✓ Sélectionné
                                    </Badge>
                        </div>
                                ))}
                        </div>
                            ) : (
                              <div className="text-amber-700 text-center py-4">
                                Aucun document sélectionné
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experts */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <User className="h-4 w-4 text-pink-600" />
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Experts assignés</h3>
                        <Badge variant="secondary" className="ml-auto">
                          {(form.watch('experts') || []).length} expert(s)
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {(form.watch('experts') || []).map((expert, idx) => {
                          const expertUser = users.find(u => u.id.toString() === expert.expert_id)
                          return (
                            <div key={idx} className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-pink-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-pink-900">
                                      {expertUser?.name || 'Expert non sélectionné'}
                                    </div>
                                    <div className="text-sm text-pink-700">
                                      {expertUser?.email || ''}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-pink-900">
                                    {expert.date ? new Date(expert.date).toLocaleDateString('fr-FR') : 'Date non définie'}
                                  </div>
                                  <Badge variant="outline" className="mt-1 bg-pink-100 text-pink-800 border-pink-300">
                                    Expert #{idx + 1}
                                  </Badge>
                                </div>
                              </div>
                              {expert.observation && (
                                <div className="mt-3 space-y-2">
                                  <div className="text-xs text-pink-600 font-medium">Observation:</div>
                                  <HtmlContent
                                    content={expert.observation || ''}
                                    className="p-2 bg-white rounded border border-pink-200"
                                    label=""
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Informations complémentaires */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <Info className="h-4 w-4 text-gray-600" />
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">Informations complémentaires</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <span className="font-medium text-gray-700">Numéro de police</span>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <span className="font-mono text-gray-900">
                                {form.watch('policy_number') || 'Non renseigné'}
                              </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                            <span className="font-medium text-gray-700">Numéro de sinistre</span>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <span className="font-mono text-gray-900">
                                {form.watch('claim_number') || 'Non renseigné'}
                              </span>
                        </div>
                          </div>
                          <div className="space-y-2">
                            <span className="font-medium text-gray-700">Date de réception</span>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <span className="text-gray-900">
                                {form.watch('received_at') ? new Date(form.watch('received_at')!).toLocaleDateString('fr-FR') : 'Non définie'}
                              </span>
                        </div>
                        </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <span className="font-medium text-gray-700">Date d'expertise</span>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <span className="text-gray-900">
                                {form.watch('expertise_date') ? new Date(form.watch('expertise_date')!).toLocaleDateString('fr-FR') : 'Non définie'}
                              </span>
                        </div>
                        </div>
                          <div className="space-y-2">
                            <span className="font-medium text-gray-700">Lieu d'expertise</span>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <span className="text-gray-900">
                                {form.watch('expertise_place') || 'Non renseigné'}
                              </span>
                      </div>
                          </div>
                        <div className="space-y-2">
                            <span className="font-medium text-gray-700">Gestionnaire</span>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <span className="text-gray-900">
                                {form.watch('administrator') || 'Non renseigné'}
                              </span>
                            </div>
                    </div>
                  </div>
                </div>

                      {/* Observations et circonstances */}
                      {(form.watch('circumstance') || form.watch('damage_declared') || form.watch('observation')) && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-700">Observations et détails</span>
                          </div>
                          <div className="space-y-3">
                            {form.watch('circumstance') && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-blue-900">Circonstances:</div>
                                <HtmlContent
                                  content={form.watch('circumstance') || ''}
                                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                                  label=""
                                />
                              </div>
                            )}
                            {form.watch('damage_declared') && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-red-900">Dégâts déclarés:</div>
                                <HtmlContent
                                  content={form.watch('damage_declared') || ''}
                                  className="p-3 bg-red-50 rounded-lg border border-red-200"
                                  label=""
                                />
                              </div>
                            )}
                            {form.watch('observation') && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-green-900">Observation générale:</div>
                                <HtmlContent
                                  content={form.watch('observation') || ''}
                                  className="p-3 bg-green-50 rounded-lg border border-green-200"
                                  label=""
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Résumé final */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <ClipboardCheck className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Résumé du dossier</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-blue-900">{clients.find(c => c.id.toString() === form.watch('client_id'))?.name ? '✓' : '✗'}</div>
                          <div className="text-blue-700">Client</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-900">{vehicles.find(v => v.id.toString() === form.watch('vehicle_id'))?.license_plate ? '✓' : '✗'}</div>
                          <div className="text-blue-700">Véhicule</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-900">{(form.watch('experts') || []).length > 0 ? '✓' : '✗'}</div>
                          <div className="text-blue-700">Experts</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-900">{selectedDocuments.length > 0 ? '✓' : '✗'}</div>
                          <div className="text-blue-700">Documents</div>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de soumission en bas du récapitulatif */}
                    <div className="flex justify-center pt-6 mb-20">
                      <Button 
                        type="submit" 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={loading}
                        size="lg"
                        className="px-8 py-3 text-sm"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-5 w-5" />
                            {isEditMode ? 'Mettre à jour le dossier' : 'Créer le dossier'}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
          </div>
 
        </form>
      </Form>

      {/* Modals de création rapide */}
      <Dialog open={showCreateClientModal} onOpenChange={setShowCreateClientModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un client</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau client.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nom *</Label>
              <Input 
                id="client-name" 
                value={createClientForm.name} 
                onChange={e => setCreateClientForm(f => ({ ...f, name: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email</Label>
              <Input 
                id="client-email" 
                type="email" 
                value={createClientForm.email} 
                onChange={e => setCreateClientForm(f => ({ ...f, email: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone1">Téléphone 1</Label>
              <Input 
                id="client-phone1" 
                value={createClientForm.phone_1} 
                onChange={e => setCreateClientForm(f => ({ ...f, phone_1: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone2">Téléphone 2</Label>
              <Input 
                id="client-phone2" 
                value={createClientForm.phone_2} 
                onChange={e => setCreateClientForm(f => ({ ...f, phone_2: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-address">Adresse</Label>
              <Input 
                id="client-address" 
                value={createClientForm.address} 
                onChange={e => setCreateClientForm(f => ({ ...f, address: e.target.value }))} 
              />
            </div>
            <DialogFooter>
              <Button type="submit">Créer le client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateVehicleModal} onOpenChange={setShowCreateVehicleModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un véhicule</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateVehicle} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-license">Plaque d'immatriculation *</Label>
                <Input 
                  id="vehicle-license" 
                  value={createVehicleForm.license_plate} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, license_plate: e.target.value }))} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-genre">Genre de véhicule *</Label>
                <VehicleGenreSelect
                  value={createVehicleForm.vehicle_genre_id}
                  onValueChange={value => setCreateVehicleForm(f => ({ ...f, vehicle_genre_id: value }))}
                  placeholder="Sélectionner un genre de véhicule"
                  showDescription={false}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="vehicle-brand">Marque *</Label>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateBrandModal(true)} className="shrink-0 w-6 h-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <BrandSelect
                  value={selectedBrandId}
                  onValueChange={setSelectedBrandId}
                  placeholder="Sélectionnez une marque"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="vehicle-model">Modèle de véhicule *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCreateVehicleModelModal(true)}
                    className="shrink-0 w-6 h-6"
                    disabled={!selectedBrandId}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <VehicleModelSelect
                  value={createVehicleForm.vehicle_model_id}
                  onValueChange={value => setCreateVehicleForm(f => ({ ...f, vehicle_model_id: value }))}
                  placeholder="Sélectionner un modèle"
                  brandId={selectedBrandId}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="vehicle-color">Couleur *</Label>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateColorModal(true)} className="shrink-0 w-6 h-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <ColorSelect
                  value={createVehicleForm.color_id}
                  onValueChange={value => setCreateVehicleForm(f => ({ ...f, color_id: value }))}
                  placeholder="Sélectionner une couleur"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="vehicle-bodywork">Carrosserie </Label>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateBodyworkModal(true)} className="shrink-0 w-6 h-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <BodyworkSelect
                  value={createVehicleForm.bodywork_id}
                  onValueChange={value => setCreateVehicleForm(f => ({ ...f, bodywork_id: value }))}
                  placeholder="Sélectionner une carrosserie"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-energy-type">Énergie *</Label>
                <VehicleEnergySelect
                  value={createVehicleForm.vehicle_energy_id}
                  onValueChange={value => setCreateVehicleForm(f => ({ ...f, vehicle_energy_id: value }))}
                  placeholder="Sélectionner un type d'énergie"
                  showDescription={false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-mileage">Kilométrage </Label>
                <Input 
                  id="vehicle-mileage" 
                  type="number" 
                  value={createVehicleForm.mileage} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, mileage: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-first-circulation">Date de première mise en circulation </Label>
                <Input 
                  id="vehicle-first-circulation" 
                  type="date"
                  value={createVehicleForm.first_entry_into_circulation_date || ''} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, first_entry_into_circulation_date: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-technical-visit">Date de visite technique</Label>
                <Input 
                  id="vehicle-technical-visit" 
                  type="date"
                  value={createVehicleForm.technical_visit_date || ''} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, technical_visit_date: e.target.value }))} 
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="vehicle-usage">Usage </Label>
                <Input 
                  id="vehicle-usage" 
                  value={createVehicleForm.usage} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, usage: e.target.value }))} 
                  required 
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Type </Label>
                <Input 
                  id="vehicle-type" 
                  value={createVehicleForm.type} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, type: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-option">Option </Label>
                <Input 
                  id="vehicle-option" 
                  value={createVehicleForm.option} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, option: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-power">Puissance fiscale </Label>
                <Input 
                  id="vehicle-power" 
                  type="number" 
                  value={createVehicleForm.fiscal_power} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, fiscal_power: Number(e.target.value) }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-payload-capacity">Charge utile </Label>
                <Input 
                  id="vehicle-payload-capacity" 
                  type="number"
                  value={createVehicleForm.payload} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, payload: Number(e.target.value) }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-serial">Numéro de série </Label>
                <Input 
                  id="vehicle-serial" 
                  value={createVehicleForm.serial_number} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, serial_number: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-new-value">Valeur neuve </Label>
                <Input 
                  id="vehicle-new-value" 
                  type="number"
                  value={createVehicleForm.new_market_value} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, new_market_value: Number(e.target.value) }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-seats">Nombre de places </Label>
                <Input 
                  id="vehicle-seats" 
                  type="number" 
                  value={createVehicleForm.nb_seats} 
                  onChange={e => setCreateVehicleForm(f => ({ ...f, nb_seats: Number(e.target.value) }))} 
                />
              </div>
              
            </div>
            <DialogFooter>
              <Button type="submit">Créer le véhicule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateInsurerModal} onOpenChange={setShowCreateInsurerModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un assureur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel assureur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateInsurer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="insurer-name">Nom *</Label>
              <Input 
                id="insurer-name" 
                value={createInsurerForm.name} 
                onChange={e => setCreateInsurerForm(f => ({ ...f, name: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurer-code">Code *</Label>
              <Input 
                id="insurer-code" 
                value={createInsurerForm.code} 
                onChange={e => setCreateInsurerForm(f => ({ ...f, code: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurer-email">Email</Label>
              <Input 
                id="insurer-email" 
                type="email" 
                value={createInsurerForm.email} 
                onChange={e => setCreateInsurerForm(f => ({ ...f, email: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurer-phone">Téléphone</Label>
              <Input 
                id="insurer-phone" 
                value={createInsurerForm.telephone} 
                onChange={e => setCreateInsurerForm(f => ({ ...f, telephone: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurer-address">Adresse</Label>
              <Input 
                id="insurer-address" 
                value={createInsurerForm.address} 
                onChange={e => setCreateInsurerForm(f => ({ ...f, address: e.target.value }))} 
              />
            </div>
            <DialogFooter>
              <Button type="submit">Créer l'assureur</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CreateRepairer
        open={showCreateRepairerModal}
        onOpenChange={setShowCreateRepairerModal}
        onSubmit={async (formData) => {
          await createEntity({
            ...formData,
            entity_type_code: 'repairer', // Code pour réparateur
          })
          fetchEntities() // Recharger la liste
        }}
      />

      <Dialog open={showCreateDocumentModal} onOpenChange={setShowCreateDocumentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un document transmis</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau document transmis.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDocument} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-code">Code *</Label>
              <Input 
                id="document-code" 
                value={createDocumentForm.code} 
                onChange={e => setCreateDocumentForm(f => ({ ...f, code: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-label">Label *</Label>
              <Input 
                id="document-label" 
                value={createDocumentForm.label} 
                onChange={e => setCreateDocumentForm(f => ({ ...f, label: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-description">Description</Label>
              <textarea 
                id="document-description" 
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={createDocumentForm.description} 
                onChange={e => setCreateDocumentForm(f => ({ ...f, description: e.target.value }))} 
              />
            </div>
            <DialogFooter>
              <Button type="submit">Créer le document</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal des détails du véhicule */}
      <Dialog open={showVehicleModal} onOpenChange={setShowVehicleModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              Détails
            </DialogTitle>
            <DialogDescription>
              Infos sur le véhicule
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4">
              {/* En-tête avec photo/icône */}
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedVehicle?.brand?.label || ''} {selectedVehicle?.vehicle_model?.label || ''}
                  </h3>
                  <p className="text-muted-foreground">{selectedVehicle.license_plate}</p>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Infos générales</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Marque</span>
                      <span className="font-medium">{selectedVehicle?.brand?.label || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modèle</span>
                      <span className="font-medium">{selectedVehicle?.vehicle_model?.label || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Couleur</span>
                      <span className="font-medium">{selectedVehicle?.color?.label || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrosserie</span>
                      <span className="font-medium">{selectedVehicle?.bodywork?.label || ''}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Caractéristiques</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kilométrage</span>
                      <span className="font-medium">{selectedVehicle?.mileage || ''} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Puissance</span>
                      <span className="font-medium">{selectedVehicle?.fiscal_power || ''} CV</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Places</span>
                      <span className="font-medium">{selectedVehicle?.nb_seats || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valeur neuve</span>
                      <span className="font-medium">{selectedVehicle?.new_market_value ? `${selectedVehicle.new_market_value} FCFA` : 'Non spécifiée'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Charge utile</span>
                      <span className="font-medium">{selectedVehicle?.payload ? `${selectedVehicle.payload} kg` : 'Non spécifiée'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations techniques */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Infos techniques</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">N° de série</span>
                      <span className="font-medium font-mono text-xs">{selectedVehicle?.serial_number || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usage</span>
                      <Badge variant="secondary">{selectedVehicle?.usage || ''}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge variant="outline">{selectedVehicle?.type || ''}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1ère circulation</span>
                      <span className="font-medium">
                        {selectedVehicle?.first_entry_into_circulation_date 
                          ? new Date(selectedVehicle?.first_entry_into_circulation_date).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visite tech.</span>
                      <span className="font-medium">
                        {selectedVehicle?.technical_visit_date 
                          ? new Date(selectedVehicle?.technical_visit_date).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Option</span>
                      <Badge variant="outline">{selectedVehicle?.option || ''}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statut du véhicule */}
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <p className="font-medium">{selectedVehicle?.bodywork?.status?.label || ''}</p>
                </div>
                <Badge 
                  variant={selectedVehicle?.bodywork?.status?.code === 'active' ? 'default' : 'secondary'}
                >
                  {selectedVehicle?.bodywork?.status?.label || ''}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails du client */}
      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xs">
              <User className="h-1.25 w-1.25" />
              Détails du client
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le client sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-1.5">
              {/* En-tête avec avatar */}
              <div className="flex items-center gap-1 p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
                <div className="h-5 w-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {selectedClient?.name?.charAt(0).toUpperCase() || ''}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{selectedClient?.name || ''}</h3>
                  <p className="text-gray-600 text-xs">{selectedClient.email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xxs">
                      {selectedClient?.role?.label || ''}
                    </Badge>
                    <span className="text-xxs text-gray-500">ID: {selectedClient?.hash_id || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-gray-900 border-b pb-0.5">Informations personnelles</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Nom complet</span>
                        <span className="font-semibold text-xs">{selectedClient?.first_name || ''} {selectedClient?.last_name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Email</span>
                        <span className="font-semibold text-xs">{selectedClient?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Téléphone</span>
                        <span className="font-semibold text-xs">{selectedClient?.telephone || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Nom d'utilisateur</span>
                        <span className="font-semibold text-xs">{selectedClient?.username || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-gray-900 border-b pb-0.5">Informations professionnelles</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Rôle</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xxs">
                          {selectedClient?.role?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Entité</span>
                        <span className="font-semibold text-xs">{selectedClient?.entity?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code entité</span>
                        <span className="font-mono text-xxs">{selectedClient?.entity?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-0.75 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Vérification</span>
                        <Badge variant={selectedClient?.pending_verification ? "destructive" : "default"} className="text-xxs">
                          {selectedClient?.pending_verification ? "En attente" : "Vérifié"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de l'entité */}
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-gray-900 border-b pb-0.5">Détails de l'entité</h4>
                <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-gray-50 rounded-xl">
                  <div className="space-y-0.75">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Nom de l'entité</span>
                      <span className="font-semibold text-xs">{selectedClient?.entity?.name || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Email de l'entité</span>
                      <span className="font-semibold text-xs">{selectedClient?.entity?.email || ''}</span>
                    </div>
                  </div>
                  <div className="space-y-0.75">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Téléphone</span>
                      <span className="font-semibold text-xs">{selectedClient?.entity?.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">Adresse</span>
                      <span className="font-semibold text-xs">{selectedClient?.entity?.address || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-1 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-xxs text-blue-600 font-medium">Membre depuis</p>
                  <p className="text-blue-900 font-semibold text-xs">
                    {new Date(selectedClient?.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-blue-600 font-medium">Dernière mise à jour</p>
                  <p className="text-blue-900 font-semibold text-xs">
                    {new Date(selectedClient?.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails de l'assureur */}
      <Dialog open={showInsurerModal} onOpenChange={setShowInsurerModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-2.5 w-2.5" />
              Détails de l'assureur
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur l'assureur sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsurer && (
            <div className="space-y-3">
              {/* En-tête avec logo */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border">
                <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <Building className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedInsurer?.name || ''}</h3>
                  <p className="text-gray-600 text-xs">{selectedInsurer?.email || ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xxs">
                      {selectedInsurer?.entity_type?.label || ''}
                    </Badge>
                    <span className="text-xxs text-gray-500">Code: {selectedInsurer?.code || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Nom</span>
                        <span className="font-semibold text-xs">{selectedInsurer?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code</span>
                        <span className="font-mono text-xxs font-semibold">{selectedInsurer?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Email</span>
                        <span className="font-semibold text-xs">{selectedInsurer?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Téléphone</span>
                        <span className="font-semibold text-xs">{selectedInsurer?.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Statut et type</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Type d'entité</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xxs">
                          {selectedInsurer?.entity_type?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Statut</span>
                        <Badge variant={selectedInsurer?.status?.code === 'active' ? "default" : "secondary"} className="text-xxs">
                          {selectedInsurer?.status?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code du statut</span>
                        <span className="font-mono text-xxs">{selectedInsurer?.status?.code || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              {selectedInsurer.address && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Adresse</h4>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium text-xs">{selectedInsurer.address}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <div>
                  <p className="text-xxs text-green-600 font-medium">Créé le</p>
                  <p className="text-green-900 font-semibold text-xs">
                    {new Date(selectedInsurer.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-green-600 font-medium">Dernière mise à jour</p>
                  <p className="text-green-900 font-semibold text-xs">
                    {new Date(selectedInsurer.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails du réparateur */}
      <Dialog open={showRepairerModal} onOpenChange={setShowRepairerModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-2.5 w-2.5" />
              Détails du réparateur
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le réparateur sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedRepairer && (
            <div className="space-y-3">
              {/* En-tête avec logo */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border">
                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedRepairer?.name || ''}</h3>
                  <p className="text-gray-600 text-xs">{selectedRepairer?.email || ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xxs">
                      {selectedRepairer?.entity_type?.label || ''}
                    </Badge>
                    <span className="text-xxs text-gray-500">Code: {selectedRepairer?.code || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Nom</span>
                        <span className="font-semibold text-xs">{selectedRepairer?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code</span>
                        <span className="font-mono text-xxs font-semibold">{selectedRepairer?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Email</span>
                        <span className="font-semibold text-xs">{selectedRepairer?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Téléphone</span>
                        <span className="font-semibold text-xs">{selectedRepairer?.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Statut et type</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Type d'entité</span>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xxs">
                          {selectedRepairer?.entity_type?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Statut</span>
                        <Badge variant={selectedRepairer?.status?.code === 'active' ? "default" : "secondary"} className="text-xxs">
                          {selectedRepairer?.status?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code du statut</span>
                        <span className="font-mono text-xxs">{selectedRepairer?.status?.code || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              {selectedRepairer.address && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Adresse</h4>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium text-xs">{selectedRepairer?.address || ''}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-xxs text-orange-600 font-medium">Créé le</p>
                  <p className="text-orange-900 font-semibold text-xs">
                    {new Date(selectedRepairer?.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-orange-600 font-medium">Dernière mise à jour</p>
                  <p className="text-orange-900 font-semibold text-xs">
                    {new Date(selectedRepairer?.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails du type d'assignation */}
      <Dialog open={showAssignmentTypeModal} onOpenChange={setShowAssignmentTypeModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-2.5 w-2.5" />
              Détails du type d'assignation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le type d'assignation sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssignmentType && (
            <div className="space-y-3">
              {/* En-tête avec icône */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedAssignmentType?.label || ''}</h3>
                  <p className="text-gray-600 text-xs">{selectedAssignmentType?.description || ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xxs">
                      Type d'assignation
                    </Badge>
                    <span className="text-xxs text-gray-500">Code: {selectedAssignmentType.code}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Libellé</span>
                        <span className="font-semibold text-xs">{selectedAssignmentType.label}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code</span>
                        <span className="font-mono text-xxs font-semibold">{selectedAssignmentType.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Description</span>
                        <span className="font-semibold text-xs">{selectedAssignmentType.description || 'Aucune description'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Statut</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Statut</span>
                        <Badge variant="default" className="text-xxs">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code du statut</span>
                        <span className="font-mono text-xxs">active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-xxs text-purple-600 font-medium">Créé le</p>
                  <p className="text-purple-900 font-semibold text-xs">
                    {new Date(selectedAssignmentType.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-purple-600 font-medium">Dernière mise à jour</p>
                  <p className="text-purple-900 font-semibold text-xs">
                    {new Date(selectedAssignmentType.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails du courtier */}
      <Dialog open={showBrokerModal} onOpenChange={setShowBrokerModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-2.5 w-2.5" />
              Détails du courtier
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le courtier sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedBroker && (
            <div className="space-y-3">
              {/* En-tête avec logo */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Building className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedBroker?.name || ''}</h3>
                  <p className="text-gray-600 text-xs">{selectedBroker?.email || ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xxs">
                      {selectedBroker?.entity_type?.label || ''}
                    </Badge>
                    <span className="text-xxs text-gray-500">Code: {selectedBroker?.code || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Nom</span>
                        <span className="font-semibold text-xs">{selectedBroker?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code</span>
                        <span className="font-mono text-xxs font-semibold">{selectedBroker?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Email</span>
                        <span className="font-semibold text-xs">{selectedBroker?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Téléphone</span>
                        <span className="font-semibold text-xs">{selectedBroker?.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Statut et type</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Type d'entité</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xxs">
                          {selectedBroker?.entity_type?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Statut</span>
                        <Badge variant={selectedBroker?.status?.code === 'active' ? "default" : "secondary"} className="text-xxs">
                          {selectedBroker?.status?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code du statut</span>
                        <span className="font-mono text-xxs">{selectedBroker?.status?.code || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              {selectedBroker.address && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Adresse</h4>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium text-xs">{selectedBroker?.address || ''}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-xxs text-blue-600 font-medium">Créé le</p>
                  <p className="text-blue-900 font-semibold text-xs">
                    {new Date(selectedBroker?.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-blue-600 font-medium">Dernière mise à jour</p>
                  <p className="text-blue-900 font-semibold text-xs">
                    {new Date(selectedBroker?.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails du type d'expertise */}
      <Dialog open={showExpertiseTypeModal} onOpenChange={setShowExpertiseTypeModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-2.5 w-2.5" />
              Détails du type d'expertise
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le type d'expertise sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpertiseType && (
            <div className="space-y-3">
              {/* En-tête avec icône */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border">
                <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                  <Search className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedExpertiseType.label}</h3>
                  <p className="text-gray-600 text-xs">{selectedExpertiseType.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800 text-xxs">
                      Type d'expertise
                    </Badge>
                    <span className="text-xxs text-gray-500">Code: {selectedExpertiseType.code}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Libellé</span>
                        <span className="font-semibold text-xs">{selectedExpertiseType.label}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code</span>
                        <span className="font-mono text-xxs font-semibold">{selectedExpertiseType.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Description</span>
                        <span className="font-semibold text-xs">{selectedExpertiseType.description || 'Aucune description'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Statut</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Statut</span>
                        <Badge variant="default" className="text-xxs">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code du statut</span>
                        <span className="font-mono text-xxs">active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-2 bg-teal-50 rounded-lg">
                <div>
                  <p className="text-xxs text-teal-600 font-medium">Créé le</p>
                  <p className="text-teal-900 font-semibold text-xs">
                    {new Date(selectedExpertiseType.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-teal-600 font-medium">Dernière mise à jour</p>
                  <p className="text-teal-900 font-semibold text-xs">
                    {new Date(selectedExpertiseType.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal des détails du document transmis */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-2.5 w-2.5" />
              Détails du document transmis
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le document transmis sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {/* {selectedDocument && ( */}
            <div className="space-y-3">
              {/* En-tête avec icône */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  {/* <h3 className="text-xl font-bold text-gray-900">{selectedDocument.label}</h3> */}
                  {/* <p className="text-gray-600 text-xs">{selectedDocument.description}</p> */}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xxs">
                      Document transmis
                    </Badge>
                    {/* <span className="text-xxs text-gray-500">Code: {selectedDocument.code}</span> */}
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Libellé</span>
                        {/* <span className="font-semibold text-xs">{selectedDocument.label}</span> */}
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code</span>
                        {/* <span className="font-mono text-xxs font-semibold">{selectedDocument.code}</span> */}
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Description</span>
                        {/* <span className="font-semibold text-xs">{selectedDocument.description || 'Aucune description'}</span> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-gray-900 border-b pb-1">Statut</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Statut</span>
                        <Badge variant="default" className="text-xxs">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">Code du statut</span>
                        <span className="font-mono text-xxs">active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-2 bg-indigo-50 rounded-lg">
                <div>
                  <p className="text-xxs text-indigo-600 font-medium">Créé le</p>
                  <p className="text-indigo-900 font-semibold text-xs">
                    {/* {new Date(selectedDocument.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} */}
                  </p>
                </div>
                <div>
                  <p className="text-xxs text-indigo-600 font-medium">Dernière mise à jour</p>
                  <p className="text-indigo-900 font-semibold text-xs">
                    {/* {new Date(selectedDocument.updated_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} */}
                  </p>
                </div>
              </div>
            </div>
          {/* // )} */}
        </DialogContent>
      </Dialog>

      {/* Modal de création rapide de marque */}
      <Dialog open={showCreateBrandModal} onOpenChange={setShowCreateBrandModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une marque</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle marque.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBrand} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-code">Code *</Label>
              <Input
                id="brand-code"
                value={createBrandForm.code}
                onChange={e => setCreateBrandForm(f => ({ ...f, code: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-label">Nom *</Label>
              <Input
                id="brand-label"
                value={createBrandForm.label}
                onChange={e => setCreateBrandForm(f => ({ ...f, label: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-description">Description</Label>
              <Input
                id="brand-description"
                value={createBrandForm.description}
                onChange={e => setCreateBrandForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loadingBrands}>Créer la marque</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de création rapide de modèle de véhicule */}
      <Dialog open={showCreateVehicleModelModal} onOpenChange={setShowCreateVehicleModelModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un modèle de véhicule</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau modèle. La marque sera pré-remplie.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateVehicleModel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-model-code">Code *</Label>
              <Input
                id="vehicle-model-code"
                value={createVehicleModelForm.code}
                onChange={e => setCreateVehicleModelForm(f => ({ ...f, code: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-model-label">Nom *</Label>
              <Input
                id="vehicle-model-label"
                value={createVehicleModelForm.label}
                onChange={e => setCreateVehicleModelForm(f => ({ ...f, label: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-model-description">Description</Label>
              <Input
                id="vehicle-model-description"
                value={createVehicleModelForm.description}
                onChange={e => setCreateVehicleModelForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-model-brand">Marque</Label>
              <Input
                id="vehicle-model-brand"
                value={brands.find(b => b.id.toString() === selectedBrandId)?.label || ''}
                disabled
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loadingVehicleModels || !selectedBrandId}>Créer le modèle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de création rapide de couleur */}
      <Dialog open={showCreateColorModal} onOpenChange={setShowCreateColorModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une couleur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle couleur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateColor} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="color-code">Code *</Label>
              <Input
                id="color-code"
                value={createColorForm.code}
                onChange={e => setCreateColorForm(f => ({ ...f, code: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color-label">Nom *</Label>
              <Input
                id="color-label"
                value={createColorForm.label}
                onChange={e => setCreateColorForm(f => ({ ...f, label: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color-description">Description</Label>
              <Input
                id="color-description"
                value={createColorForm.description}
                onChange={e => setCreateColorForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loadingColors}>Créer la couleur</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de création rapide de carrosserie */}
      <Dialog open={showCreateBodyworkModal} onOpenChange={setShowCreateBodyworkModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une carrosserie</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle carrosserie.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBodywork} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bodywork-code">Code *</Label>
              <Input
                id="bodywork-code"
                value={createBodyworkForm.code}
                onChange={e => setCreateBodyworkForm(f => ({ ...f, code: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodywork-label">Nom *</Label>
              <Input
                id="bodywork-label"
                value={createBodyworkForm.label}
                onChange={e => setCreateBodyworkForm(f => ({ ...f, label: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodywork-description">Description</Label>
              <Input
                id="bodywork-description"
                value={createBodyworkForm.description}
                onChange={e => setCreateBodyworkForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loadingBodyworks}>Créer la carrosserie</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 