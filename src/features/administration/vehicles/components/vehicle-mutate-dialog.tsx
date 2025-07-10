import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VehicleCreate, VehicleUpdate } from '@/types/vehicles'
import { useVehiclesStore } from '@/stores/vehicles'
import { useBrandsStore } from '@/stores/brands'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useColorsStore } from '@/stores/colors'
import { useBodyworksStore } from '@/stores/bodyworks'
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'
import { VehicleAgeSelect } from '@/features/widgets/vehicle-age-select'
import { VehicleEnergySelect } from '@/features/widgets/vehicle-energy-select'

const vehicleSchema = z.object({
  license_plate: z.string().min(1, 'La plaque d\'immatriculation est requise'),
  usage: z.string().min(1, 'L\'usage est requis'),
  type: z.string().min(1, 'Le type est requis'),
  option: z.string().min(1, 'L\'option est requise'),
  bodywork_id: z.string().min(1, 'La carrosserie est requise'),
  mileage: z.string().min(1, 'Le kilométrage est requis'),
  serial_number: z.string().min(1, 'Le numéro de série est requis'),
  first_entry_into_circulation_date: z.string().optional(),
  technical_visit_date: z.string().optional(),
  fiscal_power: z.number().min(1, 'La puissance fiscale est requise'),
  energy: z.string().optional(),
  nb_seats: z.number().min(1, 'Le nombre de places est requis'),
  vehicle_model_id: z.string().min(1, 'Le modèle de véhicule est requis'),
  color_id: z.string().min(1, 'La couleur est requise'),
  vehicle_genre_id: z.string().optional(),
  vehicle_age_id: z.string().optional(),
  vehicle_energy_id: z.string().optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleMutateDialogProps {
  id: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function VehicleMutateDialog({ id, open, onOpenChange }: VehicleMutateDialogProps) {
  const [loading, setLoading] = useState(false)
  const { createVehicle, updateVehicle, currentVehicle, fetchVehicle } = useVehiclesStore()
  const { fetchBrands } = useBrandsStore()
  const { vehicleModels, fetchVehicleModels } = useVehicleModelsStore()
  const { colors, fetchColors } = useColorsStore()
  const { bodyworks, fetchBodyworks } = useBodyworksStore()

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
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
      energy: '',
      nb_seats: 0,
      vehicle_model_id: '',
      color_id: '',
      vehicle_genre_id: '',
      vehicle_age_id: '',
      vehicle_energy_id: '',
    },
  })

  const isEditing = !!id

  // Charger les données pour l'édition
  useEffect(() => {
    if (id && open) {
      fetchVehicle(id)
    }
  }, [id, open, fetchVehicle])

  // Charger les données de référence
  useEffect(() => {
    if (open) {
      fetchBrands()
      fetchVehicleModels()
      fetchColors()
      fetchBodyworks()
    }
  }, [open, fetchBrands, fetchVehicleModels, fetchColors, fetchBodyworks])

  // Mettre à jour le formulaire avec les données du véhicule
  useEffect(() => {
    if (currentVehicle && isEditing) {
      form.reset({
        license_plate: currentVehicle.license_plate,
        usage: currentVehicle.usage,
        type: currentVehicle.type,
        option: currentVehicle.option,
        bodywork_id: currentVehicle.bodywork.id.toString(),
        mileage: currentVehicle.mileage,
        serial_number: currentVehicle.serial_number,
        first_entry_into_circulation_date: currentVehicle.first_entry_into_circulation_date || '',
        technical_visit_date: currentVehicle.technical_visit_date || '',
        fiscal_power: currentVehicle.fiscal_power,
        energy: currentVehicle.energy || '',
        nb_seats: currentVehicle.nb_seats,
        vehicle_model_id: currentVehicle.vehicle_model.id.toString(),
        color_id: currentVehicle.color.id.toString(),
        vehicle_genre_id: '',
        vehicle_age_id: '',
        vehicle_energy_id: '',
      })
    }
  }, [currentVehicle, isEditing, form])

  const onSubmit = async (data: VehicleFormData) => {
    setLoading(true)
    
    try {
      if (isEditing && id) {
        const updateData: VehicleUpdate = {
          ...data,
          fiscal_power: Number(data.fiscal_power),
          nb_seats: Number(data.nb_seats),
        }
        await updateVehicle(id, updateData)
        toast.success('Véhicule mis à jour avec succès')
      } else {
        const createData: VehicleCreate = {
          ...data,
          fiscal_power: Number(data.fiscal_power),
          nb_seats: Number(data.nb_seats),
        }
        await createVehicle(createData)
        toast.success('Véhicule créé avec succès')
      }
      
      onOpenChange(false)
      form.reset()
    } catch (_error) {
      // Error handled by store
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le véhicule' : 'Créer un véhicule'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du véhicule ci-dessous.'
              : 'Remplissez les informations pour créer un nouveau véhicule.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="license_plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaque d'immatriculation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage</FormLabel>
                    <FormControl>
                      <Input {...field} />
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

              <FormField
                control={form.control}
                name="energy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Énergie (libre)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                name="vehicle_model_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle de véhicule</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger  className="w-full">
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleModels.map((model: VehicleModel) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.label}
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
                name="color_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger  className="w-full">
                          <SelectValue placeholder="Sélectionner une couleur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color: Color) => (
                          <SelectItem key={color.id} value={color.id.toString()}>
                            {color.label}
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
                name="bodywork_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrosserie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une carrosserie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bodyworks.map((bodywork: Bodywork) => (
                          <SelectItem key={bodywork.id} value={bodywork.id.toString()}>
                            {bodywork.label}
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

              <FormField
                control={form.control}
                name="vehicle_age_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âge du véhicule</FormLabel>
                    <FormControl>
                      <VehicleAgeSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Sélectionner un âge de véhicule"
                        showDescription={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicle_energy_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'énergie</FormLabel>
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
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 