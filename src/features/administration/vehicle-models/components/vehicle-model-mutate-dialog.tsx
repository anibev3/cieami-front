import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useBrandsStore } from '@/stores/brands'
import { toast } from 'sonner'
import { VehicleModelCreate, VehicleModelUpdate } from '@/types/vehicle-models'

interface VehicleModelMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VehicleModelMutateDialog({ id, open, onOpenChange }: VehicleModelMutateDialogProps) {
  const { vehicleModels, createVehicleModel, updateVehicleModel, loading, error } = useVehicleModelsStore()
  const { brands, fetchBrands } = useBrandsStore()
  const isEdit = !!id
  const vehicleModel = isEdit ? vehicleModels.find(vm => vm.id === id) : null

  const [form, setForm] = useState<VehicleModelCreate & VehicleModelUpdate>({
    code: '',
    label: '',
    description: '',
    brand_id: '',
  })

  useEffect(() => {
    if (open) {
      fetchBrands()
    }
  }, [open, fetchBrands])

  useEffect(() => {
    if (isEdit && vehicleModel) {
      setForm({
        code: vehicleModel.code,
        label: vehicleModel.label,
        description: vehicleModel.description,
        brand_id: vehicleModel.brand.id.toString(),
      })
    } else {
      setForm({
        code: '',
        label: '',
        description: '',
        brand_id: '',
      })
    }
  }, [isEdit, vehicleModel, open])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateVehicleModel(id, form)
        toast.success('Modèle de véhicule modifié avec succès')
      } else {
        await createVehicleModel(form as VehicleModelCreate)
        toast.success('Modèle de véhicule créé avec succès')
      }
      onOpenChange?.(false)
    } catch (_err) {
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier le modèle de véhicule' : 'Créer un nouveau modèle de véhicule'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Code
            </label>
            <Input
              id="code"
              placeholder="Code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              required
              disabled={isEdit} // Le code ne peut pas être modifié en édition
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium">
              Libellé
            </label>
            <Input
              id="label"
              placeholder="Libellé"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="brand_id" className="text-sm font-medium">
              Marque
            </label>
            <Select
              value={form.brand_id}
              onValueChange={(value) => setForm((f) => ({ ...f, brand_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une marque" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 