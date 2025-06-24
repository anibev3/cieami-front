import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Color } from '@/types/colors'

interface DeleteColorDialogProps {
  color: Color | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteColorDialog({ color, open, onOpenChange, onConfirm }: DeleteColorDialogProps) {
  if (!color) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la couleur</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Êtes-vous sûr de vouloir supprimer la couleur <span className="font-semibold">{color.label}</span> ? Cette action est irréversible.
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