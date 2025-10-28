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
import { PaintingPrice } from '@/types/painting-prices'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PaintingPriceViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paintingPrice: PaintingPrice | null
}

export function PaintingPriceViewDialog({
  open,
  onOpenChange,
  paintingPrice,
}: PaintingPriceViewDialogProps) {
  if (!paintingPrice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] h-[600px]">
        <DialogHeader className="p-0">
          <DialogTitle>Détails du prix de peinture</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le prix sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{paintingPrice.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                {paintingPrice.deleted_at ? (
                  <Badge variant="destructive">Supprimé</Badge>
                ) : (
                  <Badge variant="default">{paintingPrice.status.label}</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Code</label>
              <p className="text-sm font-medium">{paintingPrice.code || 'Non défini'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Libellé</label>
              <p className="text-sm font-medium">{paintingPrice.label || 'Non défini'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm">{paintingPrice.description || 'Non définie'}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Taux horaire</h4>
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <label className="text-xs text-muted-foreground">ID</label>
                <p className="text-sm font-medium">{paintingPrice.hourly_rate.id}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Valeur</label>
                <p className="text-sm font-medium">{paintingPrice.hourly_rate.value}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Libellé</label>
                <p className="text-sm font-medium">{paintingPrice.hourly_rate.label}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <p className="text-sm">{paintingPrice.hourly_rate.description}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Type de peinture</h4>
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <label className="text-xs text-muted-foreground">ID</label>
                <p className="text-sm font-medium">{paintingPrice.paint_type.id}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Code</label>
                <p className="text-sm font-medium">{paintingPrice.paint_type.code}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Libellé</label>
                <p className="text-sm font-medium">{paintingPrice.paint_type.label}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <p className="text-sm">{paintingPrice.paint_type.description}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Élément de peinture</h4>
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <label className="text-xs text-muted-foreground">ID</label>
                <p className="text-sm font-medium">{paintingPrice.number_paint_element.id}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Valeur</label>
                <p className="text-sm font-medium">{paintingPrice.number_paint_element.value}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Libellé</label>
                <p className="text-sm font-medium">{paintingPrice.number_paint_element.label}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <p className="text-sm">{paintingPrice.number_paint_element.description}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p className="text-sm">
                {format(new Date(paintingPrice.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </label>
              <p className="text-sm">
                {format(new Date(paintingPrice.updated_at), 'dd/MM/yyyy HH:mm', {
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