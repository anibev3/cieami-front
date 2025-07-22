import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTechnicalConclusionsStore } from '@/stores/technical-conclusions'
import { toast } from 'sonner'
import { TechnicalConclusionCreate, TechnicalConclusionUpdate, TechnicalConclusion } from '@/types/technical-conclusions'

interface TechnicalConclusionMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: (createdTechnicalConclusion?: TechnicalConclusion) => void
}

export function TechnicalConclusionMutateDialog({ id, open, onOpenChange, onSuccess }: TechnicalConclusionMutateDialogProps) {
  const { technicalConclusions, createTechnicalConclusion, updateTechnicalConclusion, loading, error } = useTechnicalConclusionsStore()
  const isEdit = !!id
  const [form, setForm] = useState<TechnicalConclusionCreate | TechnicalConclusionUpdate>({
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      const conclusion = technicalConclusions.find((c) => c.id === id)
      if (conclusion) {
        setForm({
          label: conclusion.label,
          description: conclusion.description,
        })
      }
    } else {
      setForm({ label: '', description: '' })
    }
  }, [isEdit, id, technicalConclusions])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateTechnicalConclusion(id, form)
        toast.success('Conclusion technique modifiée avec succès')
        onOpenChange?.(false)
      } else {
        const newTechnicalConclusion = await createTechnicalConclusion(form as TechnicalConclusionCreate)
        toast.success('Conclusion technique créée avec succès')
        onOpenChange?.(false)
        onSuccess?.(newTechnicalConclusion)
      }
    } catch (_err) {
      // handled by store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier la conclusion technique' : 'Ajouter une conclusion technique'}</DialogTitle>
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