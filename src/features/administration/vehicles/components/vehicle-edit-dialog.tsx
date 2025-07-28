/* eslint-disable no-console */
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

import { VehicleUpdate } from '@/types/vehicles'
import { VehicleModel } from '@/types/vehicle-models'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useVehiclesStore } from '@/stores/vehicles'
import { useBrandsStore } from '@/stores/brands'
import { useColorsStore } from '@/stores/colors'
import { useBodyworksStore } from '@/stores/bodyworks'
import { VehicleGenreSelect } from '@/features/widgets/vehicle-genre-select'
import { VehicleEnergySelect } from '@/features/widgets/vehicle-energy-select'
import { BrandSelect } from '@/features/widgets'
import { VehicleModelSelect } from '@/features/assignments/cost-of-supply/components/vehicle-model-select'
import { Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { ColorSelect } from '@/features/widgets/color-select'
import { BodyworkSelect } from '@/features/widgets/bodywork-select'

const vehicleEditSchema = z.object({
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

type VehicleEditFormData = z.infer<typeof vehicleEditSchema>

interface VehicleEditDialogProps {
  id: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehicleEditDialog({ id, open, onOpenChange }: VehicleEditDialogProps) {
  // eslint-disable-next-line no-console
  console.log('VehicleEditDialog rendered with:', { id, open })
  
  const [loading, setLoading] = useState(false)
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const { updateVehicle, currentVehicle, fetchVehicle, setCurrentVehicle } = useVehiclesStore()
  const { fetchBrands } = useBrandsStore()
  const { colors, fetchColors } = useColorsStore()
  const { bodyworks, fetchBodyworks } = useBodyworksStore()
  const [showCreateBrandModal, setShowCreateBrandModal] = useState(false)
  const [showCreateVehicleModelModal, setShowCreateVehicleModelModal] = useState(false)
  const [showCreateColorModal, setShowCreateColorModal] = useState(false)
  const [showCreateBodyworkModal, setShowCreateBodyworkModal] = useState(false)

  const { vehicleModels, fetchVehicleModels, createVehicleModel, loading: loadingVehicleModels } = useVehicleModelsStore()
  const { createColor, loading: loadingColors } = useColorsStore()
  const { createBodywork, loading: loadingBodyworks } = useBodyworksStore()
  const { createBrand, brands, loading: loadingBrands } = useBrandsStore()

  const form = useForm<VehicleEditFormData>({
    resolver: zodResolver(vehicleEditSchema),
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

  // Charger les données pour l'édition
  useEffect(() => {
    if (id && open && (!currentVehicle || currentVehicle.id !== id)) {
      // eslint-disable-next-line no-console
      console.log('Fetching vehicle with id:', id)
      fetchVehicle(id)
    }
  }, [id, open, currentVehicle]) // Retirer fetchVehicle des dépendances

  // Charger les données de référence
  useEffect(() => {
    if (open) {
      fetchBrands()
      fetchColors()
      fetchBodyworks()
    }
  }, [open]) // Retirer les fonctions des dépendances

  // Réinitialiser le modèle quand la marque change et charger les modèles
  useEffect(() => {
    if (selectedBrandId !== '') {
      // eslint-disable-next-line no-console
      console.log('Loading vehicle models for brand:', selectedBrandId)
      form.setValue('vehicle_model_id', '')
      // Charger les modèles pour la marque sélectionnée
      fetchVehicleModels(1, { brand_id: selectedBrandId })
    }
  }, [selectedBrandId]) // Retirer form et fetchVehicleModels des dépendances

  // Mettre à jour le formulaire avec les données du véhicule
  useEffect(() => {
    if (currentVehicle && id && currentVehicle.id === id) {
      // eslint-disable-next-line no-console
      console.log('Setting form data with vehicle:', currentVehicle)
      
      // Mettre à jour la marque sélectionnée pour charger les modèles
      if (currentVehicle.brand) {
        setSelectedBrandId(currentVehicle.brand.id.toString())
      }
      
      form.reset({
        license_plate: currentVehicle?.license_plate || '',
        usage: currentVehicle?.usage || '',
        type: currentVehicle?.type || '',
        option: currentVehicle?.option || '',
        bodywork_id: currentVehicle?.bodywork?.id.toString() || '',
        mileage: currentVehicle?.mileage || '',
        serial_number: currentVehicle?.serial_number || '',
        first_entry_into_circulation_date: currentVehicle?.first_entry_into_circulation_date || '',  
        technical_visit_date: currentVehicle?.technical_visit_date || '',
        fiscal_power: currentVehicle?.fiscal_power || 0,
        nb_seats: currentVehicle?.nb_seats || 0,
        new_market_value: currentVehicle?.new_market_value || 0,
        payload: currentVehicle?.payload || 0,
        vehicle_model_id: currentVehicle?.vehicle_model?.id.toString() || '',
        color_id: currentVehicle?.color?.id.toString() || '',
        vehicle_genre_id: currentVehicle?.vehicle_genre?.id.toString() || '',
        vehicle_energy_id: currentVehicle?.vehicle_energy?.id.toString() || '',
      })
    }
  }, [currentVehicle, id, form])

  const onSubmit = async (data: VehicleEditFormData) => {
    // eslint-disable-next-line no-console
    console.log('onSubmit called with data:', data)
    setLoading(true)
    
    try {
      if (id) {
        const updateData: VehicleUpdate = {
          license_plate: data.license_plate,
          usage: data.usage || undefined,
          type: data.type || undefined,
          option: data.option || undefined,
          bodywork_id: data.bodywork_id || undefined,
          mileage: data.mileage || undefined,
          serial_number: data.serial_number || undefined,
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
        // eslint-disable-next-line no-console
        console.log('Updating vehicle with data:', updateData)
        await updateVehicle(id, updateData)
        toast.success('Véhicule mis à jour avec succès')
      }
      
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in onSubmit:', error)
      // Error handled by store
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createBrandForm?.code || !createBrandForm?.label) {
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
    } catch (_error) {
      toast.error('Erreur lors de la création de la marque')
    }
  }

  // Handler création rapide de modèle de véhicule
  const handleCreateVehicleModel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createVehicleModelForm?.code || !createVehicleModelForm?.label || !selectedBrandId) {
      toast.error('Code, nom et marque obligatoires')
      return
    }
    try {
      await createVehicleModel({ ...createVehicleModelForm, brand_id: selectedBrandId })
      await fetchVehicleModels(1, { brand_id: selectedBrandId }) // Rafraîchir la liste pour la marque
      // Sélection automatique du nouveau modèle
      const newModel = vehicleModels.find((m: VehicleModel) => m.code === createVehicleModelForm.code && m.label === createVehicleModelForm.label && m.brand.id.toString() === selectedBrandId)
      if (newModel) {
        form.setValue('vehicle_model_id', newModel.id.toString())
      }
      toast.success('Modèle créé avec succès')
      setShowCreateVehicleModelModal(false)
      setCreateVehicleModelForm({ code: '', label: '', description: '', brand_id: '' })
    } catch (_error) {
      toast.error('Erreur lors de la création du modèle')
    }
  }

  const handleCreateColor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createColorForm?.code || !createColorForm?.label) {
      toast.error('Code et nom obligatoires')
      return
    }
    try {
      await createColor(createColorForm)
      await fetchColors() // Rafraîchir la liste
      // Sélection automatique de la nouvelle couleur
      const newColor = colors.find(c => c.code === createColorForm.code && c.label === createColorForm.label)
      if (newColor) {
        form.setValue('color_id', newColor.id.toString())
      }
      toast.success('Couleur créée avec succès')
      setShowCreateColorModal(false)
      setCreateColorForm({ code: '', label: '', description: '' })
    } catch (_error) {
      toast.error('Erreur lors de la création de la couleur')
    }
  }

  const handleCreateBodywork = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createBodyworkForm?.code || !createBodyworkForm?.label) {
      toast.error('Code et nom obligatoires')
      return
    }
    try {
      await createBodywork(createBodyworkForm)
      await fetchBodyworks() // Rafraîchir la liste
      // Sélection automatique de la nouvelle carrosserie
      const newBodywork = bodyworks.find(b => b.code === createBodyworkForm.code && b.label === createBodyworkForm.label)
      if (newBodywork) {
        form.setValue('bodywork_id', newBodywork.id.toString())
      }
      toast.success('Carrosserie créée avec succès')
      setShowCreateBodyworkModal(false)
      setCreateBodyworkForm({ code: '', label: '', description: '' })
    } catch (_error) {
      toast.error('Erreur lors de la création de la carrosserie')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
    setSelectedBrandId('')
    setCurrentVehicle(null)
  }

  if (!id) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
          <DialogDescription>
            Modifiez les informations du véhicule ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            // eslint-disable-next-line no-console
            console.log('Form validation errors:', errors)
          })} className="space-y-4">
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

              {/* Marque */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <FormLabel>Marque *</FormLabel>
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

              
              {/* Modèle de véhicule */}
              <FormField
                control={form.control}
                name="vehicle_model_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-1">
                      <FormLabel>Modèle de véhicule *</FormLabel>
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
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Sélectionner un modèle"
                      brandId={selectedBrandId}
                    />
                  </FormItem>
                )}
              />


              {/* Couleur */}
              <FormField
                control={form.control}
                name="color_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-1">
                      <FormLabel>Couleur *</FormLabel>
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateColorModal(true)} className="shrink-0 w-6 h-6">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <ColorSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Sélectionner une couleur"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Carrosserie */}
              <FormField
                control={form.control}
                name="bodywork_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-1">
                      <FormLabel>Carrosserie</FormLabel>
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowCreateBodyworkModal(true)} className="shrink-0 w-6 h-6">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
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
    </Dialog>
  )
} 