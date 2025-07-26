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
import { Bodywork } from '@/types/bodyworks'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BodyworkViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bodywork: Bodywork | null
}

export function BodyworkViewDialog({
  open,
  onOpenChange,
  bodywork,
}: BodyworkViewDialogProps) {
  if (!bodywork) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de la carrosserie</DialogTitle>
          <DialogDescription>
            Informations détaillées sur la carrosserie sélectionnée.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{bodywork.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                <Badge variant={bodywork.status.code === 'active' ? 'default' : 'secondary'}>
                  {bodywork.status.label}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Code</label>
            <p className="text-sm font-medium">{bodywork?.code}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Libellé</label>
            <p className="text-sm font-medium">{bodywork?.label}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm">{bodywork?.description}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Statut</h4>
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <label className="text-xs text-muted-foreground">ID</label>
                <p className="text-sm font-medium">{bodywork.status.id}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Code</label>
                <p className="text-sm font-medium">{bodywork.status.code}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Libellé</label>
                <p className="text-sm font-medium">{bodywork.status.label}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <p className="text-sm">{bodywork.status.description}</p>
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
                {format(new Date(bodywork.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </label>
              <p className="text-sm">
                {format(new Date(bodywork.updated_at), 'dd/MM/yyyy HH:mm', {
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