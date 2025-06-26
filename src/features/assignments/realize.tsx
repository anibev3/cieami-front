/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Search as SearchIcon, 
  Eye, 
  Calendar as CalendarIcon2, 
  MapPin, 
  User, 
  Car, 
  Building, 
  FileText, 
  CheckCircle,
  Clock,
  DollarSign,
  FileType,
  Users,
  Wrench,
  Info
} from 'lucide-react'
import { useUsersStore } from '@/stores/usersStore'
import { useReparateursStore } from '@/features/gestion/reparateurs/store'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Vehicle } from '@/types/vehicles'
import { User as UserType } from '@/types/administration'
import { Entity as EntityType } from '@/types/administration'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

// Schéma de validation pour la réalisation
const realizeSchema = z.object({
  expertise_date: z.date({
    required_error: "La date d'expertise est requise",
  }),
  expertise_time: z.string().min(1, "L'heure d'expertise est requise"),
  expertise_place: z.string().min(1, 'Le lieu d\'expertise est requis'),
  point_noted: z.string().min(1, 'Les points notés sont requis'),
  directed_by: z.string().min(1, 'L\'expert est requis'),
  repairer_id: z.string().min(1, 'Le réparateur est requis'),
})

interface Assignment {
  id: number
  reference: string
  status: {
    code: string
    label: string
  }
  client: UserType
  vehicle: Vehicle
  insurer: EntityType
  repairer: EntityType
  assignment_type: {
    id: number
    label: string
    code: string
  }
  expertise_type: {
    id: number
    label: string
    code: string
  }
  document_transmitted: {
    id: number
    label: string
    code: string
  }
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
  amount: number
  experts: Array<{
    expert_id: number
    date: string
    observation: string | null
  }>
  created_at: string
  updated_at: string
  realized_at?: string
  realized_by?: {
    id: number
    name: string
  }
}

interface RealizePayload {
  expertise_date: string
  expertise_place: string
  point_noted: string
  directed_by: string
  repairer_id: string
}

export default function RealizeAssignmentPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }
  const assignmentId = parseInt(id)
  
  const [loading, setLoading] = useState(false)
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { users, fetchUsers } = useUsersStore()
  const { reparateurs, fetchReparateurs } = useReparateursStore()

  const form = useForm<z.infer<typeof realizeSchema>>({
    resolver: zodResolver(realizeSchema),
    defaultValues: {
      expertise_date: new Date(),
      expertise_time: '09:00',
      expertise_place: '',
      point_noted: '',
      directed_by: '',
      repairer_id: '',
    }
  })

  // Charger les données du dossier
  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
        const assignmentData = response.data.data
        setAssignment(assignmentData)
        
        // Si le dossier est déjà réalisé, pré-remplir le formulaire
        if (assignmentData.realized_at && assignmentData.expertise_date) {
          const expertiseDate = new Date(assignmentData.expertise_date)
          const hours = String(expertiseDate.getHours()).padStart(2, '0')
          const minutes = String(expertiseDate.getMinutes()).padStart(2, '0')
          const timeString = `${hours}:${minutes}`
          
          form.reset({
            expertise_date: expertiseDate,
            expertise_time: timeString,
            expertise_place: assignmentData.expertise_place || '',
            point_noted: assignmentData.point_noted || '',
            directed_by: assignmentData.realized_by?.id?.toString() || '',
            repairer_id: assignmentData.repairer_id?.toString() || '',
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement du dossier:', error)
        toast.error('Erreur lors du chargement du dossier')
      } finally {
        setLoading(false)
      }
    }

    if (assignmentId) {
      loadAssignment()
    }
  }, [assignmentId, form])

  // Charger les utilisateurs (experts) et réparateurs
  useEffect(() => {
    fetchUsers()
    fetchReparateurs()
  }, [fetchUsers, fetchReparateurs])

  // Filtrer les experts (utilisateurs avec le rôle expert)
  const experts = users.filter(user => user.role?.name === 'expert')

  // Mode modification de réalisation
  const isEditRealization = assignment?.realized_at && assignment?.realized_by

  const onSubmit = async (values: z.infer<typeof realizeSchema>) => {
    setLoading(true)
    
    try {
      // Combiner la date et l'heure au format "YYYY-MM-DDTHH:mm"
      const expertiseDateTime = new Date(values.expertise_date)
      const [hours, minutes] = values.expertise_time.split(':')
      expertiseDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      // Formater la date au format "YYYY-MM-DDTHH:mm"
      const year = expertiseDateTime.getFullYear()
      const month = String(expertiseDateTime.getMonth() + 1).padStart(2, '0')
      const day = String(expertiseDateTime.getDate()).padStart(2, '0')
      const formattedHours = String(expertiseDateTime.getHours()).padStart(2, '0')
      const formattedMinutes = String(expertiseDateTime.getMinutes()).padStart(2, '0')
      
      const formattedDateTime = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`
      
      const payload: RealizePayload = {
        expertise_date: formattedDateTime,
        expertise_place: values.expertise_place,
        point_noted: values.point_noted,
        directed_by: values.directed_by,
        repairer_id: values.repairer_id,
      }

      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/realize/${assignmentId}`, payload)
      toast.success(isEditRealization ? 'Réalisation modifiée avec succès' : 'Dossier réalisé avec succès')
      navigate({ to: `/assignments/${assignmentId}` })
    } catch (error) {
      console.error('Erreur lors de la réalisation:', error)
      toast.error(isEditRealization ? 'Erreur lors de la modification de la réalisation' : 'Erreur lors de la réalisation du dossier')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: `/assignments/${assignmentId}` })
  }

  // Fonction de recherche dans les détails du dossier
  const filteredDetails = assignment ? Object.entries(assignment).filter(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase())
    }
    return String(value).toLowerCase().includes(searchTerm.toLowerCase())
  }) : []

  if (loading && !assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Dossier non trouvé</p>
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
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isEditRealization ? 'Modifier la réalisation' : 'Réaliser le dossier'}
            </h2>
            <p className="text-muted-foreground">
              Référence: {assignment.reference} | Statut: {assignment.status.label}
              {isEditRealization && (
                <span className="ml-2 text-blue-600">
                  • Réalisé le {new Date(assignment.realized_at!).toLocaleDateString('fr-FR')} par {assignment.realized_by?.name}
                </span>
              )}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowDetailsModal(true)} variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Voir tous les détails
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales du dossier */}
        <div className="space-y-6">
          {/* Informations du client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">{assignment.client.name}</p>
                  <p className="text-sm text-muted-foreground">{assignment.client.email}</p>
                  <Badge variant="secondary">{assignment.client.role?.label}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">
                    {assignment.vehicle?.brand?.label} {assignment.vehicle?.vehicle_model?.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{assignment.vehicle.license_plate}</p>
                  <Badge variant="secondary">{assignment.vehicle?.color?.label}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations financières */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informations financières
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="font-semibold text-lg">{assignment.amount?.toLocaleString('fr-FR')} €</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de police</p>
                  <p className="font-semibold">{assignment.policy_number || 'Non renseigné'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire de réalisation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {isEditRealization ? 'Modifier la réalisation' : 'Formulaire de réalisation'}
              </CardTitle>
              <CardDescription>
                {isEditRealization 
                  ? 'Modifiez les informations de réalisation du dossier'
                  : 'Remplissez les informations pour finaliser l\'expertise'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Date et heure d'expertise */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="expertise_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date d'expertise</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expertise_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure d'expertise</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Lieu d'expertise */}
                  <FormField
                    control={form.control}
                    name="expertise_place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lieu d'expertise</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Adresse complète du lieu d'expertise" 
                            className="w-full" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expert et Garage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="directed_by"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expert responsable</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un expert" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className='w-full'>
                              {experts.map((expert) => (
                                <SelectItem key={expert.id} value={expert.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {expert.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="repairer_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Garage</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un garage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className='w-full'>
                              {reparateurs.map((reparateur) => (
                                <SelectItem key={reparateur.id} value={reparateur.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <Wrench className="h-4 w-4" />
                                    {reparateur.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                         <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Points notés */}
                  <FormField
                    control={form.control}
                    name="point_noted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points notés lors de l'expertise</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Décrivez en détail les points notés lors de l'expertise, les constatations, les dégâts observés..."
                            rows={6}
                            className="w-full resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Boutons d'action */}
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                      Annuler
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditRealization ? 'Modification...' : 'Réalisation...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {isEditRealization ? 'Modifier la réalisation' : 'Réaliser le dossier'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal des détails complets */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Détails complets du dossier
            </DialogTitle>
            <DialogDescription>
              Toutes les informations du dossier {assignment.reference}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les détails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Contenu scrollable */}
            <div className="max-h-[60vh] overflow-y-auto space-y-4">
              {filteredDetails.map(([key, value]) => (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {typeof value === 'object' && value !== null ? (
                      <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm">{String(value)}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
        </div>
      </Main>
      </>
  )
} 