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
  FileText,
  Star,
  StarOff,
  TrendingUp,
  DollarSign
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
} from '../hooks'
import { ShockSuppliesTable } from '../components/shock-supplies-table'
import { ShockWorkforceTable } from '../components/shock-workforce-table'
import { OtherCostTypeSelect } from '@/features/widgets/reusable-selects'   
import { ShockPointSelect } from '@/features/widgets/shock-point-select'
import type { Shock } from '../hooks/use-shock-management'
import { useEvaluationStore } from '@/stores/evaluations'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'


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

export default function EvaluateReportPage() {
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

  // États pour l'évaluation et les constats
  const { calculateEvaluation, submitEvaluation, calculating, submitting, calculationResult, submissionResult } = useEvaluationStore()
  const { ascertainmentTypes, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  
  const [marketIncidenceRate, setMarketIncidenceRate] = useState(10) // Valeur par défaut de 10%
  const [expertiseDate, setExpertiseDate] = useState(new Date().toISOString().split('T')[0])
  
  const [ascertainments, setAscertainments] = useState<Array<{
    ascertainment_type_id: string
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string
  }>>([{
    ascertainment_type_id: '',
    very_good: false,
    good: false,
    acceptable: false,
    less_good: false,
    bad: false,
    very_bad: false,
    comment: ''
  }])

  // États pour les modals d'évaluation
  const [showEvaluationCalculationModal, setShowEvaluationCalculationModal] = useState(false)
  const [showEvaluationSubmissionModal, setShowEvaluationSubmissionModal] = useState(false)
  
  // État pour gérer les calculs automatiques avec prévention
  const [autoCalculationTimeout, setAutoCalculationTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isAutoCalculating, setIsAutoCalculating] = useState(false)

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

  // Charger les types de constat
  useEffect(() => {
    if (ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [ascertainmentTypes.length, fetchAscertainmentTypes])

  // Initialiser les valeurs d'évaluation quand l'assignment est chargé
  useEffect(() => {
    console.log('📋 useEffect - Assignment chargé:', {
      assignment: !!assignment,
      vehicle: !!assignment?.vehicle,
      vehicle_id: assignment?.vehicle?.id,
      expertise_date: assignment ? (assignment as any).expertise_date : null,
      current_expertise_date: expertiseDate,
      current_market_rate: marketIncidenceRate
    })

    if (assignment) {
      // Initialiser la date d'expertise
      if ((assignment as any).expertise_date) {
        setExpertiseDate((assignment as any).expertise_date)
        console.log('📅 Date d\'expertise mise à jour:', (assignment as any).expertise_date)
      }
      
      // Initialiser le taux d'incidence marché avec une valeur par défaut si pas définie
      if (marketIncidenceRate === 10) {
        // On garde la valeur par défaut de 10% si pas de valeur spécifique
        setMarketIncidenceRate(10)
        console.log('📊 Taux d\'incidence marché initialisé à 10%')
      }
    }
  }, [assignment, marketIncidenceRate])

  // Nettoyer le timeout quand le composant est démonté
  useEffect(() => {
    return () => {
      if (autoCalculationTimeout) {
        clearTimeout(autoCalculationTimeout)
      }
    }
  }, [autoCalculationTimeout])

  // Fonctions pour gérer les constats
  const updateAscertainment = (index: number, field: string, value: any) => {
    const newAscertainments = [...ascertainments]
    newAscertainments[index] = { ...newAscertainments[index], [field]: value }
    setAscertainments(newAscertainments)
    
    // Déclencher le calcul automatique si c'est un champ de qualité
    if (['very_good', 'good', 'acceptable', 'less_good', 'bad', 'very_bad'].includes(field)) {
      triggerAutoCalculation()
    }
  }

  const addAscertainment = () => {
    setAscertainments([...ascertainments, {
      ascertainment_type_id: '',
      very_good: false,
      good: false,
      acceptable: false,
      less_good: false,
      bad: false,
      very_bad: false,
      comment: ''
    }])
  }

  const removeAscertainment = (index: number) => {
    if (ascertainments.length > 1) {
      const newAscertainments = ascertainments.filter((_, i) => i !== index)
      setAscertainments(newAscertainments)
    }
  }

  const getQualityScore = (ascertainment: any) => {
    if (ascertainment.very_good) return 6
    if (ascertainment.good) return 5
    if (ascertainment.acceptable) return 4
    if (ascertainment.less_good) return 3
    if (ascertainment.bad) return 2
    if (ascertainment.very_bad) return 1
    return 0
  }

  const getQualityColor = (score: number) => {
    if (score >= 5) return 'text-green-600 bg-green-50'
    if (score >= 4) return 'text-blue-600 bg-blue-50'
    if (score >= 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getQualityLabel = (score: number) => {
    if (score >= 5) return 'Excellent'
    if (score >= 4) return 'Bon'
    if (score >= 3) return 'Moyen'
    return 'Faible'
  }

  // Fonctions pour l'évaluation
  const handleCalculateEvaluation = useCallback(async () => {
    // Vérifier que l'assignment et le véhicule existent
    if (!assignment) {
      toast.error('Aucun dossier sélectionné')
      return false
    }

    if (!assignment.vehicle || !assignment.vehicle.id) {
      toast.error('Veuillez sélectionner un dossier avec un véhicule')
      return false
    }

    if (!expertiseDate) {
      toast.error('La date d\'expertise est obligatoire')
      return false
    }

    if (marketIncidenceRate <= 0) {
      toast.error('Le taux d\'incidence marché doit être supérieur à 0')
      return false
    }

    console.log('🔍 handleCalculateEvaluation - Vérifications:', {
      assignment_exists: !!assignment,
      vehicle_exists: !!assignment.vehicle,
      vehicle_id: assignment.vehicle?.id,
      expertise_date: expertiseDate,
      market_incidence_rate: marketIncidenceRate,
      assignment_type: typeof assignment,
      vehicle_type: typeof assignment.vehicle
    })

    const calculationData = {
      vehicle_id: assignment.vehicle.id.toString(),
      expertise_date: expertiseDate,
      market_incidence_rate: marketIncidenceRate,
      ascertainments: ascertainments.map(ascertainment => ({
        ascertainment_type_id: ascertainment.ascertainment_type_id,
        very_good: ascertainment.very_good,
        good: ascertainment.good,
        acceptable: ascertainment.acceptable,
        less_good: ascertainment.less_good,
        bad: ascertainment.bad,
        very_bad: ascertainment.very_bad,
        comment: ascertainment.comment
      })),
      shocks: shocks.map(shock => ({
        shock_point_id: shock.shock_point_id,
        shock_works: shock.shock_works.map((work: any) => ({
          supply_id: work.supply_id.toString(),
          disassembly: work.disassembly,
          replacement: work.replacement,
          repair: work.repair,
          paint: work.paint,
          control: work.control,
          comment: work.comment,
          obsolescence_rate: work.obsolescence_rate,
          recovery_rate: work.recovery_rate,
          discount: work.discount || 0,
          amount: work.amount
        })),
        paint_type_id: shock.paint_type_id,
        hourly_rate_id: shock.hourly_rate_id,
        with_tax: shock.with_tax,
        workforces: shock.workforces.map((workforce: any) => ({
          workforce_type_id: workforce.workforce_type_id,
          amount: workforce.amount
        }))
      })),
      other_costs: otherCosts.map(cost => ({
        other_cost_type_id: cost.other_cost_type_id,
        amount: cost.amount
      }))
    }

    console.log('📤 handleCalculateEvaluation - Données finales envoyées:', calculationData)
    console.log('🔍 Vérification des types:', {
      vehicle_id_type: typeof calculationData.vehicle_id,
      vehicle_id_value: calculationData.vehicle_id,
      expertise_date_type: typeof calculationData.expertise_date,
      expertise_date_value: calculationData.expertise_date,
      market_incidence_rate_type: typeof calculationData.market_incidence_rate,
      market_incidence_rate_value: calculationData.market_incidence_rate
    })

    // Vérification finale avant envoi
    if (!calculationData.vehicle_id || calculationData.vehicle_id === 'undefined' || calculationData.vehicle_id === 'null') {
      console.error('❌ vehicle_id invalide:', calculationData.vehicle_id)
      toast.error('ID du véhicule invalide')
      return false
    }

    if (!calculationData.expertise_date) {
      console.error('❌ expertise_date invalide:', calculationData.expertise_date)
      toast.error('Date d\'expertise invalide')
      return false
    }

    if (!calculationData.market_incidence_rate || calculationData.market_incidence_rate <= 0) {
      console.error('❌ market_incidence_rate invalide:', calculationData.market_incidence_rate)
      toast.error('Taux d\'incidence marché invalide')
      return false
    }

    return await calculateEvaluation(calculationData)
  }, [assignment, expertiseDate, marketIncidenceRate, ascertainments, shocks, otherCosts, calculateEvaluation])

  // Fonction de calcul automatique avec prévention
  const triggerAutoCalculation = useCallback(() => {
    // Annuler le calcul précédent s'il y en a un
    if (autoCalculationTimeout) {
      clearTimeout(autoCalculationTimeout)
    }

    console.log('🔄 triggerAutoCalculation - Vérifications:', {
      assignment_exists: !!assignment,
      vehicle_exists: !!assignment?.vehicle,
      vehicle_id: assignment?.vehicle?.id,
      expertise_date: expertiseDate,
      market_incidence_rate: marketIncidenceRate,
      loading: loading
    })

    // Vérifier si on peut faire un calcul
    if (!assignment?.vehicle?.id || !expertiseDate || marketIncidenceRate <= 0) {
      console.log('❌ triggerAutoCalculation - Conditions non remplies, calcul annulé')
      return
    }

    // Vérifier s'il y a des constats valides
    const hasValidAscertainments = ascertainments.some(ascertainment => 
      ascertainment.ascertainment_type_id && 
      (ascertainment.very_good || ascertainment.good || ascertainment.acceptable || 
       ascertainment.less_good || ascertainment.bad || ascertainment.very_bad)
    )

    if (!hasValidAscertainments) {
      return
    }

    // Programmer le calcul avec un délai de 2 secondes
    const timeout = setTimeout(async () => {
      if (!isAutoCalculating) {
        setIsAutoCalculating(true)
        try {
          await handleCalculateEvaluation()
        } finally {
          setIsAutoCalculating(false)
        }
      }
    }, 2000)

    setAutoCalculationTimeout(timeout)
  }, [assignment, expertiseDate, marketIncidenceRate, ascertainments, autoCalculationTimeout, isAutoCalculating, handleCalculateEvaluation])



  // Fonction de soumission d'évaluation (remplace la rédaction du rapport)
  const handleSubmitEvaluation = useCallback(async () => {
    // Vérifier que l'assignment et le véhicule existent
    if (!assignment) {
      toast.error('Aucun dossier sélectionné')
      return false
    }

    if (!assignment.id) {
      toast.error('ID du dossier manquant')
      return false
    }

    if (!assignment.vehicle || !assignment.vehicle.id) {
      toast.error('Veuillez sélectionner un dossier avec un véhicule')
      return false
    }

    if (!expertiseDate) {
      toast.error('La date d\'expertise est obligatoire')
      return false
    }

    if (marketIncidenceRate <= 0) {
      toast.error('Le taux d\'incidence marché doit être supérieur à 0')
      return false
    }

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
        toast.error('Veuillez sélectionner toutes les fournitures, types de main d\'œuvre, types de peinture et taux horaires avant de soumettre l\'évaluation')
      } else {
        toast.error('Aucun point de choc valide pour soumettre l\'évaluation')
      }
      return false
    }

    const submissionData = {
      market_incidence_rate: marketIncidenceRate,
      ascertainments: ascertainments.map(ascertainment => ({
        ascertainment_type_id: ascertainment.ascertainment_type_id,
        very_good: ascertainment.very_good,
        good: ascertainment.good,
        acceptable: ascertainment.acceptable,
        less_good: ascertainment.less_good,
        bad: ascertainment.bad,
        very_bad: ascertainment.very_bad,
        comment: ascertainment.comment
      })),
      shocks: cleanedShocks.map(shock => ({
        shock_point_id: shock.shock_point_id,
        shock_works: shock.shock_works.map((work: any) => ({
          supply_id: work.supply_id.toString(),
          disassembly: work.disassembly,
          replacement: work.replacement,
          repair: work.repair,
          paint: work.paint,
          control: work.control,
          comment: work.comment,
          obsolescence_rate: work.obsolescence_rate,
          recovery_rate: work.recovery_rate,
          discount: work.discount || 0,
          amount: work.amount
        })),
        workforces: shock.workforces.map((workforce: any) => ({
          workforce_type_id: workforce.workforce_type_id,
          amount: workforce.amount
        }))
      })),
      other_costs: cleanedOtherCosts.map(c => ({
        other_cost_type_id: Number(c.other_cost_type_id),
        amount: Number(c.amount) || 0
      }))
    }

    const success = await submitEvaluation(assignment.id, submissionData)
    if (success) {
      setShowVerificationModal(false)
      toast.success('Évaluation soumise avec succès')
      
      // Calculer le montant total pour le modal de quittances
      let total = 0
      cleanedShocks.forEach((shock: any) => {
        shock.shock_works.forEach((work: any) => {
          total += work.amount || 0
        })
      })
      cleanedOtherCosts.forEach((cost: any) => {
        total += cost.amount || 0
      })
      
      setAssignmentTotalAmount(total)
      setShowReceiptModal(true)
    }
    return success
  }, [assignment, shocks, cleanOtherCosts, marketIncidenceRate, ascertainments, submitEvaluation])

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

      const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.CALCULATE_EVALUATION}`, payload)
      
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
        // calculateAllShocks()
        handleCalculateEvaluation()
      }, 4000)
    }
  }, [updateShock, handleCalculateEvaluation])

  // Fonction de mise à jour des fournitures avec calcul automatique global
  const updateShockWork = useCallback((shockIndex: number, workIndex: number, field: string, value: any) => {
    const updatedShock = { ...shocks[shockIndex] }
    updatedShock.shock_works[workIndex] = { ...updatedShock.shock_works[workIndex], [field]: value }
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                        updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
    
    updateShock(shockIndex, updatedShock)
    
    // if (hasValidData) {
    //   // Déclencher le calcul global automatique après un délai
    //   setTimeout(() => {
    //     calculateAllShocks()
    //   }, 4000)
    // }
  }, [shocks, updateShock, calculateAllShocks])

  // Fonction de mise à jour de la main d'œuvre avec calcul automatique global
  const updateWorkforce = useCallback((shockIndex: number, workforceIndex: number, field: string, value: any) => {
    const updatedShock = { ...shocks[shockIndex] }
    updatedShock.workforces[workforceIndex] = { ...updatedShock.workforces[workforceIndex], [field]: value }
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                        updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
    
    updateShock(shockIndex, updatedShock)
    
    // if (hasValidData) {
    //   // Déclencher le calcul global automatique après un délai
    //   setTimeout(() => {
    //     calculateAllShocks()
    //   }, 4000)
    // }
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
        // calculateAllShocks() 
        handleCalculateEvaluation()
      }, 4000)
    }
  }, [updateOtherCost, otherCosts, handleCalculateEvaluation])

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
        // calculateAllShocks()
        handleCalculateEvaluation()
      }, 4000)
    }
  }, [removeOtherCost, otherCosts, handleCalculateEvaluation])

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Chargement du dossier...</p>
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

  if (!assignment.vehicle || !assignment.vehicle.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Dossier sans véhicule valide</p>
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
              <Button 
                onClick={() => setShowShockModal(true)}
                className=" from-black-600 to-black-600 hover:from-black-700 hover:to-black-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="font-semibold">Ajouter un point de choc</span>
              </Button>

              {/* Boutons d'évaluation */}
              <Button 
                variant="outline"
                onClick={async () => {
                  const success = await handleCalculateEvaluation()
                //   if (success) {
                //     setShowEvaluationCalculationModal(true)
                //   }
                }}
                disabled={calculating || !assignment?.vehicle?.id}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calcul en cours...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculer l'évaluation
                  </>
                )}
              </Button>

                              <Button 
                  onClick={async () => {
                    const success = await handleSubmitEvaluation()
                    if (success) {
                      setShowEvaluationSubmissionModal(true)
                    }
                  }}
                  disabled={submitting || !calculationResult || !assignment?.vehicle?.id || !expertiseDate || marketIncidenceRate <= 0}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Soumettre l'évaluation
                  </>
                )}
              </Button>

              {/* Bouton de soumission d'évaluation */}
              <Button 
                disabled={!hasUnsavedChanges || submitting} 
                onClick={() => setShowVerificationModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Soumettre l'évaluation
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
                      onUpdate={(i, field, value) => {
                        updateShockWork(index, i, field, value)
                        // setTimeout(() => {
                        //   handleCalculateEvaluation()
                        // }, 4000)
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
                        // Ne pas déclencher le calcul automatiquement lors de l'ajout d'une ligne vide
                        // Le calcul se déclenchera quand l'utilisateur sélectionnera une fourniture
                      }}
                      onRemove={(i) => {

                        console.log('🔘 tannnnnnn Bouton Remove cliqué - État actuel:', {
                          assignment: !!assignment,
                          vehicle: !!assignment?.vehicle,
                          vehicle_id: assignment?.vehicle?.id,
                          expertise_date: expertiseDate,
                          market_incidence_rate: marketIncidenceRate,
                          loading: loading
                        })
                        const updatedShock = { ...s }
                        updatedShock.shock_works.splice(i, 1)
                        
                        // Vérifier s'il reste des données valides avant de déclencher le calcul
                        const hasValidData = updatedShock.shock_works.some((work: any) => work.supply_id && work.supply_id !== 0) ||
                                           updatedShock.workforces.some((workforce: any) => workforce.workforce_type_id && workforce.workforce_type_id !== 0)
                        
                        updateShock(index, updatedShock)
                        
                        if (hasValidData) {
                          setTimeout(() => {
                            handleCalculateEvaluation()
                          }, 4000)
                        }
                      }}
                      onValidateRow={async (workIndex) => {
                        // Déclencher le calcul pour ce choc uniquement
                        // await calculateSingleShock(index)

                        console.log('🔘 tannnnnnn Bouton Calculer cliqué - État actuel:', {
                          assignment: !!assignment,
                          vehicle: !!assignment?.vehicle,
                          vehicle_id: assignment?.vehicle?.id,
                          expertise_date: expertiseDate,
                          market_incidence_rate: marketIncidenceRate,
                          loading: loading
                        })

                        handleCalculateEvaluation()
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
                                  // // Déclencher le calcul pour ce choc uniquement
                                  // await calculateSingleShock(index)

                                  console.log('🔘 tannnnnnn Bouton Calculer cliqué - État actuel:', {
                                    assignment: !!assignment,
                                    vehicle: !!assignment?.vehicle,
                                    vehicle_id: assignment?.vehicle?.id,
                                    expertise_date: expertiseDate,
                                    market_incidence_rate: marketIncidenceRate,
                                    loading: loading
                                  })
                          
                          handleCalculateEvaluation()
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

          {/* Section des constats */}
          <div className="space-y-4 mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Constats d'évaluation
                {ascertainments.length > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {ascertainments.length} constat(s)
                  </Badge>
                )}
                {isAutoCalculating && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Calcul automatique...
                  </Badge>
                )}
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addAscertainment}
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un constat
              </Button>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="space-y-4">
              {ascertainments.map((ascertainment, index) => (
                <AscertainmentItem
                  key={index}
                  ascertainment={ascertainment}
                  ascertainmentTypes={ascertainmentTypes}
                  onUpdate={(field, value) => updateAscertainment(index, field, value)}
                  onRemove={() => removeAscertainment(index)}
                  onValidate={() => triggerAutoCalculation()}
                  getQualityScore={getQualityScore}
                  getQualityColor={getQualityColor}
                  getQualityLabel={getQualityLabel}
                />
              ))}
            </div>
          </div>

          {/* Section des paramètres d'évaluation */}
          <div className="space-y-4 mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Paramètres d'évaluation
                {isAutoCalculating && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Calcul automatique...
                  </Badge>
                )}
              </h2>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    console.log('🔘 Bouton Calculer cliqué - État actuel:', {
                      assignment: !!assignment,
                      vehicle: !!assignment?.vehicle,
                      vehicle_id: assignment?.vehicle?.id,
                      expertise_date: expertiseDate,
                      market_incidence_rate: marketIncidenceRate,
                      loading: loading
                    })
                    
                    const success = await handleCalculateEvaluation()
                    if (success) {
                      setShowEvaluationCalculationModal(true)
                    }
                  }}
                  disabled={calculating || loading || !assignment?.vehicle?.id || !expertiseDate || marketIncidenceRate <= 0}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  {calculating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculer l'évaluation
                    </>
                  )}
                </Button>
                <Button 
                  onClick={async () => {
                    const success = await handleSubmitEvaluation()
                    if (success) {
                      setShowEvaluationSubmissionModal(true)
                    }
                  }}
                  disabled={submitting || !calculationResult}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Soumission en cours...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Soumettre l'évaluation
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2">
                  Date d'expertise
                  {!expertiseDate && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  type="date"
                  value={expertiseDate}
                  onChange={(e) => {
                    setExpertiseDate(e.target.value)
                    // Déclencher le calcul automatique après un délai
                    setTimeout(() => triggerAutoCalculation(), 1000)
                  }}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 ${!expertiseDate ? 'border-red-300' : ''}`}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2">
                  Taux d'incidence marché (%)
                  {marketIncidenceRate <= 0 && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  type="number"
                  value={marketIncidenceRate}
                  onChange={(e) => {
                    setMarketIncidenceRate(Number(e.target.value))
                    // Déclencher le calcul automatique après un délai
                    setTimeout(() => triggerAutoCalculation(), 1000)
                  }}
                  placeholder="10"
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 ${marketIncidenceRate <= 0 ? 'border-red-300' : ''}`}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2">
                  Véhicule
                  {!assignment?.vehicle?.id && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className={`p-2 rounded border text-xs ${!assignment?.vehicle?.id ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  {assignment?.vehicle ? (
                    <div>
                      <div className="font-medium">{assignment.vehicle.license_plate}</div>
                      <div className="text-gray-600">
                        {assignment.vehicle.brand?.label} {assignment.vehicle.vehicle_model?.label}
                      </div>
                      <div className="text-gray-500">ID: {assignment.vehicle.id}</div>
                    </div>
                  ) : (
                    <div className="text-red-600">Aucun véhicule sélectionné</div>
                  )}
                </div>
              </div>
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
                  
                  <ShockPointSelect
                    value={selectedShockPointId}
                    onValueChange={setSelectedShockPointId}
                    shockPoints={shockPoints}
                    showSelectedInfo={true}
                  />
                </div>



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
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  Confirmer la soumission de l'évaluation
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Vérifiez les informations avant de procéder à la soumission de l'évaluation
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Résumé des données */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="flex items-center gap-2 text-base font-semibold text-blue-800 mb-4">
                    <Calculator className="h-5 w-5" />
                    Résumé de l'évaluation
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
                        La soumission de l'évaluation va sauvegarder définitivement toutes les modifications et soumettre l'évaluation finale.
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
                  disabled={submitting || shocks.length === 0} 
                  onClick={() => {
                    setRedirectToReport(true)
                    handleSubmitEvaluation()
                  }}
                  className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Soumission en cours...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Confirmer et soumettre
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

          {/* Modal de calcul d'évaluation */}
          <Dialog open={showEvaluationCalculationModal} onOpenChange={setShowEvaluationCalculationModal}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  Résultat du calcul d'évaluation
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Détails du calcul d'évaluation effectué
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {calculationResult && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="flex items-center gap-2 text-base font-semibold text-blue-800 mb-4">
                        <DollarSign className="h-5 w-5" />
                        Résultats de l'évaluation
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-blue-600">
                            {calculationResult.market_value?.toLocaleString('fr-FR')} F CFA
                          </div>
                          <div className="text-xs text-gray-600">Valeur marché</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-green-600">
                            {calculationResult.total_amount?.toLocaleString('fr-FR')} F CFA
                          </div>
                          <div className="text-xs text-gray-600">Coût total</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-purple-600">
                            {calculationResult.salvage_value?.toLocaleString('fr-FR')} F CFA
                          </div>
                          <div className="text-xs text-gray-600">Valeur de récupération</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xl font-bold text-orange-600">
                            {calculationResult.final_amount?.toLocaleString('fr-FR')} F CFA
                          </div>
                          <div className="text-xs text-gray-600">Montant final</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                        <Calculator className="h-5 w-5 text-blue-600" />
                        Détails des calculs
                      </h4>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Montant HT:</span>
                            <p className="font-semibold">{calculationResult.total_amount_excluding_tax?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-gray-600">TVA:</span>
                            <p className="font-semibold">{calculationResult.total_amount_tax?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Dépréciation:</span>
                            <p className="font-semibold">{calculationResult.depreciation_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Calculs effectués:</span>
                            <p className="font-semibold">{Object.keys(calculationResult.calculations || {}).length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEvaluationCalculationModal(false)}
                  className="px-6"
                >
                  Fermer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal de soumission d'évaluation */}
          <Dialog open={showEvaluationSubmissionModal} onOpenChange={setShowEvaluationSubmissionModal}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  Évaluation soumise avec succès
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  L'évaluation a été soumise et enregistrée dans le système
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {submissionResult && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <h4 className="flex items-center gap-2 text-base font-semibold text-green-800 mb-4">
                      <Check className="h-5 w-5" />
                      Confirmation de soumission
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">ID de l'évaluation</div>
                        <div className="text-lg font-bold text-green-600">{submissionResult.evaluation_id}</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">ID du dossier</div>
                        <div className="text-lg font-bold text-blue-600">{submissionResult.assignment_id}</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">Montant total</div>
                        <div className="text-lg font-bold text-purple-600">{submissionResult.total_amount?.toLocaleString('fr-FR')} F CFA</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-800 mb-1">Date de création</div>
                        <div className="text-sm text-gray-600">{new Date(submissionResult.created_at).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  onClick={() => {
                    setShowEvaluationSubmissionModal(false)
                    navigate({ to: '/assignments' })
                  }}
                  className="px-6 bg-green-600 hover:bg-green-700"
                >
                  Retour aux dossiers
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Main>
    </>
  )
}

// Composant AscertainmentItem
function AscertainmentItem({ 
  ascertainment, 
  ascertainmentTypes, 
  onUpdate, 
  onRemove,
  onValidate,
  getQualityScore,
  getQualityColor,
  getQualityLabel
}: {
  ascertainment: {
    ascertainment_type_id: string
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string
  }
  ascertainmentTypes: Array<{ id: number; label: string; code: string }>
  onUpdate: (field: string, value: any) => void
  onRemove: () => void
  onValidate?: () => void
  getQualityScore: (ascertainment: any) => number
  getQualityColor: (score: number) => string
  getQualityLabel: (score: number) => string
}) {
  const qualityScore = getQualityScore(ascertainment)
  const qualityColor = getQualityColor(qualityScore)
  const qualityLabel = getQualityLabel(qualityScore)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-600" />
          Constat d'évaluation
        </h4>
        <div className="flex items-center gap-2">
          {qualityScore > 0 && (
            <Badge variant="outline" className={`text-xs ${qualityColor}`}>
              {qualityLabel} ({qualityScore}/6)
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {qualityScore > 0 && ascertainment.ascertainment_type_id && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                // Déclencher le calcul pour ce constat
                if (typeof onValidate === 'function') {
                  onValidate()
                }
              }}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Valider et calculer l'évaluation"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-2">Type de constat</Label>
          <Select
            value={ascertainment.ascertainment_type_id}
            onValueChange={(value) => onUpdate('ascertainment_type_id', value)}
          >
            <SelectTrigger className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-200">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {ascertainmentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700 mb-2">Qualité</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`very_good_${ascertainment.ascertainment_type_id}`}
                checked={ascertainment.very_good}
                onCheckedChange={(checked) => {
                  onUpdate('very_good', checked)
                  if (checked) {
                    onUpdate('good', false)
                    onUpdate('acceptable', false)
                    onUpdate('less_good', false)
                    onUpdate('bad', false)
                    onUpdate('very_bad', false)
                  }
                }}
              />
              <Label htmlFor={`very_good_${ascertainment.ascertainment_type_id}`} className="text-xs">
                Très bon
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`good_${ascertainment.ascertainment_type_id}`}
                checked={ascertainment.good}
                onCheckedChange={(checked) => {
                  onUpdate('good', checked)
                  if (checked) {
                    onUpdate('very_good', false)
                    onUpdate('acceptable', false)
                    onUpdate('less_good', false)
                    onUpdate('bad', false)
                    onUpdate('very_bad', false)
                  }
                }}
              />
              <Label htmlFor={`good_${ascertainment.ascertainment_type_id}`} className="text-xs">
                Bon
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`acceptable_${ascertainment.ascertainment_type_id}`}
                checked={ascertainment.acceptable}
                onCheckedChange={(checked) => {
                  onUpdate('acceptable', checked)
                  if (checked) {
                    onUpdate('very_good', false)
                    onUpdate('good', false)
                    onUpdate('less_good', false)
                    onUpdate('bad', false)
                    onUpdate('very_bad', false)
                  }
                }}
              />
              <Label htmlFor={`acceptable_${ascertainment.ascertainment_type_id}`} className="text-xs">
                Acceptable
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`less_good_${ascertainment.ascertainment_type_id}`}
                checked={ascertainment.less_good}
                onCheckedChange={(checked) => {
                  onUpdate('less_good', checked)
                  if (checked) {
                    onUpdate('very_good', false)
                    onUpdate('good', false)
                    onUpdate('acceptable', false)
                    onUpdate('bad', false)
                    onUpdate('very_bad', false)
                  }
                }}
              />
              <Label htmlFor={`less_good_${ascertainment.ascertainment_type_id}`} className="text-xs">
                Moins bon
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`bad_${ascertainment.ascertainment_type_id}`}
                checked={ascertainment.bad}
                onCheckedChange={(checked) => {
                  onUpdate('bad', checked)
                  if (checked) {
                    onUpdate('very_good', false)
                    onUpdate('good', false)
                    onUpdate('acceptable', false)
                    onUpdate('less_good', false)
                    onUpdate('very_bad', false)
                  }
                }}
              />
              <Label htmlFor={`bad_${ascertainment.ascertainment_type_id}`} className="text-xs">
                Mauvais
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`very_bad_${ascertainment.ascertainment_type_id}`}
                checked={ascertainment.very_bad}
                onCheckedChange={(checked) => {
                  onUpdate('very_bad', checked)
                  if (checked) {
                    onUpdate('very_good', false)
                    onUpdate('good', false)
                    onUpdate('acceptable', false)
                    onUpdate('less_good', false)
                    onUpdate('bad', false)
                  }
                }}
              />
              <Label htmlFor={`very_bad_${ascertainment.ascertainment_type_id}`} className="text-xs">
                Très mauvais
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700 mb-2">Commentaire</Label>
          <RichTextEditor
            value={ascertainment.comment}
            onChange={(value) => onUpdate('comment', value)}
            placeholder="Ajouter un commentaire sur ce constat..."
            className="min-h-[100px]"
          />
        </div>
      </div>
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
        <OtherCostTypeSelect
          value={cost.other_cost_type_id}
          onValueChange={(value) => onUpdate('other_cost_type_id', value)}
          label="Type de coût"
          showError={!cost.other_cost_type_id}
        />
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
