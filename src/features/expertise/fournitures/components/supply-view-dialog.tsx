import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSuppliesStore } from '@/stores/supplies'

interface SupplyViewDialogProps {
  id?: number | null
  onOpenChange?: () => void
}

export function SupplyViewDialog({ id, onOpenChange }: SupplyViewDialogProps) {
  const { supplies } = useSuppliesStore()
  const supply = supplies.find((s) => s.id === id)

  return (
    <Dialog open={!!id} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détail de la fourniture</DialogTitle>
        </DialogHeader>
        {supply ? (
          <div className="space-y-2">
            <div><strong>Libellé:</strong> {supply.label}</div>
            <div><strong>Description:</strong> {supply.description}</div>
            <div><strong>Statut:</strong> {supply.status?.label}</div>
            <div><strong>Créé le:</strong> {new Date(supply.created_at).toLocaleString()}</div>
            <div><strong>Modifié le:</strong> {new Date(supply.updated_at).toLocaleString()}</div>
          </div>
        ) : (
          <div>Fourniture introuvable.</div>
        )}
      </DialogContent>
    </Dialog>
  )
} 