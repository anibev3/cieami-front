import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkFee } from '../types'
import { useWorkFeesStore } from '../store'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: WorkFee | null
  onSuccess: () => void
}

export function TarificationHonoraireMutateDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: Props) {
  const { createWorkFee, updateWorkFee } = useWorkFeesStore()
  const isEditing = !!currentRow

  const [form, setForm] = useState<Partial<WorkFee>>({
    param_1: '',
    param_2: '',
    param_3: '',
    param_4: '',
  })

  useEffect(() => {
    if (open) {
      if (isEditing && currentRow) {
        setForm({
          param_1: currentRow.param_1,
          param_2: currentRow.param_2,
          param_3: currentRow.param_3,
          param_4: currentRow.param_4,
        })
      } else {
        setForm({ param_1: '', param_2: '', param_3: '', param_4: '' })
      }
    }
  }, [open, isEditing, currentRow])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.param_1 || !form.param_2 || !form.param_3) {
      toast.error('Tous les champs principaux sont obligatoires')
      return
    }
    try {
      if (isEditing && currentRow) {
        await updateWorkFee(currentRow.id, form)
        toast.success('Tarification mise à jour')
      } else {
        await createWorkFee(form)
        toast.success('Tarification créée')
      }
      onOpenChange(false)
      onSuccess()
    } catch (_error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Éditer la tarification' : 'Nouvelle tarification'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les paramètres de la tarification.' : 'Renseignez les paramètres pour créer une nouvelle tarification.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="param_1">Paramètre 1 *</Label>
            <Input id="param_1" value={form.param_1 ?? ''} onChange={e => setForm(f => ({ ...f, param_1: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="param_2">Paramètre 2 *</Label>
            <Input id="param_2" value={form.param_2 ?? ''} onChange={e => setForm(f => ({ ...f, param_2: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="param_3">Paramètre 3 *</Label>
            <Input id="param_3" value={form.param_3 ?? ''} onChange={e => setForm(f => ({ ...f, param_3: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="param_4">Paramètre 4</Label>
            <Input id="param_4" value={form.param_4 ?? ''} onChange={e => setForm(f => ({ ...f, param_4: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? 'Enregistrer' : 'Créer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 