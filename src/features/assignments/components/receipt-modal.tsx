import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Receipt, 
  Plus, 
  Trash2, 
  DollarSign,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Receipt {
  id?: number
  amount: number
  receipt_type_id: number
  receipt_type_label?: string
  comment?: string
  date?: string
}

interface ReceiptType {
  id: number
  label: string
  code: string
}

interface ReceiptModalProps {
  isOpen: boolean
  assignmentId: number
  assignmentAmount: number
  onSave: (receipts: Receipt[]) => void
  onClose: () => void
}

export function ReceiptModal({
  isOpen,
  assignmentId,
  assignmentAmount,
  onSave,
  onClose
}: ReceiptModalProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [receiptTypes, setReceiptTypes] = useState<ReceiptType[]>([
    { id: 1, label: 'Acompte', code: 'ACOMPTE' },
    { id: 2, label: 'Paiement partiel', code: 'PARTIEL' },
    { id: 3, label: 'Paiement final', code: 'FINAL' }
  ])

  const addReceipt = () => {
    const newReceipt: Receipt = {
      amount: 0,
      receipt_type_id: 1,
      comment: '',
      date: new Date().toISOString().split('T')[0]
    }
    setReceipts([...receipts, newReceipt])
  }

  const removeReceipt = (index: number) => {
    setReceipts(receipts.filter((_, i) => i !== index))
  }

  const updateReceipt = (index: number, field: keyof Receipt, value: any) => {
    const updatedReceipts = [...receipts]
    updatedReceipts[index] = { ...updatedReceipts[index], [field]: value }
    setReceipts(updatedReceipts)
  }

  const totalReceipts = receipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0)
  const remainingAmount = assignmentAmount - totalReceipts

  const handleSave = () => {
    if (receipts.length === 0) {
      toast.error('Ajoutez au moins une quittance')
      return
    }

    if (totalReceipts > assignmentAmount) {
      toast.error('Le montant total des quittances ne peut pas dépasser le montant du dossier')
      return
    }

    onSave(receipts)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Gérer les quittances
          </DialogTitle>
          <DialogDescription>
            Ajoutez des quittances pour le dossier {assignmentId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Résumé du dossier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du dossier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Montant du dossier</Label>
                  <p className="text-2xl font-bold text-blue-600">
                    {assignmentAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Montant restant</Label>
                  <p className={`text-2xl font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remainingAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des quittances */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Quittances</h3>
              <Button variant="outline" size="sm" onClick={addReceipt}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une quittance
              </Button>
            </div>

            {receipts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune quittance ajoutée</p>
                  <Button variant="outline" className="mt-2" onClick={addReceipt}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter la première quittance
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {receipts.map((receipt, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Type de quittance</Label>
                          <select
                            className="w-full mt-1 p-2 border rounded-md"
                            value={receipt.receipt_type_id}
                            onChange={(e) => updateReceipt(index, 'receipt_type_id', Number(e.target.value))}
                          >
                            {receiptTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-sm">Montant</Label>
                          <Input
                            type="number"
                            value={receipt.amount}
                            onChange={(e) => updateReceipt(index, 'amount', Number(e.target.value))}
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <Label className="text-sm">Date</Label>
                          <Input
                            type="date"
                            value={receipt.date}
                            onChange={(e) => updateReceipt(index, 'date', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Commentaire</Label>
                          <Input
                            value={receipt.comment || ''}
                            onChange={(e) => updateReceipt(index, 'comment', e.target.value)}
                            placeholder="Commentaire optionnel"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeReceipt(index)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Résumé des quittances */}
          {receipts.length > 0 && (
            <Card className="bg-muted">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total des quittances</p>
                    <p className="text-xl font-bold">{totalReceipts.toLocaleString('fr-FR')} €</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Montant restant</p>
                    <p className={`text-xl font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remainingAmount.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={receipts.length === 0}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Sauvegarder les quittances
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 