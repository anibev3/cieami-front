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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowLeft, Save, Loader2, FileText, Package, Wrench, ClipboardCheck, Plus, Trash2, ArrowRight, Check, Calendar, MapPin, User, Car, Building, FileType, Info, X, Search, Edit } from 'lucide-react'
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
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Vehicle } from '@/types/vehicles'
import { User as UserType } from '@/types/administration'
import { Entity as EntityType, DocumentTransmitted } from '@/types/administration'
import { ExpertiseType } from '@/types/expertise-types'
import { DatePicker } from '@/components/ui/date-picker'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

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

// Type local pour le payload de création d'assignation
interface AssignmentCreatePayload {
  client_id: number
  vehicle_id: number
  vehicle_mileage: number | null
  insurer_id: number
  repairer_id: number
  assignment_type_id: number
  expertise_type_id: number
  document_transmitted_id: number
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
  insurer_id: z.string().min(1, 'L\'assureur est requis'),
  repairer_id: z.string().min(1, 'Le réparateur est requis'),
  assignment_type_id: z.string().min(1, 'Le type d\'assignation est requis'),
  expertise_type_id: z.string().min(1, 'Le type d\'expertise est requis'),
  document_transmitted_id: z.string().min(1, 'Le document transmis est requis'),
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
    expert_id: z.string().min(1, 'L\'expert est requis'),
    date: z.string().min(1, 'La date est requise'),
    observation: z.string().optional()
  })).min(1, 'Au moins un expert est requis')
})

export default function CreateAssignmentPage() {
  const navigate = useNavigate()
    // const params = useParams({ from: '/assignments/create', })
    const { id } = useParams({ strict: false }) as { id: string }
  const [loading, setLoading] = useState(false)
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
  const [showAssignmentTypeModal, setShowAssignmentTypeModal] = useState(false)
  const [showExpertiseTypeModal, setShowExpertiseTypeModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  
  // États pour les entités sélectionnées
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedClient, setSelectedClient] = useState<UserType | null>(null)
  const [selectedInsurer, setSelectedInsurer] = useState<EntityType | null>(null)
  const [selectedRepairer, setSelectedRepairer] = useState<EntityType | null>(null)
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<AssignmentType | null>(null)
  const [selectedExpertiseType, setSelectedExpertiseType] = useState<ExpertiseType | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<DocumentTransmitted | null>(null)
  
  // Mode édition
  const isEditMode = !!id
  const assignmentId = id ? parseInt(id) : null
  
  const { createAssignment } = useAssignmentsStore()
  const { users, fetchUsers } = useUsersStore()
  const { vehicles, fetchVehicles } = useVehiclesStore()
  const { assignmentTypes, fetchAssignmentTypes } = useAssignmentTypesStore()
  const { entities, fetchEntities } = useEntitiesStore()
  const { expertiseTypes, fetchExpertiseTypes } = useExpertiseTypesStore()
  const { documents, fetchDocuments } = useDocumentsStore()

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
      document_transmitted_id: '',
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
          setLoading(true)
          const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
          const assignment = response.data.data
          
          // Pré-remplir le formulaire avec les données existantes
          form.reset({
            client_id: assignment.client_id?.toString() || '',
            vehicle_id: assignment.vehicle_id?.toString() || '',
            vehicle_mileage: assignment.vehicle_mileage?.toString() || '',
            insurer_id: assignment.insurer_id?.toString() || '',
            repairer_id: assignment.repairer_id?.toString() || '',
            assignment_type_id: assignment.assignment_type_id?.toString() || '',
            expertise_type_id: assignment.expertise_type_id?.toString() || '',
            document_transmitted_id: assignment.document_transmitted_id?.toString() || '',
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
          })

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
            setSelectedDocument(assignment.document_transmitted)
          }

          // Mettre à jour la liste des experts
          setExperts(assignment.experts?.map((expert: { expert_id: number; date: string; observation: string | null }) => ({
            expert_id: expert.expert_id?.toString() || '',
            date: expert.date || '',
            observation: expert.observation || ''
          })) || [{ expert_id: '', date: '', observation: '' }])

        } catch (error) {
          console.error('Erreur lors du chargement du dossier:', error)
          toast.error('Erreur lors du chargement du dossier')
        } finally {
          setLoading(false)
        }
      }
    }

    loadAssignmentData()
  }, [isEditMode, assignmentId, form])

  // Charger les données de base (utilisateurs, véhicules, etc.)
  useEffect(() => {
    fetchUsers()
    fetchVehicles()
    fetchAssignmentTypes()
    fetchEntities()
    fetchExpertiseTypes()
    fetchDocuments()
  }, [fetchUsers, fetchVehicles, fetchAssignmentTypes, fetchEntities, fetchExpertiseTypes, fetchDocuments])

  // Validations par étape
  const stepValidations = {
    1: () => {
      const values = form.getValues()
      const mileage = values.vehicle_mileage
      const isMileageValid = mileage !== null && mileage !== undefined && !isNaN(Number(mileage)) && Number(mileage) >= 0
      
      return (
        values.client_id?.toString().length > 0 &&
        values.vehicle_id?.toString().length > 0 &&
        values.insurer_id?.toString().length > 0 &&
        values.repairer_id?.toString().length > 0 &&
        isMileageValid
      )
    },
    2: () => {
      const values = form.getValues()
      const hasAssignmentType = values.assignment_type_id && values.assignment_type_id.toString().length > 0
      const hasExpertiseType = values.expertise_type_id && values.expertise_type_id.toString().length > 0
      const hasDocument = values.document_transmitted_id && values.document_transmitted_id.toString().length > 0
      
      return hasAssignmentType && hasExpertiseType && hasDocument
    },
    3: () => {
      const values = form.getValues()
      return Boolean(values.experts.length > 0 && values.experts.every(expert => expert.expert_id && expert.date))
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
    const currentExperts = form.getValues('experts')
    form.setValue('experts', [...currentExperts, {
      expert_id: '',
      date: new Date().toISOString().split('T')[0],
      observation: '',
    }])
  }

  const removeExpert = (index: number) => {
    const currentExperts = form.getValues('experts')
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
      const mileage = parseFloat(vehicle.mileage)
      if (!isNaN(mileage)) {
        form.setValue('vehicle_mileage', mileage)
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

  // Fonction pour gérer la sélection du document transmis
  const handleDocumentSelection = (documentId: string) => {
    const document = documents.find(d => d.id.toString() === documentId)
    if (document) {
      setSelectedDocument(document)
    }
  }

  // Fonction pour ouvrir le modal des détails du document transmis
  const openDocumentDetails = (document: DocumentTransmitted) => {
    setSelectedDocument(document)
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
      // Préparer les données pour l'API
      const assignmentData: AssignmentCreatePayload = {
        client_id: parseInt(values.client_id),
        vehicle_id: parseInt(values.vehicle_id),
        vehicle_mileage: values.vehicle_mileage ? parseInt(values.vehicle_mileage) : null,
        insurer_id: parseInt(values.insurer_id),
        repairer_id: parseInt(values.repairer_id),
        assignment_type_id: parseInt(values.assignment_type_id),
        expertise_type_id: parseInt(values.expertise_type_id),
        document_transmitted_id: parseInt(values.document_transmitted_id),
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
        experts: values.experts.map((expert) => ({
          expert_id: parseInt(expert.expert_id),
          date: expert.date,
          observation: expert.observation || null,
        })),
      }

      if (isEditMode && assignmentId) {
        // Mode modification
        const updateData: AssignmentUpdatePayload = {
          ...assignmentData,
          id: assignmentId
        }
        
        const response = await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`, updateData)
        toast.success('Dossier modifié avec succès')
        navigate({ to: `/assignments/${assignmentId}` })
      } else {
        // Mode création
        const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}`, assignmentData)
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

  return (
    <div className="w-full flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditMode ? 'Modifier le dossier' : 'Nouveau dossier'}
          </h2>
        </div>
      </div>

      {/* Barre de progression améliorée */}
      <div className="w-full rounded-lg bg-muted/50 p-6">
        <div className="relative flex items-center justify-between">
          {/* Ligne de progression */}
          <div className="absolute left-0 top-1/2 h-2 w-full rounded-full bg-muted/50 -translate-y-1/2">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>

          {/* Étapes */}
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`h-14 w-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-500 ${
                  step >= i
                    ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/20'
                    : 'bg-background text-muted-foreground border-2 border-muted'
                }`}
              >
                {i === 1 && <FileText className="h-7 w-7" />}
                {i === 2 && <FileType className="h-7 w-7" />}
                {i === 3 && <User className="h-7 w-7" />}
                {i === 4 && <ClipboardCheck className="h-7 w-7" />}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  step >= i ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {getStepTitle(i)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">{getStepTitle(step)}</CardTitle>
          <CardDescription className="text-base">{getStepDescription(step)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Étape 1 : Informations générales */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                      {/* Client et Véhicule */}
                  <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Client et Véhicule
                        </h3>
                    <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="client_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Client</FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleClientSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un client" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {users.map((user) => (
                                          <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
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
                                <FormLabel>Véhicule</FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleVehicleSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un véhicule" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {vehicles.map((vehicle) => (
                                          <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                            {vehicle.brand.label} {vehicle.vehicle_model.label} - {vehicle.license_plate}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
                                  {selectedVehicle && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openVehicleDetails(selectedVehicle)}
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
                            name="vehicle_mileage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Kilométrage du véhicule</FormLabel>
                                <FormControl>
                        <Input
                                    type="number"
                                    placeholder="Kilométrage"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      if (value === '') {
                                        field.onChange(null)
                                      } else {
                                        const numValue = parseFloat(value)
                                        field.onChange(isNaN(numValue) ? null : numValue)
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                    </div>
                  </div>

                      {/* Assureur et Réparateur */}
                  <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Assureur et Réparateur
                        </h3>
                    <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="insurer_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assureur</FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleInsurerSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un assureur" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {entities.filter(e => e.entity_type.code === 'insurer').map((entity) => (
                                          <SelectItem key={entity.id} value={entity.id.toString()}>
                                            {entity.name}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
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
                                <FormLabel>Réparateur</FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleRepairerSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un réparateur" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {entities.filter(e => e.entity_type.code === 'repairer').map((entity) => (
                                          <SelectItem key={entity.id} value={entity.id.toString()}>
                                            {entity.name}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
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

                          <FormField
                            control={form.control}
                            name="received_at"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date de réception</FormLabel>
                                <FormControl>
                        <Input
                                    type="date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                    </div>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations complémentaires</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="policy_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de police</FormLabel>
                              <FormControl>
                                <Input placeholder="Numéro de police" value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="claim_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de sinistre</FormLabel>
                              <FormControl>
                                <Input placeholder="Numéro de sinistre" value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="claim_starts_at"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Début du sinistre</FormLabel>
                              <FormControl>
                                <Input type="date" value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="claim_ends_at"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fin du sinistre</FormLabel>
                              <FormControl>
                                <Input type="date" value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                  </div>
                </div>
              </div>
            )}

                {/* Étape 2 : Type d'assignation */}
            {step === 2 && (
              <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Type d'assignation</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="assignment_type_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type d'assignation</FormLabel>
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
                                        {assignmentTypes.map((assignmentType) => (
                                          <SelectItem key={assignmentType.id} value={assignmentType.id.toString()}>
                                            {assignmentType.label}
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
                                <FormLabel>Type d'expertise</FormLabel>
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
                                        {expertiseTypes.map((expertiseType) => (
                                          <SelectItem key={expertiseType.id} value={expertiseType.id.toString()}>
                                            {expertiseType.label}
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

                          <FormField
                            control={form.control}
                            name="document_transmitted_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document transmis</FormLabel>
                                <div className="flex gap-2">
                                  <Select 
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      handleDocumentSelection(value)
                                    }} 
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Sélectionner un document" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {documents.map((document) => (
                                          <SelectItem key={document.id} value={document.id.toString()}>
                                            {document.label}
                                          </SelectItem>
                                        ))}
                                      </ScrollArea>
                                    </SelectContent>
                                  </Select>
                                  {selectedDocument && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openDocumentDetails(selectedDocument)}
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

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informations d'expertise</h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="expertise_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date d'expertise</FormLabel>
                                <FormControl>
                                  <Input type="date" value={field.value || ''} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="expertise_place"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lieu d'expertise</FormLabel>
                                <FormControl>
                                  <Input placeholder="Lieu d'expertise" value={field.value || ''} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="administrator"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Administrateur</FormLabel>
                                <FormControl>
                                  <Input placeholder="Administrateur" value={field.value || ''} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                            />
                          </div>
                        </div>
                      </div>

                    {/* Observations */}
                      <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Observations</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="circumstance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Circonstances</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Décrivez les circonstances..." value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="damage_declared"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dégâts déclarés</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Décrivez les dégâts déclarés..." value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="observation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Observations générales</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Observations générales..." value={field.value || ''} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                            />
                          </div>
                </div>
              </div>
            )}

                {/* Étape 3 : Experts */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                        <h2 className="text-xl font-semibold">Gestion des experts</h2>
                    <p className="mt-1 text-base text-muted-foreground">
                          Assignez les experts au dossier
                    </p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                            <Button variant="outline" className="gap-2 px-4 py-2 text-base transition-transform hover:scale-105" onClick={addExpert}>
                          <Plus className="h-4 w-4" />
                              Ajouter un expert
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                            <p>Ajouter un nouvel expert à la liste</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-4">
                      {form.watch('experts').map((_, index) => (
                        <div key={index} className="group border rounded-xl bg-card p-6 shadow transition-colors space-y-6 hover:border-primary/50">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Expert {index + 1}</h3>
                            {form.watch('experts').length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive transition-colors hover:bg-destructive/10"
                                onClick={() => removeExpert(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`experts.${index}.expert_id`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expert</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un expert" />
                            </SelectTrigger>
                                    </FormControl>
                            <SelectContent>
                                      <ScrollArea className="h-[200px]">
                                        {users.filter(user => user.role.name === 'expert').map((user) => (
                                          <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.name}
                                </SelectItem>
                              ))}
                                      </ScrollArea>
                            </SelectContent>
                          </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`experts.${index}.date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date d'assignation</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                      </div>

                          <FormField
                            control={form.control}
                            name={`experts.${index}.observation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observation</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Observation pour cet expert..." value={field.value || ''} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                </div>
              </div>
            )}

            {/* Étape 4 : Récapitulatif */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-8">
                  {/* Informations générales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informations générales</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Client</span>
                              <span className="font-medium">
                                {users.find(u => u.id.toString() === form.watch('client_id'))?.name}
                              </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Véhicule</span>
                              <span className="font-medium">
                                {vehicles.find(v => v.id.toString() === form.watch('vehicle_id'))?.brand.label} {vehicles.find(v => v.id.toString() === form.watch('vehicle_id'))?.vehicle_model.label}
                              </span>
                        </div>
                        <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Assureur</span>
                              <span className="font-medium">
                                {entities.find(e => e.id.toString() === form.watch('insurer_id'))?.name}
                              </span>
                        </div>
                        <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Réparateur</span>
                              <span className="font-medium">
                                {entities.find(e => e.id.toString() === form.watch('repairer_id'))?.name}
                              </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Type d'assignation</span>
                              <span className="font-medium">
                                {assignmentTypes.find(t => t.id.toString() === form.watch('assignment_type_id'))?.label}
                              </span>
                        </div>
                        <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Type d'expertise</span>
                              <span className="font-medium">
                                {expertiseTypes.find(t => t.id.toString() === form.watch('expertise_type_id'))?.label}
                              </span>
                        </div>
                        <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Date de réception</span>
                              <span className="font-medium">{form.watch('received_at')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Experts assignés</span>
                              <span className="font-medium">{form.watch('experts').length}</span>
                        </div>
                        </div>
                        </div>
                      </div>

                      {/* Experts */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Experts assignés</h3>
                        <div className="space-y-2">
                          {form.watch('experts').map((expert, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <span className="font-medium">
                                {users.find(u => u.id.toString() === expert.expert_id)?.name}
                              </span>
                              <span className="text-muted-foreground">{expert.date}</span>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation entre les étapes */}
            <div className="flex justify-between pt-6">
                <Button
                type="button"
                  variant="outline"
                  onClick={prevStep}
                disabled={step === 1}
                >
                <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep} disabled={!canProceed}>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? 'Modification...' : 'Création...'}
                        </>
                      ) : (
                        <>
                      {isEditMode ? <Edit className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                      {isEditMode ? 'Modifier le dossier' : 'Créer le dossier'}
                        </>
                      )}
                    </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
        </form>
      </Form>

      {/* Modal des détails du véhicule */}
      <Dialog open={showVehicleModal} onOpenChange={setShowVehicleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Détails du véhicule
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le véhicule sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-6">
              {/* En-tête avec photo/icône */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedVehicle?.brand?.label || ''} {selectedVehicle?.vehicle_model?.label || ''}
                  </h3>
                  <p className="text-muted-foreground">{selectedVehicle.license_plate}</p>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Informations générales</h4>
                  <div className="space-y-3">
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

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Caractéristiques</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kilométrage</span>
                      <span className="font-medium">{selectedVehicle?.mileage || ''} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Puissance fiscale</span>
                      <span className="font-medium">{selectedVehicle?.fiscal_power || ''} CV</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre de places</span>
                      <span className="font-medium">{selectedVehicle?.nb_seats || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Énergie</span>
                      <span className="font-medium">{selectedVehicle?.energy || 'Non spécifiée'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations techniques */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Informations techniques</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Numéro de série</span>
                      <span className="font-medium font-mono text-sm">{selectedVehicle?.serial_number || ''}</span>
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
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1ère mise en circulation</span>
                      <span className="font-medium">
                        {selectedVehicle?.first_entry_into_circulation_date 
                          ? new Date(selectedVehicle?.first_entry_into_circulation_date).toLocaleDateString('fr-FR')
                          : 'Non spécifiée'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visite technique</span>
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
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Statut du véhicule</p>
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
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Détails du client
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le client sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              {/* En-tête avec avatar */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedClient?.name?.charAt(0).toUpperCase() || ''}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedClient?.name || ''}</h3>
                  <p className="text-gray-600">{selectedClient.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selectedClient?.role?.label || ''}
                    </Badge>
                    <span className="text-sm text-gray-500">ID: {selectedClient?.hash_id || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations personnelles</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Nom complet</span>
                        <span className="font-semibold">{selectedClient?.first_name || ''} {selectedClient?.last_name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="font-semibold">{selectedClient?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Téléphone</span>
                        <span className="font-semibold">{selectedClient?.telephone || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Nom d'utilisateur</span>
                        <span className="font-semibold">{selectedClient?.username || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations professionnelles</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Rôle</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {selectedClient?.role?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Entité</span>
                        <span className="font-semibold">{selectedClient?.entity?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code entité</span>
                        <span className="font-mono text-sm">{selectedClient?.entity?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Vérification</span>
                        <Badge variant={selectedClient?.pending_verification ? "destructive" : "default"}>
                          {selectedClient?.pending_verification ? "En attente" : "Vérifié"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de l'entité */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Détails de l'entité</h4>
                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom de l'entité</span>
                      <span className="font-semibold">{selectedClient?.entity?.name || ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email de l'entité</span>
                      <span className="font-semibold">{selectedClient?.entity?.email || ''}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone</span>
                      <span className="font-semibold">{selectedClient?.entity?.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adresse</span>
                      <span className="font-semibold">{selectedClient?.entity?.address || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Membre depuis</p>
                  <p className="text-blue-900 font-semibold">
                    {new Date(selectedClient?.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Dernière mise à jour</p>
                  <p className="text-blue-900 font-semibold">
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
              <Building className="h-5 w-5" />
              Détails de l'assureur
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur l'assureur sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedInsurer && (
            <div className="space-y-6">
              {/* En-tête avec logo */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border">
                <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <Building className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedInsurer?.name || ''}</h3>
                  <p className="text-gray-600">{selectedInsurer?.email || ''}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {selectedInsurer?.entity_type?.label || ''}
                    </Badge>
                    <span className="text-sm text-gray-500">Code: {selectedInsurer?.code || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations générales</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Nom</span>
                        <span className="font-semibold">{selectedInsurer?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code</span>
                        <span className="font-mono text-sm font-semibold">{selectedInsurer?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="font-semibold">{selectedInsurer?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Téléphone</span>
                        <span className="font-semibold">{selectedInsurer?.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Statut et type</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Type d'entité</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {selectedInsurer?.entity_type?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Statut</span>
                        <Badge variant={selectedInsurer?.status?.code === 'active' ? "default" : "secondary"}>
                          {selectedInsurer?.status?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code du statut</span>
                        <span className="font-mono text-sm">{selectedInsurer?.status?.code || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              {selectedInsurer.address && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Adresse</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium">{selectedInsurer.address}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600 font-medium">Créé le</p>
                  <p className="text-green-900 font-semibold">
                    {new Date(selectedInsurer.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Dernière mise à jour</p>
                  <p className="text-green-900 font-semibold">
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
              <Wrench className="h-5 w-5" />
              Détails du réparateur
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le réparateur sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedRepairer && (
            <div className="space-y-6">
              {/* En-tête avec logo */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border">
                <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
                  <Wrench className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedRepairer?.name || ''}</h3>
                  <p className="text-gray-600">{selectedRepairer?.email || ''}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {selectedRepairer?.entity_type?.label || ''}
                    </Badge>
                    <span className="text-sm text-gray-500">Code: {selectedRepairer?.code || ''}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations générales</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Nom</span>
                        <span className="font-semibold">{selectedRepairer?.name || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code</span>
                        <span className="font-mono text-sm font-semibold">{selectedRepairer?.code || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Email</span>
                        <span className="font-semibold">{selectedRepairer?.email || ''}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Téléphone</span>
                        <span className="font-semibold">{selectedRepairer?.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Statut et type</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Type d'entité</span>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {selectedRepairer?.entity_type?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Statut</span>
                        <Badge variant={selectedRepairer?.status?.code === 'active' ? "default" : "secondary"}>
                          {selectedRepairer?.status?.label || ''}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code du statut</span>
                        <span className="font-mono text-sm">{selectedRepairer?.status?.code || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              {selectedRepairer.address && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Adresse</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium">{selectedRepairer?.address || ''}</p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Créé le</p>
                  <p className="text-orange-900 font-semibold">
                    {new Date(selectedRepairer?.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Dernière mise à jour</p>
                  <p className="text-orange-900 font-semibold">
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
              <FileText className="h-5 w-5" />
              Détails du type d'assignation
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le type d'assignation sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssignmentType && (
            <div className="space-y-6">
              {/* En-tête avec icône */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border">
                <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white">
                  <FileText className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedAssignmentType?.label || ''}</h3>
                  <p className="text-gray-600">{selectedAssignmentType?.description || ''}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Type d'assignation
                    </Badge>
                    <span className="text-sm text-gray-500">Code: {selectedAssignmentType.code}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations générales</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Libellé</span>
                        <span className="font-semibold">{selectedAssignmentType.label}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code</span>
                        <span className="font-mono text-sm font-semibold">{selectedAssignmentType.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Description</span>
                        <span className="font-semibold">{selectedAssignmentType.description || 'Aucune description'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Statut</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Statut</span>
                        <Badge variant="default">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code du statut</span>
                        <span className="font-mono text-sm">active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Créé le</p>
                  <p className="text-purple-900 font-semibold">
                    {new Date(selectedAssignmentType.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Dernière mise à jour</p>
                  <p className="text-purple-900 font-semibold">
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

      {/* Modal des détails du type d'expertise */}
      <Dialog open={showExpertiseTypeModal} onOpenChange={setShowExpertiseTypeModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Détails du type d'expertise
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le type d'expertise sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpertiseType && (
            <div className="space-y-6">
              {/* En-tête avec icône */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border">
                <div className="h-20 w-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white">
                  <Search className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedExpertiseType.label}</h3>
                  <p className="text-gray-600">{selectedExpertiseType.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                      Type d'expertise
                    </Badge>
                    <span className="text-sm text-gray-500">Code: {selectedExpertiseType.code}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations générales</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Libellé</span>
                        <span className="font-semibold">{selectedExpertiseType.label}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code</span>
                        <span className="font-mono text-sm font-semibold">{selectedExpertiseType.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Description</span>
                        <span className="font-semibold">{selectedExpertiseType.description || 'Aucune description'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Statut</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Statut</span>
                        <Badge variant="default">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code du statut</span>
                        <span className="font-mono text-sm">active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-4 bg-teal-50 rounded-lg">
                <div>
                  <p className="text-sm text-teal-600 font-medium">Créé le</p>
                  <p className="text-teal-900 font-semibold">
                    {new Date(selectedExpertiseType.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-teal-600 font-medium">Dernière mise à jour</p>
                  <p className="text-teal-900 font-semibold">
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
              <FileText className="h-5 w-5" />
              Détails du document transmis
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le document transmis sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-6">
              {/* En-tête avec icône */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border">
                <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  <FileText className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedDocument.label}</h3>
                  <p className="text-gray-600">{selectedDocument.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      Document transmis
                    </Badge>
                    <span className="text-sm text-gray-500">Code: {selectedDocument.code}</span>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Informations générales</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Libellé</span>
                        <span className="font-semibold">{selectedDocument.label}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code</span>
                        <span className="font-mono text-sm font-semibold">{selectedDocument.code}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Description</span>
                        <span className="font-semibold">{selectedDocument.description || 'Aucune description'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">Statut</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Statut</span>
                        <Badge variant="default">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Code du statut</span>
                        <span className="font-mono text-sm">active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Créé le</p>
                  <p className="text-indigo-900 font-semibold">
                    {new Date(selectedDocument.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Dernière mise à jour</p>
                  <p className="text-indigo-900 font-semibold">
                    {new Date(selectedDocument.updated_at).toLocaleDateString('fr-FR', {
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
    </div>
  )
} 