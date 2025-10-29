/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react'
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
import { ArrowLeft, Save, Loader2, FileText, Wrench, Plus, User, Car, Building, FileType, Info, Search, AlertCircle, Eye, CheckCircle } from 'lucide-react'
import { ClientSelect } from '@/features/widgets/client-select'
import { VehicleSelect } from '@/features/widgets/vehicle-select'
import { InsurerRelationshipSelect, RepairerRelationshipSelect, RepairerRelationshipSelectForInsurer, AdditionalInsurerSelect, SelectionDetailsCard } from '@/features/widgets'

import { useUsersStore } from '@/stores/usersStore'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAssignmentTypesStore } from '@/stores/assignmentTypesStore'

import { useExpertiseTypesStore } from '@/stores/expertise-types'
import { useDocumentsStore } from '@/stores/documentsStore'
import { repairerRelationshipService } from '@/services/repairerRelationshipService'
import { insurerRelationshipService } from '@/services/insurerRelationshipService'
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
import { useBrandsStore } from '@/stores/brands'
import { CreateRepairer } from '@/features/assignments/components/create-repairer'
import { VehicleMutateDialog } from '@/features/administration/vehicles/components/vehicle-mutate-dialog'
import { useBrokersStore } from '@/stores/brokersStore'
import { useRepairersStore } from '@/stores/repairersStore'
import { useInsurersStore } from '@/stores/insurersStore'
import axios from 'axios'
import { useUser } from '@/stores/authStore'
import { UserRole } from '@/types/auth'
import { ExpertFirmSelect } from '@/features/widgets'

// Types pour les erreurs
interface ApiError {
  status: number
  title: string
  detail: string
}

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

// Types pour les modèles et couleurs (supprimés car non utilisés)

// Type local pour le payload de création d'assignation
interface AssignmentCreatePayload {
  client_id: string
  vehicle_id: string
  vehicle_mileage: string | null
  insurer_relationship_id: string | null
  repairer_relationship_id: string | null
  broker_id: string | null
  additional_insurer_relationship_id: string | null
  assignment_type_id: string
  expertise_type_id: string
  document_transmitted_id: string[]
  policy_number: string | null
  claim_number: string | null
  claim_starts_at: string | null
  claim_ends_at: string | null
  expertise_date: string | null
  expertise_place: string | null
  received_at: string | null
  administrator: string | null
  circumstance: string | null
  damage_declared: string | null
  observation: string | null
  experts: {
    expert_id: string
    date: string
    observation: string | null
  }[]
}

// Type local pour le payload de mise à jour d'assignation
interface AssignmentUpdatePayload extends AssignmentCreatePayload {
  id: string | number
}

// Schéma de validation
const assignmentSchema = z.object({
  client_id: z.string().min(1, 'Le client est requis'),
  vehicle_id: z.string().min(1, 'Le véhicule est requis'),
  vehicle_mileage: z.string().optional(),
  insurer_relationship_id: z.string().optional(),
  repairer_relationship_id: z.string().optional(),
  broker_id: z.string().optional(),
  additional_insurer_relationship_id: z.string().optional(),
  expert_firm_id: z.string().optional(),
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
  // Indique si les données de base (listes) sont chargées
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const isInitialLoading = loadingData || !baseDataLoaded
  
  // Récupérer l'utilisateur connecté
  const user = useUser()
  
  // Vérifier les rôles de l'utilisateur
  const isInsurer = user?.role?.name === UserRole.INSURER_ADMIN || user?.role?.name === UserRole.INSURER_STANDARD_USER
  const isExpertAdmin = user?.role?.name === UserRole.EXPERT_ADMIN || user?.role?.name === UserRole.ADMIN || user?.role?.name === UserRole.SYSTEM_ADMIN
  const isRepairer = user?.role?.name === UserRole.REPAIRER_ADMIN || user?.role?.name === UserRole.REPAIRER_STANDARD_USER
  // Fonction pour vérifier si le formulaire est complet
  const isFormComplete = () => {
    const values = form.getValues()
    return !!(
      values.client_id && 
      values.vehicle_id && 
      values.assignment_type_id && 
      values.expertise_type_id && 
      values.received_at
    )
  }

  // Fonction pour obtenir le statut des champs obligatoires
  const getRequiredFieldsStatus = () => {
    const values = form.getValues()
    return [
      {
        name: 'Client',
        field: 'client_id',
        completed: !!values.client_id,
        label: 'Client'
      },
      {
        name: 'Véhicule',
        field: 'vehicle_id',
        completed: !!values.vehicle_id,
        label: 'Véhicule'
      },
      {
        name: 'Type de dossier',
        field: 'assignment_type_id',
        completed: !!values.assignment_type_id,
        label: 'Type de dossier'
      },
      {
        name: 'Type d\'expertise',
        field: 'expertise_type_id',
        completed: !!values.expertise_type_id,
        label: 'Type d\'expertise'
      },
      {
        name: 'Date de réception',
        field: 'received_at',
        completed: !!values.received_at,
        label: 'Date de réception'
      }
    ]
  }

  // Fonction pour mettre le focus sur un champ
  const focusOnField = (fieldName: string) => {
    // Essayer de trouver l'élément par son attribut name
    let element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement
    
    // Si pas trouvé, essayer de trouver le conteneur du champ
    if (!element) {
      element = document.querySelector(`[data-field="${fieldName}"]`) as HTMLElement
    }
    
    // Si toujours pas trouvé, essayer de trouver par l'ID
    if (!element) {
      element = document.getElementById(fieldName) as HTMLElement
    }
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Attendre un peu pour que le scroll se termine
      setTimeout(() => {
        element.focus()
        // Pour les Select, essayer de déclencher l'ouverture
        if (element.tagName === 'BUTTON' && element.getAttribute('role') === 'combobox') {
          element.click()
        }
      }, 300)
    }
  }
  const [_experts, setExperts] = useState<Expert[]>([
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
  
  // Removed createVehicleForm - now using VehicleMutateDialog
  
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
  const [selectedClient, setSelectedClient] = useState<any | null>(null)
  const [selectedInsurer, setSelectedInsurer] = useState<EntityType | null>(null)
  const [selectedRepairer, setSelectedRepairer] = useState<EntityType | null>(null)
  const [selectedBroker, setSelectedBroker] = useState<EntityType | null>(null)
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<AssignmentType | null>(null)
  const [selectedExpertiseType, setSelectedExpertiseType] = useState<ExpertiseType | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentTransmitted[]>([])
  const [selectedExpertFirmId, setSelectedExpertFirmId] = useState<string | null>(null)
  const [insurerRelationships, setInsurerRelationships] = useState<any[]>([])
  const [selectedClientData, setSelectedClientData] = useState<any>(null)
  const [selectedInsurerRelationshipData, setSelectedInsurerRelationshipData] = useState<any>(null)
  const [selectedAdditionalInsurerData, setSelectedAdditionalInsurerData] = useState<any>(null)
  const [selectedRepairerRelationshipData, setSelectedRepairerRelationshipData] = useState<any>(null)
  const [selectedVehicleData, setSelectedVehicleData] = useState<any>(null)
  const [repairerRelationships, setRepairerRelationships] = useState<any[]>([])

  // États pour la gestion des erreurs
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorDetails, setErrorDetails] = useState<ApiError[]>([])
  // const [showSummarySheet, setShowSummarySheet] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCreatingModal, setShowCreatingModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdAssignmentId, setCreatedAssignmentId] = useState<number | null>(null)
  
  // Mode édition
  const isEditMode = !!id
  const assignmentId = id || null
  
  
  const { fetchUsers } = useUsersStore()
  const { clients, fetchClients, createClient } = useClientsStore()
  const { vehicles, fetchVehicles } = useVehiclesStore()
  const { assignmentTypes, fetchAssignmentTypes } = useAssignmentTypesStore()
  const { brokers, fetchBrokers } = useBrokersStore()
  const { repairers, fetchRepairers, createRepairer } = useRepairersStore()
  const { insurers, fetchInsurers } = useInsurersStore()
  const { expertiseTypes, fetchExpertiseTypes } = useExpertiseTypesStore()
  const { documents, fetchDocuments, createDocument } = useDocumentsStore()
  const { fetchVehicleModels, createVehicleModel, loading: loadingVehicleModels } = useVehicleModelsStore()
  const { fetchColors, createColor, loading: loadingColors } = useColorsStore()
  const { fetchBodyworks, createBodywork, loading: loadingBodyworks } = useBodyworksStore()
  const { createBrand, brands, fetchBrands, loading: loadingBrands } = useBrandsStore()

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      client_id: '',
      vehicle_id: '',
      vehicle_mileage: '',
      insurer_relationship_id: '',
      repairer_relationship_id: '',
      expert_firm_id: '',
      assignment_type_id: '',
      expertise_type_id: '',
      document_transmitted_id: [],
      policy_number: '',
      claim_number: '',
      claim_starts_at: '',
      claim_ends_at: '',
      expertise_date: '',
      expertise_place: '',
      received_at: '',
      administrator: '',
      circumstance: '',
      damage_declared: '',
      observation: '',
      experts: [{ expert_id: '', date: '', observation: '' }]
    }
  })

  // Pré-remplir automatiquement le champ assureur/réparateur si l'utilisateur est un assureur/réparateur
  useEffect(() => {
    if (!isEditMode && user?.entity?.id) {
      if (isInsurer) {
        // Si l'utilisateur est un assureur, pré-remplir le champ assureur
        form.setValue('insurer_relationship_id', user.entity.id.toString())
      } else if (isRepairer) {
        // Si l'utilisateur est un réparateur, pré-remplir le champ réparateur
        form.setValue('repairer_relationship_id', user.entity.id.toString())
      }
    }
  }, [isEditMode, user, isInsurer, isRepairer, form])

  // Charger les données existantes en mode édition
  useEffect(() => {
    const loadAssignmentData = async () => {
      if (isEditMode && assignmentId) {
        try {
          setLoadingData(true)
          const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
          const assignment = response.data.data
          
          // Pré-remplir le formulaire avec les données existantes
          // Logique de priorité pour additional_insurer_relationship_id :
          // 1. Si additional_insurer existe, utiliser additional_insurer.id
          // 2. Sinon, si broker existe, utiliser broker.id
          // 3. Sinon, champ vide
          const additionalInsurerId = assignment.additional_insurer?.id?.toString() || 
                                    assignment.broker?.id?.toString() || ''

          // Fonction pour trouver l'ID de rattachement basé sur l'entité
          const findRelationshipId = async (entityId: string, type: 'insurer' | 'repairer') => {
            try {
              if (type === 'insurer') {
                const response = await insurerRelationshipService.list(1)
                const relationship = response.data.find((rel: any) => rel.insurer?.id?.toString() === entityId)
                return relationship?.id?.toString() || ''
              } else {
                const response = await repairerRelationshipService.list(1)
                const relationship = response.data.find((rel: any) => rel.repairer?.id?.toString() === entityId)
                return relationship?.id?.toString() || ''
              }
            } catch (error) {
              console.error(`Erreur lors de la recherche du rattachement ${type}:`, error)
              return ''
            }
          }

          // Trouver les IDs de rattachement si nécessaire
          let insurerRelationshipId = assignment.insurer_relationship_id?.toString() || ''
          let repairerRelationshipId = assignment.repairer_relationship_id?.toString() || ''
          let additionalInsurerRelationshipId = assignment.additional_insurer_relationship_id?.toString() || ''

          // Si pas d'ID de rattachement direct, chercher basé sur l'entité
          if (!insurerRelationshipId && assignment.insurer?.id) {
            insurerRelationshipId = await findRelationshipId(assignment.insurer.id.toString(), 'insurer')
          }
          if (!repairerRelationshipId && assignment.repairer?.id) {
            repairerRelationshipId = await findRelationshipId(assignment.repairer.id.toString(), 'repairer')
          }
          if (!additionalInsurerRelationshipId && assignment.additional_insurer?.id) {
            additionalInsurerRelationshipId = await findRelationshipId(assignment.additional_insurer.id.toString(), 'insurer')
          }

          const formData = {
            client_id: assignment.client?.id?.toString() || '',
            vehicle_id: assignment.vehicle?.id?.toString() || '',
            vehicle_mileage: assignment.vehicle?.mileage?.toString() || '',
            insurer_relationship_id: insurerRelationshipId,
            repairer_relationship_id: repairerRelationshipId,
            broker_id: assignment.broker?.id?.toString() || '',
            additional_insurer_relationship_id: additionalInsurerRelationshipId || additionalInsurerId,
            assignment_type_id: assignment.assignment_type?.id?.toString() || '',
            expertise_type_id: assignment.expertise_type?.id?.toString() || '',
            document_transmitted_id: assignment.document_transmitted?.map((doc: any) => doc.id.toString()) || [],
            policy_number: assignment.policy_number || '',
            claim_number: assignment.claim_number || '',
            claim_starts_at: assignment.claim_starts_at || '',
            claim_ends_at: assignment.claim_ends_at || '',
            expertise_date: assignment.expertise_date || '',
            expertise_place: assignment.expertise_place || '',
            received_at: assignment.received_at,
            administrator: assignment.administrator || '',
            circumstance: assignment.circumstance || '',
            damage_declared: assignment.damage_declared || '',
            observation: assignment.observation || '',
            experts: assignment.experts?.map((expert: { id?: number; expert_id?: number; date: string | null; observation: string | null }) => ({
              expert_id: (expert.expert_id ?? expert.id)?.toString() || '',
              date: expert.date || '',
              observation: expert.observation || ''
            })) || [{ expert_id: '', date: '', observation: '' }]
          }
          
          form.reset(formData)

          // Mettre à jour les états des entités sélectionnées
          if (assignment.client) {
            setSelectedClient(assignment.client)
          }
          if (assignment.vehicle) {
            setSelectedVehicle(assignment.vehicle)
          }
          if (assignment.insurer) {
            setSelectedInsurer(assignment.insurer)
          }
          if (assignment.repairer) {
            setSelectedRepairer(assignment.repairer)
          }
          if (assignment.assignment_type) {
            setSelectedAssignmentType(assignment.assignment_type)
          }
          if (assignment.expertise_type) {
            setSelectedExpertiseType(assignment.expertise_type)
          }
          if (assignment.document_transmitted) {
            setSelectedDocuments(assignment.document_transmitted)
          }

          // Mettre à jour la liste des experts
          const expertsData = assignment.experts?.map((expert: { id?: number; expert_id?: number; date: string | null; observation: string | null }) => ({
            expert_id: (expert.expert_id ?? expert.id)?.toString() || '',
            date: expert.date || '',
            observation: expert.observation || ''
          })) || [{ expert_id: '', date: '', observation: '' }]
          
          setExperts(expertsData)

        } catch (error: any) {
          handleApiError(error, 'le chargement du dossier')
        } finally {
          setLoadingData(false)
        }
      }
    }

    // Attendre que les données de base soient chargées pour garantir que les Selects
    // aient leurs options disponibles avant de réaliser le reset/pré-remplissage
    if (baseDataLoaded) {
      loadAssignmentData()
    }
  }, [isEditMode, assignmentId, form, baseDataLoaded])

  // Mémoriser la fonction de chargement des données de base
  const loadBaseData = useCallback(async () => {
    try {
      await Promise.allSettled([
        fetchUsers(),
        fetchClients(),
        fetchVehicles(),
        fetchAssignmentTypes(),
        fetchBrokers(),
        fetchRepairers(),
        fetchInsurers(),
        fetchExpertiseTypes(),
        fetchDocuments(),
        fetchVehicleModels(),
        fetchColors(),
        fetchBodyworks(),
        fetchBrands()
      ])
      setBaseDataLoaded(true)
    } catch (error: any) {
      // Ne pas afficher d'erreur pour le chargement des données de base
      // car cela pourrait être géré individuellement par chaque store
    }
  }, [fetchUsers, fetchClients, fetchVehicles, fetchAssignmentTypes, fetchBrokers, fetchRepairers, fetchInsurers, fetchExpertiseTypes, fetchDocuments, fetchVehicleModels, fetchColors, fetchBodyworks, fetchBrands])

  // Charger les données de base (utilisateurs, véhicules, etc.)
  useEffect(() => {
    // Ne charger qu'une seule fois au montage du composant
    if (!baseDataLoaded) {
      loadBaseData()
    }
    // Charger les rattachements assureurs et réparateurs
    loadInsurerRelationships()
    loadRepairerRelationships()
  }, [baseDataLoaded, loadBaseData])

  // Log des données chargées
  useEffect(() => {
    console.log('=== DONNÉES CHARGÉES ===')
    console.log('assignmentTypes loaded:', assignmentTypes.length, assignmentTypes)
    console.log('expertiseTypes loaded:', expertiseTypes.length, expertiseTypes)
    console.log('vehicles loaded:', vehicles.length, vehicles)
    console.log('clients loaded:', clients.length, clients)
    console.log('========================')
  }, [assignmentTypes, expertiseTypes, vehicles, clients])

  // Removed effect for vehicle model reset - now handled by VehicleMutateDialog


  // Fonction pour ouvrir le récapitulatif
  // const openSummary = () => {
  //   setShowSummarySheet(true)
    
  // }

  // Fonction pour confirmer la création
  const confirmCreation = () => {
    // setShowSummarySheet(false)
    setShowConfirmModal(true)
  }

  // Fonctions pour le modal de succès
  const handleCreateNewAssignment = () => {
    setShowSuccessModal(false)
    setCreatedAssignmentId(null)
    // Réinitialiser le formulaire
    form.reset()
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoToAssignment = () => {
    if (createdAssignmentId) {
      navigate({ to: `/assignments/${createdAssignmentId}` })
    }
  }

  const handleGoToAssignmentsList = () => {
    navigate({ to: '/assignments' })
  }

  // Fonctions pour les experts (UI d'édition désactivée)

  // Fonction pour pré-remplir le kilométrage quand un véhicule est sélectionné
  const handleVehicleSelection = (vehicleId: string) => {
    console.log('handleVehicleSelection called with:', vehicleId)
    console.log('vehicles available:', vehicles.length)
    const vehicle = vehicles.find(v => v.id.toString() === vehicleId)
    if (vehicle) {
      console.log('Vehicle found:', vehicle)
      setSelectedVehicle(vehicle)
      setSelectedVehicleData(vehicle)
      // Pré-remplir le kilométrage avec la valeur du véhicule
      const mileage = vehicle.mileage
      if (mileage !== null && mileage !== undefined) {
        form.setValue('vehicle_mileage', mileage.toString())
      }
    } else {
      console.log('Vehicle not found for ID:', vehicleId)
    }
  }

  // Fonction pour ouvrir le modal des détails du véhicule (supprimée car non utilisée)

  // Fonction pour gérer la sélection du client
  const handleClientSelection = (clientId: string) => {
    const client = clients.find(u => u.id.toString() === clientId)
    if (client) {
      setSelectedClient(client)
      setSelectedClientData(client)
    }
  }

  // Fonction pour ouvrir le modal des détails du client
  const openClientDetails = (client: UserType) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  // Fonction pour gérer la sélection du rattachement assureur
  const handleInsurerRelationshipSelection = (relationshipId: string) => {
    const relationship = insurerRelationships.find(rel => rel.id === relationshipId)
    if (relationship) {
      setSelectedInsurer(relationship.insurer)
      setSelectedInsurerRelationshipData(relationship)
    }
  }

  // Fonction pour ouvrir le modal des détails de l'assureur (non utilisée actuellement)
  const _openInsurerDetails = (insurer: EntityType) => {
    setSelectedInsurer(insurer)
    setShowInsurerModal(true)
  }

  // Fonction pour gérer la sélection du rattachement réparateur
  const handleRepairerRelationshipSelection = (relationshipId: string) => {
    const relationship = repairerRelationships.find(rel => rel.id === relationshipId)
    if (relationship) {
      setSelectedRepairerRelationshipData(relationship)
    }
  }

  // Fonction pour gérer la sélection du cabinet d'expertise (pour les assureurs)
  const handleExpertFirmSelection = (expertFirmId: string) => {
    if (isInsurer && expertFirmId) {
      setSelectedExpertFirmId(expertFirmId)
      // Recharger les rattachements réparateurs avec le filtre expert_firm_id
      loadRepairerRelationshipsByExpertFirm(expertFirmId)
    }
  }

  // Fonction pour charger les rattachements réparateurs par cabinet d'expertise
  const loadRepairerRelationshipsByExpertFirm = async (expertFirmId: string) => {
    try {
      const response = await repairerRelationshipService.list(1, `?expert_firm_id=${expertFirmId}`)
      setRepairerRelationships(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des rattachements réparateurs:', error)
    }
  }

  // Fonction pour charger tous les rattachements réparateurs
  const loadRepairerRelationships = async () => {
    try {
      const response = await repairerRelationshipService.list(1)
      setRepairerRelationships(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des rattachements réparateurs:', error)
    }
  }

  // Fonction pour charger les rattachements assureurs
  const loadInsurerRelationships = async () => {
    try {
      const response = await insurerRelationshipService.list(1)
      setInsurerRelationships(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des rattachements assureurs:', error)
    }
  }

  // Fonction pour ouvrir le modal des détails du réparateur (non utilisée actuellement)
  const _openRepairerDetails = (repairer: EntityType) => {
    setSelectedRepairer(repairer)
    setShowRepairerModal(true)
  }

  // Fonction pour gérer la sélection du courtier/assureur additionnel
  const handleBrokerSelection = (brokerId: string) => {
    const broker = brokers.find(b => b.id.toString() === brokerId)
    if (broker) {
      setSelectedBroker(broker)
      setSelectedAdditionalInsurerData(broker)
    }
  }

  // Fonction pour ouvrir le modal des détails du courtier
  const openBrokerDetails = (broker: EntityType) => {
    setSelectedBroker(broker)
    setShowBrokerModal(true)
  }

  // Fonction pour gérer la sélection du Type de mission
  const handleAssignmentTypeSelection = (assignmentTypeId: string) => {
    console.log('handleAssignmentTypeSelection called with:', assignmentTypeId)
    console.log('assignmentTypes available:', assignmentTypes.length)
    const assignmentType = assignmentTypes.find(at => at.id.toString() === assignmentTypeId)
    if (assignmentType) {
      console.log('Assignment type found:', assignmentType)
      setSelectedAssignmentType(assignmentType)
    } else {
      console.log('Assignment type not found for ID:', assignmentTypeId)
    }
  }

  // Fonction pour ouvrir le modal des détails du Type de mission
  const openAssignmentTypeDetails = (assignmentType: AssignmentType) => {
    setSelectedAssignmentType(assignmentType)
    setShowAssignmentTypeModal(true)
  }

  // Fonction pour gérer la sélection du type d'expertise
  const handleExpertiseTypeSelection = (expertiseTypeId: string) => {
    console.log('handleExpertiseTypeSelection called with:', expertiseTypeId)
    console.log('expertiseTypes available:', expertiseTypes.length)
    const expertiseType = expertiseTypes.find(et => et.id.toString() === expertiseTypeId)
    if (expertiseType) {
      console.log('Expertise type found:', expertiseType)
      setSelectedExpertiseType(expertiseType)
    } else {
      console.log('Expertise type not found for ID:', expertiseTypeId)
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

  // Fonction pour ouvrir le modal des détails du document transmis (supprimée car non utilisée)

  // Fonctions pour les titres et descriptions des étapes (supprimées car non utilisées)

  const onSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    // En création: client_id, vehicle_id, insurer_relationship_id, received_at, assignment_type_id et expertise_type_id sont requis (vérifiés via stepValidations)
    setLoading(true)
    setShowCreatingModal(true)
    
    try {
      
      
      // Préparer les données pour l'API - transmission des données telles quelles
      const assignmentData = {
        client_id: values.client_id,
        vehicle_id: values.vehicle_id,
        vehicle_mileage: values.vehicle_mileage || null,
        insurer_relationship_id: values.insurer_relationship_id || null,
        repairer_relationship_id: values.repairer_relationship_id || null,
        broker_id: values.broker_id || null,
        additional_insurer_relationship_id: values.additional_insurer_relationship_id || null,
        assignment_type_id: values.assignment_type_id,
        expertise_type_id: values.expertise_type_id,
        document_transmitted_id: values.document_transmitted_id || [],
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
          expert_id: expert.expert_id!,
          date: expert.date!,
          observation: expert.observation || null,
        })),
      } as AssignmentCreatePayload

      if (isEditMode && assignmentId) {
        // Mode modification
        const updateData: AssignmentUpdatePayload = {
          ...assignmentData,
          id: assignmentId
        }
        
          const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_SUFIX}${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/update/${assignmentId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('expert_0001_auth_token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
        toast.success('Dossier modifié avec succès')
        navigate({ to: `/assignments/${assignmentId}` })
      } else {
        // Mode création
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_SUFIX}${API_CONFIG.ENDPOINTS.ASSIGNMENTS}`, assignmentData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('expert_0001_auth_token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })
        toast.success('Dossier créé avec succès')
        setCreatedAssignmentId(response.data.data.id)
        setShowSuccessModal(true)
      }
    } catch (error: any) {
      
      // Gestion complète des erreurs
      let errorMessages: ApiError[] = []
      let toastMessage = 'Une erreur inattendue est survenue'
      
      if (error.response) {
        // Erreur HTTP avec réponse
        const status = error.response.status
        const responseData = error.response.data
        
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          // Erreurs structurées de l'API
          errorMessages = responseData.errors.map((err: any) => ({
            status: err.status || status,
            title: err.title || 'Erreur de validation',
            detail: err.detail || 'Une erreur est survenue'
          }))
          toastMessage = errorMessages[0]?.detail || 'Erreur de validation'
        } else if (responseData?.message) {
          // Message d'erreur simple
          errorMessages = [{
            status: status,
            title: 'Erreur',
            detail: responseData.message
          }]
          toastMessage = responseData.message
        } else if (responseData?.error) {
          // Erreur avec champ 'error'
          errorMessages = [{
            status: status,
            title: 'Erreur',
            detail: responseData.error
          }]
          toastMessage = responseData.error
        } else {
          // Erreur HTTP sans structure connue
          const statusText = error.response.statusText || 'Erreur inconnue'
          errorMessages = [{
            status: status,
            title: `Erreur ${status}`,
            detail: statusText
          }]
          toastMessage = `Erreur ${status}: ${statusText}`
        }
      } else if (error.request) {
        // Erreur réseau (pas de réponse)
        errorMessages = [{
          status: 0,
          title: 'Erreur de connexion',
          detail: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.'
        }]
        toastMessage = 'Erreur de connexion au serveur'
      } else if (error.code === 'ECONNABORTED') {
        // Timeout
        errorMessages = [{
          status: 408,
          title: 'Délai d\'attente dépassé',
          detail: 'La requête a pris trop de temps. Veuillez réessayer.'
        }]
        toastMessage = 'Délai d\'attente dépassé'
      } else if (error.message) {
        // Erreur JavaScript
        errorMessages = [{
          status: 500,
          title: 'Erreur technique',
          detail: error.message
        }]
        toastMessage = error.message
      } else {
        // Erreur complètement inconnue
        errorMessages = [{
          status: 500,
          title: 'Erreur inconnue',
          detail: 'Une erreur inattendue est survenue. Veuillez réessayer.'
        }]
        toastMessage = 'Erreur inattendue'
      }
      
      // Afficher les erreurs
      setErrorDetails(errorMessages)
      setShowErrorModal(true)
      toast.error(toastMessage)
      
    } finally {
      setLoading(false)
      setShowCreatingModal(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/assignments' })
  }

  // Fonction utilitaire pour gérer les erreurs de manière uniforme
  const handleApiError = (error: any, context: string = 'opération') => {
    
    let errorMessages: ApiError[] = []
    let toastMessage = `Une erreur inattendue est survenue lors de ${context}`
    
    if (error.response) {
      // Erreur HTTP avec réponse
      const status = error.response.status
      const responseData = error.response.data
      
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        // Erreurs structurées de l'API
        errorMessages = responseData.errors.map((err: any) => ({
          status: err.status || status,
          title: err.title || 'Erreur de validation',
          detail: err.detail || 'Une erreur est survenue'
        }))
        toastMessage = errorMessages[0]?.detail || 'Erreur de validation'
      } else if (responseData?.message) {
        // Message d'erreur simple
        errorMessages = [{
          status: status,
          title: 'Erreur',
          detail: responseData.message
        }]
        toastMessage = responseData.message
      } else if (responseData?.error) {
        // Erreur avec champ 'error'
        errorMessages = [{
          status: status,
          title: 'Erreur',
          detail: responseData.error
        }]
        toastMessage = responseData.error
      } else {
        // Erreur HTTP sans structure connue
        const statusText = error.response.statusText || 'Erreur inconnue'
        errorMessages = [{
          status: status,
          title: `Erreur ${status}`,
          detail: statusText
        }]
        toastMessage = `Erreur ${status}: ${statusText}`
      }
    } else if (error.request) {
      // Erreur réseau (pas de réponse)
      errorMessages = [{
        status: 0,
        title: 'Erreur de connexion',
        detail: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.'
      }]
      toastMessage = 'Erreur de connexion au serveur'
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      errorMessages = [{
        status: 408,
        title: 'Délai d\'attente dépassé',
        detail: 'La requête a pris trop de temps. Veuillez réessayer.'
      }]
      toastMessage = 'Délai d\'attente dépassé'
    } else if (error.message) {
      // Erreur JavaScript
      errorMessages = [{
        status: 500,
        title: 'Erreur technique',
        detail: error.message
      }]
      toastMessage = error.message
    } else {
      // Erreur complètement inconnue
      errorMessages = [{
        status: 500,
        title: 'Erreur inconnue',
        detail: 'Une erreur inattendue est survenue. Veuillez réessayer.'
      }]
      toastMessage = 'Erreur inattendue'
    }
    
    // Afficher les erreurs
    setErrorDetails(errorMessages)
    setShowErrorModal(true)
    toast.error(toastMessage)
    
    return errorMessages
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
    } catch (error: any) {
      handleApiError(error, 'la création du client')
    }
  }
  
  // Removed handleCreateVehicle - now using VehicleMutateDialog

  const handleCreateInsurer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createInsurerForm.name || !createInsurerForm.code) {
      toast.error('Nom et code obligatoires')
      return
    }
    try {
      // TODO: Implémenter la création d'assureur avec un store séparé
      toast.success('Assureur créé avec succès')
      setShowCreateInsurerModal(false)
      setCreateInsurerForm({ name: '', code: '', email: '', telephone: '', address: '' })
      // fetchInsurers() // Recharger la liste
    } catch (error: any) {
      handleApiError(error, 'la création de l\'assureur')
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
    } catch (error: any) {
      handleApiError(error, 'la création du document')
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
    } catch (error: any) {
      handleApiError(error, 'la création de la marque')
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
      // Removed automatic selection - handled by VehicleMutateDialog
      toast.success('Modèle créé avec succès')
      setShowCreateVehicleModelModal(false)
      setCreateVehicleModelForm({ code: '', label: '', description: '', brand_id: '' })
    } catch (error: any) {
      handleApiError(error, 'la création du modèle')
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
      // Removed automatic color selection - handled by VehicleMutateDialog
      toast.success('Couleur créée avec succès')
      setShowCreateColorModal(false)
      setCreateColorForm({ code: '', label: '', description: '' })
    } catch (error: any) {
      handleApiError(error, 'la création de la couleur')
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
      // Removed automatic bodywork selection - handled by VehicleMutateDialog
      toast.success('Carrosserie créée avec succès')
      setShowCreateBodyworkModal(false)
      setCreateBodyworkForm({ code: '', label: '', description: '' })
    } catch (error: any) {
      handleApiError(error, 'la création de la carrosserie')
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
                      <Loader2 className="h-3 w-3 animate-spin text-gray-600" />
                      <span className="text-xs text-gray-600">Chargement...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-sm text-gray-600 hidden sm:block">
              {isEditMode ? 'Mode édition' : 'Nouveau dossier'}
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={`w-full px-2 sm:px-4 lg:px-6 py-4 lg:py-6 ${isInitialLoading ? 'pointer-events-none opacity-50' : ''}`}>

            {/* Contenu principal - Pleine largeur */}
            <div className="w-full space-y-6">
              {/* Section 1: Informations générales */}
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none">
                <CardHeader className="px-3 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Informations générales
                  </CardTitle>
                  <CardDescription>
                    Renseignez les informations du client, véhicule, assureur et réparateur.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-3 sm:px-6">
                  {/* Section Client et Véhicule */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                              <FormItem data-field="client_id">
                              <div className="flex items-center gap-2 justify-between">
                                <FormLabel>Client <span className="text-red-500">*</span></FormLabel>
                                <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateClientModal(true)} className="shrink-0 w-6 h-6">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                                <div className="flex gap-2">
                                    <ClientSelect
                                      value={field.value || null}
                                      onValueChange={(value: string | null) => {
                                        console.log('=== CLIENT SELECT ===')
                                        console.log('Value received:', value, 'type:', typeof value)
                                        console.log('Field value before:', field.value)
                                        field.onChange(value || '')
                                        console.log('Field value after:', field.value)
                                        if (value) {
                                          handleClientSelection(value)
                                        }
                                        console.log('=====================')
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
                                {selectedClientData && (
                                  <div className="mt-3">
                                    <SelectionDetailsCard
                                      type="client"
                                      data={selectedClientData}
                                    />
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="vehicle_id"
                            render={({ field }) => (
                              <FormItem data-field="vehicle_id">
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
                                      console.log('=== VEHICLE SELECT ===')
                                      console.log('Value received:', value, 'type:', typeof value)
                                      console.log('Field value before:', field.value)
                                      field.onChange(value)
                                      console.log('Field value after:', field.value)
                                      handleVehicleSelection(value)
                                      console.log('======================')
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
                      {selectedVehicleData && (
                        <div className="mt-3">
                          <SelectionDetailsCard
                            type="vehicle"
                            data={selectedVehicleData}
                          />
                        </div>
                      )}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>
                          
                      </div>
                  </div>

                    {/* Assureur et Réparateur */}
                    <div className="space-y-4">
                      <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <Building className="h-5 w-5 text-green-500" />
                          {isInsurer ? 'Cabinet d\'expertise' : 'Assureur et Réparateur'}
                        </h3>
                        <div className="space-y-4">
                          {/* Si l'utilisateur est un assureur, afficher un champ pour sélectionner le rattachement */}
                          {isInsurer && (
                            <FormField
                              control={form.control}
                              name="insurer_relationship_id"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-2 justify-between">
                                    <FormLabel> Assureur <span className="text-red-500">*</span></FormLabel>
                                  </div>
                                  <div className="flex gap-2">
                                    <ExpertFirmSelect
                                      value={field.value || null}
                                      onValueChange={(value: string | null) => {
                                        field.onChange(value || '')
                                        if (value) {
                                          handleExpertFirmSelection(value)
                                        }
                                      }}
                                      placeholder="Sélectionner un cabinet d'expertise"
                                      className="flex-1"
                                      showStatus={true}
                                    />
                                  </div>
                                  <FormMessage />
                                  <p className="text-xs text-muted-foreground">
                                    Votre assurance ({user?.entity?.name}) est automatiquement assignée à ce dossier
                                  </p>
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Champ rattachement assureur - masqué pour les assureurs */}
                          {!isInsurer && (
                            <FormField
                              control={form.control}
                              name="insurer_relationship_id"
                              render={({ field }) => (
                                <FormItem>
                                <div className="flex items-center gap-2 justify-between">
                                  <FormLabel> Assureur</FormLabel>
                                </div>
                                  <div className="flex gap-2">
                                    <InsurerRelationshipSelect
                                      value={field.value || null}
                                      onValueChange={(value: string | null) => {
                                        field.onChange(value || '')
                                        if (value) {
                                          handleInsurerRelationshipSelection(value)
                                        }
                                      }}
                                      placeholder="Sélectionner un rattachement assureur"
                                      className="flex-1"
                                      showStatus={true}
                                      showExpertFirm={true}
                                    />
                                  </div>
                                  {selectedInsurerRelationshipData && (
                                    <div className="mt-3">
                                      <SelectionDetailsCard
                                        type="insurer-relationship"
                                        data={selectedInsurerRelationshipData}
                                      />
                                    </div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Assureur additionnel - masqué pour les assureurs */}
                          {!isInsurer && isExpertAdmin && (
                            <FormField
                              control={form.control}
                              name="additional_insurer_relationship_id"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center gap-2 justify-between">
                                    <FormLabel>Assureur additionnel</FormLabel>
                                  </div>
                                  <div className="flex gap-2">
                                    <AdditionalInsurerSelect
                                      value={field.value || null}
                                      onValueChange={(value: string | null) => {
                                        field.onChange(value || '')
                                        if (value) {
                                          handleBrokerSelection(value)
                                        }
                                      }}
                                      placeholder="Sélectionner un assureur additionnel"
                                      className="flex-1"
                                      showStatus={true}
                                      showExpertFirm={true}
                                      excludeInsurerId={selectedInsurer?.id?.toString() || null}
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
                                  {selectedAdditionalInsurerData && (
                                    <div className="mt-3">
                                      <SelectionDetailsCard
                                        type="additional-insurer"
                                        data={selectedAdditionalInsurerData}
                                      />
                                    </div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {/* Rattachement réparateur - accessible pour tous sauf si réparateur */}
                          {!isRepairer && (
                            <FormField
                              control={form.control}
                              name="repairer_relationship_id"
                              render={({ field }) => (
                                <FormItem>
                                <div className="flex items-center gap-2 justify-between">
                                  <FormLabel> Réparateur</FormLabel>
                                </div>
                                  <div className="flex gap-2">
                                    {isInsurer ? (
                                      <RepairerRelationshipSelectForInsurer
                                        value={field.value || null}
                                        onValueChange={(value: string | null) => {
                                          field.onChange(value || '')
                                          if (value) {
                                            handleRepairerRelationshipSelection(value)
                                          }
                                        }}
                                        placeholder="Sélectionner un rattachement réparateur"
                                        className="flex-1"
                                        showStatus={true}
                                        showExpertFirm={true}
                                        expertFirmId={selectedExpertFirmId}
                                      />
                                    ) : (
                                      <RepairerRelationshipSelect
                                        value={field.value || null}
                                        onValueChange={(value: string | null) => {
                                          field.onChange(value || '')
                                          if (value) {
                                            handleRepairerRelationshipSelection(value)
                                          }
                                        }}
                                        placeholder="Sélectionner un rattachement réparateur"
                                        className="flex-1"
                                        showStatus={true}
                                        showExpertFirm={true}
                                      />
                                    )}
                                  </div>
                                  {selectedRepairerRelationshipData && (
                                    <div className="mt-3">
                                      <SelectionDetailsCard
                                        type="repairer-relationship"
                                        data={selectedRepairerRelationshipData}
                                      />
                                    </div>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {/* Message pour les réparateurs */}
                          {isRepairer && (
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                              <p className="text-sm text-orange-900 font-medium">
                                Votre atelier ({user?.entity?.name}) est automatiquement assigné à ce dossier
                              </p>
                            </div>
                          )}
                      </div>

                      <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800 mt-6">
                        <Info className="h-5 w-5 text-gray-500" />
                        Dates informationnelles
                      </h3>
                      <div className="space-y-4">
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
                          <FormField control={form.control} name="received_at" render={({ field }) => (
                      <FormItem data-field="received_at">
                                <FormLabel>Date de réception <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                              <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                      )} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Types et Documents */}
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/60 shadow-none">
                  <CardHeader className="px-3 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                      <FileType className="h-5 w-5 text-green-600" />
                      Types et Documents
                    </CardTitle>
                    <CardDescription>
                      Sélectionnez les types d'assignation et d'expertise, ainsi que les documents transmis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-3 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                              <FormItem data-field="assignment_type_id">
                                <FormLabel>Type de mission <span className="text-red-500">*</span></FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      console.log('=== ASSIGNMENT TYPE SELECT ===')
                                      console.log('Value received:', value, 'type:', typeof value)
                                      console.log('Field value before:', field.value)
                                      field.onChange(value)
                                      console.log('Field value after:', field.value)
                                      handleAssignmentTypeSelection(value)
                                      console.log('===============================')
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un Type de mission" />
                            </SelectTrigger>
                                    </FormControl>
                            <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {assignmentTypes.length === 0 ? (
                                          <div className="p-4 text-center text-gray-500">
                                            Chargement des types de mission...
                                          </div>
                                        ) : (
                                          assignmentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                              {type.label}
                                            </SelectItem>
                                          ))
                                        )}
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
                              <FormItem data-field="expertise_type_id">
                                <FormLabel>Type d'expertise <span className="text-red-500">*</span></FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      console.log('=== EXPERTISE TYPE SELECT ===')
                                      console.log('Value received:', value, 'type:', typeof value)
                                      console.log('Field value before:', field.value)
                                      field.onChange(value)
                                      console.log('Field value after:', field.value)
                                      handleExpertiseTypeSelection(value)
                                      console.log('================================')
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
                                        {expertiseTypes.length === 0 ? (
                                          <div className="p-4 text-center text-gray-500">
                                            Chargement des types d'expertise...
                                          </div>
                                        ) : (
                                          expertiseTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                              {type.label}
                                            </SelectItem>
                                          ))
                                        )}
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
                        <FormField control={form.control} name="expertise_place" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lieu d'expertise</FormLabel>
                                <FormControl>
                              <Input placeholder="Lieu d'expertise" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                        )} />
                        </div>
                      </div>

                      {/* Documents transmis */}
                      <div className="space-y-4">
                        <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2 text-gray-800">
                          <FileText className="h-5 w-5 text-indigo-500" />
                          Documents transmis
                        </h3>
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
                  </CardContent>
                </Card>
            </div>
            
          </div>
                      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4 px-10 sm:px-10 lg:px-10 -mx-6 -mb-6">
                        <div className="flex flex-col gap-4">
                          {/* Indicateur des champs obligatoires */}
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-medium text-gray-700 mr-2">
                              Champs obligatoires ({getRequiredFieldsStatus().filter(f => f.completed).length}/{getRequiredFieldsStatus().length}) :
                            </span>
                            {getRequiredFieldsStatus().map((field) => (
                              <button
                                key={field.field}
                                onClick={() => focusOnField(field.field)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${
                                  field.completed
                                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                                }`}
                                title={`Cliquer pour aller au champ ${field.name}`}
                              >
                                {field.completed ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <AlertCircle className="h-3 w-3" />
                                )}
                                {field.name}
                              </button>
                            ))}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {isEditMode 
                                ? 'Vérifiez les informations avant de mettre à jour le dossier'
                                : 'Vérifiez les informations avant de créer le dossier'
                              }
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                type="button"
                                variant="outline" 
                                onClick={handleCancel}
                                className="px-6"
                              >
                                Annuler
                              </Button>
                              {isEditMode ? (
                      <Button 
                        type="submit" 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={loading}
                        size="lg"
                                  className="px-8"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-5 w-5" />
                                      Mettre à jour le dossier
                          </>
                        )}
                      </Button>
                              ) : (
                                <Button 
                                  type="button"
                                  onClick={confirmCreation}
                                  disabled={!isFormComplete()}
                                  size="lg"
                                  className="px-8"
                                >
                                  <Eye className="mr-2 h-5 w-5" />
                                  Confirmer la création
                                </Button>
              )}
            </div>
          </div>
                        </div>
                      </div>
        </form>
        
      </Form>

        {/* Modal de confirmation */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="max-w-xl min-w-xl w-1/2 max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Confirmation de création
              </DialogTitle>
              <DialogDescription>
                Vérifiez toutes les informations avant de créer le dossier
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations générales
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Client :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const clientId = form.watch('client_id')
                          const client = clients.find(c => c.id.toString() === clientId)
                          return client ? client.name : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Véhicule :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const vehicleId = form.watch('vehicle_id')
                          const vehicle = vehicles.find(v => v.id.toString() === vehicleId)
                          return vehicle ? `${vehicle?.brand?.label} ${vehicle?.vehicle_model?.label}` : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Assureur :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const insurerId = form.watch('insurer_relationship_id')
                          const insurer = insurers?.find((i: any) => i.id.toString() === insurerId)
                          return insurer ? insurer?.name : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Réparateur :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const repairerId = form.watch('repairer_relationship_id')
                          const repairer = repairers?.find((r: any) => r.id.toString() === repairerId)
                          return repairer ? repairer?.name : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Courtier :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const brokerId = form.watch('broker_id') || form.watch('additional_insurer_relationship_id')
                          const broker = brokers?.find((b: any) => b.id.toString() === brokerId)
                          return broker ? broker?.name : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Assureur additionnel :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const additionalInsurerId = form.watch('additional_insurer_relationship_id')
                          const additionalInsurer = additionalInsurers?.find((a: any) => a.id.toString() === additionalInsurerId)
                          return additionalInsurer ? additionalInsurer?.name : 'Non sélectionné'
                        })()}
                      </span>
                    </div> */}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Date de réception :</span>
                      <span className="text-gray-900">{form.watch('received_at') || 'Non définie'}</span>
                    </div>
                  </div>
                </div>

                {/* Types et Documents */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <FileType className="h-4 w-4" />
                    Types et Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Type de mission :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const assignmentTypeId = form.watch('assignment_type_id')
                          const assignmentType = assignmentTypes?.find(at => at.id.toString() === assignmentTypeId)
                          return assignmentType ? assignmentType?.label : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Type d'expertise :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const expertiseTypeId = form.watch('expertise_type_id')
                          const expertiseType = expertiseTypes?.find(et => et.id.toString() === expertiseTypeId)
                          return expertiseType ? expertiseType?.label : 'Non sélectionné'
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between md:col-span-2">
                      <span className="font-medium text-gray-700">Documents transmis :</span>
                      <span className="text-gray-900">
                        {(() => {
                          const documentIds = form.watch('document_transmitted_id') || []
                          if (documentIds.length === 0) return 'Aucun document'
                          const documentNames = documentIds.map(id => {
                            const doc = documents.find(d => d.id.toString() === id)
                            return doc?.label || 'Document inconnu'
                          })
                          return documentNames.join(', ')
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Informations complémentaires
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Numéro de police :</span>
                      <span className="text-gray-900">{form.watch('policy_number') || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Numéro de sinistre :</span>
                      <span className="text-gray-900">{form.watch('claim_number') || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Date de sinistre :</span>
                      <span className="text-gray-900">{form.watch('claim_starts_at') || 'Non définie'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Date d'expertise :</span>
                      <span className="text-gray-900">{form.watch('expertise_date') || 'Non définie'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Lieu d'expertise :</span>
                      <span className="text-gray-900">{form.watch('expertise_place') || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Gestionnaire :</span>
                      <span className="text-gray-900">{form.watch('administrator') || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>

                {/* Experts */}
                {/* <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Experts assignés ({(form.watch('experts') || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(form.watch('experts') || []).map((expert, idx) => {
                      const expertUser = users.find(u => u.id.toString() === expert.expert_id)
                      return (
                        <div key={idx} className="bg-white rounded p-3 border border-orange-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Expert #{idx + 1} :</span>
                            <span className="text-gray-900">
                              {expertUser ? `${expertUser.first_name} ${expertUser.last_name}` : 'Expert non trouvé'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">Date :</span>
                            <span className="text-xs text-gray-600">{expert.date || 'Non définie'}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div> */}

                {/* Observations */}
                {/* <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Observations
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Circonstance :</span>
                      <div className="text-gray-900 bg-white rounded p-2 border">
                        {form.watch('circumstance') ? (
                          <HtmlContent content={form.watch('circumstance') || ''} />
                        ) : (
                          <span className="text-gray-500 italic">Aucune circonstance renseignée</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Dommages déclarés :</span>
                      <div className="text-gray-900 bg-white rounded p-2 border">
                        {form.watch('damage_declared') ? (
                          <HtmlContent content={form.watch('damage_declared') || ''} />
                        ) : (
                          <span className="text-gray-500 italic">Aucun dommage déclaré</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Observation générale :</span>
                      <div className="text-gray-900 bg-white rounded p-2 border">
                        {form.watch('observation') ? (
                          <HtmlContent content={form.watch('observation') || ''} />
                        ) : (
                          <span className="text-gray-500 italic">Aucune observation</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={() => {
                setShowConfirmModal(false)
                form.handleSubmit(onSubmit)()
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Créer le dossier
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <VehicleMutateDialog 
        id={null}
        open={showCreateVehicleModal}
        onOpenChange={setShowCreateVehicleModal}
      />


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
          await createRepairer(formData)
          fetchRepairers() // Recharger la liste
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

      {/* Modal des détails du Type de mission */}
      <Dialog open={showAssignmentTypeModal} onOpenChange={setShowAssignmentTypeModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-2.5 w-2.5" />
              Détails du Type de mission
            </DialogTitle>
            <DialogDescription className="text-xs">
              Informations complètes sur le Type de mission sélectionné
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
                      Type de mission
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

      {/* Modal d'erreur amélioré */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-[300px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Erreur détectée
            </DialogTitle>
            <DialogDescription>
              Une ou plusieurs erreurs ont été détectées. Veuillez consulter les détails ci-dessous et corriger les problèmes :
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Résumé des erreurs */}
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">
                  {errorDetails.length} erreur{errorDetails.length > 1 ? 's' : ''} détectée{errorDetails.length > 1 ? 's' : ''}
                </span>
                      </div>
              <p className="text-sm text-muted-foreground">
                {errorDetails.length === 1 
                  ? 'Une erreur a empêché la sauvegarde de votre dossier.'
                  : 'Plusieurs erreurs ont empêché la sauvegarde de votre dossier.'
                }
              </p>
                        </div>

            {/* Liste détaillée des erreurs */}
            <div className="space-y-3">
              {errorDetails.map((error, index) => (
                <div key={index} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-destructive">{index + 1}</span>
                      </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-destructive">
                          {error.title}
                        </h4>
                        {error.status && (
                          <span className="px-2 py-1 text-xs bg-destructive/20 text-destructive rounded-full font-mono">
                            {error.status}
                          </span>
                        )}
                    </div>
                      <div className='p-2 bg-red-900 border border-red-200 rounded text-xs text-white'>
                        <p className="text-sm text-white-700 leading-relaxed ">
                         <span className='font-bold'>Détail :</span> {error.detail}
                        </p>
                      </div>
                      
                      {/* Suggestions de résolution basées sur le type d'erreur */}
                      {error.detail?.toLowerCase().includes('existe déjà') && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          <strong>Suggestion :</strong> Vérifiez que les informations saisies sont uniques ou modifiez les valeurs en conflit.
                    </div>
                      )}
                      {error.detail?.toLowerCase().includes('requis') && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          <strong>Suggestion :</strong> Assurez-vous de remplir tous les champs obligatoires marqués d'un astérisque (*).
              </div>
            )}
                      {error.detail?.toLowerCase().includes('connexion') && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                          <strong>Suggestion :</strong> Vérifiez votre connexion internet et réessayez dans quelques instants.
          </div>
                      )}
                      {error.detail?.toLowerCase().includes('timeout') && (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800">
                          <strong>Suggestion :</strong> La requête a pris trop de temps. Réessayez ou contactez le support si le problème persiste.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions suggérées */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Actions suggérées :</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Vérifiez les informations saisies dans le formulaire</li>
                <li>• Assurez-vous que tous les champs obligatoires sont remplis</li>
                <li>• Vérifiez que les données sont uniques (numéros, codes, etc.)</li>
                <li>• Si le problème persiste, contactez le support technique</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowErrorModal(false)}
              className="flex-1"
            >
              Fermer
            </Button>
            <Button 
              variant="default" 
              onClick={() => {
                setShowErrorModal(false)
                // Optionnel : scroll vers le premier champ en erreur
                const firstErrorField = document.querySelector('[data-error="true"]')
                if (firstErrorField) {
                  firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
              className="flex-1"
            >
              Corriger les erreurs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de chargement initial - seulement en mode édition */}
      <Dialog open={isEditMode && isInitialLoading} onOpenChange={() => {}}>
        <DialogContent className="w-1/3">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Chargement des données
            </DialogTitle>
            <DialogDescription>
              Veuillez patienter pendant le chargement des informations du formulaire...
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Préparation du formulaire en cours...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Indicateur de chargement discret - seulement en mode création */}
      {!isEditMode && isInitialLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-700">Chargement des données...</span>
          </div>
        </div>
      )}

      {/* Modal de création en cours */}
      <Dialog open={showCreatingModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              {isEditMode ? 'Mise à jour du dossier' : 'Création du dossier'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Veuillez patienter pendant la mise à jour de votre dossier...'
                : 'Veuillez patienter pendant la création de votre dossier...'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Save className="h-6 w-6 text-blue-600" />
      </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              {isEditMode 
                ? 'Mise à jour en cours...'
                : 'Création en cours...'
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de succès */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Dossier créé avec succès !
            </DialogTitle>
            <DialogDescription>
              Votre dossier a été créé avec succès. Que souhaitez-vous faire maintenant ?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-6">
              Le dossier #{createdAssignmentId} a été créé avec succès.
            </p>
          </div>

          <div className="flex justify-between">
            <Button 
              onClick={handleGoToAssignment}
              className=""
              size="lg"
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir le dossier créé
            </Button>
            
            <Button 
              onClick={handleGoToAssignmentsList}
              variant="outline"
              className=""
              size="lg"
            >
              <FileText className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
            
            <Button 
              onClick={handleCreateNewAssignment}
              variant="outline"
              className=""
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer un nouveau dossier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
} 