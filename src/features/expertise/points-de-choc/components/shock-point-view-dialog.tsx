import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useShockPointsStore } from '@/stores/shock-points'

interface ShockPointViewDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function ShockPointViewDialog({ id, onOpenChange }: ShockPointViewDialogProps) {
  const { shockPoints } = useShockPointsStore()
  const shockPoint = shockPoints.find((sp) => sp.id === id)

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail du point de choc</DialogTitle>
        </DialogHeader>
        {shockPoint ? (
          <div className="space-y-2">
            <div><strong>Code:</strong> {shockPoint.code}</div>
            <div><strong>Libellé:</strong> {shockPoint.label}</div>
            <div><strong>Description:</strong> {shockPoint.description}</div>
            <div><strong>Statut:</strong> {shockPoint.status?.label}</div>
            <div><strong>Créé le:</strong> {new Date(shockPoint.created_at).toLocaleString()}</div>
            <div><strong>Modifié le:</strong> {new Date(shockPoint.updated_at).toLocaleString()}</div>
          </div>
        ) : (
          <div>Point de choc introuvable.</div>
        )}
      </DialogContent>
    </Dialog>
  )
} 