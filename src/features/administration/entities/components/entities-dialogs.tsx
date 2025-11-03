import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Mail, Phone, MapPin, Building, Hash, AlertTriangle } from 'lucide-react'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { useStatusesStore } from '@/stores/statusesStore'
import { useEntityTypesStore } from '@/stores/entityTypesStore'
import { Entity, CreateEntityData, UpdateEntityData } from '@/types/administration'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface EntitiesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedEntity: Entity | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function EntitiesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedEntity,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: EntitiesDialogsProps) {
  const navigate = useNavigate()
  const { createEntity, updateEntity, deleteEntity } = useEntitiesStore()
  const { fetchStatuses } = useStatusesStore()
  const { entityTypes, fetchEntityTypes } = useEntityTypesStore()

  // États pour les formulaires
  const [createForm, setCreateForm] = useState<CreateEntityData>({
    code: '',
    name: '',
    email: '',
    telephone: '',
    address: '',
    entity_type_code: undefined,
  })

  const [editForm, setEditForm] = useState<UpdateEntityData>({
    name: '',
    email: '',
    telephone: '',
    address: '',
  })

  // Charger les données de référence
  useEffect(() => {
    fetchStatuses()
    fetchEntityTypes()
  }, [])

  // Réinitialiser les formulaires
  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({
        code: '',
        name: '',
        email: '',
        telephone: '',
        address: '',
        entity_type_code: undefined,
      })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedEntity) {
      setEditForm({
        name: selectedEntity.name,
        email: selectedEntity.email,
        telephone: selectedEntity.telephone || '',
        address: selectedEntity.address || '',
      })
    }
  }, [isEditOpen, selectedEntity])

  // Rediriger vers la page de création lorsque l'ancien modal de création est demandé
  useEffect(() => {
    if (isCreateOpen) {
      onCloseCreate()
      navigate({ to: '/administration/entities/new' })
    }
  }, [isCreateOpen])

  // Handlers pour la modification
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEntity) return
    
    try {
      await updateEntity(selectedEntity.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Handlers pour la suppression
  const handleDeleteSubmit = async () => {
    if (!selectedEntity) return
    
    try {
      await deleteEntity(selectedEntity.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  return (
    <>
      {/* Création déplacée vers la page /administration/entities/new */}

      {/* Dialog de modification */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'entité</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'entité.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telephone">Téléphone</Label>
              <Input
                id="edit-telephone"
                value={editForm.telephone}
                onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Adresse</Label>
              <Textarea
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
            <DialogTitle>Détails de l'entité</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'entité sélectionnée.
            </DialogDescription>
          </DialogHeader>
          {selectedEntity && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{selectedEntity.code}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                  <div className="font-medium">{selectedEntity.name}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEntity.email}</span>
                  </div>
                </div>
                
                {selectedEntity.telephone && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEntity.telephone}</span>
                    </div>
                  </div>
                )}
                
                {selectedEntity.address && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEntity.address}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Type d'entité</Label>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{selectedEntity.entity_type.label}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                  <Badge variant={selectedEntity.status.deleted_at ? 'destructive' : 'default'}>
                    {selectedEntity.status.deleted_at ? 'Inactif' : 'Actif'}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedEntity.created_at).toLocaleDateString('fr-FR')}</span>
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
            <DialogTitle>Supprimer l'entité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette entité ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedEntity && (
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong>{selectedEntity.name}</strong> ({selectedEntity.code})
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