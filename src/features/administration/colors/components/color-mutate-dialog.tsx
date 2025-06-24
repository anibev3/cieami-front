import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useColorsStore } from '@/stores/colors'
import { toast } from 'sonner'
import { ColorCreate, ColorUpdate } from '@/types/colors'

interface ColorMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ColorMutateDialog({ id, open, onOpenChange }: ColorMutateDialogProps) {
  const { colors, createColor, updateColor, loading, error } = useColorsStore()
  const isEdit = !!id
  const color = isEdit ? colors.find(c => c.id === id) : null

  const [form, setForm] = useState<ColorCreate & ColorUpdate>({
    code: '',
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && color) {
      setForm({
        code: color.code,
        label: color.label,
        description: color.description,
      })
    } else {
      setForm({
        code: '',
        label: '',
        description: '',
      })
    }
  }, [isEdit, color, open])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateColor(id, form)
        toast.success('Couleur modifiée avec succès')
      } else {
        await createColor(form as ColorCreate)
        toast.success('Couleur créée avec succès')
      }
      onOpenChange?.(false)
    } catch (err) {
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier la couleur' : 'Créer une nouvelle couleur'}
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