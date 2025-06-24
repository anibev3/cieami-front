import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Assureur } from './types'
import { useAssureursStore } from './store'
import { toast } from 'sonner'

interface AssureursDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedAssureur: Assureur | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function AssureursDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedAssureur,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: AssureursDialogsProps) {
  const { createAssureur, updateAssureur, deleteAssureur } = useAssureursStore()

  // États pour les formulaires
  const [createForm, setCreateForm] = useState<Partial<Assureur>>({
    code: '',
    name: '',
    email: '',
    telephone: '',
    address: '',
  })
  const [editForm, setEditForm] = useState<Partial<Assureur>>({})

  // Réinitialiser les formulaires
  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({ code: '', name: '', email: '', telephone: '', address: '' })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedAssureur) {
      setEditForm({
        code: selectedAssureur.code,
        name: selectedAssureur.name,
        email: selectedAssureur.email,
        telephone: selectedAssureur.telephone || '',
        address: selectedAssureur.address || '',
      })
    }
  }, [isEditOpen, selectedAssureur])

  // Handlers pour la création
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name || !createForm.email || !createForm.code) {
      toast.error('Nom, code et email obligatoires')
      return
    }
    try {
      await createAssureur(createForm)
      onCloseCreate()
    } catch (_error) {
      // Optionally handle error
    }
  }

  // Handlers pour la modification
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssureur) return
    try {
      await updateAssureur(selectedAssureur.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Optionally handle error
    }
  }

  // Handlers pour la suppression
  const handleDeleteSubmit = async () => {
    if (!selectedAssureur) return
    try {
      await deleteAssureur(selectedAssureur.id)
      onCloseDelete()
    } catch (_error) {
      // Optionally handle error
    }
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouvel assureur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un assureur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input id="code" value={createForm.code ?? ''} onChange={e => setCreateForm(f => ({ ...f, code: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={createForm.name ?? ''} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={createForm.email ?? ''} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" value={createForm.telephone ?? ''} onChange={e => setCreateForm(f => ({ ...f, telephone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={createForm.address ?? ''} onChange={e => setCreateForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Éditer l'assureur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'assureur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code-edit">Code *</Label>
              <Input id="code-edit" value={editForm.code ?? ''} onChange={e => setEditForm(f => ({ ...f, code: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-edit">Nom *</Label>
              <Input id="name-edit" value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-edit">Email *</Label>
              <Input id="email-edit" type="email" value={editForm.email ?? ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone-edit">Téléphone</Label>
              <Input id="telephone-edit" value={editForm.telephone ?? ''} onChange={e => setEditForm(f => ({ ...f, telephone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-edit">Adresse</Label>
              <Input id="address-edit" value={editForm.address ?? ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de vue détaillée */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détail de l'assureur</DialogTitle>
          </DialogHeader>
          {selectedAssureur ? (
            <div className="space-y-2">
              <div><b>Nom :</b> {selectedAssureur.name}</div>
              <div><b>Code :</b> {selectedAssureur.code}</div>
              <div><b>Email :</b> {selectedAssureur.email}</div>
              <div><b>Téléphone :</b> {selectedAssureur.telephone || '-'}</div>
              <div><b>Adresse :</b> {selectedAssureur.address || '-'}</div>
              <div><b>Statut :</b> {selectedAssureur.status.label}</div>
              <div><b>Type d'entité :</b> {selectedAssureur.entity_type.label}</div>
              <div><b>Créé le :</b> {new Date(selectedAssureur.created_at).toLocaleString()}</div>
              <div><b>Modifié le :</b> {new Date(selectedAssureur.updated_at).toLocaleString()}</div>
            </div>
          ) : (
            <div>Chargement...</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l'assureur</DialogTitle>
          </DialogHeader>
          <div>Êtes-vous sûr de vouloir supprimer cet assureur&nbsp;?</div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteSubmit}>Supprimer</Button>
            <Button variant="outline" onClick={onCloseDelete}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 