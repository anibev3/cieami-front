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


interface OtherCostType {
  id: number
  label: string
  code: string
}

interface CalculationResult {
  shocks: any[]
  other_costs: any[]
  shock_works?: any[]
  workforces?: any[]
  // Montants globaux des chocs
  total_shock_amount_excluding_tax?: number
  total_shock_amount_tax?: number
  total_shock_amount?: number
  // Montants globaux de la main d'œuvre
  total_workforce_amount_excluding_tax?: number
  total_workforce_amount_tax?: number
  total_workforce_amount?: number
  // Montants globaux des produits peinture
  total_paint_product_amount_excluding_tax?: number
  total_paint_product_amount_tax?: number
  total_paint_product_amount?: number
  // Montants globaux des petites fournitures
  total_small_supply_amount_excluding_tax?: number
  total_small_supply_amount_tax?: number
  total_small_supply_amount?: number
  // Montants globaux des autres coûts
  total_other_costs_amount_excluding_tax?: number
  total_other_costs_amount_tax?: number
  total_other_costs_amount?: number
  // Montants globaux totaux
  shocks_amount_excluding_tax?: number
  shocks_amount_tax?: number
  shocks_amount?: number
  total_amount_excluding_tax?: number
  total_amount_tax?: number
  total_amount?: number
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
    goBack,
    formattedShocks,
    setFormattedShocks
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
  } = useShockManagement(formattedShocks) as {
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
  } = useOtherCosts(assignment?.other_costs?.map(cost => ({
    other_cost_type_id: cost.other_cost_type_id,
    amount: parseFloat(cost.amount) || 0
  })))
  
  const {
    calculationResults,
    loadingCalculation,
    calculateAll,
    removeCalculation,
    getCalculatedCount,
    getTotalAmount,
    updateCalculation
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
  
  // État pour suivre si des données pré-remplies ont été chargées
  const [hasPreloadedData, setHasPreloadedData] = useState(false)

  // Mettre à jour hasUnsavedChanges quand les données changent
  useEffect(() => {
    if (shocks.length > 0 || otherCosts.some(cost => cost.other_cost_type_id !== 0)) {
      setHasUnsavedChanges(true)
    }
  }, [shocks, otherCosts, setHasUnsavedChanges])

  // Vérifier si des données pré-remplies ont été chargées
  useEffect(() => {
    if (assignment?.shocks && assignment.shocks.length > 0) {
      setHasPreloadedData(true)
      // Afficher un toast informatif
      toast.success(`${assignment.shocks.length} point(s) de choc pré-rempli(s) chargé(s)`)
    } else {
      toast.success('Aucun point de choc pré-rempli chargé')
    }
  }, [assignment?.shocks])

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
        with_tax: shock.with_tax,
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
        with_tax: shock.with_tax,
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
          with_tax: shock.with_tax,
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
        
        // Mettre à jour les résultats de calcul avec les montants globaux
        // Stocker les montants globaux dans le premier calcul (index 0)
        if (calculatedData) {
          updateCalculation(0, {
            shocks: calculatedData.shocks || [],
            other_costs: calculatedData.other_costs || [],
            shock_works: calculatedData.shocks?.[0]?.shock_works || [],
            workforces: calculatedData.shocks?.[0]?.workforces || [],
            // Montants globaux des chocs
            total_shock_amount_excluding_tax: calculatedData.total_shock_amount_excluding_tax,
            total_shock_amount_tax: calculatedData.total_shock_amount_tax,
            total_shock_amount: calculatedData.total_shock_amount,
            // Montants globaux de la main d'œuvre
            total_workforce_amount_excluding_tax: calculatedData.total_workforce_amount_excluding_tax,
            total_workforce_amount_tax: calculatedData.total_workforce_amount_tax,
            total_workforce_amount: calculatedData.total_workforce_amount,
            // Montants globaux des produits peinture
            total_paint_product_amount_excluding_tax: calculatedData.total_paint_product_amount_excluding_tax,
            total_paint_product_amount_tax: calculatedData.total_paint_product_amount_tax,
            total_paint_product_amount: calculatedData.total_paint_product_amount,
            // Montants globaux des petites fournitures
            total_small_supply_amount_excluding_tax: calculatedData.total_small_supply_amount_excluding_tax,
            total_small_supply_amount_tax: calculatedData.total_small_supply_amount_tax,
            total_small_supply_amount: calculatedData.total_small_supply_amount,
            // Montants globaux des autres coûts
            total_other_costs_amount_excluding_tax: calculatedData.total_other_costs_amount_excluding_tax,
            total_other_costs_amount_tax: calculatedData.total_other_costs_amount_tax,
            total_other_costs_amount: calculatedData.total_other_costs_amount,
            // Montants globaux totaux
            shocks_amount_excluding_tax: calculatedData.shocks_amount_excluding_tax,
            shocks_amount_tax: calculatedData.shocks_amount_tax,
            shocks_amount: calculatedData.shocks_amount,
            total_amount_excluding_tax: calculatedData.total_amount_excluding_tax,
            total_amount_tax: calculatedData.total_amount_tax,
            total_amount: calculatedData.total_amount,
          })
        }
        
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

  // Fonction de calcul d'un seul point de choc
  const calculateSingleShock = useCallback(async (shockIndex: number) => {
    const shock = shocks[shockIndex]
    if (!shock || !shock.shock_point_id || shock.shock_point_id === 0) {
      return
    }

    // Vérifier s'il y a des données valides dans ce choc
    const hasValidData = shock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                        shock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
    
    if (!hasValidData) {
      return
    }

    // Marquer ce point de choc comme en cours de calcul
    setCalculatingShocks(prev => new Set([...prev, shockIndex]))

    try {
      // Préparer le payload pour ce choc uniquement
      const validShock = {
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
        with_tax: shock.with_tax,
        workforces: shock.workforces.filter((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0).map((workforce: any) => ({
          workforce_type_id: workforce.workforce_type_id,
          nb_hours: workforce.nb_hours,
          discount: workforce.discount
        }))
      }

      // Vérifier que le choc a des données valides
      if ((validShock.shock_works.length === 0 && validShock.workforces.length === 0) || !validShock.paint_type_id || !validShock.hourly_rate_id) {
        return
      }

      const payload = {
        shocks: [validShock],
        other_costs: [] // Pas d'autres coûts pour le calcul d'un seul choc
      }

      const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.CALCULATIONS}`, payload)
      
      if (response.data.status === 200) {
        const calculatedData = response.data.data
        
        // Mettre à jour seulement ce point de choc avec les montants calculés
        const calculatedShock = calculatedData.shocks[0]
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
        
        // Mettre à jour les résultats de calcul avec les montants globaux
        if (calculatedData) {
          updateCalculation(shockIndex, {
            shocks: calculatedData.shocks || [],
            other_costs: calculatedData.other_costs || [],
            shock_works: calculatedData.shocks?.[0]?.shock_works || [],
            workforces: calculatedData.shocks?.[0]?.workforces || [],
            // Montants globaux des chocs
            total_shock_amount_excluding_tax: calculatedData.total_shock_amount_excluding_tax,
            total_shock_amount_tax: calculatedData.total_shock_amount_tax,
            total_shock_amount: calculatedData.total_shock_amount,
            // Montants globaux de la main d'œuvre
            total_workforce_amount_excluding_tax: calculatedData.total_workforce_amount_excluding_tax,
            total_workforce_amount_tax: calculatedData.total_workforce_amount_tax,
            total_workforce_amount: calculatedData.total_workforce_amount,
            // Montants globaux des produits peinture
            total_paint_product_amount_excluding_tax: calculatedData.total_paint_product_amount_excluding_tax,
            total_paint_product_amount_tax: calculatedData.total_paint_product_amount_tax,
            total_paint_product_amount: calculatedData.total_paint_product_amount,
            // Montants globaux des petites fournitures
            total_small_supply_amount_excluding_tax: calculatedData.total_small_supply_amount_excluding_tax,
            total_small_supply_amount_tax: calculatedData.total_small_supply_amount_tax,
            total_small_supply_amount: calculatedData.total_small_supply_amount,
            // Montants globaux des autres coûts
            total_other_costs_amount_excluding_tax: calculatedData.total_other_costs_amount_excluding_tax,
            total_other_costs_amount_tax: calculatedData.total_other_costs_amount_tax,
            total_other_costs_amount: calculatedData.total_other_costs_amount,
            // Montants globaux totaux
            shocks_amount_excluding_tax: calculatedData.shocks_amount_excluding_tax,
            shocks_amount_tax: calculatedData.shocks_amount_tax,
            shocks_amount: calculatedData.shocks_amount,
            total_amount_excluding_tax: calculatedData.total_amount_excluding_tax,
            total_amount_tax: calculatedData.total_amount_tax,
            total_amount: calculatedData.total_amount,
          })
        }
        
        setHasUnsavedChanges(true)
        toast.success('Calcul effectué avec succès')
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error)
      toast.error('Erreur lors du calcul')
    } finally {
      // Retirer ce point de choc du calcul en cours
      setCalculatingShocks(prev => {
        const newSet = new Set(prev)
        newSet.delete(shockIndex)
        return newSet
      })
    }
  }, [shocks, updateShock, setHasUnsavedChanges])

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
        <div className="">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate({ to: '/assignments' })}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Édition du dossier</h1>
                <p className="text-sm text-muted-foreground">
                  Modifiez les informations du dossier {assignment.reference}
                </p>
                {hasPreloadedData && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Check className="mr-1 h-3 w-3" />
                      Données pré-remplies chargées
                    </Badge>
                  </div>
                )}
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
            {hasPreloadedData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="text-base font-semibold text-blue-800">Données pré-remplies détectées</h3>
                    <p className="text-xs text-blue-700">
                      {shocks.length} point(s) de choc avec leurs fournitures et main d'œuvre ont été chargés automatiquement.
                      Vous pouvez les modifier ou ajouter de nouveaux points de choc.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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
                        <CardDescription className="text-sm">
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
                      onValidateRow={async (workIndex) => {
                        // Déclencher le calcul pour ce choc uniquement
                        await calculateSingleShock(index)
                      }}
                    />


                    {/* Main d'œuvre */}
                    <ShockWorkforceTable
                      workforceTypes={workforceTypes}
                      workforces={s.workforces}
                      paintTypes={paintTypes}
                      hourlyRates={hourlyRates}
                      paintTypeId={s.paint_type_id}
                      hourlyRateId={s.hourly_rate_id}
                      withTax={s.with_tax}
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
                      onPaintTypeChange={(value) => {
                        const updatedShock = { ...s, paint_type_id: value }
                        updateShockWithGlobalCalculation(index, updatedShock)
                      }}
                      onHourlyRateChange={(value) => {
                        const updatedShock = { ...s, hourly_rate_id: value }
                        updateShockWithGlobalCalculation(index, updatedShock)
                      }}
                      onWithTaxChange={(value) => {
                        const updatedShock = { ...s, with_tax: value }
                        updateShockWithGlobalCalculation(index, updatedShock)
                      }}
                      onValidateRow={async (workforceIndex) => {
                        // Déclencher le calcul pour ce choc uniquement
                        await calculateSingleShock(index)
                      }}
                    />



  
                    {/* Résultat du calcul */}
                    {calculationResults[index] && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="flex items-center gap-2 text-sm text-green-800 font-semibold">
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
                        <div className="grid grid-cols-3 gap-4 text-xs">
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
                <h2 className="text-lg font-bold flex items-center gap-2">
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
                <h3 className="text-base font-semibold text-gray-700 mb-2">Aucun coût autre</h3>
                <p className="text-sm text-gray-500 mb-4">Ajoutez des coûts supplémentaires si nécessaire</p>
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
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Ajouter un point de choc
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Sélectionnez un point de choc à ajouter au dossier pour commencer l'expertise
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Section de sélection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
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
                              <span className="text-sm font-medium">{point.label}</span>
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
                      <span className="text-sm font-semibold text-green-800">Point de choc sélectionné</span>
                    </div>
                    <div className="text-xs text-gray-700">
                      <p className="text-sm font-medium">
                        {shockPoints.find(p => p.id === selectedShockPointId)?.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: {shockPoints.find(p => p.id === selectedShockPointId)?.code}
                      </p>
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">{shockPoints.length}</div>
                      <div className="text-xs text-gray-600">Points disponibles</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">{shocks.length}</div>
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
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  Confirmer la rédaction du rapport
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Vérifiez les informations avant de procéder à la rédaction du rapport d'expertise
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Résumé des données */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-blue-800 mb-4">
                    <Calculator className="h-5 w-5" />
                    Résumé de l'expertise
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">{shocks.length}</div>
                      <div className="text-xs text-gray-600">Points de choc</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">{otherCosts.filter(c => c.other_cost_type_id > 0).length}</div>
                      <div className="text-xs text-gray-600">Coûts autres</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-purple-600">{Object.keys(calculationResults).length}</div>
                      <div className="text-xs text-gray-600">Calculs effectués</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {shocks.reduce((total, shock) => 
                          total + shock.shock_works.length + shock.workforces.length, 0
                        )}
                      </div>
                      <div className="text-xs text-gray-600">Lignes totales</div>
                    </div>
                  </div>
                </div>

                {/* Validation des données */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <Check className="h-5 w-5 text-green-600" />
                    Validation des données
                  </h4>
                  
                  <div className="space-y-2">
                    {shocks.length > 0 ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Points de choc configurés</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700">Aucun point de choc ajouté</span>
                      </div>
                    )}
                    
                    {shocks.every(shock => shock.paint_type_id && shock.hourly_rate_id) ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Types de peinture et taux horaires définis</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-700">Types de peinture ou taux horaires manquants</span>
                      </div>
                    )}
                    
                    {Object.keys(calculationResults).length > 0 ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-700">Calculs effectués avec succès</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs">
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
                    <div className="text-xs">
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
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
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
          <Label className="text-xs font-medium text-gray-700 mb-2">Type de coût</Label>
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
          <Label className="text-xs font-medium text-gray-700 mb-2">Montant (FCFA)</Label>
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
  // Récupérer les montants globaux depuis tous les calculs
  const allResults = Object.values(calculationResults)
  
  // Prendre le premier résultat qui contient les montants globaux
  const globalResults = allResults.find(result => 
    result.total_amount_excluding_tax !== undefined ||
    result.total_other_costs_amount_excluding_tax !== undefined
  ) as CalculationResult | undefined

  // Si aucun résultat global n'est trouvé, essayer de récupérer depuis n'importe quel calcul
  const fallbackResults = allResults.length > 0 ? allResults[0] : undefined

  // Montants des autres coûts
  const otherCostsAmounts = {
    total_other_costs_amount_excluding_tax: globalResults?.total_other_costs_amount_excluding_tax || fallbackResults?.total_other_costs_amount_excluding_tax || 0,
    total_other_costs_amount_tax: globalResults?.total_other_costs_amount_tax || fallbackResults?.total_other_costs_amount_tax || 0,
    total_other_costs_amount: globalResults?.total_other_costs_amount || fallbackResults?.total_other_costs_amount || 0,
  }

  // Montants totaux globaux
  const totalAmounts = {
    total_amount_excluding_tax: globalResults?.total_amount_excluding_tax || fallbackResults?.total_amount_excluding_tax || 0,
    total_amount_tax: globalResults?.total_amount_tax || fallbackResults?.total_amount_tax || 0,
    total_amount: globalResults?.total_amount || fallbackResults?.total_amount || 0,
  }

  const formatCurrency = (amount: number) => {
    return (amount / 1000).toFixed(3) || '0.000'
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Récapitulatif global
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Points de choc</p>
            <p className="text-xl font-bold">{shocks.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Calculs effectués</p>
            <p className="text-xl font-bold text-green-600">{Object.keys(calculationResults).length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Coûts autres</p>
            <p className="text-xl font-bold">{otherCosts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total TTC</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totalAmounts.total_amount)}</p>  
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid">
          <div>
            <h4 className="font-semibold mb-4 text-base">Récapitulatif final</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-800">Coûts autres</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">HT:</span>
                    <p className="font-semibold">{formatCurrency(otherCostsAmounts.total_other_costs_amount_excluding_tax)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">TVA:</span>
                    <p className="font-semibold">{formatCurrency(otherCostsAmounts.total_other_costs_amount_tax)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">TTC:</span>
                    <p className="font-semibold">{formatCurrency(otherCostsAmounts.total_other_costs_amount)}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-900 text-base">Total général</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-blue-600">HT:</span>
                    <p className="font-bold text-lg text-blue-900">{formatCurrency(totalAmounts.total_amount_excluding_tax)}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">TVA:</span>
                    <p className="font-bold text-lg text-blue-900">{formatCurrency(totalAmounts.total_amount_tax)}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">TTC:</span>
                    <p className="font-bold text-xl text-blue-900">{formatCurrency(totalAmounts.total_amount)}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">Tous montants calculés par l'API</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
