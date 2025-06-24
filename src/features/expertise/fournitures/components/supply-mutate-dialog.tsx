import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSuppliesStore } from '@/stores/supplies'
import { toast } from 'sonner'
import { Supply, SupplyCreate, SupplyUpdate } from '@/types/supplies'

interface SupplyMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SupplyMutateDialog({ id, open, onOpenChange }: SupplyMutateDialogProps) {
  const { supplies, createSupply, updateSupply, loading, error } = useSuppliesStore()
  const isEdit = !!id
  const [form, setForm] = useState<SupplyCreate | SupplyUpdate>({
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      const supply = supplies.find((s) => s.id === id)
      if (supply) {
        setForm({
          label: supply.label,
          description: supply.description,
        })
      }
    } else {
      setForm({ label: '', description: '' })
    }
  }, [isEdit, id, supplies])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateSupply(id, form)
        toast.success('Fourniture modifiée avec succès')
      } else {
        await createSupply(form as SupplyCreate)
        toast.success('Fourniture créée avec succès')
      }
      onOpenChange?.(false)
    } catch (err) {
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la fourniture' : 'Ajouter une fourniture'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Libellé"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            required
            disabled={loading}
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
            disabled={loading}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {isEdit ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 