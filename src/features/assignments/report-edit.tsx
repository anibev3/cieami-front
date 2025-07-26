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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Main } from '@/components/layout/main'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
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
  TrendingUp,
  Star,
  StarOff,
  CalendarIcon,
  Car,
  AlertCircle,
  Receipt
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
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { useRemarkStore } from '@/stores/remarkStore'
import { ShockSuppliesTable } from './components/shock-supplies-table'
import { ShockWorkforceTable } from './components/shock-workforce-table'
import { OtherCostTypeSelect } from '@/features/widgets/reusable-selects'   
import { ShockPointSelect } from '@/features/widgets/shock-point-select'
import { AscertainmentTypeSelect } from '@/features/widgets/ascertainment-type-select'
import { ClaimNatureSelect } from '@/features/widgets'
import { RemarkSelect } from '@/features/widgets'
import { GeneralStateSelect } from '@/features/widgets/general-state-select'
import { TechnicalConclusionSelect } from '@/features/widgets/technical-conclusion-select'
import { ShockPointMutateDialog } from '@/features/expertise/points-de-choc/components/shock-point-mutate-dialog'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import type { Shock } from './hooks/use-shock-management'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'


interface OtherCostType {
  id: number
  label: string
  code: string
}

interface ClaimNature {
  id: number
  code: string
  label: string
  description: string
  status: {
    id: number
    code: string | null
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_at: string
  updated_at: string
}

interface Remark {
  id: number
  label: string
  description: string
  status: {
    id: number
    code: string | null
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_at: string
  updated_at: string
}

// Interfaces pour les constats
interface Ascertainment {
  ascertainment_type_id: string
  very_good: boolean
  good: boolean
  acceptable: boolean
  less_good: boolean
  bad: boolean
  very_bad: boolean
  comment: string | null
}

interface CalculationResult {
  shocks: any[]
  other_costs: any[]
  shock_works?: any[]
  workforces?: any[]
  // Montants globaux (niveau global)
  shocks_amount_excluding_tax?: number
  shocks_amount_tax?: number
  shocks_amount?: number
  total_other_costs_amount_excluding_tax?: number
  total_other_costs_amount_tax?: number
  total_other_costs_amount?: number
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
    hourlyRates,
    reloadData
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
  } = useOtherCosts(
    assignment?.other_costs && assignment.other_costs.length > 0
      ? assignment.other_costs.map(cost => ({
          other_cost_type_id: cost.other_cost_type_id,
          amount: parseFloat(cost.amount) || 0
        }))
      : undefined
  )
  
  const {
    calculationResults,
    loadingCalculation,
    calculateAll,
    removeCalculation,
    getCalculatedCount,
    getTotalAmount,
    updateCalculation
  } = useCalculations()

  // Hook pour les types de constat
  const { ascertainmentTypes, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  
  // Hook pour les remarques
  const { remarks, fetchRemarks } = useRemarkStore()
  
  // États pour les modals
  const [showShockModal, setShowShockModal] = useState(false)
  const [showCalculationModal, setShowCalculationModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showCreateShockPointModal, setShowCreateShockPointModal] = useState(false)
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
  const [marketIncidenceRate, setMarketIncidenceRate] = useState(0) // Valeur par défaut de 6%
  const [expertiseDate, setExpertiseDate] = useState(new Date().toISOString().split('T')[0])
  
  // États pour les données des selects
  const [generalStates, setGeneralStates] = useState<any[]>([])
  const [claimNatures, setClaimNatures] = useState<any[]>([])
  const [technicalConclusions, setTechnicalConclusions] = useState<any[]>([])
  const [instructions, setInstructions] = useState('')
  
  // États pour les champs supplémentaires des dossiers NON-évaluation
  const [seenBeforeWorkDate, setSeenBeforeWorkDate] = useState<string>('')
  const [seenDuringWorkDate, setSeenDuringWorkDate] = useState<string>('')
  const [seenAfterWorkDate, setSeenAfterWorkDate] = useState<string>('')
  const [contactDate, setContactDate] = useState<string>('')
  const [expertisePlace, setExpertisePlace] = useState('')
  const [assuredValue, setAssuredValue] = useState<number>(0)
  const [salvageValue, setSalvageValue] = useState<number>(0)
  const [workDuration, setWorkDuration] = useState('')
  
  // États pour les nouveaux champs requis par l'API
  const [claimNatureId, setClaimNatureId] = useState<number | null>(null)
  const [expertRemark, setExpertRemark] = useState('')
  const [selectedRemarkId, setSelectedRemarkId] = useState<number | null>(null)
  const [generalStateId, setGeneralStateId] = useState<number | null>(null)
  const [technicalConclusionId, setTechnicalConclusionId] = useState<number | null>(null)
  const isEvaluation = assignment?.expertise_type?.code === 'evaluation'
  
  const [ascertainments, setAscertainments] = useState<Array<{
    ascertainment_type_id: string
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string
  }>>([])

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

  // Vérifier si des coûts autres pré-remplis ont été chargés
  useEffect(() => {
    if (assignment?.other_costs && assignment.other_costs.length > 0) {
      toast.success(`${assignment.other_costs.length} coût(s) autre(s) pré-rempli(s) chargé(s)`)
    }
  }, [assignment?.other_costs])

  // Charger les types de constat
  useEffect(() => {
    if (ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [ascertainmentTypes.length, fetchAscertainmentTypes])

  // Charger les remarques
  useEffect(() => {
    if (remarks.length === 0) {
      fetchRemarks()
    }
  }, [remarks.length, fetchRemarks])

  // Initialiser les valeurs d'évaluation quand l'assignment est chargé
  useEffect(() => {
    if (assignment) {
      // Initialiser la date d'expertise
      if ((assignment as any).expertise_date) {
        setExpertiseDate((assignment as any).expertise_date)
      }
      
      // Pré-remplir les champs selon le type d'expertise
      if (!isEvaluation) {
        // Champs requis pour les dossiers NON-évaluation
        if ((assignment as any).general_state?.id) {
          setGeneralStateId((assignment as any).general_state.id)
        }
        if ((assignment as any).technical_conclusion?.id) {
          setTechnicalConclusionId((assignment as any).technical_conclusion.id)
        }
        if ((assignment as any).expert_report_remark) {
          setExpertRemark((assignment as any).expert_report_remark)
        }
        
        // Champs supplémentaires pour les dossiers NON-évaluation
        if ((assignment as any).seen_before_work_date) {
          setSeenBeforeWorkDate((assignment as any).seen_before_work_date)
        }
        if ((assignment as any).seen_during_work_date) {
          setSeenDuringWorkDate((assignment as any).seen_during_work_date)
        }
        if ((assignment as any).seen_after_work_date) {
          setSeenAfterWorkDate((assignment as any).seen_after_work_date)
        }
        if ((assignment as any).contact_date) {
          setContactDate((assignment as any).contact_date)
        }
        if ((assignment as any).expertise_place) {
          setExpertisePlace((assignment as any).expertise_place)
        }
        if ((assignment as any).assured_value) {
          setAssuredValue((assignment as any).assured_value)
        }
        if ((assignment as any).salvage_value) {
          setSalvageValue((assignment as any).salvage_value)
        }
        if ((assignment as any).work_duration) {
          setWorkDuration((assignment as any).work_duration)
        }
      } else {
        // Champs requis pour les dossiers d'évaluation
        if ((assignment as any).instructions) {
          setInstructions((assignment as any).instructions)
        }
        if ((assignment as any).market_incidence_rate) {
          setMarketIncidenceRate((assignment as any).market_incidence_rate)
        }
      }
    }
  }, [assignment, isEvaluation])
  
  // Charger les données des selects
  useEffect(() => {
    const loadSelectData = async () => {
      try {
        // Charger les états généraux
        const generalStatesResponse = await axiosInstance.get('/general-states')
        setGeneralStates(generalStatesResponse.data.data || [])
        
        // Charger les natures de sinistre
        const claimNaturesResponse = await axiosInstance.get('/claim-natures')
        setClaimNatures(claimNaturesResponse.data.data || [])
        
        // Charger les conclusions techniques
        const technicalConclusionsResponse = await axiosInstance.get('/technical-conclusions')
        setTechnicalConclusions(technicalConclusionsResponse.data.data || [])
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }
    
    loadSelectData()
  }, [])

  // Fonctions pour gérer les constats
  const updateAscertainment = (index: number, field: string, value: any) => {
    const newAscertainments = [...ascertainments]
    
    // Si c'est un champ de qualité et qu'on coche une option
    if (['very_good', 'good', 'acceptable', 'less_good', 'bad', 'very_bad'].includes(field) && value === true) {
      // Décocher toutes les autres options
      newAscertainments[index] = {
        ...newAscertainments[index],
        very_good: false,
        good: false,
        acceptable: false,
        less_good: false,
        bad: false,
        very_bad: false,
        [field]: value
      }
    } else {
      // Mise à jour normale
      newAscertainments[index] = { ...newAscertainments[index], [field]: value }
    }
    
    setAscertainments(newAscertainments)
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
    const newAscertainments = ascertainments.filter((_, i) => i !== index)
    setAscertainments(newAscertainments)
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

  // Fonction de rédaction directe du rapport
  const handleGenerateReport = useCallback(async () => {
    // Validation des champs requis

    if (!isEvaluation) {
    
      if (!claimNatureId) {
        toast.error('Veuillez sélectionner une nature de sinistre')
        return
      }
    
      if (!expertRemark.trim()) {
        toast.error('Veuillez saisir une remarque d\'expert')
        return
      }
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
          obsolescence: work.obsolescence,
          comment: work.comment,
          obsolescence_rate: work.obsolescence_rate,
          recovery_amount: work.recovery_amount,
          discount: work.discount,
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
      // Paramètres d'évaluation
      vehicle_id: assignment?.vehicle?.id?.toString(),
      expertise_date: expertiseDate,
      // Constats
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
      repairer_id: 1,
      // Champs requis selon le type d'expertise
      ...(isEvaluation ? {
        // Champs pour les dossiers d'évaluation
        instructions: instructions,
        market_incidence_rate: marketIncidenceRate,
      } : {
        // Champs pour les dossiers NON-évaluation
        general_state_id: generalStateId || 1,
        technical_conclusion_id: technicalConclusionId || 1,
        claim_nature_id: claimNatureId,
        report_remark_id: selectedRemarkId,
        expert_report_remark: expertRemark,
        // Champs supplémentaires
        seen_before_work_date: seenBeforeWorkDate || null,
        seen_during_work_date: seenDuringWorkDate || null,
        seen_after_work_date: seenAfterWorkDate || null,
        contact_date: contactDate || null,
        expertise_place: expertisePlace || null,
        assured_value: assuredValue || null,
        salvage_value: salvageValue || null,
        work_duration: workDuration || null,
      })
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
  }, [shocks, cleanOtherCosts, saveAssignment, claimNatureId, expertRemark, generalStateId, technicalConclusionId, selectedRemarkId, instructions, isEvaluation, seenBeforeWorkDate, seenDuringWorkDate, seenAfterWorkDate, contactDate, expertisePlace, assuredValue, salvageValue, workDuration])

  // Gestion des quittances
  const handleReceiptSave = useCallback((receipts: any[]) => {
    toast.success(`${receipts.length} quittance(s) ajoutée(s) avec succès`)
    navigate({ to: '/assignments' })
  }, [navigate])

  const handleReceiptClose = useCallback(() => {
    navigate({ to: '/assignments' })
  }, [navigate])


  // const handleReceiptclick = useCallback((receipts: any[]) => {
  //   toast.success(`${receipts.length} quittance(s) ajoutée(s) avec succès`)
  //   setShowReceiptModal(false)
  // }, [])

  // const handleReceiptClose_ = useCallback(() => {
  //   setShowReceiptModal(false)
  // }, [])

  // Gestion de la création de point de choc
  const handleCreateShockPoint = useCallback(() => {
    setShowCreateShockPointModal(true)
  }, [])

  const handleShockPointCreated = useCallback(async () => {
    // Rafraîchir les données après création
    await reloadData()
    setShowCreateShockPointModal(false)
    toast.success('Point de choc créé avec succès')
  }, [reloadData])

  const handleSupplyCreated = useCallback(async (newSupply: any) => {
    // Rafraîchir les données après création
    await reloadData()
    toast.success('Fourniture créée avec succès')
  }, [reloadData])



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
      }, 4000)
    }
  }, [updateShock])

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
        // calculateAllShocks()
      }, 4000)
    }
  }, [shocks, updateShock])

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
        // calculateAllShocks()
      }, 4000)
    }
  }, [shocks, updateShock])

  // Fonction de mise à jour des autres coûts avec calcul automatique global
  const updateOtherCostWithCalculation = useCallback((index: number, field: 'other_cost_type_id' | 'amount', value: number) => {
    updateOtherCost(index, field, value)
    
    // Vérifier s'il y a des données valides avant de déclencher le calcul
    const updatedOtherCosts = [...otherCosts]
    updatedOtherCosts[index] = { ...updatedOtherCosts[index], [field]: value }
    const hasValidData = updatedOtherCosts.some(cost => cost.other_cost_type_id > 0)
    
    if (hasValidData) {
      // Déclencher le calcul global automatique après un délai
      // setTimeout(() => {
        // calculateAllShocks()
      // }, 1000)
    }
  }, [updateOtherCost, otherCosts])

  // Fonction d'ajout d'autres coûts avec calcul automatique global
  const addOtherCostWithCalculation = useCallback(() => {
    addOtherCost()
    
    // Ne pas déclencher le calcul automatiquement lors de l'ajout d'une ligne vide
    // Le calcul se déclenchera quand l'utilisateur sélectionnera un type de coût
  }, [addOtherCost])

  // Fonction de suppression d'autres coûts avec calcul automatique global
  const removeOtherCostWithCalculation = useCallback(async (index: number) => {
    await removeOtherCost(index)
    
    // Vérifier s'il reste des données valides avant de déclencher le calcul
    const remainingOtherCosts = otherCosts.filter((_, i) => i !== index)
    const hasValidData = remainingOtherCosts.some(cost => cost.other_cost_type_id > 0)
    
    // if (hasValidData) {
    //   // Déclencher le calcul global automatique après un délai
    //   setTimeout(() => {
        // calculateAllShocks()
    //   }, 4000)
    // }
  }, [removeOtherCost, otherCosts])

  // Handlers pour les nouveaux champs
  const handleClaimNatureChange = useCallback((value: number | null) => {
    setClaimNatureId(value)
    setHasUnsavedChanges(true)
  }, [setHasUnsavedChanges])

  const handleRemarkChange = useCallback((value: number | null) => {
    setSelectedRemarkId(value)
    
    // Quand une remarque est sélectionnée, pré-remplir le champ expert_remark
    if (value) {
      const selectedRemark = remarks.find(remark => remark.id === value)
      if (selectedRemark) {
        setExpertRemark(selectedRemark.description)
        toast.success(`Remarque "${selectedRemark.label}" chargée`)
      }
    } else {
      // Si aucune remarque n'est sélectionnée, vider le champ
      setExpertRemark('')
    }
    setHasUnsavedChanges(true)
  }, [remarks, setHasUnsavedChanges])

  const handleExpertRemarkChange = useCallback((value: string) => {
    setExpertRemark(value)
    setHasUnsavedChanges(true)
  }, [setHasUnsavedChanges])

  const handleGeneralStateChange = useCallback((value: number | null) => {
    setGeneralStateId(value)
    setHasUnsavedChanges(true)
  }, [setHasUnsavedChanges])

  const handleTechnicalConclusionChange = useCallback((value: number | null) => {
    setTechnicalConclusionId(value)
    setHasUnsavedChanges(true)
  }, [setHasUnsavedChanges])

  // Fonction unifiée pour préparer le payload complet
  const prepareCompletePayload = useCallback(() => {
    // Filtrer les chocs valides
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
          obsolescence: work.obsolescence,
          comment: work.comment,
          obsolescence_rate: work.obsolescence_rate,
          recovery_amount: work.recovery_amount,
          discount: work.discount,
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

    // Filtrer les autres coûts valides
    const validOtherCosts = otherCosts
      .filter(cost => cost.other_cost_type_id > 0)
      .map(cost => ({
        other_cost_type_id: cost.other_cost_type_id,
        amount: cost.amount
      }))

    // Préparer les constats
    const validAscertainments = ascertainments.map(ascertainment => ({
      ascertainment_type_id: ascertainment.ascertainment_type_id,
      very_good: ascertainment.very_good,
      good: ascertainment.good,
      acceptable: ascertainment.acceptable,
      less_good: ascertainment.less_good,
      bad: ascertainment.bad,
      very_bad: ascertainment.very_bad,
      comment: ascertainment.comment
    }))

    return {
      shocks: validShocks,
      other_costs: validOtherCosts,
      // Paramètres d'évaluation
      vehicle_id: assignment?.vehicle?.id?.toString(),
      expertise_date: expertiseDate,
      // Constats
      ascertainments: validAscertainments,
      assignment_id: assignmentId,
      // Champs requis selon le type d'expertise
      ...(isEvaluation ? {
        // Champs pour les dossiers d'évaluation
        instructions: instructions,
        market_incidence_rate: marketIncidenceRate,
      } : {
        // Champs pour les dossiers NON-évaluation
        
        general_state_id: generalStateId || 1,
        technical_conclusion_id: technicalConclusionId || 1,
        claim_nature_id: claimNatureId,
        report_remark_id: selectedRemarkId,
        expert_report_remark: expertRemark,
        // Champs supplémentaires
        seen_before_work_date: seenBeforeWorkDate || null,
        seen_during_work_date: seenDuringWorkDate || null,
        seen_after_work_date: seenAfterWorkDate || null,
        contact_date: contactDate || null,
        expertise_place: expertisePlace || null,
        assured_value: assuredValue || null,
        salvage_value: salvageValue || null,
        work_duration: workDuration || null,
      })
    }
  }, [
    shocks, 
    otherCosts, 
    ascertainments, 
    assignment, 
    expertiseDate, 
    marketIncidenceRate, 
    assignmentId, 
    generalStateId, 
    technicalConclusionId, 
    claimNatureId, 
    expertRemark,
    isEvaluation,
    instructions,
    selectedRemarkId,
    seenBeforeWorkDate,
    seenDuringWorkDate,
    seenAfterWorkDate,
    contactDate,
    expertisePlace,
    assuredValue,
    salvageValue,
    workDuration
  ])

  // Fonction unifiée pour effectuer le calcul
  const performCalculation = useCallback(async (targetShockIndex?: number) => {
    const payload = prepareCompletePayload()
    
    // // Vérifier s'il y a des données valides
    // const hasValidData = payload.shocks.length > 0 || payload.other_costs.length > 0
    
    // if (!hasValidData) {
    //   console.log('Aucune donnée valide pour le calcul')
    //   return
    // }

    // Si on calcule pour un choc spécifique, marquer seulement celui-ci
    if (targetShockIndex !== undefined) {
      setCalculatingShocks(new Set([targetShockIndex]))
    } else {
      // Sinon, marquer tous les chocs
      setCalculatingShocks(new Set(shocks.map((_, index) => index)))
    }

    try {
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
        toast.success('Calcul effectué avec succès')
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error)
      toast.error('Erreur lors du calcul')
    } finally {
      // Retirer tous les points de choc du calcul en cours
      setCalculatingShocks(new Set())
    }
  }, [prepareCompletePayload, shocks, updateShock, updateCalculation, setHasUnsavedChanges])

  // Fonction de calcul global automatique pour tous les points de choc
  const calculateAllShocks = useCallback(async () => {
    // Utiliser la fonction unifiée pour le calcul global
    await performCalculation()
  }, [performCalculation])

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

    // Utiliser la fonction unifiée pour le calcul
    await performCalculation(shockIndex)
  }, [shocks, performCalculation])

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
            <Button variant="outline" disabled={!hasUnsavedChanges || saving} className="bg-gradient-to-r from-black-600 to-black-600 hover:from-black-700 hover:to-black-700 text-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 " onClick={() => calculateAllShocks()}>
              {loadingCalculation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calcul en cours...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Effectuer le calcul
                </>
              )}
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

          {/* Nouveaux champs requis par l'API */}
          {!isEvaluation && (
            <div className="space-y-6 mt-10 mb-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informations complémentaires
              </h2>
              
              <div className="">
                {/* Remarque d'expert */}
                <Card className='shadow-none'>
                  <CardHeader>
                    <CardTitle className="text-base">Note d'expert</CardTitle>
                    <CardDescription>
                      {/* Sélectionnez une remarque prédéfinie ou créez-en une personnalisée */}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="claim-nature">Nature de sinistre</Label>
                        <ClaimNatureSelect
                          value={claimNatureId}
                          onValueChange={handleClaimNatureChange}
                          placeholder="Choisir une nature de sinistre..."
                          showStatus={true}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="technical-conclusion">Conclusion technique</Label>
                        <TechnicalConclusionSelect
                          value={technicalConclusionId || 0}
                          onValueChange={setTechnicalConclusionId}
                          technicalConclusions={technicalConclusions}
                          placeholder="Sélectionner une conclusion..."
                          showSelectedInfo={false}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expert-remark">Note d'expert</Label>
                        <RemarkSelect
                          value={selectedRemarkId}
                          onValueChange={handleRemarkChange}
                          placeholder="Choisir une note d'expert..."
                          showStatus={true}
                          showDescription={true}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="general-state">État général</Label>
                        <GeneralStateSelect
                          value={generalStateId || 0}
                          onValueChange={setGeneralStateId}
                          generalStates={generalStates}
                          placeholder="Sélectionner un état général..."
                          showSelectedInfo={false}
                        />
                      </div>
                    </div>
                    
                  
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="expert-remark">Note d'expert</Label>
                        {selectedRemarkId && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <FileText className="mr-1 h-3 w-3" />
                            Remarque prédéfinie chargée
                          </Badge>
                        )}
                      </div>
                      <RichTextEditor
                        value={expertRemark}
                        onChange={handleExpertRemarkChange}
                        placeholder="Rédigez votre note d'expert..."
                        className="min-h-[220px]"
                      />
                      {selectedRemarkId && (
                        <p className="text-xs text-muted-foreground">
                          Vous pouvez modifier cette note d'expert selon vos besoins
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dates de visite */}
                <Card className='shadow-none mt-4'>
                  <CardHeader>
                    <CardTitle className="text-base">Dates de visite</CardTitle>
                    <CardDescription>
                      Dates des différentes visites effectuées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="seen-before-work">Date de visite avant travaux</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left text-sm",
                                !seenBeforeWorkDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {seenBeforeWorkDate ? (
                                format(new Date(seenBeforeWorkDate), "dd/MM/yyyy", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={seenBeforeWorkDate ? new Date(seenBeforeWorkDate) : undefined}
                              initialFocus
                              onSelect={(date) => {
                                if (date) {
                                  setSeenBeforeWorkDate(date.toISOString().split('T')[0])
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seen-during-work">Date de visite pendant travaux</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left text-sm",
                                !seenDuringWorkDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {seenDuringWorkDate ? (
                                format(new Date(seenDuringWorkDate), "dd/MM/yyyy", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={seenDuringWorkDate ? new Date(seenDuringWorkDate) : undefined}
                              initialFocus
                              onSelect={(date) => {
                                if (date) {
                                  setSeenDuringWorkDate(date.toISOString().split('T')[0])
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seen-after-work">Date de visite après travaux</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left text-sm",
                                !seenAfterWorkDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {seenAfterWorkDate ? (
                                format(new Date(seenAfterWorkDate), "dd/MM/yyyy", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={seenAfterWorkDate ? new Date(seenAfterWorkDate) : undefined}
                              initialFocus
                              onSelect={(date) => {
                                if (date) {
                                  setSeenAfterWorkDate(date.toISOString().split('T')[0])
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations générales */}
                <Card className='shadow-none mt-4'>
                  <CardHeader>
                    <CardTitle className="text-base">Informations générales</CardTitle>
                    <CardDescription>
                      Informations complémentaires sur l'expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-date">Date de contact</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left text-sm",
                                !contactDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {contactDate ? (
                                format(new Date(contactDate), "dd/MM/yyyy", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={contactDate ? new Date(contactDate) : undefined}
                              initialFocus
                              onSelect={(date) => {
                                if (date) {
                                  setContactDate(date.toISOString().split('T')[0])
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expertise-place">Lieu de l'expertise</Label>
                        <Input
                          id="expertise-place"
                          value={expertisePlace}
                          onChange={(e) => setExpertisePlace(e.target.value)}
                          placeholder="Ex: Cocody, Abidjan"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="work-duration">Durée des travaux</Label>
                        <Input
                          id="work-duration"
                          value={workDuration}
                          onChange={(e) => setWorkDuration(e.target.value)}
                          placeholder="Ex: 15 jours"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assured-value">Valeur assurée (FCFA)</Label>
                        <Input
                          id="assured-value"
                          type="number"
                          min="0"
                          step="1000"
                          value={assuredValue}
                          onChange={(e) => setAssuredValue(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salvage-value">Valeur de sauvetage (FCFA)</Label>
                        <Input
                          id="salvage-value"
                          type="number"
                          min="0"
                          step="1000"
                          value={salvageValue}
                          onChange={(e) => setSalvageValue(parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          {isEvaluation && (
            <div>
              {/* Section des paramètres d'évaluation - EN PREMIER PLAN */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Paramètres d'évaluation
                  </h2>
                </div>
                <div className="border-b border-gray-200 mb-4"></div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        Date d'expertise
                        {!expertiseDate && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left text-sm",
                              !expertiseDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expertiseDate ? (
                              format(new Date(expertiseDate), "EEEE, d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={expertiseDate ? new Date(expertiseDate) : undefined}
                            initialFocus
                            onSelect={(date) => {
                              if (date) {
                                setExpertiseDate(date.toISOString().split('T')[0])
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Taux d'incidence marché (%)
                        {marketIncidenceRate <= 0 && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={marketIncidenceRate}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0
                          setMarketIncidenceRate(Math.max(0, value))
                        }}
                        onBlur={(e) => {
                          const value = parseFloat(e.target.value) || 0
                          setMarketIncidenceRate(Math.max(0, value))
                        }}
                        placeholder="6"
                        className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 ${marketIncidenceRate < 0 ? 'border-red-300' : ''}`}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Car className="h-4 w-4 text-purple-600" />
                        Véhicule
                        {!assignment?.vehicle?.id && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <div className={`p-2 rounded-lg border-2 ${!assignment?.vehicle?.id ? 'bg-red-50 border-red-200' : 'bg-white border-blue-200'}`}>
                        {assignment?.vehicle ? (
                          <div className="">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-[13px] text-gray-800">{assignment.vehicle.license_plate}</div>
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                <Check className="mr-1 h-2 w-3" />
                                Valide
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-600 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Aucun véhicule sélectionné
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions de l'expert */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Instructions de l'expert
                  </h2>
                </div>
                <div className="border-b border-gray-200 mb-4"></div>
                
                <Card className='shadow-none'>
                  <CardHeader>
                    <CardTitle className="text-base">Instructions</CardTitle>
                    <CardDescription>
                      Rédigez les instructions spécifiques pour cette évaluation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions de l'expert</Label>
                      <RichTextEditor
                        value={instructions}
                        onChange={setInstructions}
                        placeholder="Rédigez vos instructions pour cette évaluation..."
                        className="min-h-[200px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section des constats */}
              <div className="space-y-4 mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Constatation
                    {ascertainments.length > 0 && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {ascertainments.length} constatation(s)
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
                    Ajouter une constatation
                  </Button>
                </div>
                <div className="border-b border-gray-200 mb-4"></div>
                
                {/* Tableau des constats */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* En-tête du tableau avec bouton de calcul */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">Liste des constatations</span>
                      {ascertainments.length > 0 && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {ascertainments.length} constatation(s)
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={calculateAllShocks}
                      disabled={ascertainments.length === 0 || loadingCalculation}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {loadingCalculation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calcul en cours...
                        </>
                      ) : (
                        <>
                          <Calculator className="mr-2 h-4 w-4" />
                          Calculer avec constats
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Type de constatation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Qualité
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Commentaire
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ascertainments.map((ascertainment, index) => (
                          <AscertainmentItem
                            key={index}
                            ascertainment={ascertainment}
                            ascertainmentTypes={ascertainmentTypes}
                            onUpdate={(field, value) => updateAscertainment(index, field, value)}
                            onRemove={() => removeAscertainment(index)}
                            getQualityScore={getQualityScore}
                            getQualityColor={getQualityColor}
                            getQualityLabel={getQualityLabel}
                            index={index}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Message quand aucun constat */}
                {ascertainments.length === 0 && (
                  <div className="text-center pb-5">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
                      <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-base font-semibold text-gray-700 mb-2">Aucune constatation</h3>
                      <p className="text-sm text-gray-500 mb-4">Ajoutez des constatations pour évaluer la qualité du véhicule</p>
                      <Button 
                        onClick={addAscertainment}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                          Ajouter une constatation
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Liste des points de choc */}
          <div className="space-y-6 mt-10 w-full">
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
            
            {/* Affichage quand aucun choc */}
            {shocks.length === 0 && (
              <div className="text-center w-full">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 w-full mx-auto">
                  <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun point de choc</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Commencez par ajouter des points de choc pour effectuer l'expertise du véhicule
                  </p>
                  <Button 
                    onClick={() => setShowShockModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Ajouter un point de choc
                  </Button>
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
                      isEvaluation={isEvaluation}
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
                          obsolescence: false,
                          comment: '',
                          obsolescence_rate: 0,
                          recovery_amount: 0,
                          discount: 0,
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
                        
                        // if (hasValidData) {
                        //   setTimeout(() => {
                        //     calculateAllShocks()
                        //   }, 4000)
                        // }
                      }}
                      onValidateRow={async (workIndex) => {
                        // Déclencher le calcul pour ce choc uniquement
                        await calculateSingleShock(index)
                      }}
                      onSupplyCreated={handleSupplyCreated}
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
                        
                        // if (hasValidData) {
                        //   setTimeout(() => {
                        //     calculateAllShocks()
                        //   }, 4000)
                        // }
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
                      onWorkforceTypeCreated={async (newWorkforceType) => {
                        // Rafraîchir les données après création
                        await reloadData()
                        toast.success('Type de main d\'œuvre créé avec succès')
                      }}
                    />



  
                    {/* Résultat du calcul */}
                    {calculationResults[index] && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        {/* <div className="flex items-center justify-between mb-3">
                          <h4 className="flex items-center gap-2 text-sm text-green-800 font-semibold">
                            <Check className="h-4 w-4" />
                            Calcul terminé
                          </h4>
                        </div> */}


                        {/* <pre className="text-xs">
                          {JSON.stringify(calculationResults[index], null, 2)}
                        </pre> */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="flex items-center gap-2 text-sm text-green-800 font-semibold">
                            <Check className="h-4 w-4" />
                            Calcul terminé
                          </h4>
                          {/* <Button variant="outline" size="sm" onClick={() => {
                            setSelectedShockIndex(index)
                            setShowCalculationModal(true)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </Button> */}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-[13px]">
                          <div>
                            <span className="text-green-600">Total Main d'œuvre :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_workforce_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Total Fournitures neuves :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_paint_product_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Total récuperation :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_recovery_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Total vetusté :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_obsolescence_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Total remise :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_discount_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Total produits de peinture :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_paint_product_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Total petite fourniture :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_small_supply_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <span className="text-green-600">Montant total :</span>
                            <p className="font-semibold">{(calculationResults[index].shocks[0] as any)?.total_shock_amount?.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          {/* <div>
                            <span className="text-green-600">Fournitures :</span>
                            <p className="font-semibold">{(calculationResults[index] as CalculationResult).shock_works?.length || 0}</p>
                          </div>
                          <div>
                            <span className="text-green-600">Main d'œuvre :</span>
                            <p className="font-semibold">{(calculationResults[index] as CalculationResult).workforces?.length || 0}</p>
                          </div> */}
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
                  console.log('costPPPPPPP', cost),
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
          <Card className="mt-10">
            <CardContent>
              <div className="flex justify-end gap-3">
                {/* <Button 
                  onClick={() => setShowReceiptModal(true)}
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Gérer les quittances
                </Button> */}
                <Button 
                  disabled={!hasUnsavedChanges || saving
                    // || !claimNatureId || !expertRemark.trim()
                  } 
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
              
              {/* Message d'aide pour les champs requis */}
              {/* {!isEvaluation && (
                <>
                {(!claimNatureId || !expertRemark.trim()) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Pour rédiger le rapport, vous devez remplir :
                        {!claimNatureId && <span className="font-semibold"> Nature du sinistre</span>}
                        {!claimNatureId && !expertRemark.trim() && <span>, </span>}
                        {!expertRemark.trim() && <span className="font-semibold"> Remarque d'expert</span>}
                      </span>
                    </div>
                  </div>
                  )}
                </>
              )} */}
              
            </CardContent>
          </Card>
          {/* Modal d'ajout de point de choc */}
          <Dialog open={showShockModal} onOpenChange={setShowShockModal}>
            <DialogContent className="sm:max-w-lg">
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
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        Point de choc à ajouter
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" onClick={handleCreateShockPoint}>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un nouveau point de choc
                      </Button>
                    </div>
                  </div>
                  
                  <ShockPointSelect
                    value={selectedShockPointId}
                    onValueChange={setSelectedShockPointId}
                    shockPoints={shockPoints}
                    showSelectedInfo={true}
                    onCreateNew={handleCreateShockPoint}
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
            onSave={handleReceiptSave}
            onClose={handleReceiptClose}
          />

          {/* Modal de création de point de choc */}
          <ShockPointMutateDialog
            open={showCreateShockPointModal}
            onOpenChange={setShowCreateShockPointModal}
            onSuccess={handleShockPointCreated}
          />
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
  getQualityScore,
  getQualityColor,
  getQualityLabel,
  index
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
  getQualityScore: (ascertainment: any) => number
  getQualityColor: (score: number) => string
  getQualityLabel: (score: number) => string
  index: number
}) {
  const qualityScore = getQualityScore(ascertainment)
  const qualityColor = getQualityColor(qualityScore)
  const qualityLabel = getQualityLabel(qualityScore)

  // Trouver le type de constat sélectionné
  const selectedType = ascertainmentTypes.find(type => type.id.toString() === ascertainment.ascertainment_type_id)

  return (
    <tr className="hover:bg-gray-50">
      {/* Numéro */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-600" />
          #{index + 1}
        </div>
      </td>

      {/* Type de constat */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="w-48">
          <AscertainmentTypeSelect
            value={Number(ascertainment.ascertainment_type_id)}
            onValueChange={(value) => onUpdate('ascertainment_type_id', value)}
          />
        </div>
      </td>

      {/* Qualité */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="space-y-2">
          {/* Badge de qualité */}
          {qualityScore > 0 && (
            <Badge className={`${qualityColor} mb-2`}>
              {qualityLabel}
            </Badge>
          )}
          
          {/* Checkboxes de qualité */}
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center space-x-1">
              <Checkbox
                id={`very_good_${index}`}
                checked={ascertainment.very_good}
                onCheckedChange={(checked) => onUpdate('very_good', checked)}
                className="h-3 w-3"
              />
              <Label htmlFor={`very_good_${index}`} className="text-xs">Très bon</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id={`good_${index}`}
                checked={ascertainment.good}
                onCheckedChange={(checked) => onUpdate('good', checked)}
                className="h-3 w-3"
              />
              <Label htmlFor={`good_${index}`} className="text-xs">Bon</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id={`acceptable_${index}`}
                checked={ascertainment.acceptable}
                onCheckedChange={(checked) => onUpdate('acceptable', checked)}
                className="h-3 w-3"
              />
              <Label htmlFor={`acceptable_${index}`} className="text-xs">Acceptable</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id={`less_good_${index}`}
                checked={ascertainment.less_good}
                onCheckedChange={(checked) => onUpdate('less_good', checked)}
                className="h-3 w-3"
              />
              <Label htmlFor={`less_good_${index}`} className="text-xs">Peu bon</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id={`bad_${index}`}
                checked={ascertainment.bad}
                onCheckedChange={(checked) => onUpdate('bad', checked)}
                className="h-3 w-3"
              />
              <Label htmlFor={`bad_${index}`} className="text-xs">Mauvais</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id={`very_bad_${index}`}
                checked={ascertainment.very_bad}
                onCheckedChange={(checked) => onUpdate('very_bad', checked)}
                className="h-3 w-3"
              />
              <Label htmlFor={`very_bad_${index}`} className="text-xs">Très mauvais</Label>
            </div>
          </div>
        </div>
      </td>

      {/* Commentaire */}
      <td className="px-4 py-3">
        <div className="w-64">
          <Textarea
            value={ascertainment.comment}
            onChange={(e) => onUpdate('comment', e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="min-h-[60px] text-xs resize-none"
          />
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
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
            min="0"
            step="0.01"
            value={cost.amount}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0
              onUpdate('amount', Math.max(0, value))
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value) || 0
              onUpdate('amount', Math.max(0, value))
            }}
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
