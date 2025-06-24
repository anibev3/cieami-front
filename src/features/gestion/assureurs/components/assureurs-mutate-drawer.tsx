import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Assureur } from '../types'
import { useAssureursStore } from '../store'
import { useAssureurs } from '../context/assureurs-context'
import { toast } from 'sonner'

interface AssureursMutateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Assureur | null
}

export function AssureursMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: AssureursMutateDrawerProps) {
  const { createAssureur, updateAssureur } = useAssureursStore()
  const { setOpen } = useAssureurs()
  const isEditing = !!currentRow

  const [form, setForm] = useState<Partial<Assureur>>({
    code: '',
    name: '',
    email: '',
    telephone: '',
    address: '',
  })

  // Réinitialiser le formulaire
  useEffect(() => {
    if (open) {
      if (isEditing && currentRow) {
        setForm({
          code: currentRow.code,
          name: currentRow.name,
          email: currentRow.email,
          telephone: currentRow.telephone || '',
          address: currentRow.address || '',
        })
      } else {
        setForm({
          code: '',
          name: '',
          email: '',
          telephone: '',
          address: '',
        })
      }
    }
  }, [open, isEditing, currentRow])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.code) {
      toast.error('Nom, code et email obligatoires')
      return
    }

    try {
      if (isEditing && currentRow) {
        await updateAssureur(currentRow.id, form)
        toast.success('Assureur mis à jour avec succès')
      } else {
        await createAssureur(form)
        toast.success('Assureur créé avec succès')
      }
      onOpenChange(false)
      setOpen(null)
    } catch (_error) {
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Éditer l\'assureur' : 'Créer un nouvel assureur'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations de l\'assureur.'
              : 'Remplissez les informations pour créer un assureur.'
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
            <Label htmlFor="name">Nom *</Label>
            <Input 
              id="name" 
              value={form.name ?? ''} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={form.email ?? ''} 
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input 
              id="telephone" 
              value={form.telephone ?? ''} 
              onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input 
              id="address" 
              value={form.address ?? ''} 
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))} 
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