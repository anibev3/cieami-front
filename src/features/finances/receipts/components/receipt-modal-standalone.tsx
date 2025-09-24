/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { 
  Receipt, 
  Plus, 
  Trash2, 
  CheckCircle,
  Loader2,
  RefreshCw,
  Calculator,
  Save
} from 'lucide-react'
import { toast } from 'sonner'
import { receiptService } from '@/services/receiptService'
import { receiptTypeService } from '@/services/receiptTypeService'
import { ReceiptTypeSelect } from '@/features/widgets/receipt-type-select'
import { AssignmentSelect } from '@/features/widgets/assignment-select'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { Receipt as AdminReceipt } from '@/types/administration'

interface ReceiptType {
  id: number
  label: string
  code: string
}

interface Receipt {
  id?: number
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  receipt_type: {
    id: number
    code: string
    label: string
  }
  created_at?: string
  isNew?: boolean
}

interface ReceiptFormData {
  receipt_type_id: number
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

interface AssignmentDetail {
  id: number
  reference: string
  total_amount: string
  receipts: Receipt[]
}

interface ReceiptModalStandaloneProps {
  isOpen: boolean
  onSave: (receipts: Receipt[]) => void
  onClose: () => void
  mode?: 'create' | 'edit'
  selectedReceipt?: AdminReceipt | null
}

export function ReceiptModalStandalone({
  isOpen,
  onSave,
  onClose,
  mode = 'create',
  selectedReceipt = null
}: ReceiptModalStandaloneProps) {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [receiptTypes, setReceiptTypes] = useState<ReceiptType[]>([])
  const [assignmentDetail, setAssignmentDetail] = useState<AssignmentDetail | null>(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Nouveaux états pour le calcul
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showCalculationResults, setShowCalculationResults] = useState(false)
  const [formData, setFormData] = useState<ReceiptFormData>({
    receipt_type_id: 0,
    amount: 0
  })
  
  // Fonction utilitaire pour extraire un message d'erreur de manière sécurisée
  const extractErrorMessage = (value: any): string => {
    if (typeof value === 'string') {
      return value
    }
    if (typeof value === 'number') {
      return value.toString()
    }
    if (typeof value === 'object' && value !== null) {
      // Si c'est un objet, essayer d'extraire un message lisible
      if (value.message) {
        return String(value.message)
      }
      if (value.detail) {
        return String(value.detail)
      }
      if (value.title) {
        return String(value.title)
      }
      // Si c'est un objet complexe, le convertir en JSON
      try {
        return JSON.stringify(value)
      } catch {
        return 'Erreur inconnue'
      }
    }
    return String(value)
  }

  // Fonction utilitaire pour gérer les erreurs de l'API
  const handleApiError = useCallback((error: any, defaultMessage: string) => {
    console.error(defaultMessage, error)
    
    // Gérer les erreurs spécifiques de l'API
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const apiError = error.response.data.errors[0]
      const errorMessage = extractErrorMessage(apiError.detail || apiError.title || defaultMessage)
      toast.error(errorMessage)
    } else if (error.response?.data?.message) {
      const errorMessage = extractErrorMessage(error.response.data.message)
      toast.error(errorMessage)
    } else if (error.message) {
      const errorMessage = extractErrorMessage(error.message)
      toast.error(errorMessage)
    } else {
      toast.error(defaultMessage)
    }
  }, [])

  // Fonction utilitaire pour gérer les réponses d'erreur directes de l'API
  const handleApiResponseError = (responseData: any, defaultMessage: string) => {
    console.error(defaultMessage, responseData)
    
    // Gérer les erreurs directes de l'API (quand l'API retourne directement {errors: [...]})
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      const apiError = responseData.errors[0]
      const errorMessage = extractErrorMessage(apiError.detail || apiError.title || defaultMessage)
      toast.error(errorMessage)
      return true // Indique qu'une erreur a été gérée
    }
    return false // Aucune erreur gérée
  }


  const loadReceiptTypes = async () => {
    try {
      const response = await receiptTypeService.getAll()
      setReceiptTypes(response.data)
    } catch (_error) {
      toast.error('Erreur lors du chargement des types de quittances')
    }
  }

  // Charger les détails de l'assignation quand un dossier est sélectionné
  const loadAssignmentDetails = useCallback(async (assignmentId: string) => {
    if (!assignmentId) return
    
    setLoading(true)
    try {
      const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
      setAssignmentDetail(response.data.data)
      
      // Convertir les quittances existantes au format du modal
      const existingReceipts = (response.data.data.receipts || []).map((receipt: Receipt) => ({
        ...receipt,
        isNew: false
      }))

      setReceipts(existingReceipts)
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du chargement des données du dossier')
      setAssignmentDetail(null)
      setReceipts([])
    } finally {
      setLoading(false)
    }
  }, [handleApiError])

  // Charger les types de quittances au montage du modal
  useEffect(() => {
    if (isOpen) {
      loadReceiptTypes()
      
      // Si on est en mode édition, initialiser avec la quittance sélectionnée
      if (mode === 'edit' && selectedReceipt) {
        // Pour l'édition, on simule une quittance existante
        const existingReceipt: Receipt = {
          ...selectedReceipt,
          isNew: false
        }
        setReceipts([existingReceipt])
        
        // Définir l'ID de l'assignation (on suppose qu'il est disponible dans selectedReceipt)
        if (selectedReceipt.assignment_id) {
          setSelectedAssignmentId(selectedReceipt.assignment_id.toString())
          loadAssignmentDetails(selectedReceipt.assignment_id.toString())
        }
      }
    }
  }, [isOpen, mode, selectedReceipt, loadAssignmentDetails])

  // Vérifier si le type de quittance est automatique (ID = 1)
  const isAutomaticReceiptType = (receiptTypeId: number) => {
    return receiptTypeId === 1
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

  const addReceipt = () => {
    if (!selectedAssignmentId) {
      toast.error('Veuillez sélectionner un dossier')
      return
    }

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
    const existingReceipt = receipts.find(r => r.receipt_type.id === formData.receipt_type_id)
    if (existingReceipt) {
      toast.error('Ce type de quittance est déjà dans la liste')
      return
    }

    // Pour les types non-automatiques, vérifier le montant
    if (!isAutomaticReceiptType(formData.receipt_type_id) && !formData.amount) {
      toast.error('Veuillez saisir un montant pour ce type de quittance')
      return
    }

    const receiptType = receiptTypes.find(type => type && type.id === formData.receipt_type_id)
    const newReceipt: Receipt = {
      amount_excluding_tax: '0',
      amount_tax: '0',
      amount: receiptToAdd.amount.toString(),
      receipt_type: {
        id: receiptType?.id || 1,
        code: receiptType?.code || '',
        label: receiptType?.label || ''
      },
      isNew: true
    }
    
    setReceipts([...receipts, newReceipt])
    setFormData({ receipt_type_id: 0, amount: 0 })
  }

  // Fonction pour calculer les quittances
  const calculateReceipts = async () => {
    if (!selectedAssignmentId) {
      toast.error('Veuillez sélectionner un dossier')
      return
    }

    if (receipts.length === 0) {
      toast.error('Veuillez ajouter au moins une quittance avant de calculer')
      return
    }

    try {
      setIsCalculating(true)
      
      // Préparer le payload pour le calcul
      const payload = {
        assignment_id: selectedAssignmentId,
        receipts: receipts.map(receipt => ({
          amount: Number(receipt.amount),
          receipt_type_id: String(receipt.receipt_type.id)
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
    } catch (error: any) {
      console.error('Erreur lors du calcul des quittances:', error)
      
      // Gérer les erreurs spécifiques de l'API pour le calcul
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const apiError = error.response.data.errors[0]
        const errorMessage = extractErrorMessage(apiError.detail || apiError.title || 'Erreur lors du calcul des quittances')
        toast.error(errorMessage)
      } else if (error.response?.data?.message) {
        const errorMessage = extractErrorMessage(error.response.data.message)
        toast.error(errorMessage)
      } else if (error.message) {
        const errorMessage = extractErrorMessage(error.message)
        toast.error(errorMessage)
      } else {
        toast.error('Erreur lors du calcul des quittances')
      }
    } finally {
      setIsCalculating(false)
    }
  }

  // Fonction pour créer les quittances après calcul
  const createReceiptsAfterCalculation = async () => {
    if (!calculationResult || !selectedAssignmentId) return

    try {
      setSaving(true)
      
      // Créer les quittances avec les montants calculés
      const receiptsToCreateWithCalculatedAmounts = calculationResult.receipts.map(calculatedReceipt => ({
        receipt_type_id: Number(calculatedReceipt.receipt_type_id),
        amount: calculatedReceipt.amount_excluding_tax
      }))

      const response = await receiptService.createMultipleReceipts(Number(selectedAssignmentId), receiptsToCreateWithCalculatedAmounts)
      
      // Vérifier si la réponse contient des erreurs
      if (response && handleApiResponseError(response, 'Erreur lors de la création des quittances')) {
        return // L'erreur a été gérée, on s'arrête ici
      }
      
      toast.success(`${calculationResult.receipts.length} quittance(s) créée(s) avec succès`)
      
      // Réinitialiser les états
      setCalculationResult(null)
      setShowCalculationResults(false)
      
      onSave(receipts)
      
      // Recharger les données pour avoir les IDs des nouvelles quittances
      await loadAssignmentDetails(selectedAssignmentId)
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création des quittances')
    } finally {
      setSaving(false)
    }
  }

  const removeReceipt = async (index: number) => {
    const receipt = receipts[index]
    
    if (receipt.id && !receipt.isNew) {
      // Supprimer de l'API
      try {
        await receiptService.deleteReceipt(receipt.id)
        toast.success('Quittance supprimée avec succès')
      } catch (error: any) {
        handleApiError(error, 'Erreur lors de la suppression de la quittance')
        return
      }
    }
    
    // Supprimer de l'état local
    setReceipts(receipts.filter((_, i) => i !== index))
  }

  const assignmentAmount = assignmentDetail ? parseFloat(assignmentDetail.total_amount) : 0
  const _totalReceipts = receipts.reduce((sum, receipt) => sum + (Number(receipt.amount) || 0), 0)

  const handleSave = async () => {
    if (!selectedAssignmentId) {
      toast.error('Veuillez sélectionner un dossier')
      return
    }

    if (receipts.length === 0) {
      toast.error('Ajoutez au moins une quittance')
      return
    }

    setSaving(true)
    try {
      const newReceipts = receipts.filter(r => r.isNew)
      const existingReceipts = receipts.filter(r => !r.isNew && r.id)

      // Créer les nouvelles quittances
      if (newReceipts.length > 0) {
        const receiptsToCreate = newReceipts.map(r => ({
          receipt_type_id: r.receipt_type.id,
          amount: Number(r.amount)
        }))
        const response = await receiptService.createMultipleReceipts(Number(selectedAssignmentId), receiptsToCreate)
        
        // Vérifier si la réponse contient des erreurs
        if (response && handleApiResponseError(response, 'Erreur lors de la création des quittances')) {
          return // L'erreur a été gérée, on s'arrête ici
        }
      }

      // Mettre à jour les quittances existantes
      for (const receipt of existingReceipts) {
        if (receipt.id) {
          await receiptService.updateReceipt(receipt.id, {
            assignment_id: Number(selectedAssignmentId),
            receipt_type_id: receipt.receipt_type.id,
            amount: Number(receipt.amount)
          })
        }
      }

      toast.success('Quittances sauvegardées avec succès')
      onSave(receipts)
      
      // Recharger les données pour avoir les IDs des nouvelles quittances
      await loadAssignmentDetails(selectedAssignmentId)
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la sauvegarde des quittances')
    } finally {
      setSaving(false)
    }
  }

  const handleRefresh = () => {
    if (selectedAssignmentId) {
      loadAssignmentDetails(selectedAssignmentId)
    }
  }

  const handleAssignmentChange = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId)
    if (assignmentId) {
      loadAssignmentDetails(assignmentId)
    } else {
      setAssignmentDetail(null)
      setReceipts([])
    }
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {mode === 'edit' ? 'Modifier la quittance' : 'Gérer les quittances'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? 'Modifiez les informations de la quittance sélectionnée'
              : 'Sélectionnez un dossier et gérez ses quittances'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
          {/* Sélection du dossier */}
          <Card className="shadow-none border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">
                {mode === 'edit' ? 'Dossier de la quittance' : 'Sélectionner un dossier'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="assignment_select">Dossier *</Label>
                <AssignmentSelect
                  value={selectedAssignmentId}
                  onValueChange={handleAssignmentChange}
                  placeholder="Sélectionner un dossier"
                  showReceipts={true}
                  showDetails={true}
                  disabled={mode === 'edit'} // Désactivé en mode édition
                />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-8 flex-1">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">Chargement des données du dossier...</span>
            </div>
          ) : assignmentDetail ? (
            <>
              {/* Résumé du dossier */}
              <Card className='shadow-none'>
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
                        {assignmentDetail.reference}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Montant du dossier</Label>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(assignmentAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulaire d'ajout */}
              <Card className="shadow-none border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Ajouter une quittance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Type de quittance</Label>
                      <ReceiptTypeSelect
                        value={formData.receipt_type_id || null}
                        onValueChange={(value) => {
                          const newReceiptTypeId = value || 0
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
                    onClick={addReceipt}
                    disabled={!formData.receipt_type_id || (!formData.amount && !isAutomaticReceiptType(formData.receipt_type_id))}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter à la liste
                  </Button>
                </CardContent>
              </Card>

              {/* Liste des quittances */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Quittances
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {receipts.length}
                    </Badge>
                  </h3>
                  
                  {receipts.length > 0 && (
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
                  )}
                </div>

                {receipts.length === 0 ? (
                  <Card className="border-dashed shadow-none">
                    <CardContent className="text-center py-8">
                      <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucune quittance ajoutée</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {receipts.map((receipt, index) => (
                      <Card key={index} className="shadow-none border-gray-200">
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{receipt.receipt_type.label}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {receipt.receipt_type.code}
                                </Badge>
                                {isAutomaticReceiptType(receipt.receipt_type.id) && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                                    Calcul automatique
                                  </Badge>
                                )}
                                <Badge variant={receipt.isNew ? "default" : "secondary"}>
                                  {receipt.isNew ? "Nouvelle" : "Existante"}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                ID: {receipt.id || 'Nouveau'}
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

              {/* Résultats du calcul */}
              {showCalculationResults && calculationResult && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Résultats du calcul
                  </h4>
                  
                  <Card className="border-green-200 bg-green-50 shadow-none">
                    <CardContent>
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
                            const receiptType = receiptTypes.find(type => type && type.id === Number(calculatedReceipt.receipt_type_id))
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span>{receiptType?.label || 'Type inconnu'}</span>
                                    {isAutomaticReceiptType(Number(calculatedReceipt.receipt_type_id)) && (
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
            </>
          ) : selectedAssignmentId ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement des données du dossier...</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Sélectionnez un dossier pour commencer</p>
            </div>
          )}
        </div>

        {/* Actions - Toujours visibles en bas */}
        <div className="flex justify-end gap-2 pt-4 border-t mt-4 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
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
              disabled={!selectedAssignmentId || receipts.length === 0 || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'edit' ? 'Modification...' : 'Sauvegarde...'}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {mode === 'edit' ? 'Modifier la quittance' : 'Sauvegarder les quittances'}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
