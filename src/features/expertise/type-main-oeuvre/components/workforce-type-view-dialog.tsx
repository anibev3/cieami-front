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
import { WorkforceType } from '@/types/workforce-types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface WorkforceTypeViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workforceType: WorkforceType | null
}

export function WorkforceTypeViewDialog({
  open,
  onOpenChange,
  workforceType,
}: WorkforceTypeViewDialogProps) {
  if (!workforceType) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du type main d'oeuvre</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le type sélectionné.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-sm">{workforceType.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="mt-1">
                <Badge variant={workforceType.status.code === 'active' ? 'default' : 'secondary'}>
                  {workforceType.status.label}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-muted-foreground">Code</label>
            <p className="text-sm font-medium">{workforceType.code}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Libellé</label>
            <p className="text-sm font-medium">{workforceType.label}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm">{workforceType.description}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Statut</h4>
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <label className="text-xs text-muted-foreground">ID</label>
                <p className="text-sm font-medium">{workforceType.status.id}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Code</label>
                <p className="text-sm font-medium">{workforceType.status.code}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Libellé</label>
                <p className="text-sm font-medium">{workforceType.status.label}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <p className="text-sm">{workforceType.status.description}</p>
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
                {format(new Date(workforceType.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dernière modification
              </label>
              <p className="text-sm">
                {format(new Date(workforceType.updated_at), 'dd/MM/yyyy HH:mm', {
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