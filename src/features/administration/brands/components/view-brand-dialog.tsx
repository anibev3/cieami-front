import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/format-date'
import { Brand } from '@/types/brands'

interface ViewBrandDialogProps {
  brand: Brand | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewBrandDialog({ brand, open, onOpenChange }: ViewBrandDialogProps) {
  if (!brand) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Détail de la marque</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Code :</span> {brand.code}
          </div>
          <div>
            <span className="font-semibold">Libellé :</span> {brand.label}
          </div>
          <div>
            <span className="font-semibold">Description :</span> {brand.description}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> <Badge>{brand.status.label}</Badge>
          </div>
          <div>
            <span className="font-semibold">Créé le :</span> {formatDate(brand.created_at)}
          </div>
          <div>
            <span className="font-semibold">Modifié le :</span> {formatDate(brand.updated_at)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 