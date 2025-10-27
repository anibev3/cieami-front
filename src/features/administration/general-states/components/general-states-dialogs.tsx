import { useState, useEffect } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGeneralStatesStore } from '@/stores/generalStatesStore'
import { CreateGeneralStateData, UpdateGeneralStateData, GeneralState } from '@/types/administration'
import { Hash, Calendar, AlertTriangle, Trash2, User, Mail, Phone } from 'lucide-react'

interface GeneralStatesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedGeneralState: GeneralState | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function GeneralStatesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedGeneralState,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: GeneralStatesDialogsProps) {
  const { createGeneralState, updateGeneralState, deleteGeneralState, loading } = useGeneralStatesStore()
  const [formData, setFormData] = useState<CreateGeneralStateData>({
    code: '',
    label: '',
    description: '',
  })

  // Préremplir les champs lors de l'ouverture du modal d'édition
  useEffect(() => {
    if (isEditOpen && selectedGeneralState) {
      setFormData({
        code: selectedGeneralState.code || '',
        label: selectedGeneralState.label || '',
        description: selectedGeneralState.description || '',
      })
    }
  }, [isEditOpen, selectedGeneralState])

  // Gérer la création
  const handleCreate = async () => {
    try {
      await createGeneralState(formData)
      setFormData({ code: '', label: '', description: '' })
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la modification
  const handleEdit = async () => {
    if (!selectedGeneralState) return
    
    try {
      const updateData: UpdateGeneralStateData = {
        label: formData.label,
        description: formData.description,
      }
      await updateGeneralState(selectedGeneralState.id, updateData)
      setFormData({ code: '', label: '', description: '' })
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la suppression
  const handleDelete = async () => {
    if (!selectedGeneralState) return
    
    try {
      await deleteGeneralState(selectedGeneralState.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
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
            <DialogTitle>Créer un nouvel état général</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel état général au système.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* <div>
              <label className="text-sm font-medium">Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="ex: new"
              />
            </div> */}
            <div>
              <label className="text-sm font-medium">Libellé</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Neuf(ve)s"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'état général..."
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
            <DialogTitle>Modifier l'état général</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'état général.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input value={selectedGeneralState?.code || ''} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Libellé</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Neuf(ve)s"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de l'état général..."
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
              Détails de l'état général
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur l'état général.
            </DialogDescription>
          </DialogHeader>
          
          {selectedGeneralState && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Code
                </div>
                <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
                  {selectedGeneralState.code}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Libellé
                </div>
                <div className="text-lg font-semibold">
                  {selectedGeneralState.label}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Description
                </div>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  {selectedGeneralState.description}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Statut
                </div>
                <Badge variant={selectedGeneralState.status.code === 'active' ? 'default' : 'secondary'}>
                  {selectedGeneralState.status.label}
                </Badge>
              </div>

              {/* Informations sur l'utilisateur qui a créé */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Créé par</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedGeneralState.created_by.photo_url} alt={selectedGeneralState.created_by.name} />
                      <AvatarFallback>
                        {selectedGeneralState.created_by.first_name.charAt(0)}{selectedGeneralState.created_by.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedGeneralState.created_by.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{selectedGeneralState.created_by.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedGeneralState.created_by.telephone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Créé le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedGeneralState.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Modifié le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedGeneralState.updated_at)}
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
              Supprimer l'état général
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet état général ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedGeneralState && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      Attention
                    </p>
                    <p className="text-sm text-muted-foreground">
                      La suppression de cet état général peut affecter les données associées dans le système.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">État général à supprimer :</p>
                <div className="bg-muted px-3 py-2 rounded-md">
                  <p className="font-medium">{selectedGeneralState.label}</p>
                  <p className="text-sm text-muted-foreground">{selectedGeneralState.code}</p>
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