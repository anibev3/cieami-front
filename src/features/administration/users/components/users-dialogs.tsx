import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Mail, Phone, Building, User as UserIcon, Shield, AlertTriangle } from 'lucide-react'
import { useUsersStore } from '@/stores/usersStore'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { User, CreateUserData, UpdateUserData } from '@/types/administration'
import { toast } from 'sonner'

const ROLES = [
  { name: 'system_admin', label: 'Administrateur système' },
  { name: 'admin', label: 'Administrateur plateforme' },
  { name: 'insurer_admin', label: 'Administrateur assureur' },
  { name: 'repairer_admin', label: 'Administrateur réparateur' },
  { name: 'ceo', label: 'Directeur général' },
  { name: 'editor', label: 'Rédacteur' },
  { name: 'expert', label: 'Expert' },
]

interface UsersDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedUser: User | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function UsersDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedUser,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: UsersDialogsProps) {
  const { createUser, updateUser, deleteUser } = useUsersStore()
  const { entities, fetchEntities } = useEntitiesStore()

  // États pour les formulaires
  const [createForm, setCreateForm] = useState<CreateUserData>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    telephone: '',
    entity_id: 0,
    role: '',
    code: '',
  })

  const [editForm, setEditForm] = useState<UpdateUserData>({})

  // Charger les entités pour le select
  useEffect(() => {
    fetchEntities()
  }, [])

  // Réinitialiser les formulaires
  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        telephone: '',
        entity_id: 0,
        role: '',
        code: '',
      })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedUser) {
      setEditForm({
        email: selectedUser.email,
        username: selectedUser.username,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        telephone: selectedUser.telephone,
        entity_id: selectedUser.entity.id,
        role: selectedUser.role.name,
      })
    }
  }, [isEditOpen, selectedUser])

  // Handlers pour la création
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.entity_id || !createForm.role) {
      toast.error('Veuillez sélectionner une entité et un rôle')
      return
    }
    try {
      await createUser(createForm)
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Handlers pour la modification
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    try {
      await updateUser(selectedUser.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Handlers pour la suppression
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return
    try {
      await deleteUser(selectedUser.id)
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
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un utilisateur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  value={createForm.first_name}
                  onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  value={createForm.last_name}
                  onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={createForm.telephone}
                onChange={(e) => setCreateForm({ ...createForm, telephone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity">Entité *</Label>
              <Select
                value={createForm.entity_id ? String(createForm.entity_id) : ''}
                onValueChange={(value) => setCreateForm({ ...createForm, entity_id: Number(value) })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une entité" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Select
                value={createForm.role}
                onValueChange={(value) => setCreateForm({ ...createForm, role: value })}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid  gap-4">

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first_name">Prénom</Label>
                <Input
                  id="edit-first_name"
                  value={editForm.first_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last_name">Nom</Label>
                <Input
                  id="edit-last_name"
                  value={editForm.last_name || ''}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telephone">Téléphone</Label>
              <Input
                id="edit-telephone"
                value={editForm.telephone || ''}
                onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-entity">Entité</Label>
              <Select
                value={editForm.entity_id ? String(editForm.entity_id) : ''}
                onValueChange={(value) => setEditForm({ ...editForm, entity_id: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entité" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select
                value={editForm.role || ''}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'utilisateur sélectionné.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <div className="font-bold text-lg">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.username}</div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.telephone}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Entité</Label>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{selectedUser.entity.name}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Rôle</Label>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">{selectedUser.role.label}</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</span>
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
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong>{selectedUser.name}</strong> ({selectedUser.username})
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