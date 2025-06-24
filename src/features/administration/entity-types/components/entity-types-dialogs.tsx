import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useEntityTypesStore } from '@/stores/entityTypesStore'
import { CreateEntityTypeData, UpdateEntityTypeData, EntityType } from '@/types/administration'
import { Hash, Calendar, AlertTriangle, Trash2, Power, PowerOff } from 'lucide-react'

interface EntityTypesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedEntityType: EntityType | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function EntityTypesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedEntityType,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: EntityTypesDialogsProps) {
  const { createEntityType, updateEntityType, deleteEntityType, enableEntityType, disableEntityType, loading } = useEntityTypesStore()
  const [formData, setFormData] = useState<CreateEntityTypeData>({
    code: '',
    label: '',
    description: '',
  })

  // Gérer la création
  const handleCreate = async () => {
    try {
      await createEntityType(formData)
      onCloseCreate()
      setFormData({ code: '', label: '', description: '' })
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la modification
  const handleEdit = async () => {
    if (!selectedEntityType) return
    
    try {
      const updateData: UpdateEntityTypeData = {
        label: formData.label,
        description: formData.description,
      }
      await updateEntityType(selectedEntityType.id, updateData)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la suppression
  const handleDelete = async () => {
    if (!selectedEntityType) return
    
    try {
      await deleteEntityType(selectedEntityType.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer l'activation/désactivation
  const handleToggleStatus = async () => {
    if (!selectedEntityType) return
    try {
      if (!selectedEntityType.deleted_at) {
        await disableEntityType(selectedEntityType.id)
      } else {
        await enableEntityType(selectedEntityType.id)
      }
      onCloseView()
    } catch (_error) {}
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau type d'entité</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau type d'entité au système.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="ex: main_org"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Libellé</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Entité principale"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type d'entité..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseCreate}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le type d'entité</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type d'entité.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input value={selectedEntityType?.code || ''} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Libellé</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Entité principale"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type d'entité..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseEdit}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Détails du type d'entité
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le type d'entité.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntityType && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Code
                </div>
                <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
                  {selectedEntityType.code}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Libellé
                </div>
                <div className="text-lg font-semibold">
                  {selectedEntityType.label}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Description
                </div>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  {selectedEntityType.description}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Statut
                </div>
                <Badge variant={selectedEntityType.deleted_at ? 'destructive' : 'default'}>
                  {selectedEntityType.deleted_at ? 'Inactif' : 'Actif'}
                </Badge>
                <Button
                  variant={selectedEntityType.deleted_at ? 'default' : 'destructive'}
                  className="ml-2"
                  size="sm"
                  onClick={handleToggleStatus}
                  disabled={loading}
                >
                  {selectedEntityType.deleted_at ? (
                    <>
                      <Power className="mr-2 h-4 w-4" />
                      Activer
                    </>
                  ) : (
                    <>
                      <PowerOff className="mr-2 h-4 w-4" />
                      Désactiver
                    </>
                  )}
                </Button>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Créé le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedEntityType.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Modifié le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedEntityType.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onCloseView}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Supprimer le type d'entité
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type d'entité ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntityType && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      Attention
                    </p>
                    <p className="text-sm text-muted-foreground">
                      La suppression de ce type d'entité peut affecter les données associées dans le système.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Type d'entité à supprimer :</p>
                <div className="bg-muted px-3 py-2 rounded-md">
                  <p className="font-medium">{selectedEntityType.label}</p>
                  <p className="text-sm text-muted-foreground">{selectedEntityType.code}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={onCloseDelete}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 