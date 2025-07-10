import { useState, useEffect } from 'react'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { AscertainmentType, CreateAscertainmentTypeData, UpdateAscertainmentTypeData } from '@/services/ascertainmentTypeService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/format-date'

// Types pour les props des dialogues
interface CreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ascertainmentType: AscertainmentType | null
}

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ascertainmentType: AscertainmentType | null
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ascertainmentType: AscertainmentType | null
}

// Dialogue de création
export function CreateAscertainmentTypeDialog({ open, onOpenChange }: CreateDialogProps) {
  const { createAscertainmentType, loading } = useAscertainmentTypeStore()
  const [formData, setFormData] = useState<CreateAscertainmentTypeData>({
    label: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await createAscertainmentType(formData)
    if (success) {
      onOpenChange(false)
      setFormData({ label: '', description: '' })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({ label: '', description: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau type de constat</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau type de constat au système.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Très bon"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type de constat"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.label.trim()}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialogue de modification
export function EditAscertainmentTypeDialog({ open, onOpenChange, ascertainmentType }: EditDialogProps) {
  const { updateAscertainmentType, loading } = useAscertainmentTypeStore()
  const [formData, setFormData] = useState<UpdateAscertainmentTypeData>({
    label: '',
    description: ''
  })

  useEffect(() => {
    if (ascertainmentType) {
      setFormData({
        label: ascertainmentType.label,
        description: ascertainmentType.description
      })
    }
  }, [ascertainmentType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ascertainmentType) return
    
    const success = await updateAscertainmentType(ascertainmentType.id, formData)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!ascertainmentType) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le type de constat</DialogTitle>
          <DialogDescription>
            Modifiez les informations du type de constat "{ascertainmentType.label}".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-label">Label *</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Très bon"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type de constat"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.label?.trim()}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialogue de visualisation
export function ViewAscertainmentTypeDialog({ open, onOpenChange, ascertainmentType }: ViewDialogProps) {
  if (!ascertainmentType) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du type de constat</DialogTitle>
          <DialogDescription>
            Informations complètes sur le type de constat.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Code</Label>
              <p className="font-mono text-sm">{ascertainmentType.code}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
              <Badge variant="default" className="mt-1">
                {ascertainmentType.status.label}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Label</Label>
            <p className="text-sm">{ascertainmentType.label}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm text-muted-foreground">{ascertainmentType.description}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
              <p className="text-sm">{formatDate(ascertainmentType.created_at)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Modifié le</Label>
              <p className="text-sm">{formatDate(ascertainmentType.updated_at)}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Créé par</Label>
            <div className="flex items-center space-x-2 mt-1">
              <img
                src={ascertainmentType.created_by.photo_url}
                alt={ascertainmentType.created_by.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{ascertainmentType.created_by.name}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Modifié par</Label>
            <div className="flex items-center space-x-2 mt-1">
              <img
                src={ascertainmentType.updated_by.photo_url}
                alt={ascertainmentType.updated_by.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{ascertainmentType.updated_by.name}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Dialogue de suppression
export function DeleteAscertainmentTypeDialog({ open, onOpenChange, ascertainmentType }: DeleteDialogProps) {
  const { deleteAscertainmentType, loading } = useAscertainmentTypeStore()

  const handleDelete = async () => {
    if (!ascertainmentType) return
    
    const success = await deleteAscertainmentType(ascertainmentType.id)
    if (success) {
      onOpenChange(false)
    }
  }

  if (!ascertainmentType) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement le type de constat "{ascertainmentType.label}" du système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 