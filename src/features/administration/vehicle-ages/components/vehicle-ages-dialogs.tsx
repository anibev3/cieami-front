import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'
import { VehicleAge, CreateVehicleAgeData, UpdateVehicleAgeData } from '@/services/vehicleAgeService'

interface VehicleAgesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedVehicleAge: VehicleAge | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function VehicleAgesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedVehicleAge,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: VehicleAgesDialogsProps) {
  const { createVehicleAge, updateVehicleAge, deleteVehicleAge, loading } = useVehicleAgesStore()
  
  const [createForm, setCreateForm] = useState<CreateVehicleAgeData>({
    value: 0,
    label: '',
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateVehicleAgeData>({
    value: 0,
    label: '',
    description: '',
  })

  // Gestionnaires de soumission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVehicleAge(createForm)
      onCloseCreate()
      setCreateForm({ value: 0, label: '', description: '' })
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleAge) return
    
    try {
      await updateVehicleAge(selectedVehicleAge.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedVehicleAge) return
    
    try {
      const success = await deleteVehicleAge(selectedVehicleAge.id)
      // if (success.status === 200) {
      //   onCloseDelete()
      // }
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  // Réinitialiser le formulaire d'édition quand l'âge sélectionné change
  useState(() => {
    if (selectedVehicleAge && isEditOpen) {
      setEditForm({
        value: selectedVehicleAge.value,
        label: selectedVehicleAge.label,
        description: selectedVehicleAge.description,
      })
    }
  })

  return (
    <>
      {/* Dialogue de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un âge de véhicule</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel âge de véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valeur (mois) *</Label>
              <Input
                id="value"
                type="number"
                min="0"
                value={createForm.value}
                onChange={(e) => setCreateForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder="Ex: 24"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={createForm.label}
                onChange={(e) => setCreateForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: 24 mois"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description de l'âge de véhicule"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseCreate}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                Créer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'édition */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'âge de véhicule</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'âge de véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-value">Valeur (mois) *</Label>
              <Input
                id="edit-value"
                type="number"
                min="0"
                value={editForm.value}
                onChange={(e) => setEditForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder="Ex: 24"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label *</Label>
              <Input
                id="edit-label"
                value={editForm.label}
                onChange={(e) => setEditForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: 24 mois"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description de l'âge de véhicule"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseEdit}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                Modifier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de l'âge de véhicule</DialogTitle>
            <DialogDescription>
              Informations détaillées sur l'âge de véhicule.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleAge && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Valeur</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="outline" className="font-mono">
                    {selectedVehicleAge.value} mois
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="font-medium">{selectedVehicleAge.label}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {selectedVehicleAge.description || 'Aucune description'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant={selectedVehicleAge.status.code === 'active' ? 'default' : 'secondary'}>
                    {selectedVehicleAge.status.label}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date de création</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {new Date(selectedVehicleAge.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={onCloseView}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l'âge de véhicule</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet âge de véhicule ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleAge && (
            <div className="p-4 bg-destructive/10 rounded-md">
              <div className="font-medium text-destructive">
                {selectedVehicleAge.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Valeur: {selectedVehicleAge.value} mois
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCloseDelete}>
              Annuler
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteSubmit}
              disabled={loading}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 