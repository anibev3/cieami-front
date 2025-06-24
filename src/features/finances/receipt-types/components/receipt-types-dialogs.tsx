import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Hash, AlertTriangle } from 'lucide-react'
import { useReceiptTypesStore } from '@/stores/receiptTypesStore'
import { ReceiptType, CreateReceiptTypeData, UpdateReceiptTypeData } from '@/types/administration'

interface ReceiptTypesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedReceiptType: ReceiptType | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function ReceiptTypesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedReceiptType,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: ReceiptTypesDialogsProps) {
  const { createReceiptType, updateReceiptType, deleteReceiptType } = useReceiptTypesStore()

  const [createForm, setCreateForm] = useState<CreateReceiptTypeData>({
    code: '',
    label: '',
    description: '',
  })
  const [editForm, setEditForm] = useState<UpdateReceiptTypeData>({})

  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({ code: '', label: '', description: '' })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedReceiptType) {
      setEditForm({
        code: selectedReceiptType.code,
        label: selectedReceiptType.label,
        description: selectedReceiptType.description,
      })
    }
  }, [isEditOpen, selectedReceiptType])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createReceiptType(createForm)
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReceiptType) return
    try {
      await updateReceiptType(selectedReceiptType.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedReceiptType) return
    try {
      await deleteReceiptType(selectedReceiptType.id)
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
            <DialogTitle>Nouveau type de reçu</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un type de reçu.
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
            <DialogTitle>Modifier le type de reçu</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type de reçu.
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
            <DialogTitle>Détails du type de reçu</DialogTitle>
            <DialogDescription>
              Informations complètes sur le type de reçu sélectionné.
            </DialogDescription>
          </DialogHeader>
          {selectedReceiptType && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{selectedReceiptType.code}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Libellé</Label>
                  <div className="font-medium">{selectedReceiptType.label}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <div className="text-muted-foreground text-sm">
                  {selectedReceiptType.description}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedReceiptType.created_at).toLocaleDateString('fr-FR')}</span>
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
            <DialogTitle>Supprimer le type de reçu</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de reçu ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedReceiptType && (
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong>{selectedReceiptType.label}</strong> ({selectedReceiptType.code})
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