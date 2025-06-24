import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/format-date'
import { Color } from '@/types/colors'

interface ViewColorDialogProps {
  color: Color | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewColorDialog({ color, open, onOpenChange }: ViewColorDialogProps) {
  if (!color) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Détail de la couleur</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Code :</span> {color.code}
          </div>
          <div>
            <span className="font-semibold">Libellé :</span> {color.label}
          </div>
          <div>
            <span className="font-semibold">Description :</span> {color.description}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> <Badge>{color.status.label}</Badge>
          </div>
          <div>
            <span className="font-semibold">Créé le :</span> {formatDate(color.created_at)}
          </div>
          <div>
            <span className="font-semibold">Modifié le :</span> {formatDate(color.updated_at)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 