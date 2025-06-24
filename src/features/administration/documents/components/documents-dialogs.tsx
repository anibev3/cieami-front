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
import { useDocumentsStore } from '@/stores/documentsStore'
import { CreateDocumentTransmittedData, UpdateDocumentTransmittedData, DocumentTransmitted } from '@/types/administration'
import { FileText, Calendar, Hash, AlertTriangle, Trash2 } from 'lucide-react'

interface DocumentsDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedDocument: DocumentTransmitted | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function DocumentsDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedDocument,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: DocumentsDialogsProps) {
  const { createDocument, updateDocument, deleteDocument, loading } = useDocumentsStore()
  const [formData, setFormData] = useState<CreateDocumentTransmittedData>({
    code: '',
    label: '',
    description: '',
  })

  // Gérer la création
  const handleCreate = async () => {
    try {
      await createDocument(formData)
      onCloseCreate()
      setFormData({ code: '', label: '', description: '' })
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la modification
  const handleEdit = async () => {
    if (!selectedDocument) return
    
    try {
      const updateData: UpdateDocumentTransmittedData = {
        label: formData.label,
        description: formData.description,
      }
      await updateDocument(selectedDocument.id, updateData)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la suppression
  const handleDelete = async () => {
    if (!selectedDocument) return
    
    try {
      await deleteDocument(selectedDocument.id)
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
            <DialogTitle>Créer un nouveau document</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau type de document transmis au système.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="ex: carte_grise"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Libellé</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Carte grise"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du document..."
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
            <DialogTitle>Modifier le document</DialogTitle>
            <DialogDescription>
              Modifiez les informations du document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input value={selectedDocument?.code || ''} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Libellé</label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Carte grise"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du document..."
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Détails du document
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le document transmis.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Code
                </div>
                <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
                  {selectedDocument.code}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Libellé
                </div>
                <div className="text-lg font-semibold">
                  {selectedDocument.label}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Description
                </div>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  {selectedDocument.description}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Statut
                </div>
                <Badge variant={selectedDocument.status.code === 'active' ? 'default' : 'secondary'}>
                  {selectedDocument.status.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Créé le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedDocument.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Modifié le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedDocument.updated_at)}
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
              Supprimer le document
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      Attention
                    </p>
                    <p className="text-sm text-muted-foreground">
                      La suppression de ce document peut affecter les données associées dans le système.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Document à supprimer :</p>
                <div className="bg-muted px-3 py-2 rounded-md">
                  <p className="font-medium">{selectedDocument.label}</p>
                  <p className="text-sm text-muted-foreground">{selectedDocument.code}</p>
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