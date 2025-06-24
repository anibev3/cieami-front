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
import { HourlyRate } from '@/types/hourly-rates'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface HourlyRateViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hourlyRate: HourlyRate | null
}

export function HourlyRateViewDialog({
  open,
  onOpenChange,
  hourlyRate,
}: HourlyRateViewDialogProps) {
  if (!hourlyRate) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de l'horaire</DialogTitle>
          <DialogDescription>
            Informations détaillées sur l'horaire sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{hourlyRate.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                {hourlyRate.deleted_at ? (
                  <Badge variant="destructive">Supprimé</Badge>
                ) : (
                  <Badge variant="default">Actif</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Libellé</label>
            <p className="text-sm font-medium">{hourlyRate.label}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm">{hourlyRate.description}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Valeur</label>
            <p className="text-sm font-medium">{hourlyRate.value}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date de création
              </label>
              <p className="text-sm">
                {format(new Date(hourlyRate.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </label>
              <p className="text-sm">
                {format(new Date(hourlyRate.updated_at), 'dd/MM/yyyy HH:mm', {
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