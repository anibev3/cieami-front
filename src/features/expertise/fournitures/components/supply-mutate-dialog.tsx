/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSuppliesStore } from '@/stores/supplies'
import { toast } from 'sonner'
import { SupplyCreate, SupplyUpdate, Supply } from '@/types/supplies'
import { Package, FileText } from 'lucide-react'

interface SupplyMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: (createdSupply?: Supply) => void
}

export function SupplyMutateDialog({ id, open, onOpenChange, onSuccess }: SupplyMutateDialogProps) {
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
        onOpenChange?.(false)
      } else {
        const newSupply = await createSupply(form as SupplyCreate)
        toast.success('Fourniture créée avec succès')
        onOpenChange?.(false)
        onSuccess?.(newSupply)
      }
    } catch (err) {
      console.error(err)
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEdit ? 'Modifier la fourniture' : 'Ajouter une fourniture'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifiez les informations de la fourniture' : 'Créez une nouvelle fourniture'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="label" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Libellé
              </label>
              <Input
                id="label"
                placeholder="Entrez le libellé de la fourniture"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Entrez la description de la fourniture"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                disabled={loading}
                rows={4}
              />
            </div>
          </div>
          
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