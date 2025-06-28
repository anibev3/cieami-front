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
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
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
import { ReceiptModal } from '@/components/receipt-modal'
import { 
  useEditAssignment, 
  useEditData, 
  useShockManagement, 
  useOtherCosts, 
  useCalculations 
} from './hooks'
import { ShockSuppliesTable } from './components/shock-supplies-table'
import { ShockWorkforceTable } from './components/shock-workforce-table'
import type { Shock } from './hooks/use-shock-management'
import { Checkbox } from '@/components/ui/checkbox'

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
  shock_works?: any[]
  workforces?: any[]
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
    otherCostTypes,
    paintTypes,
    hourlyRates
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
  
  // État pour les calculs individuels
  const [calculatingShocks, setCalculatingShocks] = useState<Set<number>>(new Set())

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
      .map(shock => ({
        ...shock,
        shock_works: shock.shock_works.filter((work: any) => work.supply_id && work.supply_id !== 0),
        workforces: shock.workforces.filter((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
      }))
      .filter(shock => shock.shock_works.length > 0 || shock.workforces.length > 0)

    const cleanedOtherCosts = cleanOtherCosts()

    if (cleanedShocks.length === 0) {
      // Vérifier s'il y a des chocs avec des données invalides
      const invalidShocks = shocks.filter(shock => {
        const hasInvalidSupplies = shock.shock_works.some((work: any) => !work.supply_id || work.supply_id === 0)
        const hasInvalidWorkforce = shock.workforces.some((workforce: any) => !workforce.workforce_type_id || workforce.workforce_type_id === 0)
        const hasInvalidPaintType = !shock.paint_type_id || shock.paint_type_id === 0
        const hasInvalidHourlyRate = !shock.hourly_rate_id || shock.hourly_rate_id === 0
        return hasInvalidSupplies || hasInvalidWorkforce || hasInvalidPaintType || hasInvalidHourlyRate
      })
      
      if (invalidShocks.length > 0) {
        toast.error('Veuillez sélectionner toutes les fournitures, types de main d\'œuvre, types de peinture et taux horaires avant de sauvegarder')
      } else {
        toast.error('Aucun point de choc valide à sauvegarder')
      }
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

  // Fonction de rédaction directe du rapport
  const handleGenerateReport = useCallback(async () => {
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
      .map(shock => ({
        ...shock,
        shock_works: shock.shock_works.filter((work: any) => work.supply_id && work.supply_id !== 0),
        workforces: shock.workforces.filter((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
      }))
      .filter(shock => shock.shock_works.length > 0 || shock.workforces.length > 0)

    const cleanedOtherCosts = cleanOtherCosts()

    if (cleanedShocks.length === 0) {
      // Vérifier s'il y a des chocs avec des données invalides
      const invalidShocks = shocks.filter(shock => {
        const hasInvalidSupplies = shock.shock_works.some((work: any) => !work.supply_id || work.supply_id === 0)
        const hasInvalidWorkforce = shock.workforces.some((workforce: any) => !workforce.workforce_type_id || workforce.workforce_type_id === 0)
        const hasInvalidPaintType = !shock.paint_type_id || shock.paint_type_id === 0
        const hasInvalidHourlyRate = !shock.hourly_rate_id || shock.hourly_rate_id === 0
        return hasInvalidSupplies || hasInvalidWorkforce || hasInvalidPaintType || hasInvalidHourlyRate
      })
      
      if (invalidShocks.length > 0) {
        toast.error('Veuillez sélectionner toutes les fournitures, types de main d\'œuvre, types de peinture et taux horaires avant de rédiger le rapport')
      } else {
        toast.error('Aucun point de choc valide pour rédiger le rapport')
      }
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

    // Exécuter directement la sauvegarde et la rédaction
    const success = await saveAssignment(payload, true) // true pour rediriger vers le rapport
    
    if (success) {
      setShowVerificationModal(false)
      toast.success('Rapport généré avec succès')
      
      // Calculer le montant total pour le modal de quittances
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
      setShowReceiptModal(true)
    }
  }, [shocks, cleanOtherCosts, saveAssignment])

  // Gestion des quittances
  const handleReceiptSave = useCallback((receipts: any[]) => {
    toast.success(`${receipts.length} quittance(s) ajoutée(s) avec succès`)
    navigate({ to: '/assignments' })
  }, [navigate])

  const handleReceiptClose = useCallback(() => {
    navigate({ to: '/assignments' })
  }, [navigate])

  // Fonction de calcul global automatique pour tous les points de choc
  const calculateAllShocks = useCallback(async () => {
    // Vérifier s'il y a au moins une fourniture, une main d'œuvre ou des autres coûts
    const hasSupplies = shocks.some(shock => shock.shock_works.length > 0)
    const hasWorkforce = shocks.some(shock => shock.workforces.length > 0)
    const hasOtherCosts = otherCosts.some(cost => cost.other_cost_type_id > 0)
    
    if (!hasSupplies && !hasWorkforce && !hasOtherCosts) {
      return // Pas de calcul si aucune donnée
    }

    // Marquer tous les points de choc comme en cours de calcul
    setCalculatingShocks(new Set(shocks.map((_, index) => index)))

    try {
      // Filtrer les autres coûts valides (avec other_cost_type_id > 0)
      const validOtherCosts = otherCosts.filter(cost => cost.other_cost_type_id > 0)

      // Filtrer les chocs avec des données valides
      const validShocks = shocks
        .filter(shock => shock.shock_point_id && shock.shock_point_id !== 0)
        .map(shock => ({
          shock_point_id: shock.shock_point_id,
          shock_works: shock.shock_works.filter((work: any) => work.supply_id && work.supply_id !== 0).map((work: any) => ({
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
          workforces: shock.workforces.filter((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0).map((workforce: any) => ({
            workforce_type_id: workforce.workforce_type_id,
            nb_hours: workforce.nb_hours,
            discount: workforce.discount
          }))
        }))
        .filter(shock => (shock.shock_works.length > 0 || shock.workforces.length > 0) && shock.paint_type_id && shock.hourly_rate_id)

      const payload = {
        shocks: validShocks,
        other_costs: validOtherCosts.map(cost => ({
          other_cost_type_id: cost.other_cost_type_id,
          amount: cost.amount
        }))
      }

      const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.CALCULATIONS}`, payload)
      
      if (response.data.status === 200) {
        const calculatedData = response.data.data
        
        // Mettre à jour tous les points de choc avec les montants calculés
        shocks.forEach((shock, shockIndex) => {
          const calculatedShock = calculatedData.shocks[shockIndex]
          if (calculatedShock) {
            // Mettre à jour les fournitures avec les montants calculés
            const updatedShockWorks = shock.shock_works.map((work: any, index: number) => ({
              ...work,
              ...calculatedShock.shock_works[index]
            }))

            // Mettre à jour la main d'œuvre avec les montants calculés
            const updatedWorkforces = shock.workforces.map((workforce: any, index: number) => ({
              ...workforce,
              ...calculatedShock.workforces[index]
            }))

            // Mettre à jour le point de choc
            const updatedShock = {
              ...shock,
              shock_works: updatedShockWorks,
              workforces: updatedWorkforces
            }

            updateShock(shockIndex, updatedShock)
          }
        })
        
        // Mettre à jour les résultats de calcul globaux
        Object.keys(calculatedData).forEach(key => {
          if (key !== 'shocks') {
            (calculationResults as any)[key] = calculatedData[key]
          }
        })
        
        setHasUnsavedChanges(true)
        toast.success('Calcul global effectué avec succès')
      }
    } catch (error) {
      console.error('Erreur lors du calcul global:', error)
      toast.error('Erreur lors du calcul global')
    } finally {
      // Retirer tous les points de choc du calcul en cours
      setCalculatingShocks(new Set())
    }
  }, [shocks, otherCosts, assignmentId, calculationResults, updateShock, setHasUnsavedChanges])

  // Fonction de mise à jour avec calcul automatique global
  const updateShockWithGlobalCalculation = useCallback((shockIndex: number, updatedShock: Shock) => {
    updateShock(shockIndex, updatedShock)
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                        updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
    
    if (hasValidData) {
      // Déclencher le calcul global automatique après un délai
      setTimeout(() => {
        calculateAllShocks()
      }, 4000)
    }
  }, [updateShock, calculateAllShocks])

  // Fonction de mise à jour des fournitures avec calcul automatique global
  const updateShockWork = useCallback((shockIndex: number, workIndex: number, field: string, value: any) => {
    const updatedShock = { ...shocks[shockIndex] }
    updatedShock.shock_works[workIndex] = { ...updatedShock.shock_works[workIndex], [field]: value }
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                        updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
    
    updateShock(shockIndex, updatedShock)
    
    if (hasValidData) {
      // Déclencher le calcul global automatique après un délai
      setTimeout(() => {
        calculateAllShocks()
      }, 4000)
    }
  }, [shocks, updateShock, calculateAllShocks])

  // Fonction de mise à jour de la main d'œuvre avec calcul automatique global
  const updateWorkforce = useCallback((shockIndex: number, workforceIndex: number, field: string, value: any) => {
    const updatedShock = { ...shocks[shockIndex] }
    updatedShock.workforces[workforceIndex] = { ...updatedShock.workforces[workforceIndex], [field]: value }
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                        updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
    
    updateShock(shockIndex, updatedShock)
    
    if (hasValidData) {
      // Déclencher le calcul global automatique après un délai
      setTimeout(() => {
        calculateAllShocks()
      }, 4000)
    }
  }, [shocks, updateShock, calculateAllShocks])

  // Fonction de mise à jour des autres coûts avec calcul automatique global
  const updateOtherCostWithCalculation = useCallback((index: number, field: 'other_cost_type_id' | 'amount', value: number) => {
    updateOtherCost(index, field, value)
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const updatedOtherCosts = [...otherCosts]
    updatedOtherCosts[index] = { ...updatedOtherCosts[index], [field]: value }
    const hasValidData = updatedOtherCosts.some(cost => cost.other_cost_type_id > 0)
    
    if (hasValidData) {
      // Déclencher le calcul global automatique après un délai
      setTimeout(() => {
        calculateAllShocks()
      }, 4000)
    }
  }, [updateOtherCost, otherCosts, calculateAllShocks])

  // Fonction d'ajout d'autres coûts avec calcul automatique global
  const addOtherCostWithCalculation = useCallback(() => {
    addOtherCost()
    
    // Ne pas déclencher le calcul automatiquement lors de l'ajout d'une ligne vide
    // Le calcul se déclenchera quand l'utilisateur sélectionnera un type de coût
  }, [addOtherCost])

  // Fonction de suppression d'autres coûts avec calcul automatique global
  const removeOtherCostWithCalculation = useCallback((index: number) => {
    removeOtherCost(index)
    
    // Vérifier s'il reste des données valides avant de déclencher le calcul
    const remainingOtherCosts = otherCosts.filter((_, i) => i !== index)
    const hasValidData = remainingOtherCosts.some(cost => cost.other_cost_type_id > 0)
    
    if (hasValidData) {
      // Déclencher le calcul global automatique après un délai
      setTimeout(() => {
        calculateAllShocks()
      }, 4000)
    }
  }, [removeOtherCost, otherCosts, calculateAllShocks])

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
    <>
          <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="container mx-autospace-y-6">
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
              {/* Bouton de sauvegarde */}
              {/* <Button 
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
              </Button> */}

            <Button 
              onClick={() => setShowShockModal(true)}
              className=" from-black-600 to-black-600 hover:from-black-700 hover:to-black-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              <span className="font-semibold">Ajouter un point de choc</span>
            </Button>

              {/* Bouton de rédaction du rapport */}
              <Button 
                disabled={!hasUnsavedChanges || saving} 
                onClick={() => setShowVerificationModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rédaction en cours...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Rédiger le rapport
                  </>
                )}
              </Button>
            </div>
          </div>



          {/* Liste des points de choc */}
          <div className="space-y-6 mt-10">
            {shocks.map((shock, index) => {
              const s = shock as Shock;
              return (
                <Card key={s.uid} className="shadow-none">
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
                        {calculatingShocks.has(index) && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Calcul en cours...
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
                      onUpdate={(i, field, value) => updateShockWork(index, i, field, value)}
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
                        // Ne pas déclencher le calcul automatiquement lors de l'ajout d'une ligne vide
                        // Le calcul se déclenchera quand l'utilisateur sélectionnera une fourniture
                      }}
                      onRemove={(i) => {
                        const updatedShock = { ...s }
                        updatedShock.shock_works.splice(i, 1)
                        
                        // Vérifier s'il reste des données valides avant de déclencher le calcul
                        const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                                           updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
                        
                        updateShock(index, updatedShock)
                        
                        if (hasValidData) {
                          setTimeout(() => {
                            calculateAllShocks()
                          }, 4000)
                        }
                      }}
                    />

                    {/* Main d'œuvre */}
                    <ShockWorkforceTable
                      workforceTypes={workforceTypes}
                      workforces={s.workforces}
                      onUpdate={(i, field, value) => updateWorkforce(index, i, field, value)}
                      onAdd={() => {
                        const newWorkforce = {
                          uid: crypto.randomUUID(),
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
                        // Ne pas déclencher le calcul automatiquement lors de l'ajout d'une ligne vide
                        // Le calcul se déclenchera quand l'utilisateur sélectionnera un type de main d'œuvre
                      }}
                      onRemove={(i) => {
                        const updatedShock = { ...s }
                        updatedShock.workforces.splice(i, 1)
                        
                        // Vérifier s'il reste des données valides avant de déclencher le calcul
                        const hasValidData = updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
                        
                        updateShock(index, updatedShock)
                        
                        if (hasValidData) {
                          setTimeout(() => {
                            calculateAllShocks()
                          }, 4000)
                        }
                      }}
                    />



  
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
                            <p className="font-semibold">{calculationResults[index].total_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Fournitures :</span>
                            <p className="font-semibold">{(calculationResults[index] as CalculationResult).shock_works?.length || 0}</p>
                          </div>
                          <div>
                            <span className="text-green-600">Main d'œuvre :</span>
                            <p className="font-semibold">{(calculationResults[index] as CalculationResult).workforces?.length || 0}</p>
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
          {otherCosts.length > 0 && (
            <div className="space-y-4 mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Coûts autres
                  {loadingCalculation && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Calcul en cours...
                    </Badge>
                  )}
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addOtherCostWithCalculation}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un coût
                </Button>
              </div>
              <div className="border-b border-gray-200 mb-4"></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-4">
                {otherCosts.map((cost, index) => (
                  <OtherCostItem
                    key={index}
                    cost={cost}
                    otherCostTypes={otherCostTypes}
                    onUpdate={(field, value) => updateOtherCostWithCalculation(index, field, value)}
                    onRemove={() => removeOtherCostWithCalculation(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bouton pour ajouter le premier coût autre */}
          {otherCosts.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <Calculator className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun coût autre</h3>
                <p className="text-gray-500 mb-4">Ajoutez des coûts supplémentaires si nécessaire</p>
                <Button 
                  onClick={addOtherCostWithCalculation}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un coût autre
                </Button>
              </div>
            </div>
          )}

          {/* Récapitulatif global */}
          <GlobalRecap
            shocks={shocks}
            otherCosts={otherCosts}
            calculationResults={calculationResults}
          />

          {/* Modal d'ajout de point de choc */}
          <Dialog open={showShockModal} onOpenChange={setShowShockModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Ajouter un point de choc
                </DialogTitle>
                <DialogDescription className="text-base">
                  Sélectionnez un point de choc à ajouter au dossier pour commencer l'expertise
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Section de sélection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Point de choc à ajouter
                  </div>
                  
                  <div className="relative">
                    <Select value={selectedShockPointId.toString()} onValueChange={(value) => setSelectedShockPointId(Number(value))}>
                      <SelectTrigger className={`w-full h-12 text-left ${!selectedShockPointId ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-50'}`}>
                        <SelectValue placeholder={!selectedShockPointId ? "🔍 Choisir un point de choc..." : "Point de choc sélectionné"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {shockPoints.map((point) => (
                          <SelectItem key={point.id} value={point.id.toString()} className="py-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{point.label}</span>
                              <span className="text-xs text-gray-500 ml-auto">#{point.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Informations sur le point sélectionné */}
                {selectedShockPointId > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">Point de choc sélectionné</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">
                        {shockPoints.find(p => p.id === selectedShockPointId)?.label}
                      </p>
                      <p className="text-gray-500 mt-1">
                        Code: {shockPoints.find(p => p.id === selectedShockPointId)?.code}
                      </p>
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{shockPoints.length}</div>
                      <div className="text-xs text-gray-600">Points disponibles</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{shocks.length}</div>
                      <div className="text-xs text-gray-600">Points ajoutés</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowShockModal(false)
                    setSelectedShockPointId(0)
                  }}
                  className="px-6"
                >
                  Annuler
                </Button>
                <Button 
                  disabled={!selectedShockPointId} 
                  onClick={() => {
                    addShock(selectedShockPointId)
                    setShowShockModal(false)
                    setSelectedShockPointId(0)
                  }}
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter le point
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal de vérification */}
          <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  Confirmer la rédaction du rapport
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600">
                  Vérifiez les informations avant de procéder à la rédaction du rapport d'expertise
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Résumé des données */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-4">
                    <Calculator className="h-5 w-5" />
                    Résumé de l'expertise
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{shocks.length}</div>
                      <div className="text-sm text-gray-600">Points de choc</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">{otherCosts.filter(c => c.other_cost_type_id > 0).length}</div>
                      <div className="text-sm text-gray-600">Coûts autres</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">{Object.keys(calculationResults).length}</div>
                      <div className="text-sm text-gray-600">Calculs effectués</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {shocks.reduce((total, shock) => 
                          total + shock.shock_works.length + shock.workforces.length, 0
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Lignes totales</div>
                    </div>
                  </div>
                </div>

                {/* Validation des données */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Check className="h-5 w-5 text-green-600" />
                    Validation des données
                  </h4>
                  
                  <div className="space-y-2">
                    {shocks.length > 0 ? (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Points de choc configurés</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700">Aucun point de choc ajouté</span>
                      </div>
                    )}
                    
                    {shocks.every(shock => shock.paint_type_id && shock.hourly_rate_id) ? (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Types de peinture et taux horaires définis</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700">Types de peinture ou taux horaires manquants</span>
                      </div>
                    )}
                    
                    {Object.keys(calculationResults).length > 0 ? (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Calculs effectués avec succès</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-orange-700">Aucun calcul effectué</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avertissement */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-amber-100 rounded-full mt-0.5">
                      <FileText className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-amber-800 mb-1">Action irréversible</p>
                      <p className="text-amber-700">
                        La rédaction du rapport va sauvegarder définitivement toutes les modifications et générer le rapport d'expertise final.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowVerificationModal(false)}
                  className="px-6"
                >
                  Annuler
                </Button>
                <Button 
                  disabled={saving || shocks.length === 0} 
                  onClick={() => {
                    setRedirectToReport(true)
                    handleGenerateReport()
                  }}
                  className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rédaction en cours...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Confirmer et rédiger
                    </>
                  )}
                </Button>
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
      </Main>
    </>
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 m">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-purple-600" />
          Coût supplémentaire
        </h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Type de coût</Label>
          <Select 
            value={cost.other_cost_type_id.toString()} 
            onValueChange={(value) => onUpdate('other_cost_type_id', Number(value))}
            
          >
            <SelectTrigger className={`w-full border-gray-300 focus:border-purple-500 focus:ring-purple-200 ${!cost.other_cost_type_id ? 'border-red-300 bg-red-50' : ''}`}>
              <SelectValue placeholder={!cost.other_cost_type_id ? "⚠️ Sélectionner un type" : "Sélectionner un type"} />
            </SelectTrigger>
            <SelectContent className="w-full">
              {otherCostTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">Montant (FCFA)</Label>
          <Input
            type="number"
            value={cost.amount}
            onChange={(e) => onUpdate('amount', Number(e.target.value))}
            placeholder="0"
            className="border-gray-300 focus:border-purple-500 focus:ring-purple-200"
          />
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
    <Card className="shadow-none">
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
            <p className="text-2xl font-bold text-blue-600">{grandTotal.toLocaleString('fr-FR')} F CFA</p>  
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Détail des montants</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Montant des chocs :</span>
                <span className="font-semibold">{totalShockAmount.toLocaleString('fr-FR')} F CFA</span>
              </div>
              <div className="flex justify-between">
                <span>Coûts autres :</span>
                <span className="font-semibold">{totalOtherCosts.toLocaleString('fr-FR')} F CFA</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total général :</span>
                  <span className="text-blue-600">{grandTotal.toLocaleString('fr-FR')} F CFA</span>
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
