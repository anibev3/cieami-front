import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface CreateRepairerForm {
  name: string
  code: string
  email: string
  telephone?: string
  address?: string
}

interface CreateRepairerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: CreateRepairerForm) => Promise<void>
}

export function CreateRepairer({ open, onOpenChange, onSubmit }: CreateRepairerProps) {
  const [form, setForm] = useState<CreateRepairerForm>({
    name: '',
    code: '',
    email: '',
    telephone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.name || !form.code || !form.email) {
      toast.error('Nom, code et email obligatoires')
      return
    }

    try {
      setLoading(true)
      await onSubmit(form)
      
      // Reset form
      setForm({ name: '', code: '', email: '', telephone: '', address: '' })
      onOpenChange(false)
      toast.success('Réparateur créé avec succès')
    } catch (_error) {
      toast.error('Erreur lors de la création du réparateur')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateRepairerForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un réparateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau réparateur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repairer-name">Nom *</Label>
            <Input 
              id="repairer-name" 
              value={form.name} 
              onChange={e => handleInputChange('name', e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repairer-code">Code *</Label>
            <Input 
              id="repairer-code" 
              value={form.code} 
              onChange={e => handleInputChange('code', e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repairer-email">Email *</Label>
            <Input 
              id="repairer-email" 
              type="email" 
              value={form.email} 
              onChange={e => handleInputChange('email', e.target.value)} 
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repairer-phone">Téléphone</Label>
            <Input 
              id="repairer-phone" 
              value={form.telephone} 
              onChange={e => handleInputChange('telephone', e.target.value)} 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repairer-address">Adresse</Label>
            <Input 
              id="repairer-address" 
              value={form.address} 
              onChange={e => handleInputChange('address', e.target.value)} 
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le réparateur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 