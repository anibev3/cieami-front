import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, Calendar, AlertTriangle, Tag, Receipt as ReceiptIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useReceiptsStore } from '@/stores/receiptsStore'
import { useReceiptTypesStore } from '@/stores/receiptTypesStore'
import { Receipt, CreateReceiptData, UpdateReceiptData } from '@/types/administration'
import { formatCurrency } from '@/utils/format-currency'
import { AssignmentSelect } from '@/features/widgets/assignment-select'

interface ReceiptsDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedReceipt: Receipt | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function ReceiptsDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedReceipt,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: ReceiptsDialogsProps) {
  const { createReceipt, updateReceipt, deleteReceipt } = useReceiptsStore()
  const { receiptTypes, fetchReceiptTypes } = useReceiptTypesStore()

  const [createForm, setCreateForm] = useState<CreateReceiptData>({
    assignment_id: 0,
    receipt_type_id: 0,
    amount: 0,
  })
  const [editForm, setEditForm] = useState<UpdateReceiptData>({})

  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({
        assignment_id: 0,
        receipt_type_id: 0,
        amount: 0,
      })
      fetchReceiptTypes()
    }
  }, [isCreateOpen, fetchReceiptTypes])

  useEffect(() => {
    if (isEditOpen && selectedReceipt) {
      setEditForm({
        assignment_id: 0, // On ne peut pas changer l'assignation lors de l'édition
        receipt_type_id: selectedReceipt.receipt_type.id,
        amount: parseFloat(selectedReceipt.amount),
      })
      fetchReceiptTypes()
    }
  }, [isEditOpen, selectedReceipt, fetchReceiptTypes])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!createForm.assignment_id) {
      toast.error('Veuillez sélectionner un dossier')
      return
    }
    
    if (!createForm.receipt_type_id) {
      toast.error('Veuillez sélectionner un type de quittance')
      return
    }
    
    if (!createForm.amount || createForm.amount <= 0) {
      toast.error('Veuillez saisir un montant valide')
      return
    }
    
    try {
      await createReceipt(createForm)
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReceipt) return
    try {
      await updateReceipt(selectedReceipt.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedReceipt) return
    try {
      await deleteReceipt(selectedReceipt.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouvelle quittance</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer une nouvelle quittance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignment_id">Dossier *</Label>
              <AssignmentSelect
                value={createForm.assignment_id.toString()}
                onValueChange={(value) => setCreateForm({ ...createForm, assignment_id: parseInt(value) })}
                placeholder="Sélectionner un dossier"
                showReceipts={true}
                showDetails={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt_type_id">Type de quittance *</Label>
              <Select
                value={createForm.receipt_type_id.toString()}
                onValueChange={(value) => setCreateForm({ ...createForm, receipt_type_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de quittance" />
                </SelectTrigger>
                <SelectContent>
                  {receiptTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={createForm.amount}
                onChange={(e) => setCreateForm({ ...createForm, amount: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseCreate}>
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la quittance</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la quittance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_receipt_type_id">Type de quittance</Label>
              <Select
                value={editForm.receipt_type_id?.toString() || ''}
                onValueChange={(value) => setEditForm({ ...editForm, receipt_type_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de quittance" />
                </SelectTrigger>
                <SelectContent>
                  {receiptTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_amount">Montant (FCFA)</Label>
              <Input
                id="edit_amount"
                type="number"
                step="0.01"
                value={editForm.amount || ''}
                onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCloseEdit}>
                Annuler
              </Button>
              <Button type="submit">Modifier</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la quittance</DialogTitle>
            <DialogDescription>
              Informations complètes sur la quittance sélectionnée.
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                  <div className="flex items-center space-x-2">
                    <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{selectedReceipt.id}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Type de quittance</Label>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedReceipt.receipt_type.label}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Montant HT</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatCurrency(parseFloat(selectedReceipt.amount_excluding_tax))}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">TVA</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatCurrency(parseFloat(selectedReceipt.amount_tax))}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Montant TTC</Label>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono font-semibold">{formatCurrency(parseFloat(selectedReceipt.amount))}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                <div className="text-sm">{selectedReceipt.status.label}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedReceipt.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={onCloseView}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer la quittance</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette quittance ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong>{selectedReceipt.receipt_type.label}</strong> - {formatCurrency(parseFloat(selectedReceipt.amount))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
