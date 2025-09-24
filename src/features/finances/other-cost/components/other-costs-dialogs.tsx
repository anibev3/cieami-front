import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, Calendar, AlertTriangle, Tag } from 'lucide-react'
import { useOtherCostsStore } from '@/stores/otherCostsStore'
import { useOtherCostTypesStore } from '@/stores/otherCostTypesStore'
import { OtherCost, CreateOtherCostData, UpdateOtherCostData } from '@/types/administration'
import { formatCurrency } from '@/utils/format-currency'

interface OtherCostsDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedOtherCost: OtherCost | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function OtherCostsDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedOtherCost,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: OtherCostsDialogsProps) {
  const { createOtherCost, updateOtherCost, deleteOtherCost } = useOtherCostsStore()
  const { otherCostTypes, fetchOtherCostTypes } = useOtherCostTypesStore()

  const [createForm, setCreateForm] = useState<CreateOtherCostData>({
    other_cost_type_id: 0,
    amount_excluding_tax: 0,
    amount_tax: 0,
    amount: 0,
  })
  const [editForm, setEditForm] = useState<UpdateOtherCostData>({})

  useEffect(() => {
    if (isCreateOpen) {
      setCreateForm({
        other_cost_type_id: 0,
        amount_excluding_tax: 0,
        amount_tax: 0,
        amount: 0,
      })
      fetchOtherCostTypes()
    }
  }, [isCreateOpen, fetchOtherCostTypes])

  useEffect(() => {
    if (isEditOpen && selectedOtherCost) {
      setEditForm({
        other_cost_type_id: selectedOtherCost.other_cost_type.id,
        amount_excluding_tax: parseFloat(selectedOtherCost.amount_excluding_tax),
        amount_tax: parseFloat(selectedOtherCost.amount_tax),
        amount: parseFloat(selectedOtherCost.amount),
      })
      fetchOtherCostTypes()
    }
  }, [isEditOpen, selectedOtherCost, fetchOtherCostTypes])

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createOtherCost(createForm)
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOtherCost) return
    try {
      await updateOtherCost(selectedOtherCost.id, editForm)
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedOtherCost) return
    try {
      await deleteOtherCost(selectedOtherCost.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const calculateTotal = (amountExcludingTax: number, amountTax: number) => {
    return amountExcludingTax + amountTax
  }

  const handleAmountExcludingTaxChange = (value: string) => {
    const amount = parseFloat(value) || 0
    const tax = parseFloat(createForm.amount_tax?.toString() || '0')
    setCreateForm({
      ...createForm,
      amount_excluding_tax: amount,
      amount: calculateTotal(amount, tax)
    })
  }

  const handleAmountTaxChange = (value: string) => {
    const tax = parseFloat(value) || 0
    const amountExcludingTax = parseFloat(createForm.amount_excluding_tax?.toString() || '0')
    setCreateForm({
      ...createForm,
      amount_tax: tax,
      amount: calculateTotal(amountExcludingTax, tax)
    })
  }

  const handleEditAmountExcludingTaxChange = (value: string) => {
    const amount = parseFloat(value) || 0
    const tax = parseFloat(editForm.amount_tax?.toString() || '0')
    setEditForm({
      ...editForm,
      amount_excluding_tax: amount,
      amount: calculateTotal(amount, tax)
    })
  }

  const handleEditAmountTaxChange = (value: string) => {
    const tax = parseFloat(value) || 0
    const amountExcludingTax = parseFloat(editForm.amount_excluding_tax?.toString() || '0')
    setEditForm({
      ...editForm,
      amount_tax: tax,
      amount: calculateTotal(amountExcludingTax, tax)
    })
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau coût</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau coût.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="other_cost_type_id">Type de coût *</Label>
              <Select
                value={createForm.other_cost_type_id.toString()}
                onValueChange={(value) => setCreateForm({ ...createForm, other_cost_type_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de coût" />
                </SelectTrigger>
                <SelectContent>
                  {otherCostTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount_excluding_tax">Montant HT *</Label>
                <Input
                  id="amount_excluding_tax"
                  type="number"
                  step="0.01"
                  value={createForm.amount_excluding_tax}
                  onChange={(e) => handleAmountExcludingTaxChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount_tax">TVA</Label>
                <Input
                  id="amount_tax"
                  type="number"
                  step="0.01"
                  value={createForm.amount_tax}
                  onChange={(e) => handleAmountTaxChange(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant TTC</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={createForm.amount}
                disabled
                className="bg-muted"
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
            <DialogTitle>Modifier le coût</DialogTitle>
            <DialogDescription>
              Modifiez les informations du coût.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_other_cost_type_id">Type de coût</Label>
              <Select
                value={editForm.other_cost_type_id?.toString() || ''}
                onValueChange={(value) => setEditForm({ ...editForm, other_cost_type_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de coût" />
                </SelectTrigger>
                <SelectContent>
                  {otherCostTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_amount_excluding_tax">Montant HT</Label>
                <Input
                  id="edit_amount_excluding_tax"
                  type="number"
                  step="0.01"
                  value={editForm.amount_excluding_tax || ''}
                  onChange={(e) => handleEditAmountExcludingTaxChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_amount_tax">TVA</Label>
                <Input
                  id="edit_amount_tax"
                  type="number"
                  step="0.01"
                  value={editForm.amount_tax || ''}
                  onChange={(e) => handleEditAmountTaxChange(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_amount">Montant TTC</Label>
              <Input
                id="edit_amount"
                type="number"
                step="0.01"
                value={editForm.amount || ''}
                disabled
                className="bg-muted"
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
            <DialogTitle>Détails du coût</DialogTitle>
            <DialogDescription>
              Informations complètes sur le coût sélectionné.
            </DialogDescription>
          </DialogHeader>
          {selectedOtherCost && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Type de coût</Label>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedOtherCost.other_cost_type_label}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Montant HT</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatCurrency(parseFloat(selectedOtherCost.amount_excluding_tax))}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">TVA</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatCurrency(parseFloat(selectedOtherCost.amount_tax))}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Montant TTC</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-semibold">{formatCurrency(parseFloat(selectedOtherCost.amount))}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(selectedOtherCost.created_at).toLocaleDateString('fr-FR')}</span>
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
            <DialogTitle>Supprimer le coût</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce coût ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedOtherCost && (
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div className="text-sm">
                <strong>{selectedOtherCost.other_cost_type_label}</strong> - {formatCurrency(parseFloat(selectedOtherCost.amount))}
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
