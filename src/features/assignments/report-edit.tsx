/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  ArrowLeft, 
  Loader2, 
  MapPin,
  Eye,
  Save,
  Plus,
  Check,
  Trash2,
  History,
  Calculator,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { ReceiptModal } from './components/receipt-modal'
import { 
  useEditAssignment, 
  useEditData, 
  useShockManagement, 
  useOtherCosts, 
  useCalculations 
} from './hooks'
import { ShockSuppliesTable } from './components/shock-supplies-table'
import { ShockWorkforceTable } from './components/shock-workforce-table'
import type { Shock, ShockWork, Workforce } from './hooks/use-shock-management'

interface ShockPoint {
  id: number
  label: string
  code: string
}

interface Supply {
  id: number
  label: string
  code: string
  price: number
}

interface WorkforceType {
  id: number
  label: string
  code: string
  hourly_rate: number
}

interface OtherCostType {
  id: number
  label: string
  code: string
}

interface Assignment {
  id: number
  reference: string
  status: {
    code: string
    label: string
  }
  client: {
    id: number
    name: string
    email: string
  }
  vehicle: {
    id: number
    license_plate: string
    brand?: {
      label: string
    }
    vehicle_model?: {
      label: string
    }
  }
  insurer: {
    id: number
    name: string
  }
  repairer: {
    id: number
    name: string
  }
  total_amount: number
  created_at: string
  updated_at: string
}

interface CalculationResult {
  shocks: any[]
  other_costs: any[]
  total_amount: number
}

export default function ReportEditPage() {
  const navigate = useNavigate()
  const { id } = useParams({ strict: false }) as { id: string }
  const assignmentId = parseInt(id)
  
  // Utilisation des hooks personnalisés
  const { 
    loading, 
    assignment, 
    saving, 
    hasUnsavedChanges, 
    setHasUnsavedChanges, 
    saveAssignment, 
    goBack 
  } = useEditAssignment(assignmentId)
  
  const { 
    loading: loadingData, 
    shockPoints, 
    supplies, 
    workforceTypes, 
    otherCostTypes 
  } = useEditData()
  
  const {
    shocks,
    setShocks,
    addShock,
    removeShock,
    updateShock
  } = useShockManagement() as {
    shocks: Shock[];
    setShocks: React.Dispatch<React.SetStateAction<Shock[]>>;
    addShock: (shockPointId: number) => void;
    removeShock: (index: number) => void;
    updateShock: (index: number, shock: Shock) => void;
  }
  
  const {
    otherCosts,
    addOtherCost,
    removeOtherCost,
    updateOtherCost,
    cleanOtherCosts
  } = useOtherCosts()
  
  const {
    calculationResults,
    loadingCalculation,
    calculateAll,
    removeCalculation,
    getCalculatedCount,
    getTotalAmount
  } = useCalculations()
  
  // États pour les modals
  const [showShockModal, setShowShockModal] = useState(false)
  const [showCalculationModal, setShowCalculationModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedShockPointId, setSelectedShockPointId] = useState(0)
  const [selectedShockIndex, setSelectedShockIndex] = useState(0)
  
  // États pour la vérification
  const [editPayload, setEditPayload] = useState<any>(null)
  const [assignmentTotalAmount, setAssignmentTotalAmount] = useState(0)
  const [redirectToReport, setRedirectToReport] = useState(false)

  // Mettre à jour hasUnsavedChanges quand les données changent
  useEffect(() => {
    if (shocks.length > 0 || otherCosts.some(cost => cost.other_cost_type_id !== 0)) {
      setHasUnsavedChanges(true)
    }
  }, [shocks, otherCosts, setHasUnsavedChanges])

  // Fonction de sauvegarde avec option de redirection
  const handleSaveAssignment = useCallback(async () => {
    const cleanedShocks = shocks
      .filter(shock => shock.shock_point_id && shock.shock_point_id !== 0)
      .reduce((acc, shock) => {
        const existingIndex = acc.findIndex(s => s.shock_point_id === shock.shock_point_id)
        if (existingIndex === -1) {
          acc.push(shock)
        } else {
          acc[existingIndex] = shock
        }
        return acc
      }, [] as any[])

    const cleanedOtherCosts = cleanOtherCosts()

    if (cleanedShocks.length === 0) {
      toast.error('Aucun point de choc valide à sauvegarder')
      return
    }

    const payload = {
      fournitures: [],
      shocks: cleanedShocks.map(shock => ({
        shock_point_id: shock.shock_point_id,
        shock_works: shock.shock_works.map((work: any) => ({
          supply_id: work.supply_id,
          disassembly: work.disassembly,
          replacement: work.replacement,
          repair: work.repair,
          paint: work.paint,
          control: work.control,
          comment: work.comment,
          obsolescence_rate: work.obsolescence_rate,
          recovery_rate: work.recovery_rate,
          amount: work.amount || 0
        })),
        paint_type_id: shock.paint_type_id,
        hourly_rate_id: shock.hourly_rate_id,
        workforces: shock.workforces.map((workforce: any) => ({
          workforce_type_id: workforce.workforce_type_id,
          nb_hours: workforce.nb_hours,
          discount: workforce.discount
        }))
      })),
      other_costs: cleanedOtherCosts.map(c => ({
        other_cost_type_id: Number(c.other_cost_type_id),
        amount: Number(c.amount) || 0
      })),
      repairer_id: 1,
      general_state_id: 1,
      technical_conclusion_id: 1
    }

    setEditPayload(payload)
    setShowVerificationModal(true)
  }, [shocks, cleanOtherCosts])

  // Fonction de confirmation de sauvegarde
  const confirmSave = useCallback(async (payload: any) => {
    const success = await saveAssignment(payload, redirectToReport)
    
    if (success) {
      // Calculer le montant total
      let total = 0
      payload.shocks.forEach((shock: any) => {
        shock.shock_works.forEach((work: any) => {
          total += work.amount || 0
        })
      })
      payload.other_costs.forEach((cost: any) => {
        total += cost.amount || 0
      })
      
      setAssignmentTotalAmount(total)
      setShowVerificationModal(false)
      
      if (!redirectToReport) {
        setShowReceiptModal(true)
      }
    }
  }, [saveAssignment, redirectToReport])

  // Gestion des quittances
  const handleReceiptSave = useCallback((receipts: any[]) => {
    toast.success(`${receipts.length} quittance(s) ajoutée(s) avec succès`)
    navigate({ to: '/assignments' })
  }, [navigate])

  const handleReceiptClose = useCallback(() => {
    navigate({ to: '/assignments' })
  }, [navigate])

  // Fonction de calcul global
  const handleCalculateAll = useCallback(async () => {
    const success = await calculateAll(shocks, otherCosts)
    if (success) {
      setHasUnsavedChanges(true)
    }
  }, [calculateAll, shocks, otherCosts, setHasUnsavedChanges])

  // Fonction d'ajout de point de choc
  const handleAddShock = useCallback(() => {
    if (!selectedShockPointId) return

    addShock(selectedShockPointId)
    setShowShockModal(false)
    setSelectedShockPointId(0)
  }, [selectedShockPointId, addShock])

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Dossier non trouvé</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate({ to: '/assignments' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Édition du dossier</h1>
            <p className="text-muted-foreground">
              Modifiez les informations du dossier {assignment.reference}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Statut des calculs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calculator className="h-4 w-4" />
            {Object.keys(calculationResults).length} / {shocks.length} calculé(s)
          </div>

          {/* Bouton de sauvegarde */}
          <Button 
            disabled={!hasUnsavedChanges || saving} 
            onClick={handleSaveAssignment}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Édition en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder définitivement
              </>
            )}
          </Button>

          {/* Bouton de rédaction du rapport */}
          <Button 
            variant="outline"
            onClick={() => {
              setRedirectToReport(true)
              handleSaveAssignment()
            }}
            disabled={!hasUnsavedChanges || saving}
          >
            <FileText className="mr-2 h-4 w-4" />
            Sauvegarder et rédiger le rapport
          </Button>
        </div>
      </div>

      {/* Actions principales */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowCalculationModal(true)}
        >
          <History className="mr-2 h-4 w-4" />
          Historique des calculs
        </Button>

        <Button
          variant="default"
          disabled={loadingCalculation || shocks.length === 0}
          onClick={handleCalculateAll}
        >
          {loadingCalculation ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Calculer tout
            </>
          )}
        </Button>

        <Button onClick={() => setShowShockModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un point de choc
        </Button>
      </div>

      {/* Liste des points de choc */}
      <div className="space-y-6">
        {shocks.map((shock, index) => {
          const s = shock as Shock;
          return (
            <Card key={s.uid}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {shockPoints.find(p => p.id === s.shock_point_id)?.label || `Point de choc`}
                    </CardTitle>
                    <CardDescription>
                      Point de choc avec {s.shock_works.length} fourniture(s) et {s.workforces.length} main d'œuvre
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {calculationResults[index] && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Calculé
                      </Badge>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => removeShock(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fournitures */}
                <ShockSuppliesTable
                  supplies={supplies}
                  shockWorks={s.shock_works}
                  onUpdate={(i, field, value) => {
                    const updatedShock = { ...s }
                    updatedShock.shock_works[i] = { ...updatedShock.shock_works[i], [field]: value }
                    updateShock(index, updatedShock)
                  }}
                  onAdd={() => {
                    const newWork = {
                      uid: crypto.randomUUID(),
                      supply_id: 0,
                      disassembly: false,
                      replacement: false,
                      repair: false,
                      paint: false,
                      control: false,
                      comment: '',
                      obsolescence_rate: 0,
                      recovery_rate: 0,
                      amount: 0
                    }
                    const updatedShock = { ...s, shock_works: [...s.shock_works, newWork] }
                    updateShock(index, updatedShock)
                  }}
                  onRemove={(i) => {
                    const updatedShock = { ...s }
                    updatedShock.shock_works.splice(i, 1)
                    updateShock(index, updatedShock)
                  }}
                />
                {/* Main d'œuvre */}
                <ShockWorkforceTable
                  workforceTypes={workforceTypes}
                  workforces={s.workforces}
                  onUpdate={(i, field, value) => {
                    const updatedShock = { ...s }
                    updatedShock.workforces[i] = { ...updatedShock.workforces[i], [field]: value }
                    updateShock(index, updatedShock)
                  }}
                  onAdd={() => {
                    const newWorkforce = {
                      workforce_type_id: 0,
                      workforce_type_label: '',
                      nb_hours: 0,
                      work_fee: '0',
                      discount: 0,
                      amount_excluding_tax: 0,
                      amount_tax: 0,
                      amount: 0
                    }
                    const updatedShock = { ...s, workforces: [...s.workforces, newWorkforce] }
                    updateShock(index, updatedShock)
                  }}
                  onRemove={(i) => {
                    const updatedShock = { ...s }
                    updatedShock.workforces.splice(i, 1)
                    updateShock(index, updatedShock)
                  }}
                />
                {/* Commentaire */}
                <div>
                  <Label>Commentaire</Label>
                  <Textarea
                    value={s.comment}
                    onChange={(e) => updateShock(index, { ...s, comment: e.target.value })}
                    placeholder="Commentaire sur ce point de choc..."
                    rows={3}
                  />
                </div>
                {/* Résultat du calcul */}
                {calculationResults[index] && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="flex items-center gap-2 text-green-800 font-semibold">
                        <Check className="h-4 w-4" />
                        Calcul terminé
                      </h4>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedShockIndex(index)
                        setShowCalculationModal(true)
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">Montant total :</span>
                        <p className="font-semibold">{calculationResults[index].total_amount?.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div>
                        <span className="text-green-600">Fournitures :</span>
                        <p className="font-semibold">{calculationResults[index].shocks?.[0]?.shock_works?.length || 0}</p>
                      </div>
                      <div>
                        <span className="text-green-600">Main d'œuvre :</span>
                        <p className="font-semibold">{calculationResults[index].shocks?.[0]?.workforces?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coûts autres */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Coûts autres</h2>
        <div className="space-y-4">
          {otherCosts.map((cost, index) => (
            <OtherCostItem
              key={index}
              cost={cost}
              otherCostTypes={otherCostTypes}
              onUpdate={(field, value) => updateOtherCost(index, field, value)}
              onRemove={() => removeOtherCost(index)}
            />
          ))}
          <Button variant="outline" onClick={addOtherCost}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un coût autre
          </Button>
        </div>
      </div>

      {/* Récapitulatif global */}
      <GlobalRecap
        shocks={shocks}
        otherCosts={otherCosts}
        calculationResults={calculationResults}
      />

      {/* Modal d'ajout de point de choc */}
      <Dialog open={showShockModal} onOpenChange={setShowShockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un point de choc</DialogTitle>
            <DialogDescription>
              Sélectionnez un point de choc à ajouter au dossier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="shock-point">Point de choc</Label>
              <Select value={selectedShockPointId.toString()} onValueChange={(value) => setSelectedShockPointId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un point de choc" />
                </SelectTrigger>
                <SelectContent>
                  {shockPoints.map((point) => (
                    <SelectItem key={point.id} value={point.id.toString()}>
                      {point.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowShockModal(false)}>
                Annuler
              </Button>
              <Button disabled={!selectedShockPointId} onClick={handleAddShock}>
                Valider
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de vérification */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la sauvegarde</DialogTitle>
            <DialogDescription>
              Voulez-vous sauvegarder définitivement les modifications ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Résumé des modifications :</h4>
              <p>• {shocks.length} point(s) de choc</p>
              <p>• {otherCosts.length} coût(s) autre(s)</p>
              <p>• {Object.keys(calculationResults).length} calcul(s) effectué(s)</p>
            </div>
            
            {/* Option de redirection vers la rédaction du rapport */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={redirectToReport}
                onCheckedChange={(checked) => setRedirectToReport(checked as boolean)}
              />
              <Label className="text-sm">
                Rediriger vers la rédaction du rapport après sauvegarde
              </Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowVerificationModal(false)}>
                Annuler
              </Button>
              <Button 
                disabled={saving} 
                onClick={() => confirmSave(editPayload)}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {redirectToReport ? 'Sauvegarder et continuer' : 'Confirmer'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de quittances */}
      <ReceiptModal
        isOpen={showReceiptModal}
        assignmentId={assignmentId}
        assignmentAmount={assignmentTotalAmount}
        onSave={handleReceiptSave}
        onClose={handleReceiptClose}
      />
    </div>
  )
}

// Composant OtherCostItem
function OtherCostItem({ 
  cost, 
  otherCostTypes, 
  onUpdate, 
  onRemove 
}: {
  cost: { other_cost_type_id: number; amount: number }
  otherCostTypes: OtherCostType[]
  onUpdate: (field: 'other_cost_type_id' | 'amount', value: number) => void
  onRemove: () => void
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Type de coût</Label>
          <Select 
            value={cost.other_cost_type_id.toString()} 
            onValueChange={(value) => onUpdate('other_cost_type_id', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
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
        <div>
          <Label>Montant</Label>
          <Input
            type="number"
            value={cost.amount}
            onChange={(e) => onUpdate('amount', Number(e.target.value))}
            placeholder="0"
          />
        </div>
        <div className="flex items-end">
          <Button variant="destructive" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Composant GlobalRecap
function GlobalRecap({ 
  shocks, 
  otherCosts, 
  calculationResults 
}: {
  shocks: Shock[]
  otherCosts: { other_cost_type_id: number; amount: number }[]
  calculationResults: { [key: number]: CalculationResult }
}) {
  const totalShockAmount = Object.values(calculationResults).reduce((total, result) => {
    return total + (result.total_amount || 0)
  }, 0)

  const totalOtherCosts = otherCosts.reduce((total, cost) => {
    return total + (cost.amount || 0)
  }, 0)

  const grandTotal = totalShockAmount + totalOtherCosts

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Récapitulatif global
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Points de choc</p>
            <p className="text-2xl font-bold">{shocks.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Calculs effectués</p>
            <p className="text-2xl font-bold text-green-600">{Object.keys(calculationResults).length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Coûts autres</p>
            <p className="text-2xl font-bold">{otherCosts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-blue-600">{grandTotal.toLocaleString('fr-FR')} €</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Détail des montants</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Montant des chocs :</span>
                <span className="font-semibold">{totalShockAmount.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between">
                <span>Coûts autres :</span>
                <span className="font-semibold">{totalOtherCosts.toLocaleString('fr-FR')} €</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total général :</span>
                <span className="text-blue-600">{grandTotal.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Statut des calculs</h4>
            <div className="space-y-2">
              {shocks.map((shock, index) => (
                <div key={shock.uid} className="flex justify-between items-center">
                  <span className="text-sm">
                    {shock.shock_point_id ? `Point ${index + 1}` : 'Point non défini'}
                  </span>
                  {calculationResults[index] ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Check className="mr-1 h-3 w-3" />
                      Calculé
                    </Badge>
                  ) : (
                    <Badge variant="secondary">En attente</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
