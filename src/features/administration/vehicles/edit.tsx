/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { VehicleUpdate } from '@/types/vehicles'
import { useVehiclesStore } from '@/stores/vehicles'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBrandsStore } from '@/stores/brands'
import { useColorsStore } from '@/stores/colors'
import { useBodyworksStore } from '@/stores/bodyworks'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'
import { useVehicleEnergiesStore } from '@/stores/vehicleEnergiesStore'
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'
import { VehicleEnergySelect } from '@/features/widgets/vehicle-energy-select'
import { BrandSelect } from '@/features/widgets'
import { VehicleModelSelect } from '@/features/assignments/cost-of-supply/components/vehicle-model-select'
import { ColorSelect } from '@/features/widgets/color-select'
import { BodyworkSelect } from '@/features/widgets/bodywork-select'

const vehicleEditSchema = z.object({
  license_plate: z.string().min(1, 'La plaque d\'immatriculation est requise'),
  usage: z.string().optional(),
  type: z.string().optional(),
  option: z.string().optional(),
  bodywork_id: z.string().optional(),
  mileage: z.coerce.number().int('Le kilométrage doit être un nombre entier').optional(),
  serial_number: z.string().optional(),
  first_entry_into_circulation_date: z.string().optional(),
  technical_visit_date: z.string().optional(),
  fiscal_power: z.coerce.number().int('La puissance fiscale doit être un nombre entier').optional(),
  nb_seats: z.coerce.number().int('Le nombre de places doit être un nombre entier').optional(),
  new_market_value: z.coerce.number().int('La valeur neuve doit être un nombre entier').optional(),
  payload: z.coerce.number().int('La charge utile doit être un nombre entier').optional(),
  vehicle_model_id: z.string().optional(),
  color_id: z.string().optional(),
  vehicle_genre_id: z.string().optional(),
  vehicle_energy_id: z.string().optional(),
})

type VehicleEditFormData = z.infer<typeof vehicleEditSchema>

export default function EditVehiclePage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }
  const vehicleId = parseInt(id)
  
  const [loading, setLoading] = useState(false)
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [baseDataLoaded, setBaseDataLoaded] = useState(false)
  const [initialPrefillDone, setInitialPrefillDone] = useState(false)
  
  const { currentVehicle, fetchVehicle, updateVehicle } = useVehiclesStore()
  const { fetchBrands } = useBrandsStore()
  const { fetchColors } = useColorsStore()
  const { fetchBodyworks } = useBodyworksStore()
  const { fetchVehicleModels, loading: loadingVehicleModels } = useVehicleModelsStore()
  const { fetchVehicleGenres } = useVehicleGenresStore()
  const { fetchVehicleEnergies } = useVehicleEnergiesStore()

  const needsModelLoad = Boolean(currentVehicle?.brand?.id)
  const isInitialLoading = 
    !baseDataLoaded ||
    !currentVehicle ||
    currentVehicle.id !== vehicleId ||
    (needsModelLoad ? (loadingVehicleModels || !initialPrefillDone) : false)
  
  // Pour les véhicules, on est toujours en mode édition, donc on garde le modal
  const showLoadingModal = isInitialLoading
  const showDiscreteLoading = false // Pas de mode création pour les véhicules

  console.log('EditVehiclePage - vehicleId:', vehicleId)
  console.log('EditVehiclePage - currentVehicle:', currentVehicle)

  const form = useForm<VehicleEditFormData>({
    resolver: zodResolver(vehicleEditSchema),
    defaultValues: {
      license_plate: '',
      usage: '',
      type: '',
      option: '',
      bodywork_id: '',
      mileage: undefined,
      serial_number: '',
      first_entry_into_circulation_date: '',
      technical_visit_date: '',
      fiscal_power: undefined,
      nb_seats: undefined,
      new_market_value: undefined,
      payload: undefined,
      vehicle_model_id: '',
      color_id: '',
      vehicle_genre_id: '',
      vehicle_energy_id: '',
    },
  })

  // Charger les données du véhicule
  useEffect(() => {
    if (vehicleId) {
      fetchVehicle(vehicleId)
    }
  }, [vehicleId, fetchVehicle])

  // Charger les données de référence
  useEffect(() => {
    const loadRefs = async () => {
      await Promise.allSettled([
        fetchBrands(),
        fetchColors(),
        fetchBodyworks(),
        fetchVehicleGenres(),
        fetchVehicleEnergies(),
      ])
      setBaseDataLoaded(true)
    }
    loadRefs()
  }, [fetchBrands, fetchColors, fetchBodyworks, fetchVehicleGenres, fetchVehicleEnergies])

  // Réinitialiser le modèle quand la marque change et charger les modèles
  useEffect(() => {
    if (selectedBrandId !== '') {
      // Ne réinitialiser le modèle que si l'utilisateur change réellement la marque
      // Après le pré-remplissage initial, on permet le reset
      if (initialPrefillDone) {
        form.setValue('vehicle_model_id', '')
      }
      fetchVehicleModels(1, { brand_id: selectedBrandId })
    }
  }, [selectedBrandId, initialPrefillDone, fetchVehicleModels, form])

  // Mettre à jour le formulaire avec les données du véhicule
  useEffect(() => {
    const prefill = async () => {
      if (!baseDataLoaded) return
      if (currentVehicle && currentVehicle.id === vehicleId) {
        console.log('Setting form data with vehicle:', currentVehicle)
        
        // Charger les modèles de la marque du véhicule avant le reset
        if (currentVehicle.brand) {
          const brandIdStr = currentVehicle.brand.id.toString()
          setSelectedBrandId(brandIdStr)
          try {
            await fetchVehicleModels(1, { brand_id: brandIdStr })
          } catch (_error) {
            // ignore fetch error, form reset will still proceed
          }
        }
        
        form.reset({
          license_plate: currentVehicle?.license_plate || '',
          usage: currentVehicle?.usage || '',
          type: currentVehicle?.type || '',
          option: currentVehicle?.option || '',
          bodywork_id: currentVehicle?.bodywork?.id?.toString() || '',
          mileage: currentVehicle?.mileage || undefined,
          serial_number: currentVehicle?.serial_number || '',
          first_entry_into_circulation_date: currentVehicle?.first_entry_into_circulation_date || '',  
          technical_visit_date: currentVehicle?.technical_visit_date || '',
          fiscal_power: currentVehicle?.fiscal_power || undefined,
          nb_seats: currentVehicle?.nb_seats || undefined,
          new_market_value: currentVehicle?.new_market_value ? Number(currentVehicle.new_market_value) : undefined,
          payload: currentVehicle?.payload || undefined,
          vehicle_model_id: currentVehicle?.vehicle_model?.id?.toString() || '',
          color_id: currentVehicle?.color?.id?.toString() || '',
          vehicle_genre_id: currentVehicle?.vehicle_genre?.id?.toString() || '',
          vehicle_energy_id: currentVehicle?.vehicle_energy?.id?.toString() || '',
        })

        // Si aucune marque/modèle requis, marquer le pré-remplissage comme terminé
        if (!currentVehicle?.brand?.id || !currentVehicle?.vehicle_model?.id) {
          setInitialPrefillDone(true)
        }
      }
    }
    prefill()
  }, [currentVehicle, vehicleId, form, baseDataLoaded, fetchVehicleModels])

  // Une fois les modèles de la marque chargés, assurer le pré-remplissage du modèle
  useEffect(() => {
    if (!baseDataLoaded) return
    if (!currentVehicle || currentVehicle.id !== vehicleId) return
    if (!selectedBrandId) return
    if (initialPrefillDone) return
    if (loadingVehicleModels) return

    const modelId = currentVehicle?.vehicle_model?.id?.toString() || ''
    form.setValue('vehicle_model_id', modelId)
    setInitialPrefillDone(true)
  }, [baseDataLoaded, currentVehicle, vehicleId, selectedBrandId, loadingVehicleModels, initialPrefillDone, form])

  const onSubmit = async (data: VehicleEditFormData) => {
    console.log('onSubmit called with data:', data)
    setLoading(true)
    
    try {
      const updateData: VehicleUpdate = {
        license_plate: data.license_plate || undefined,
        usage: data.usage || undefined,
        type: data.type || undefined,
        option: data.option || undefined,
        bodywork_id: data.bodywork_id || undefined,
        mileage: data.mileage || undefined,
        serial_number: data.serial_number || undefined,
        first_entry_into_circulation_date: data.first_entry_into_circulation_date || undefined,
        technical_visit_date: data.technical_visit_date || undefined,
        fiscal_power: data.fiscal_power ? Number(data.fiscal_power) : undefined,
        nb_seats: data.nb_seats ? Number(data.nb_seats) : undefined,
        new_market_value: data.new_market_value ? Number(data.new_market_value) : undefined,
        payload: data.payload ? Number(data.payload) : undefined,
        vehicle_model_id: data.vehicle_model_id || undefined,
        color_id: data.color_id || undefined,
        vehicle_genre_id: data.vehicle_genre_id || undefined,
        vehicle_energy_id: data.vehicle_energy_id || undefined,
      }
      
      console.log('Updating vehicle with data:', updateData)
      await updateVehicle(vehicleId, updateData)
      toast.success('Véhicule mis à jour avec succès')
      navigate({ to: '/administration/vehicles' })
    } catch (error: unknown) {
      console.error('Error in onSubmit:', error)
      
      // Afficher les erreurs de validation spécifiques
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any
      if (axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors
        Object.keys(errors).forEach(field => {
          const fieldErrors = errors[field]
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach(errorMessage => {
              toast.error(`${field}: ${errorMessage}`)
            })
          }
        })
      } else {
        toast.error('Erreur lors de la mise à jour du véhicule')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/administration/vehicles' })
  }

  // Affichage modal de chargement initial tant que les données ne sont pas prêtes

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
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Modifier le véhicule</h2>
              <p className='text-muted-foreground'>
                Modifiez les informations du véhicule {currentVehicle?.license_plate || ''}
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="license_plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plaque d'immatriculation *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicle_genre_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre de véhicule</FormLabel>
                        <FormControl>
                          <VehicleGenreSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Sélectionner un genre de véhicule"
                            showDescription={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Marque</FormLabel>
                    <BrandSelect
                      value={selectedBrandId}
                      onValueChange={setSelectedBrandId}
                      placeholder="Sélectionnez une marque"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="vehicle_model_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modèle de véhicule</FormLabel>
                        <VehicleModelSelect
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner un modèle"
                          brandId={selectedBrandId}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Couleur</FormLabel>
                        <ColorSelect
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner une couleur"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bodywork_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carrosserie</FormLabel>
                        <BodyworkSelect
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner une carrosserie"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicle_energy_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Énergie</FormLabel>
                        <FormControl>
                          <VehicleEnergySelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Sélectionner un type d'énergie"
                            showDescription={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="new_market_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valeur neuve</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="first_entry_into_circulation_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de première mise en circulation</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technical_visit_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de visite technique</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="option"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilométrage</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serial_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de série</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fiscal_power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puissance fiscale</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payload"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charge utile</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nb_seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de places</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Mettre à jour
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Main>
      {/* Modal de chargement - toujours affiché pour l'édition de véhicules */}
      <Dialog open={showLoadingModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              Chargement des données
            </DialogTitle>
            <DialogDescription>
              Veuillez patienter pendant le chargement des informations du véhicule...
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

      {/* Indicateur de chargement discret - pas utilisé pour les véhicules */}
      {showDiscreteLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-700">Chargement des données...</span>
          </div>
        </div>
      )}
    </>
  )
} 