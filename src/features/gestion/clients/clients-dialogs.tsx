/* eslint-disable no-empty */
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Client } from './types'
import { useClientsStore } from './store'
import { toast } from 'sonner'

interface ClientsDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedClient: Client | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function ClientsDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedClient,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: ClientsDialogsProps) {
  const { createClient, updateClient, deleteClient } = useClientsStore()

  // États pour les formulaires
  const [createForm, setCreateForm] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone_1: '',
    phone_2: '',
    address: '',
  })
  const [editForm, setEditForm] = useState<Partial<Client>>({})

  // Réinitialiser les formulaires
  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({ name: '', email: '', phone_1: '', phone_2: '', address: '' })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedClient) {
      setEditForm({
        name: selectedClient.name,
        email: selectedClient.email,
        phone_1: selectedClient.phone_1 || '',
        phone_2: selectedClient.phone_2 || '',
        address: selectedClient.address || '',
      })
    }
  }, [isEditOpen, selectedClient])

  // Handlers pour la création
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name) {
      toast.error('Nom et email obligatoires')
      return
    }
    try {
      await createClient(createForm)
      onCloseCreate()
    } catch (_error) {}
  }

  // Handlers pour la modification
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) return
    try {
      await updateClient(selectedClient.id, editForm)
      onCloseEdit()
    } catch (_error) {}
  }

  // Handlers pour la suppression
  const handleDeleteSubmit = async () => {
    if (!selectedClient) return
    try {
      await deleteClient(selectedClient.id)
      onCloseDelete()
    } catch (_error) {}
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau client</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un client.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_1">Téléphone 1</Label>
              <Input id="phone_1" value={createForm.phone_1 || ''} onChange={e => setCreateForm(f => ({ ...f, phone_1: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_2">Téléphone 2</Label>
              <Input id="phone_2" value={createForm.phone_2 || ''} onChange={e => setCreateForm(f => ({ ...f, phone_2: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={createForm.address} onChange={e => setCreateForm(f => ({ ...f, address: e.target.value }))} />
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
            <DialogTitle>Éditer le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-edit">Nom *</Label>
              <Input id="name-edit" value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-edit">Email *</Label>
              <Input id="email-edit" type="email" value={editForm.email || ''} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_1-edit">Téléphone 1</Label>
              <Input id="phone_1-edit" value={editForm.phone_1 || ''} onChange={e => setEditForm(f => ({ ...f, phone_1: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_2-edit">Téléphone 2</Label>
              <Input id="phone_2-edit" value={editForm.phone_2 || ''} onChange={e => setEditForm(f => ({ ...f, phone_2: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-edit">Adresse</Label>
              <Input id="address-edit" value={editForm.address || ''} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
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
            <DialogTitle>Détail du client</DialogTitle>
          </DialogHeader>
          {selectedClient ? (
            <div className="space-y-2">
              <div><b>Nom :</b> {selectedClient.name}</div>
              <div><b>Email :</b> {selectedClient.email}</div>
              <div><b>Téléphone 1 :</b> {selectedClient.phone_1 || '-'}</div>
              <div><b>Téléphone 2 :</b> {selectedClient.phone_2 || '-'}</div>
              <div><b>Adresse :</b> {selectedClient.address || '-'}</div>
              <div><b>Créé le :</b> {new Date(selectedClient.created_at).toLocaleString()}</div>
              <div><b>Modifié le :</b> {new Date(selectedClient.updated_at).toLocaleString()}</div>
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
            <DialogTitle>Supprimer le client</DialogTitle>
          </DialogHeader>
          <div>Êtes-vous sûr de vouloir supprimer ce client&nbsp;?</div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteSubmit}>Supprimer</Button>
            <Button variant="outline" onClick={onCloseDelete}>Annuler</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 