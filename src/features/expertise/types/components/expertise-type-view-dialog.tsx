import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useExpertiseTypesStore } from '@/stores/expertise-types'

interface ExpertiseTypeViewDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function ExpertiseTypeViewDialog({ id, onOpenChange }: ExpertiseTypeViewDialogProps) {
  const { expertiseTypes } = useExpertiseTypesStore()
  const expertiseType = expertiseTypes.find((et) => et.id === id)

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail du type d'expertise</DialogTitle>
        </DialogHeader>
        {expertiseType ? (
          <div className="space-y-2">
            <div><strong>Code:</strong> {expertiseType.code}</div>
            <div><strong>Libellé:</strong> {expertiseType.label}</div>
            <div><strong>Description:</strong> {expertiseType.description}</div>
            <div><strong>Statut:</strong> {expertiseType.status?.label}</div>
            <div><strong>Créé le:</strong> {new Date(expertiseType.created_at).toLocaleString()}</div>
            <div><strong>Modifié le:</strong> {new Date(expertiseType.updated_at).toLocaleString()}</div>
          </div>
        ) : (
          <div>Type d'expertise introuvable.</div>
        )}
      </DialogContent>
    </Dialog>
  )
} 