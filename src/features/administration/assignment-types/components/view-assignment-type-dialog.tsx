import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AssignmentType } from '@/types/assignment-types'
import { formatDate } from '@/utils/format-date'
import { Badge } from '@/components/ui/badge'

interface ViewAssignmentTypeDialogProps {
  assignmentType: AssignmentType | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewAssignmentTypeDialog({ assignmentType, open, onOpenChange }: ViewAssignmentTypeDialogProps) {
  if (!assignmentType) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du type d'affectation</DialogTitle>
          <DialogDescription>
            Informations complètes sur le type d'affectation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations principales</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Code
                </label>
                <p className="text-sm font-medium">{assignmentType.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Libellé
                </label>
                <p className="text-sm">{assignmentType.label}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm">{assignmentType.description}</p>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statut</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Statut
                </label>
                <div className="mt-1">
                  <Badge variant={assignmentType.status.code === 'active' ? 'default' : 'secondary'}>
                    {assignmentType.status.label}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description du statut
                </label>
                <p className="text-sm">{assignmentType.status.description}</p>
              </div>
            </div>
          </div>

          {/* Informations système */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations système</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Créé le
                </label>
                <p className="text-sm">{formatDate(assignmentType.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Modifié le
                </label>
                <p className="text-sm">{formatDate(assignmentType.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 