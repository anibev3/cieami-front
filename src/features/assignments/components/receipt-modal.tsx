import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Receipt, 
  Plus, 
  Trash2, 
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { receiptService } from '@/services/receiptService'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface ReceiptType {
  id: number
  label: string
  code: string
}

interface Receipt {
  id?: number
  amount: number
  receipt_type_id: number
  receipt_type_label?: string
  comment?: string
  date?: string
  isNew?: boolean
}

interface AssignmentDetail {
  id: number
  reference: string
  total_amount: string
  receipts: Array<{
    id: number
    amount: string
    receipt_type: {
      id: number
      label: string
    }
    created_at: string
  }>
}

interface ReceiptModalProps {
  isOpen: boolean
  assignmentId: number
  onSave: (receipts: Receipt[]) => void
  onClose: () => void
}

export function ReceiptModal({
  isOpen,
  assignmentId,
  onSave,
  onClose
}: ReceiptModalProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [receiptTypes, setReceiptTypes] = useState<ReceiptType[]>([])
  const [assignmentDetail, setAssignmentDetail] = useState<AssignmentDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Charger les données au montage du modal
  useEffect(() => {
    if (isOpen && assignmentId) {
      loadData()
    }
  }, [isOpen, assignmentId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Charger les types de quittances et les détails de l'assignation en parallèle
      const [typesResponse, assignmentResponse] = await Promise.all([
        receiptService.getReceiptTypes(),
        axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
      ])

      // Vérifier que typesResponse est un tableau et extraire les données
      let receiptTypesData: ReceiptType[] = []
      if (Array.isArray(typesResponse)) {
        receiptTypesData = typesResponse
      } else if (typesResponse && typeof typesResponse === 'object') {
        const response = typesResponse as any
        if (Array.isArray(response.data)) {
          receiptTypesData = response.data
        } else if (response.data && Array.isArray(response.data.data)) {
          receiptTypesData = response.data.data
        }
      }
      
      // Fallback si aucun type de quittance n'est trouvé
      if (receiptTypesData.length === 0) {
        receiptTypesData = [
          { id: 1, label: 'Honoraires', code: 'work_fee' },
          { id: 2, label: 'Frais de dossier', code: 'document_fee' },
          { id: 3, label: 'Acompte', code: 'advance' }
        ]
      }
      
      setReceiptTypes(receiptTypesData)
      setAssignmentDetail(assignmentResponse.data.data)
      
      // Convertir les quittances existantes au format du modal
      const existingReceipts = (assignmentResponse.data.data.receipts || []).map((receipt: { id: number; amount: string; receipt_type: { id: number; label: string }; created_at: string }) => ({
        id: receipt.id,
        amount: parseFloat(receipt.amount || '0'),
        receipt_type_id: receipt.receipt_type?.id || 1,
        receipt_type_label: receipt.receipt_type?.label || '',
        comment: '',
        date: new Date(receipt.created_at).toISOString().split('T')[0],
        isNew: false
      }))

      setReceipts(existingReceipts)
    } catch (_error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const addReceipt = () => {
    const newReceipt: Receipt = {
      amount: 0,
      receipt_type_id: Array.isArray(receiptTypes) && receiptTypes.length > 0 ? receiptTypes[0].id : 1,
      comment: '',
      date: new Date().toISOString().split('T')[0],
      isNew: true
    }
    setReceipts([...receipts, newReceipt])
  }

  const removeReceipt = async (index: number) => {
    const receipt = receipts[index]
    
    if (receipt.id && !receipt.isNew) {
      // Supprimer de l'API
      try {
        await receiptService.deleteReceipt(receipt.id)
        toast.success('Quittance supprimée avec succès')
      } catch (_error) {
        toast.error('Erreur lors de la suppression de la quittance')
        return
      }
    }
    
    // Supprimer de l'état local
    setReceipts(receipts.filter((_, i) => i !== index))
  }

  const updateReceipt = (index: number, field: keyof Receipt, value: string | number) => {
    const updatedReceipts = [...receipts]
    updatedReceipts[index] = { ...updatedReceipts[index], [field]: value }
    setReceipts(updatedReceipts)
  }

  const assignmentAmount = assignmentDetail ? parseFloat(assignmentDetail.total_amount) : 0
  const totalReceipts = receipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0)
  const remainingAmount = assignmentAmount - totalReceipts

  const handleSave = async () => {
    if (receipts.length === 0) {
      toast.error('Ajoutez au moins une quittance')
      return
    }

    if (totalReceipts > assignmentAmount) {
      toast.error('Le montant total des quittances ne peut pas dépasser le montant du dossier')
      return
    }

    setSaving(true)
    try {
      const newReceipts = receipts.filter(r => r.isNew)
      const existingReceipts = receipts.filter(r => !r.isNew && r.id)

      // Créer les nouvelles quittances
      if (newReceipts.length > 0) {
        const receiptsToCreate = newReceipts.map(r => ({
          receipt_type_id: r.receipt_type_id,
          amount: r.amount
        }))
        await receiptService.createMultipleReceipts(assignmentId, receiptsToCreate)
      }

      // Mettre à jour les quittances existantes
      for (const receipt of existingReceipts) {
        if (receipt.id) {
          await receiptService.updateReceipt(receipt.id, {
            receipt_type_id: receipt.receipt_type_id,
            amount: receipt.amount
          })
        }
      }

      toast.success('Quittances sauvegardées avec succès')
      onSave(receipts)
      
      // Recharger les données pour avoir les IDs des nouvelles quittances
      await loadData()
    } catch (_error) {
      toast.error('Erreur lors de la sauvegarde des quittances')
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = () => {
    loadData()
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
            Gérez les quittances pour le dossier {assignmentDetail?.reference || assignmentId}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Chargement...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Résumé du dossier */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Informations du dossier</span>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Référence</Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {assignmentDetail?.reference}
                    </p>
                  </div>
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
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={receipt.isNew ? "default" : "secondary"}>
                            {receipt.isNew ? "Nouvelle" : "Existante"}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeReceipt(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">Type de quittance</Label>
                            <select
                              className="w-full mt-1 p-2 border rounded-md"
                              value={receipt.receipt_type_id}
                              onChange={(e) => updateReceipt(index, 'receipt_type_id', Number(e.target.value))}
                            >
                              {Array.isArray(receiptTypes) && receiptTypes.map((type) => (
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
              <Button onClick={handleSave} disabled={receipts.length === 0 || saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sauvegarder les quittances
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 