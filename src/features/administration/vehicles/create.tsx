/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
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

import { VehicleCreate } from '@/types/vehicles'
import { useVehiclesStore } from '@/stores/vehicles'
import { useBrandsStore } from '@/stores/brands'
import { useColorsStore } from '@/stores/colors'
import { useBodyworksStore } from '@/stores/bodyworks'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'
import { VehicleEnergySelect } from '@/features/widgets/vehicle-energy-select'
import { BrandSelect } from '@/features/widgets'
import { VehicleModelSelect } from '@/features/assignments/cost-of-supply/components/vehicle-model-select'
import { ColorSelect } from '@/features/widgets/color-select'
import { BodyworkSelect } from '@/features/widgets/bodywork-select'

const vehicleCreateSchema = z.object({
  license_plate: z.string().min(1, 'La plaque d\'immatriculation est requise'),
  usage: z.string().optional(),
  type: z.string().optional(),
  option: z.string().optional(),
  bodywork_id: z.string().optional(),
  mileage: z.string().optional(),
  serial_number: z.string().optional(),
  first_entry_into_circulation_date: z.string().optional(),
  technical_visit_date: z.string().optional(),
  fiscal_power: z.number().optional(),
  nb_seats: z.number().optional(),
  new_market_value: z.number().optional(),
  payload: z.number().optional(),
  vehicle_model_id: z.string().min(1, 'Le modèle de véhicule est requis'),
  color_id: z.string().min(1, 'La couleur est requise'),
  vehicle_genre_id: z.string().min(1, 'Le genre de véhicule est requis'),
  vehicle_energy_id: z.string().min(1, 'L\'énergie est requise'),
})

type VehicleCreateFormData = z.infer<typeof vehicleCreateSchema>

export default function CreateVehiclePage() {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  
  const { createVehicle } = useVehiclesStore()
  const { fetchBrands } = useBrandsStore()
  const { fetchColors } = useColorsStore()
  const { fetchBodyworks } = useBodyworksStore()
  const { fetchVehicleModels } = useVehicleModelsStore()

  const form = useForm<VehicleCreateFormData>({
    resolver: zodResolver(vehicleCreateSchema),
    defaultValues: {
      license_plate: '',
      usage: '',
      type: '',
      option: '',
      bodywork_id: '',
      mileage: '',
      serial_number: '',
      first_entry_into_circulation_date: '',
      technical_visit_date: '',
      fiscal_power: 0,
      nb_seats: 0,
      new_market_value: 0,
      payload: 0,
      vehicle_model_id: '',
      color_id: '',
      vehicle_genre_id: '',
      vehicle_energy_id: '',
    },
  })

  // Charger les données de référence
  useEffect(() => {
    fetchBrands()
    fetchColors()
    fetchBodyworks()
  }, [])

  // Réinitialiser le modèle quand la marque change et charger les modèles
  useEffect(() => {
    if (selectedBrandId !== '') {
      form.setValue('vehicle_model_id', '')
      fetchVehicleModels(1, { brand_id: selectedBrandId })
    }
  }, [selectedBrandId])

  const onSubmit = async (data: VehicleCreateFormData) => {
    console.log('onSubmit called with data:', data)
    setLoading(true)
    
    try {
      const createData: VehicleCreate = {
        license_plate: data.license_plate,
        usage: data.usage || undefined,
        type: data.type || '',
        option: data.option || '',
        bodywork_id: data.bodywork_id || '',
        mileage: data.mileage || '',
        serial_number: data.serial_number || '',
        first_entry_into_circulation_date: data.first_entry_into_circulation_date || undefined,
        technical_visit_date: data.technical_visit_date || undefined,
        fiscal_power: Number(data.fiscal_power),
        nb_seats: Number(data.nb_seats),
        new_market_value: Number(data.new_market_value),
        payload: Number(data.payload),
        vehicle_model_id: data.vehicle_model_id,
        color_id: data.color_id,
        vehicle_genre_id: data.vehicle_genre_id || undefined,
        vehicle_energy_id: data.vehicle_energy_id || undefined,
      }
      
      console.log('Creating vehicle with data:', createData)
      await createVehicle(createData)
      toast.success('Véhicule créé avec succès')
      navigate({ to: '/administration/vehicles' })
    } catch (error) {
      console.error('Error in onSubmit:', error)
      toast.error('Erreur lors de la création du véhicule')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/administration/vehicles' })
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
              <h2 className='text-2xl font-bold tracking-tight'>Créer un véhicule</h2>
              <p className='text-muted-foreground'>
                Remplissez les informations pour créer un nouveau véhicule
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
                        <FormLabel>Genre de véhicule *</FormLabel>
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
                    <FormLabel>Marque *</FormLabel>
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
                        <FormLabel>Modèle de véhicule *</FormLabel>
                        <VehicleModelSelect
                          value={field.value}
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
                        <FormLabel>Couleur *</FormLabel>
                        <ColorSelect
                          value={field.value}
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
                        <FormLabel>Énergie *</FormLabel>
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
                        Créer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}