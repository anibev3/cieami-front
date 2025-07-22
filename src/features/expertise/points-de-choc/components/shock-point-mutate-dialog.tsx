import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ShockPointCreate } from '@/types/shock-points'
import { useShockPointsStore } from '@/stores/shock-points'

interface ShockPointMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function ShockPointMutateDialog({ id, open, onOpenChange, onSuccess }: ShockPointMutateDialogProps) {
  const { shockPoints, createShockPoint, updateShockPoint, loading, error } = useShockPointsStore()
  const isEdit = !!id
  const [form, setForm] = useState<{
    code: string
    label: string
    description: string
  }>({
    code: '',
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      const shockPoint = shockPoints.find((sp) => sp.id === id)
      if (shockPoint) {
        setForm({
          code: shockPoint.code,
          label: shockPoint.label,
          description: shockPoint.description,
        })
      }
    } else {
      setForm({ code: '', label: '', description: '' })
    }
  }, [isEdit, id, shockPoints])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateShockPoint(id, form)
        toast.success('Point de choc modifié avec succès')
      } else {
        await createShockPoint(form as ShockPointCreate)
        toast.success('Point de choc créé avec succès')
      }
      onOpenChange?.(false)
      onSuccess?.()
    } catch {
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le point de choc' : 'Ajouter un point de choc'}</DialogTitle>
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
              disabled={loading}
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
              disabled={loading}
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
              required
              disabled={loading}
            />
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