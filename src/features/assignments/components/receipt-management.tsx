import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  Trash2, 
  Receipt, 
  Check,
  Loader2,
  Edit,
  Eye,
  Calculator,
  Save
} from 'lucide-react'
import { receiptService } from '@/services/receiptService'
import { receiptTypeService } from '@/services/receiptTypeService'
import { ReceiptTypeSelect } from '@/features/widgets/receipt-type-select'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface ReceiptType {
  id: string
  label: string
  code: string
}

interface Receipt {
  id: string
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  receipt_type: {
    id: string
    code: string
    label: string
  }
}

interface ReceiptFormData {
  receipt_type_id: string
  amount: number
}

interface CalculatedReceipt {
  assignment_id: string
  receipt_type_id: string
  amount_excluding_tax: number
  amount_tax: number
  amount: number
}

interface CalculationResult {
  receipts: CalculatedReceipt[]
  receipt_amount_excluding_tax: number
  receipt_amount_tax: number
  receipt_amount: number
}

interface ReceiptManagementProps {
  assignmentId: string
  receipts: Receipt[]
  onRefresh: () => void
}

export function ReceiptManagement({ assignmentId, receipts, onRefresh }: ReceiptManagementProps) {
  const [receiptTypes, setReceiptTypes] = useState<ReceiptType[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null)
  const [formData, setFormData] = useState<ReceiptFormData>({
    receipt_type_id: '',
    amount: 0
  })
  const [receiptsToCreate, setReceiptsToCreate] = useState<ReceiptFormData[]>([])
  const [_loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Nouveaux états pour le calcul
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showCalculationResults, setShowCalculationResults] = useState(false)
  


  // Charger les types de quittances
  useEffect(() => {
    loadReceiptTypes()
  }, [])

  const loadReceiptTypes = async () => {
    try {
      setLoading(true)
      const response = await receiptTypeService.getAll()
      setReceiptTypes(
        response.data.map((rt) => ({
          id: String(rt.id),
          label: rt.label,
          code: rt.code,
        }))
      )
    } catch (_error) {
      toast.error('Erreur lors du chargement des types de quittances')
    } finally {
      setLoading(false)
    }
  }



  // Ouvrir le modal de création
  const openCreateModal = () => {
    setFormData({ receipt_type_id: '', amount: 0 })
    setReceiptsToCreate([])
    setCalculationResult(null)
    setShowCalculationResults(false)
    setIsCreateModalOpen(true)
  }

  // Fonction pour calculer les quittances
  const calculateReceipts = async () => {
    if (receiptsToCreate.length === 0) {
      toast.error('Veuillez ajouter au moins une quittance avant de calculer')
      return
    }

    try {
      setIsCalculating(true)
      
      // Préparer le payload pour le calcul
      const payload = {
        assignment_id: String(assignmentId),
        receipts: receiptsToCreate.map(receipt => ({
          amount: receipt.amount,
          receipt_type_id: receipt.receipt_type_id
        }))
      }

      const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.RECEIPTS}/calculate`, payload)
      
      if (response.data.status === 201) {
        setCalculationResult(response.data.data)
        setShowCalculationResults(true)
        toast.success('Calcul effectué avec succès')
      } else {
        toast.error('Erreur lors du calcul')
      }
    } catch (_error) {
      toast.error('Erreur lors du calcul des quittances')
    } finally {
      setIsCalculating(false)
    }
  }

  // Fonction pour créer les quittances après calcul
  const createReceiptsAfterCalculation = async () => {
    if (!calculationResult) return

    try {
      setSaving(true)
      
      // Créer les quittances avec les montants calculés
      const receiptsToCreateWithCalculatedAmounts = calculationResult.receipts.map(calculatedReceipt => ({
        receipt_type_id: calculatedReceipt.receipt_type_id,
        amount: calculatedReceipt.amount_excluding_tax
      }))

      await receiptService.createMultipleReceipts(Number(assignmentId), receiptsToCreateWithCalculatedAmounts)
      toast.success(`${calculationResult.receipts.length} quittance(s) créée(s) avec succès`)
      
      // Réinitialiser les états
      setIsCreateModalOpen(false)
      setReceiptsToCreate([])
      setCalculationResult(null)
      setShowCalculationResults(false)
      
      onRefresh()
    } catch (_error) {
      toast.error('Erreur lors de la création des quittances')
    } finally {
      setSaving(false)
    }
  }

  // Vérifier si le type de quittance est automatique (ID = 1)
  const isAutomaticReceiptType = (receiptTypeId: string) => {
    return receiptTypeId === 'rec_eLgoNjw3jE0MB'
  }

  // Ouvrir le modal de modification
  const openEditModal = (receipt: Receipt) => {
    // Empêcher la modification des quittances automatiques (receipt_type_id = 1)
    if (isAutomaticReceiptType(receipt.receipt_type.id)) {
      toast.error('Les quittances de type automatique ne peuvent pas être modifiées')
      return
    }

    setSelectedReceipt(receipt)
    setFormData({
      receipt_type_id: receipt.receipt_type.id,
      amount: Number(receipt.amount)
    })
    setIsEditModalOpen(true)
  }

  // Ouvrir le modal de visualisation
  const openViewModal = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setIsViewModalOpen(true)
  }

  // Ouvrir le modal de suppression
  const openDeleteModal = (receipt: Receipt) => {
    setReceiptToDelete(receipt)
    setIsDeleteModalOpen(true)
  }

  // Supprimer une quittance
  const deleteReceipt = async () => {
    if (!receiptToDelete) return

    try {
      setSaving(true)
      await receiptService.deleteReceipt(receiptToDelete.id)
      toast.success('Quittance supprimée avec succès')
      onRefresh()
      setIsDeleteModalOpen(false)
      setReceiptToDelete(null)
    } catch (_error) {
      toast.error('Erreur lors de la suppression de la quittance')
    } finally {
      setSaving(false)
    }
  }

  // Ajouter une quittance à la liste de création
  const addReceiptToCreate = () => {
    if (!formData.receipt_type_id) {
      toast.error('Veuillez sélectionner un type de quittance')
      return
    }

    // Pour les types automatiques (ID = 1), le montant est forcé à 0
    const receiptToAdd = {
      receipt_type_id: formData.receipt_type_id,
      amount: isAutomaticReceiptType(formData.receipt_type_id) ? 0 : formData.amount
    }

    // Vérifier si le type est déjà dans la liste
    const existingReceipt = receiptsToCreate.find(r => r.receipt_type_id === formData.receipt_type_id)
    if (existingReceipt) {
      toast.error('Ce type de quittance est déjà dans la liste')
      return
    }

    // Pour les types non-automatiques, vérifier le montant
    if (!isAutomaticReceiptType(formData.receipt_type_id) && !formData.amount) {
      toast.error('Veuillez saisir un montant pour ce type de quittance')
      return
    }
    
    setReceiptsToCreate([...receiptsToCreate, receiptToAdd])
    setFormData({ receipt_type_id: '', amount: 0 })
  }

  // Supprimer une quittance de la liste de création
  const removeReceiptFromCreate = (index: number) => {
    const newReceipts = receiptsToCreate.filter((_, i) => i !== index)
    setReceiptsToCreate(newReceipts)
  }

  // Sauvegarder (créer ou modifier)
  const handleSave = async () => {
    try {
      setSaving(true)
      
      if (selectedReceipt) {
        // Modification
        await receiptService.updateReceipt(selectedReceipt.id, {
          assignment_id: Number(assignmentId),
          receipt_type_id: formData.receipt_type_id,
          amount: formData.amount
        })
        toast.success('Quittance modifiée avec succès')
        setIsEditModalOpen(false)
        setSelectedReceipt(null)
      } else {
        // Création multiple
        if (receiptsToCreate.length === 0) {
          toast.error('Veuillez ajouter au moins une quittance')
          return
        }
        
        await receiptService.createMultipleReceipts(Number(assignmentId), receiptsToCreate)
        toast.success(`${receiptsToCreate.length} quittance(s) créée(s) avec succès`)
        setIsCreateModalOpen(false)
        setReceiptsToCreate([])
      }
      
      onRefresh()
    } catch (_error) {
      toast.error('Erreur lors de la sauvegarde de la quittance')
    } finally {
      setSaving(false)
    }
  }

  // Formater les montants
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)
  }

  // Calculer le total des quittances
  const totalReceipts = receipts.reduce((sum, receipt) => sum + Number(receipt.amount), 0)

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Quittances</h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {receipts.length} quittance(s)
          </Badge>
        </div>
        <Button onClick={openCreateModal} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une quittance
        </Button>
      </div>

      {/* Liste des quittances */}
      {receipts.length === 0 ? (
        <Card className="shadow-none">
          <CardContent className="p-8">
            <div className="text-center">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune quittance</h3>
              <p className="text-gray-500 mb-4">Aucune quittance n'a été ajoutée à ce dossier</p>
              <Button onClick={openCreateModal} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter la première quittance
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <Card key={receipt.id} className="shadow-none border-gray-200">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{receipt.receipt_type.label}</h4>
                      <Badge variant="outline" className="text-xs">
                        {receipt.receipt_type.code}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      ID: {receipt.id}
                    </div>
                  </div>
                  
                  <div className="text-right mr-4">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(receipt.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      HT: {formatCurrency(receipt.amount_excluding_tax)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewModal(receipt)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(receipt)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(receipt)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Récapitulatif */}
      {receipts.length > 0 && (
        <Card className="shadow-none bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Récapitulatif</h4>
                <p className="text-sm text-green-600">
                  {receipts.length} quittance(s) enregistrée(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total des quittances</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalReceipts)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de création */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              Ajouter des quittances
            </DialogTitle>
            <DialogDescription>
              Créez une ou plusieurs quittances pour ce dossier. Les quittances de type automatique seront calculées automatiquement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Formulaire d'ajout */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Nouvelle quittance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className='w-full'>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Type de quittance</Label>
                  <ReceiptTypeSelect
                    value={formData.receipt_type_id || null}
                    onValueChange={(value) => {
                      const newReceiptTypeId = value || ''
                      setFormData({ 
                        receipt_type_id: newReceiptTypeId,
                        amount: isAutomaticReceiptType(newReceiptTypeId) ? 0 : formData.amount
                      })
                    }}
                    placeholder="Sélectionner un type"
                    className={!formData.receipt_type_id ? 'border-red-300 bg-red-50' : ''}
                    showCreateOption={true}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Montant (FCFA)
                    {isAutomaticReceiptType(formData.receipt_type_id) && (
                      <span className="text-xs text-orange-600 ml-1">(Calculé automatiquement)</span>
                    )}
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    placeholder="0"
                    disabled={isAutomaticReceiptType(formData.receipt_type_id)}
                    className={`${isAutomaticReceiptType(formData.receipt_type_id) ? 'bg-gray-100 cursor-not-allowed' : ''} ${!formData.amount && !isAutomaticReceiptType(formData.receipt_type_id) ? 'border-red-300 bg-red-50' : ''}`}
                  />
                </div>
              </div>
              
              <Button 
                onClick={addReceiptToCreate}
                disabled={!formData.receipt_type_id || (!formData.amount && !isAutomaticReceiptType(formData.receipt_type_id))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter à la liste
              </Button>
            </div>

            {/* Liste des quittances à créer */}
            {receiptsToCreate.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    Quittances à créer
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {receiptsToCreate.length}
                    </Badge>
                  </h4>
                  
                  <Button 
                    onClick={calculateReceipts}
                    disabled={isCalculating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calcul en cours...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculer
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {receiptsToCreate.map((receipt, index) => {
                    const receiptType = receiptTypes.find(type => type && type.id === receipt.receipt_type_id)
                    return (
                      <Card key={index} className="border-blue-200 bg-blue-50 shadow-none w-1/2 flex justify-between">
                        <CardContent className="">
                          <div className=''>
                            <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h5 className="font-semibold text-blue-800">
                                  {receiptType?.label || 'Type inconnu'}
                                </h5>
                                <Badge variant="outline" className="text-xs">
                                  {receiptType?.code || 'N/A'}
                                </Badge>
                                {isAutomaticReceiptType(receipt.receipt_type_id) && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                    Calcul automatique
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-blue-600">
                                Montant: {formatCurrency(receipt.amount)}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReceiptFromCreate(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Résultats du calcul */}
            {showCalculationResults && calculationResult && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Résultats du calcul
                </h4>
                
                <Card className="border-green-200 bg-green-50 shadow-none">
                  <CardContent className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type de quittance</TableHead>
                          <TableHead>Montant HT</TableHead>
                          <TableHead>TVA</TableHead>
                          <TableHead>Montant TTC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculationResult.receipts.map((calculatedReceipt, index) => {
                          const receiptType = receiptTypes.find(type => type && type.id === calculatedReceipt.receipt_type_id)
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <span>{receiptType?.label || 'Type inconnu'}</span>
                                  {isAutomaticReceiptType(calculatedReceipt.receipt_type_id) && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                      Auto
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(calculatedReceipt.amount_excluding_tax)}</TableCell>
                              <TableCell>{formatCurrency(calculatedReceipt.amount_tax)}</TableCell>
                              <TableCell className="font-bold text-green-600">
                                {formatCurrency(calculatedReceipt.amount)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Total HT</p>
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(calculationResult.receipt_amount_excluding_tax)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total TVA</p>
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(calculationResult.receipt_amount_tax)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total TTC</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(calculationResult.receipt_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(false)
                setReceiptsToCreate([])
                setCalculationResult(null)
                setShowCalculationResults(false)
              }}
              disabled={saving}
            >
              Annuler
            </Button>
            
            {showCalculationResults && calculationResult ? (
              <Button 
                onClick={createReceiptsAfterCalculation}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Créer {calculationResult.receipts.length} quittance(s)
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleSave}
                disabled={saving || receiptsToCreate.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Créer {receiptsToCreate.length > 0 ? `(${receiptsToCreate.length})` : ''}
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Edit className="h-5 w-5 text-orange-600" />
              </div>
              Modifier la quittance
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de cette quittance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="w-full">
              <Label className="text-sm font-medium text-gray-700 mb-2">Type de quittance</Label>
              <ReceiptTypeSelect
                value={formData.receipt_type_id || null}
                onValueChange={(value) => setFormData({ ...formData, receipt_type_id: value || '' })}
                placeholder="Sélectionner un type"
                className={!formData.receipt_type_id ? 'border-red-300 bg-red-50' : ''}
                showCreateOption={false}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Montant (FCFA)</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="0"
                className={!formData.amount ? 'border-red-300 bg-red-50' : ''}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || !formData.receipt_type_id || !formData.amount}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de visualisation */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              Détails de la quittance
            </DialogTitle>
            <DialogDescription>
              Informations détaillées de cette quittance
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">ID</Label>
                  <p className="text-base font-semibold">{selectedReceipt.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                  <p className="text-base font-semibold">{selectedReceipt.receipt_type.label}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Code</Label>
                  <p className="text-base font-semibold">{selectedReceipt.receipt_type.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Montant TTC</Label>
                  <p className="text-base font-semibold text-green-600">{formatCurrency(selectedReceipt.amount)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Montant HT</Label>
                  <p className="text-base font-semibold">{formatCurrency(selectedReceipt.amount_excluding_tax)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">TVA</Label>
                  <p className="text-base font-semibold">{formatCurrency(selectedReceipt.amount_tax)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsViewModalOpen(false)}
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette quittance ?
            </DialogDescription>
          </DialogHeader>

          {receiptToDelete && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-red-600" />
                  <div>
                    <h4 className="font-semibold text-red-800">{receiptToDelete.receipt_type.label}</h4>
                    <p className="text-sm text-red-600">
                      Montant: {formatCurrency(receiptToDelete.amount)}
                    </p>
                    <p className="text-xs text-red-500">ID: {receiptToDelete.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteModalOpen(false)
                setReceiptToDelete(null)
              }}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button 
              onClick={deleteReceipt}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
} 