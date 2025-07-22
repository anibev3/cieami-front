import { useState, useEffect } from 'react'
import { useRemarkStore } from '@/stores/remarkStore'
import { Remark, CreateRemarkData, UpdateRemarkData } from '@/types/administration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
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
  Calendar,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface RemarkDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedRemark: Remark | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function RemarkDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedRemark,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: RemarkDialogsProps) {
  const { createRemark, updateRemark, deleteRemark, loading } = useRemarkStore()
  
  // États pour les formulaires
  const [createForm, setCreateForm] = useState<CreateRemarkData>({
    label: '',
    description: ''
  })
  
  const [editForm, setEditForm] = useState<UpdateRemarkData>({
    label: '',
    description: ''
  })

  // Réinitialiser les formulaires quand les modals s'ouvrent
  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({ label: '', description: '' })
    }
  }, [isCreateOpen])

  useEffect(() => {
    if (isEditOpen && selectedRemark) {
      setEditForm({
        label: selectedRemark.label,
        description: selectedRemark.description
      })
    }
  }, [isEditOpen, selectedRemark])

  // Handlers pour la création
  const handleCreate = async () => {
    try {
      await createRemark(createForm)
      onCloseCreate()
    } catch (_error) {
      // L'erreur est gérée dans le store
    }
  }

  // Handlers pour la modification
  const handleEdit = async () => {
    if (!selectedRemark) return
    
    try {
      await updateRemark(selectedRemark.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // L'erreur est gérée dans le store
    }
  }

  // Handlers pour la suppression
  const handleDelete = async () => {
    if (!selectedRemark) return
    
    try {
      await deleteRemark(selectedRemark.id)
      onCloseDelete()
    } catch (_error) {
      // L'erreur est gérée dans le store
    }
  }

  return (
    <>
      {/* Modal de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer une remarque</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle remarque d'expert au système
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-label">Label</Label>
              <Input
                id="create-label"
                value={createForm.label}
                onChange={(e) => setCreateForm({ ...createForm, label: e.target.value })}
                placeholder="ex: Cas 1 : choc violent (pas épave)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <RichTextEditor
                value={createForm.description}
                onChange={(value) => setCreateForm({ ...createForm, description: value })}
                placeholder="Décrivez la remarque en détail..."
                className="min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseCreate}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={loading || !createForm.label || !createForm.description}>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la remarque</DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette remarque d'expert
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Label</Label>
              <Input
                id="edit-label"
                value={editForm.label}
                onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                placeholder="ex: Cas 1 : choc violent (pas épave)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <RichTextEditor
                value={editForm.description}
                onChange={(value) => setEditForm({ ...editForm, description: value })}
                placeholder="Décrivez la remarque en détail..."
                className="min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseEdit}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={loading || !editForm.label || !editForm.description}>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la remarque</DialogTitle>
            <DialogDescription>
              Informations complètes sur cette remarque d'expert
            </DialogDescription>
          </DialogHeader>
          
          {selectedRemark && (
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Label</Label>
                      <p className="font-medium">{selectedRemark.label}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Description
                      </Label>
                      <div 
                        className="prose prose-sm max-w-none mt-2"
                        dangerouslySetInnerHTML={{ __html: selectedRemark.description }}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                      <Badge 
                        variant={selectedRemark.status.label === 'Actif(ve)' ? 'default' : 'secondary'}
                        className={selectedRemark.status.label === 'Actif(ve)' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {selectedRemark.status.label}
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
                          {format(new Date(selectedRemark.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Modifié le
                        </Label>
                        <p className="text-sm">
                          {format(new Date(selectedRemark.updated_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </p>
                      </div>
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
              Êtes-vous sûr de vouloir supprimer la remarque "{selectedRemark?.label}" ? 
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