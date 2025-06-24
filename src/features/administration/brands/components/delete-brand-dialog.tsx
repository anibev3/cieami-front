import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Brand } from '@/types/brands'

interface DeleteBrandDialogProps {
  brand: Brand | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteBrandDialog({ brand, open, onOpenChange, onConfirm }: DeleteBrandDialogProps) {
  if (!brand) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la marque</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Êtes-vous sûr de vouloir supprimer la marque <span className="font-semibold">{brand.label}</span> ? Cette action est irréversible.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 