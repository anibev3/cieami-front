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
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useDocuments } from '../context/documents-context'

export function DeleteDocumentDialog() {
  const { 
    isDeleteDialogOpen, 
    closeDeleteDialog, 
    deleteDocument, 
    selectedDocument, 
    loading 
  } = useDocuments()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!selectedDocument) return null

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteDocument(selectedDocument.id)
    } catch (_error) {
      // L'erreur est déjà gérée dans le contexte
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      closeDeleteDialog()
    }
  }

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Supprimer le document
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le document "{selectedDocument.label}" ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
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

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting || loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 