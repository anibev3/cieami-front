/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { 
  ArrowLeft, 
  Loader2, 
  User, 
  Car, 
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import { UserSelect } from '@/features/widgets/user-select'
import { RepairerRelationshipSelect } from '@/features/widgets'
import { repairerRelationshipService } from '@/services/repairerRelationshipService'
import { useUser } from '@/stores/authStore'
import { UserRole } from '@/types/auth'
import { useAssignmentRealizationStore } from '@/stores/assignmentRealizationStore'


// Schéma de validation pour la réalisation
const realizeSchema = z.object({
  expertise_date: z.date({
    required_error: "La date d'expertise est requise",
  }),
  // expertise_time: z.string().optional(),
  expertise_place: z.string().optional(),
  point_noted: z.string().optional(),
  directed_by: z.string().min(1, 'L\'expert responsable est requis'),
  repairer_relationship_id: z.string().optional(),
})

// Interface déplacée vers le service
import { RealizeAssignmentPayload as RealizePayload } from '@/services/assignmentRealizationService'

export default function RealizeAssignmentPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }
  const assignmentId = id
  const user = useUser()
  const isInsurer = user?.role?.name === UserRole.INSURER_ADMIN || user?.role?.name === UserRole.INSURER_STANDARD_USER
  
  // Utilisation du store dédié
  const { 
    loading, 
    assignment, 
    error, 
    fetchAssignmentDetails, 
    realizeAssignment,
    updateRealizeAssignment
  } = useAssignmentRealizationStore()

  const form = useForm<z.infer<typeof realizeSchema>>({
    resolver: zodResolver(realizeSchema),
    defaultValues: {
      expertise_date: undefined,
      // expertise_time: '',
      expertise_place: '',
      point_noted: '',
      directed_by: '',
      repairer_relationship_id: '',
    }
  })

  // Charger les données du dossier via le store
  useEffect(() => {
    if (assignmentId) {
      fetchAssignmentDetails(assignmentId)
    }
  }, [assignmentId, fetchAssignmentDetails])

  // Pré-remplir le formulaire quand les données sont chargées
  useEffect(() => {
    const prefill = async () => {
      if (assignment) {
        // Gérer la date d'expertise
        let expertiseDate = new Date()
        
        if (assignment.expertise_date) {
          expertiseDate = new Date(assignment.expertise_date)
        }
        
        // Tentative de retrouver le rattachement réparateur à partir du réparateur si présent
        let repairerRelationshipId = ''
        try {
          if (assignment.repairer?.id) {
            const response = await repairerRelationshipService.list(1)
            const relationship = response.data.find((rel: any) => rel.repairer?.id?.toString() === assignment.repairer!.id.toString())
            repairerRelationshipId = relationship?.id?.toString() || ''
          }
        } catch (_e) {
          // ignore fallback
        }

        form.reset({
          expertise_date: expertiseDate,
          // expertise_time: timeString,
          expertise_place: assignment.expertise_place || '',
          point_noted: assignment.point_noted || '',
          directed_by: assignment.directed_by?.id?.toString() || '',
          repairer_relationship_id: repairerRelationshipId,
        })
      }
    }
    prefill()
  }, [assignment, form])

  // Les utilisateurs et réparateurs sont maintenant chargés automatiquement par les composants dédiés

  // Note: 
  // - realized_by: utilisateur qui a effectué la réalisation du dossier
  // - directed_by: expert responsable assigné au dossier (c'est ce qu'on veut dans le formulaire)

  // Mode modification de réalisation
  const isEditRealization = assignment?.realized_at && assignment?.realized_by

  const onSubmit = async (values: z.infer<typeof realizeSchema>) => {
    try {
      // Gérer la date et l'heure de manière optionnelle
      let formattedDateTime: string | null = null
      
      if (values.expertise_date) {
        // if (values.expertise_date && values.expertise_time) {
        //   const expertiseDateTime = new Date(values.expertise_date)
        //   const [hours, minutes] = values.expertise_time.split(':')
        //   expertiseDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        //   
        //   // Formater la date au format "YYYY-MM-DDTHH:mm"
        //   const year = expertiseDateTime.getFullYear()
        //   const month = String(expertiseDateTime.getMonth() + 1).padStart(2, '0')
        //   const day = String(expertiseDateTime.getDate()).padStart(2, '0')
        //   const formattedHours = String(expertiseDateTime.getHours()).padStart(2, '0')
        //   const formattedMinutes = String(expertiseDateTime.getMinutes()).padStart(2, '0')
        //   
        //   formattedDateTime = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`
        // } else {
          // Formater seulement la date au format "YYYY-MM-DD"
          const year = values.expertise_date.getFullYear()
          const month = String(values.expertise_date.getMonth() + 1).padStart(2, '0')
          const day = String(values.expertise_date.getDate()).padStart(2, '0')
          formattedDateTime = `${year}-${month}-${day}`
        // }
      }
      
      const payload: RealizePayload = {
        expertise_date: formattedDateTime,
        expertise_place: values.expertise_place || null,
        point_noted: values.point_noted || null,
        directed_by: values.directed_by,
        repairer_relationship_id: values.repairer_relationship_id || null,
      }      

      if (isEditRealization) {
        await updateRealizeAssignment(assignmentId, payload, isEditRealization)
      } else {
        await realizeAssignment(assignmentId, payload, isEditRealization)
      }
      navigate({ to: `/assignments/${assignmentId}` })
    } catch (error) {
      // Les erreurs sont gérées par le store
      console.error('Erreur lors de la soumission:', error)
    }
  }

  const handleCancel = () => {
    navigate({ to: `/assignments/${assignmentId}` })
  }

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
        <div className="flex items-center justify-between w-full">
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
                  {assignment.directed_by && ` (Expert: ${assignment.directed_by.name})`}
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: `/assignments/edit/${assignment.id}` })}>
            Modifier le dossier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales du dossier */}
        <div className="space-y-6">
          {/* Informations du client */}
          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.client ? (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{assignment.client.name}</p>
                    <p className="text-sm text-muted-foreground">{assignment.client.email}</p>
                    {assignment.client.phone_1 && (
                      <Badge variant="secondary">{assignment.client.phone_1}</Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <User className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Aucun client sélectionné</p>
                  <p className="text-xs text-muted-foreground">Le client n'a pas été sélectionné pour ce dossier</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations du véhicule */}
          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.vehicle ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Car className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Aucune information véhicule</p>
                  <p className="text-xs text-muted-foreground">Le véhicule n'a pas été assigné à ce dossier</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations financières */}
          <Card className='shadow-none'>
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
                  <p className="font-semibold text-lg">{assignment.total_amount ? parseFloat(assignment.total_amount).toLocaleString('fr-FR') : '0'} F CFA</p>
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
          <Card className='shadow-none'>
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
                  {/* Date d'expertise */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="expertise_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expertise</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null
                                field.onChange(date)
                              }}
                              max={format(new Date(), 'yyyy-MM-dd')}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
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
                    /> */}
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
                  </div>

                  

                  {/* Expert et Garage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="directed_by"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expert responsable <span className="text-red-500">*</span></FormLabel>
                            <UserSelect
                              value={field.value as unknown as number | null}
                              onValueChange={(value: number | null) => {
                                field.onChange(value || '')
                              }}
                              placeholder="Sélectionner un expert"
                              filterRole="expert,expert_manager"
                              showStatus={true}
                            />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="repairer_relationship_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>réparateur</FormLabel>
                          <RepairerRelationshipSelect
                            value={field.value || null}
                            onValueChange={(value: string | null) => {
                              field.onChange(value || '')
                            }}
                            placeholder="Sélectionner un rattachement réparateur"
                            className="w-full"
                            showStatus={true}
                            showExpertFirm={true}
                          />
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
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Décrivez en détail les points notés lors de l'expertise, les constatations, les dégâts observés..."
                            className="w-full"
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
        </div>
      </Main>
      </>
  )
} 