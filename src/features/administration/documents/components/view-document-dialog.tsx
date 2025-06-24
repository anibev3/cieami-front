import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useDocuments } from '../context/documents-context'
import { FileText, Calendar, Hash } from 'lucide-react'

export function ViewDocumentDialog() {
  const { isViewDialogOpen, closeViewDialog, selectedDocument } = useDocuments()

  if (!selectedDocument) return null

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
    <Dialog open={isViewDialogOpen} onOpenChange={closeViewDialog}>
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
        
        <div className="space-y-6">
          {/* Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Hash className="h-4 w-4" />
              Code
            </div>
            <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
              {selectedDocument.code}
            </div>
          </div>

          {/* Libellé */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Libellé
            </div>
            <div className="text-lg font-semibold">
              {selectedDocument.label}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Description
            </div>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
              {selectedDocument.description}
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Statut
            </div>
            <Badge variant={selectedDocument.status.code === 'active' ? 'default' : 'secondary'}>
              {selectedDocument.status.label}
            </Badge>
          </div>

          {/* Dates */}
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

        <DialogFooter>
          <Button variant="outline" onClick={closeViewDialog}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 