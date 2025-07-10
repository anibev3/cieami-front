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
import { useVehicleEnergiesStore } from '@/stores/vehicleEnergiesStore'
import { VehicleEnergy, CreateVehicleEnergyData, UpdateVehicleEnergyData } from '@/services/vehicleEnergyService'

interface VehicleEnergiesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedVehicleEnergy: VehicleEnergy | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function VehicleEnergiesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedVehicleEnergy,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: VehicleEnergiesDialogsProps) {
  const { createVehicleEnergy, updateVehicleEnergy, deleteVehicleEnergy, loading } = useVehicleEnergiesStore()
  
  const [createForm, setCreateForm] = useState<CreateVehicleEnergyData>({
    label: '',
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateVehicleEnergyData>({
    label: '',
    description: '',
  })

  // Gestionnaires de soumission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVehicleEnergy(createForm)
      onCloseCreate()
      setCreateForm({ label: '', description: '' })
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleEnergy) return
    
    try {
      await updateVehicleEnergy(selectedVehicleEnergy.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedVehicleEnergy) return
    
    try {
      await deleteVehicleEnergy(selectedVehicleEnergy.id)
      onCloseDelete()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  // Réinitialiser le formulaire d'édition quand l'énergie sélectionnée change
  useState(() => {
    if (selectedVehicleEnergy && isEditOpen) {
      setEditForm({
        label: selectedVehicleEnergy.label,
        description: selectedVehicleEnergy.description,
      })
    }
  })

  return (
    <>
      {/* Dialogue de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une énergie de véhicule</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle énergie de véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={createForm.label}
                onChange={(e) => setCreateForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: ESSENCE"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description de l'énergie de véhicule"
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
            <DialogTitle>Modifier l'énergie de véhicule</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'énergie de véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label *</Label>
              <Input
                id="edit-label"
                value={editForm.label}
                onChange={(e) => setEditForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: ESSENCE"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description de l'énergie de véhicule"
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
            <DialogTitle>Détails de l'énergie de véhicule</DialogTitle>
            <DialogDescription>
              Informations détaillées sur l'énergie de véhicule.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleEnergy && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="outline" className="font-mono">
                    {selectedVehicleEnergy.code}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="font-medium">{selectedVehicleEnergy.label}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {selectedVehicleEnergy.description || 'Aucune description'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant={selectedVehicleEnergy.status.code === 'active' ? 'default' : 'secondary'}>
                    {selectedVehicleEnergy.status.label}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date de création</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {new Date(selectedVehicleEnergy.created_at).toLocaleDateString('fr-FR')}
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
            <DialogTitle>Supprimer l'énergie de véhicule</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette énergie de véhicule ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleEnergy && (
            <div className="p-4 bg-destructive/10 rounded-md">
              <div className="font-medium text-destructive">
                {selectedVehicleEnergy.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Code: {selectedVehicleEnergy.code}
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