import { useState, useEffect } from 'react'
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
import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'
import { VehicleGenre, CreateVehicleGenreData, UpdateVehicleGenreData } from '@/services/vehicleGenreService'

interface VehicleGenresDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedVehicleGenre: VehicleGenre | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function VehicleGenresDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedVehicleGenre,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: VehicleGenresDialogsProps) {
  const { createVehicleGenre, updateVehicleGenre, deleteVehicleGenre, loading } = useVehicleGenresStore()
  
  const [createForm, setCreateForm] = useState<CreateVehicleGenreData>({
    code: '',
    label: '',
    description: null,
    max_mileage_essence_per_year: 0,
    max_mileage_diesel_per_year: 0,
  })

  const [editForm, setEditForm] = useState<UpdateVehicleGenreData>({
    label: '',
    description: null,
    max_mileage_essence_per_year: 0,
    max_mileage_diesel_per_year: 0,
  })

  // Initialiser le formulaire d'édition avec les données du genre sélectionné
  useEffect(() => {
    if (selectedVehicleGenre && isEditOpen) {
      setEditForm({
        label: selectedVehicleGenre.label,
        description: selectedVehicleGenre.description,
        max_mileage_essence_per_year: selectedVehicleGenre.max_mileage_essence_per_year || 0,
        max_mileage_diesel_per_year: selectedVehicleGenre.max_mileage_diesel_per_year || 0,
      })
    }
  }, [selectedVehicleGenre, isEditOpen])

  // Gestionnaires de soumission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVehicleGenre(createForm)
      onCloseCreate()
      setCreateForm({ code: '', label: '', description: null, max_mileage_essence_per_year: 0, max_mileage_diesel_per_year: 0 })
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleGenre) return
    
    try {
      await updateVehicleGenre(selectedVehicleGenre.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedVehicleGenre) return
    
    try {
      await deleteVehicleGenre(selectedVehicleGenre.id)
      onCloseDelete()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  return (
    <>
      {/* Dialogue de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un genre de véhicule</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau genre de véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={createForm.code}
                onChange={(e) => setCreateForm(f => ({ ...f, code: e.target.value }))}
                placeholder="Ex: VG01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={createForm.label}
                onChange={(e) => setCreateForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: VOITURE PARTICULIER"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description || ''}
                onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value || null }))}
                placeholder="Description du genre de véhicule"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_mileage_essence_per_year">Kilométrage max essence/an *</Label>
                <Input
                  id="max_mileage_essence_per_year"
                  type="number"
                  min="0"
                  value={createForm.max_mileage_essence_per_year}
                  onChange={(e) => setCreateForm(f => ({ ...f, max_mileage_essence_per_year: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 15000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_mileage_diesel_per_year">Kilométrage max diesel/an *</Label>
                <Input
                  id="max_mileage_diesel_per_year"
                  type="number"
                  min="0"
                  value={createForm.max_mileage_diesel_per_year}
                  onChange={(e) => setCreateForm(f => ({ ...f, max_mileage_diesel_per_year: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 20000"
                  required
                />
              </div>
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
            <DialogTitle>Modifier le genre de véhicule</DialogTitle>
            <DialogDescription>
              Modifiez les informations du genre de véhicule.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label *</Label>
              <Input
                id="edit-label"
                value={editForm.label}
                onChange={(e) => setEditForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: VOITURE PARTICULIER"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description || ''}
                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value || null }))}
                placeholder="Description du genre de véhicule"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-max_mileage_essence_per_year">Kilométrage max essence/an *</Label>
                <Input
                  id="edit-max_mileage_essence_per_year"
                  type="number"
                  min="0"
                  value={editForm.max_mileage_essence_per_year}
                  onChange={(e) => setEditForm(f => ({ ...f, max_mileage_essence_per_year: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 15000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max_mileage_diesel_per_year">Kilométrage max diesel/an *</Label>
                <Input
                  id="edit-max_mileage_diesel_per_year"
                  type="number"
                  min="0"
                  value={editForm.max_mileage_diesel_per_year}
                  onChange={(e) => setEditForm(f => ({ ...f, max_mileage_diesel_per_year: parseInt(e.target.value) || 0 }))}
                  placeholder="Ex: 20000"
                  required
                />
              </div>
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
            <DialogTitle>Détails du genre de véhicule</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le genre de véhicule.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleGenre && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="outline" className="font-mono">
                    {selectedVehicleGenre.code}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="font-medium">{selectedVehicleGenre.label}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">
                    {selectedVehicleGenre.description || 'Aucune description'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kilométrage max essence/an</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm font-mono">
                      {selectedVehicleGenre.max_mileage_essence_per_year?.toLocaleString() || 'Non défini'} km
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Kilométrage max diesel/an</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm font-mono">
                      {selectedVehicleGenre.max_mileage_diesel_per_year?.toLocaleString() || 'Non défini'} km
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date de création</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {new Date(selectedVehicleGenre.created_at).toLocaleDateString('fr-FR')}
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
            <DialogTitle>Supprimer le genre de véhicule</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce genre de véhicule ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicleGenre && (
            <div className="p-4 bg-destructive/10 rounded-md">
              <div className="font-medium text-destructive">
                {selectedVehicleGenre.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Code: {selectedVehicleGenre.code}
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