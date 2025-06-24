import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useVehicleStatesStore } from '@/stores/vehicle-states'
import { toast } from 'sonner'
import { VehicleStateCreate, VehicleStateUpdate } from '@/types/vehicle-states'

interface VehicleStateMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VehicleStateMutateDialog({ id, open, onOpenChange }: VehicleStateMutateDialogProps) {
  const { vehicleStates, createVehicleState, updateVehicleState, loading, error } = useVehicleStatesStore()
  const isEdit = !!id
  const vehicleState = isEdit ? vehicleStates.find(vs => vs.id === id) : null

  const [form, setForm] = useState<VehicleStateCreate & VehicleStateUpdate>({
    code: '',
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && vehicleState) {
      setForm({
        code: vehicleState.code,
        label: vehicleState.label,
        description: vehicleState.description,
      })
    } else {
      setForm({
        code: '',
        label: '',
        description: '',
      })
    }
  }, [isEdit, vehicleState, open])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateVehicleState(id, form)
        toast.success('État de véhicule modifié avec succès')
      } else {
        await createVehicleState(form as VehicleStateCreate)
        toast.success('État de véhicule créé avec succès')
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
            {isEdit ? 'Modifier l\'état de véhicule' : 'Créer un nouvel état de véhicule'}
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