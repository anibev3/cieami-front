import { useState, useEffect } from 'react'
import { useClaimNatureStore } from '@/stores/claimNatureStore'
import { ClaimNature, CreateClaimNatureData, UpdateClaimNatureData } from '@/types/administration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ClaimNatureDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedClaimNature: ClaimNature | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function ClaimNatureDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedClaimNature,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: ClaimNatureDialogsProps) {
  const { createClaimNature, updateClaimNature, deleteClaimNature, loading } = useClaimNatureStore()
  
  // États pour les formulaires
  const [createForm, setCreateForm] = useState<CreateClaimNatureData>({
    code: '',
    label: '',
    description: ''
  })
  
  const [editForm, setEditForm] = useState<UpdateClaimNatureData>({
    code: '',
    label: '',
    description: ''
  })

  // Réinitialiser les formulaires quand les modals s'ouvrent
  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({ code: '', label: '', description: '' })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedClaimNature) {
      setEditForm({
        code: selectedClaimNature.code,
        label: selectedClaimNature.label,
        description: selectedClaimNature.description
      })
    }
  }, [isEditOpen, selectedClaimNature])

  // Handlers pour la création
  const handleCreate = async () => {
    try {
      await createClaimNature(createForm)
      onCloseCreate()
    } catch (_error) {
      // L'erreur est gérée dans le store
    }
  }

  // Handlers pour la modification
  const handleEdit = async () => {
    if (!selectedClaimNature) return
    
    try {
      await updateClaimNature(selectedClaimNature.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // L'erreur est gérée dans le store
    }
  }

  // Handlers pour la suppression
  const handleDelete = async () => {
    if (!selectedClaimNature) return
    
    try {
      await deleteClaimNature(selectedClaimNature.id)
      onCloseDelete()
    } catch (_error) {
      // L'erreur est gérée dans le store
    }
  }

  return (
    <>
      {/* Modal de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nature de sinistre</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle nature de sinistre au système
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={createForm.code}
                onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                placeholder="ex: accident_collision"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={createForm.label}
                onChange={(e) => setCreateForm({ ...createForm, label: e.target.value })}
                placeholder="ex: Accident / Collision"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Description détaillée..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseCreate}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={loading || !createForm.code || !createForm.label}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la nature de sinistre</DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette nature de sinistre
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Code</Label>
              <Input
                id="edit-code"
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                placeholder="ex: accident_collision"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={editForm.label}
                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                placeholder="ex: Accident / Collision"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description détaillée..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseEdit}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={loading || !editForm.code || !editForm.label}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                'Modifier'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la nature de sinistre</DialogTitle>
            <DialogDescription>
              Informations complètes sur cette nature de sinistre
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaimNature && (
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                      <p className="font-mono text-sm">{selectedClaimNature.code}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Label</Label>
                      <p className="font-medium">{selectedClaimNature.label}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                      <p className="text-sm">{selectedClaimNature.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                      <Badge 
                        variant={selectedClaimNature.status.code === 'active' ? 'default' : 'secondary'}
                        className={selectedClaimNature.status.code === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {selectedClaimNature.status.label}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Créé le
                        </Label>
                        <p className="text-sm">
                          {format(new Date(selectedClaimNature.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Modifié le
                        </Label>
                        <p className="text-sm">
                          {format(new Date(selectedClaimNature.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Créé par
                      </Label>
                      {/* <p className="text-sm">{selectedClaimNature.created_by.name}</p> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onCloseView}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <AlertDialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la nature de sinistre "{selectedClaimNature?.label}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 