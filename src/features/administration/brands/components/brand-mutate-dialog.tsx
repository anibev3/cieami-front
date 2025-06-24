import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useBrandsStore } from '@/stores/brands'
import { toast } from 'sonner'
import { BrandCreate, BrandUpdate } from '@/types/brands'

interface BrandMutateDialogProps {
  id?: number | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BrandMutateDialog({ id, open, onOpenChange }: BrandMutateDialogProps) {
  const { brands, createBrand, updateBrand, loading, error } = useBrandsStore()
  const isEdit = !!id
  const brand = isEdit ? brands.find(b => b.id === id) : null

  const [form, setForm] = useState<BrandCreate & BrandUpdate>({
    code: '',
    label: '',
    description: '',
  })

  useEffect(() => {
    if (isEdit && brand) {
      setForm({
        code: brand.code,
        label: brand.label,
        description: brand.description,
      })
    } else {
      setForm({
        code: '',
        label: '',
        description: '',
      })
    }
  }, [isEdit, brand, open])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateBrand(id, form)
        toast.success('Marque modifiée avec succès')
      } else {
        await createBrand(form as BrandCreate)
        toast.success('Marque créée avec succès')
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
            {isEdit ? 'Modifier la marque' : 'Créer une nouvelle marque'}
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