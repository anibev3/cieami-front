import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DocumentTransmis } from '../types'
import { useDocumentsTransmisStore } from '../store'
import { toast } from 'sonner'

interface DocumentsMutateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: DocumentTransmis | null
  onSuccess: () => void
}

export function DocumentsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: DocumentsMutateDrawerProps) {
  const { createDocument, updateDocument } = useDocumentsTransmisStore()
  const isEditing = !!currentRow

  const [form, setForm] = useState<Partial<DocumentTransmis>>({
    code: '',
    label: '',
    description: '',
  })

  // Réinitialiser le formulaire
  useEffect(() => {
    if (open) {
      if (isEditing && currentRow) {
        setForm({
          code: currentRow.code,
          label: currentRow.label,
          description: currentRow.description,
        })
      } else {
        setForm({
          code: '',
          label: '',
          description: '',
        })
      }
    }
  }, [open, isEditing, currentRow])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label || !form.code) {
      toast.error('Code et label obligatoires')
      return
    }

    try {
      if (isEditing && currentRow) {
        await updateDocument(currentRow.id, form)
        toast.success('Document mis à jour avec succès')
      } else {
        await createDocument(form)
        toast.success('Document créé avec succès')
      }
      onOpenChange(false)
      onSuccess()
    } catch (_error) {
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Éditer le document' : 'Créer un nouveau document'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du document.'
              : 'Remplissez les informations pour créer un document.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input 
              id="code" 
              value={form.code ?? ''} 
              onChange={e => setForm(f => ({ ...f, code: e.target.value }))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Label *</Label>
            <Input 
              id="label" 
              value={form.label ?? ''} 
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={form.description ?? ''} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 