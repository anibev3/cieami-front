import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RejectAssignmentRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => Promise<void>
  requestReference?: string
  loading?: boolean
}

export function RejectAssignmentRequestDialog({
  open,
  onOpenChange,
  onConfirm,
  requestReference,
  loading = false,
}: RejectAssignmentRequestDialogProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    // Validation
    if (!reason.trim()) {
      setError('La raison de rejet est obligatoire')
      return
    }

    setError(null)
    try {
      await onConfirm(reason.trim())
      // Réinitialiser le formulaire après succès
      setReason('')
      setError(null)
    } catch (err) {
      // L'erreur est gérée par le parent
      console.error('Erreur lors du rejet:', err)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Réinitialiser le formulaire quand on ferme
      setReason('')
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeter la demande d'expertise</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir rejeter la demande d'expertise{' '}
            {requestReference && <strong>{requestReference}</strong>} ? 
            Cette action changera le statut de la demande. Veuillez indiquer la raison du rejet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">
              Raison du rejet <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Saisissez la raison du rejet de la demande d'expertise..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError(null)
              }}
              rows={4}
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Rejet en cours...' : 'Rejeter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

