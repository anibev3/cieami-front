import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Hash, AlertTriangle } from 'lucide-react'
import { useOtherCostTypesStore } from '@/stores/otherCostTypesStore'
import { OtherCostType, CreateOtherCostTypeData, UpdateOtherCostTypeData } from '@/types/administration'

interface OtherCostTypesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedOtherCostType: OtherCostType | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function OtherCostTypesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedOtherCostType,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: OtherCostTypesDialogsProps) {
  const { createOtherCostType, updateOtherCostType, deleteOtherCostType } = useOtherCostTypesStore()

  const [createForm, setCreateForm] = useState<CreateOtherCostTypeData>({
    code: '',
    label: '',
    description: '',
  })
  const [editForm, setEditForm] = useState<UpdateOtherCostTypeData>({})

  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({ code: '', label: '', description: '' })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedOtherCostType) {
      setEditForm({
        code: selectedOtherCostType.code,
        label: selectedOtherCostType.label,
        description: selectedOtherCostType.description,
      })
    }
  }, [isEditOpen, selectedOtherCostType])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createOtherCostType(createForm)
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOtherCostType) return
    try {
      await updateOtherCostType(selectedOtherCostType.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedOtherCostType) return
    try {
      await deleteOtherCostType(selectedOtherCostType.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouveau type de coût</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un type de coût.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={createForm.code}
                onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Libellé *</Label>
              <Input
                id="label"
                value={createForm.label}
                onChange={(e) => setCreateForm({ ...createForm, label: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseCreate}>
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le type de coût</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type de coût.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Code</Label>
              <Input
                id="edit-code"
                value={editForm.code || ''}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-label">Libellé</Label>
              <Input
                id="edit-label"
                value={editForm.label || ''}
                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseEdit}>
                Annuler
              </Button>
              <Button type="submit">Modifier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du type de coût</DialogTitle>
            <DialogDescription>
              Informations complètes sur le type de coût sélectionné.
            </DialogDescription>
          </DialogHeader>
          {selectedOtherCostType && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{selectedOtherCostType.code}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Libellé</Label>
                  <div className="font-medium">{selectedOtherCostType.label}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <div className="text-muted-foreground text-sm">
                  {selectedOtherCostType.description}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedOtherCostType.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={onCloseView}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer le type de coût</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de coût ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedOtherCostType && (
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong>{selectedOtherCostType.label}</strong> ({selectedOtherCostType.code})
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 