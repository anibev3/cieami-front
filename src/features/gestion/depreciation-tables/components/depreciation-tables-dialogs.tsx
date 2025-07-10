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
import { Badge } from '@/components/ui/badge'
import { useDepreciationTablesStore } from '@/stores/depreciationTablesStore'
import { DepreciationTable, CreateDepreciationTableData, UpdateDepreciationTableData } from '@/services/depreciationTableService'
import { VehicleGenreSelect, VehicleAgeSelect } from '@/features/widgets'

interface DepreciationTablesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedDepreciationTable: DepreciationTable | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function DepreciationTablesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedDepreciationTable,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: DepreciationTablesDialogsProps) {
  const { createDepreciationTable, updateDepreciationTable, deleteDepreciationTable, loading } = useDepreciationTablesStore()
  
  const [createForm, setCreateForm] = useState<CreateDepreciationTableData>({
    vehicle_genre_id: '',
    vehicle_age_id: '',
    value: 0,
  })

  const [editForm, setEditForm] = useState<UpdateDepreciationTableData>({
    vehicle_genre_id: '',
    vehicle_age_id: '',
    value: 0,
  })

  // Gestionnaires de soumission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createDepreciationTable(createForm)
      onCloseCreate()
      setCreateForm({ vehicle_genre_id: '', vehicle_age_id: '', value: 0 })
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDepreciationTable) return
    
    try {
      await updateDepreciationTable(selectedDepreciationTable.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedDepreciationTable) return
    
    try {
      await deleteDepreciationTable(selectedDepreciationTable.id)
      onCloseDelete()
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  // Réinitialiser le formulaire d'édition quand le tableau sélectionné change
  useState(() => {
    if (selectedDepreciationTable && isEditOpen) {
      setEditForm({
        vehicle_genre_id: selectedDepreciationTable.vehicle_genre.id.toString(),
        vehicle_age_id: selectedDepreciationTable.vehicle_age.id.toString(),
        value: Number(selectedDepreciationTable.value),
      })
    }
  })

  return (
    <>
      {/* Dialogue de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un tableau de dépréciation</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau tableau de dépréciation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_genre">Genre de véhicule *</Label>
              <VehicleGenreSelect
                value={createForm.vehicle_genre_id}
                onValueChange={(value) => setCreateForm(f => ({ ...f, vehicle_genre_id: value }))}
                placeholder="Sélectionner un genre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_age">Âge du véhicule *</Label>
              <VehicleAgeSelect
                value={createForm.vehicle_age_id}
                onValueChange={(value) => setCreateForm(f => ({ ...f, vehicle_age_id: value }))}
                placeholder="Sélectionner un âge"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Taux de dépréciation (%) *</Label>
              <Input
                id="value"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={createForm.value}
                onChange={(e) => setCreateForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder="Ex: 25.50"
                required
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
            <DialogTitle>Modifier le tableau de dépréciation</DialogTitle>
            <DialogDescription>
              Modifiez les informations du tableau de dépréciation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-vehicle-genre">Genre de véhicule *</Label>
              <VehicleGenreSelect
                value={editForm.vehicle_genre_id}
                onValueChange={(value) => setEditForm(f => ({ ...f, vehicle_genre_id: value }))}
                placeholder="Sélectionner un genre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-vehicle-age">Âge du véhicule *</Label>
              <VehicleAgeSelect
                value={editForm.vehicle_age_id}
                onValueChange={(value) => setEditForm(f => ({ ...f, vehicle_age_id: value }))}
                placeholder="Sélectionner un âge"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">Taux de dépréciation (%) *</Label>
              <Input
                id="edit-value"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={editForm.value}
                onChange={(e) => setEditForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder="Ex: 25.50"
                required
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
            <DialogTitle>Détails du tableau de dépréciation</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le tableau de dépréciation.
            </DialogDescription>
          </DialogHeader>
          {selectedDepreciationTable && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Genre de véhicule</Label>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium">{selectedDepreciationTable.vehicle_genre.label}</span>
                    <Badge variant="outline" className="w-fit text-xs mt-1">
                      {selectedDepreciationTable.vehicle_genre.code}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Âge du véhicule</Label>
                <div className="p-3 bg-muted rounded-md">
                  <div className="flex flex-col">
                    <span className="font-medium">{selectedDepreciationTable.vehicle_age.label}</span>
                    <Badge variant="outline" className="w-fit text-xs font-mono mt-1">
                      {selectedDepreciationTable.vehicle_age.value} mois
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Taux de dépréciation</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="secondary" className="font-mono">
                    {selectedDepreciationTable.value}%
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant={selectedDepreciationTable.status.code === 'active' ? 'default' : 'secondary'}>
                    {selectedDepreciationTable.status.label}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date de création</Label>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-sm">
                    {new Date(selectedDepreciationTable.created_at).toLocaleDateString('fr-FR')}
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
            <DialogTitle>Supprimer le tableau de dépréciation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce tableau de dépréciation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedDepreciationTable && (
            <div className="p-4 bg-destructive/10 rounded-md">
              <div className="font-medium text-destructive">
                {selectedDepreciationTable.vehicle_genre.label} - {selectedDepreciationTable.vehicle_age.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Taux: {selectedDepreciationTable.value}%
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