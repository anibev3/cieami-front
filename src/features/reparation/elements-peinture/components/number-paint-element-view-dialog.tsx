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
import { NumberPaintElement } from '@/types/number-paint-elements'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface NumberPaintElementViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  numberPaintElement: NumberPaintElement | null
}

export function NumberPaintElementViewDialog({
  open,
  onOpenChange,
  numberPaintElement,
}: NumberPaintElementViewDialogProps) {
  if (!numberPaintElement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de l'élément de peinture</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'élément sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{numberPaintElement.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                {numberPaintElement.deleted_at ? (
                  <Badge variant="destructive">Supprimé</Badge>
                ) : (
                  <Badge variant="default">{numberPaintElement.status.label}</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Libellé</label>
            <p className="text-sm font-medium">{numberPaintElement.label}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm">{numberPaintElement.description}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Valeur</label>
            <p className="text-sm font-medium">{numberPaintElement.value}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p className="text-sm">
                {format(new Date(numberPaintElement.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </label>
              <p className="text-sm">
                {format(new Date(numberPaintElement.updated_at), 'dd/MM/yyyy HH:mm', {
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