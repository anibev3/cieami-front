import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PaintType } from '@/types/paint-types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PaintTypeViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintType: PaintType | null
}

export function PaintTypeViewDialog({
  open,
  onOpenChange,
  paintType,
}: PaintTypeViewDialogProps) {
  if (!paintType) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du type de peinture</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le type sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{paintType.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                {paintType.deleted_at ? (
                  <Badge variant="destructive">Supprimé</Badge>
                ) : (
                  <Badge variant="default">Actif</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Code</label>
            <p className="text-sm font-medium">{paintType.code}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Libellé</label>
            <p className="text-sm font-medium">{paintType.label}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm">{paintType.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p className="text-sm">
                {format(new Date(paintType.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </label>
              <p className="text-sm">
                {format(new Date(paintType.updated_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 