import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useEvaluationStore } from '@/stores/evaluations'
import { useAssignmentsStore } from '@/stores/assignments'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { useEditData } from '@/features/assignments/hooks'
import { 
  EvaluationCalculationRequest,
  EvaluationSubmissionRequest
} from '@/types/assignments'
import { CreateAscertainmentData } from '@/services/ascertainmentService'

export function useEvaluation() {
  const navigate = useNavigate()
  const { calculateEvaluation, submitEvaluation, calculating, submitting, calculationResult, submissionResult } = useEvaluationStore()
  const { fetchAssignment, currentAssignment } = useAssignmentsStore()
  const { ascertainmentTypes, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  const { shockPoints, supplies, workforceTypes, otherCostTypes, paintTypes, hourlyRates } = useEditData()
  
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('')
  const [marketIncidenceRate, setMarketIncidenceRate] = useState(0)
  const [expertiseDate, setExpertiseDate] = useState(new Date().toISOString().split('T')[0])

  // Charger les données nécessaires
  const loadRequiredData = useCallback(async () => {
    try {
      await Promise.all([
        fetchAscertainmentTypes(),
        // Les autres données sont chargées par useEditData
      ])
    } catch (_error) {
      toast.error('Erreur lors du chargement des données')
    }
  }, [fetchAscertainmentTypes])

  // Préparer les données pour le calcul d'évaluation
  const prepareCalculationData = useCallback((
    ascertainments: CreateAscertainmentData['ascertainments'],
    shocks: Array<{
      shock_point_id: number
      shock_works: Array<{
        supply_id: number
        disassembly: boolean
        replacement: boolean
        repair: boolean
        paint: boolean
        control: boolean
        comment: string
        obsolescence_rate: number
        recovery_rate: number
        discount?: number
        amount: number
      }>
      paint_type_id: number
      hourly_rate_id: number
      with_tax: boolean
      workforces: Array<{
        workforce_type_id: number
        amount: number
      }>
    }>,
    otherCosts: Array<{
      other_cost_type_id: number
      amount: number
    }>
  ): EvaluationCalculationRequest => {
    return {
      vehicle_id: selectedAssignmentId,
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
        shock_works: shock.shock_works.map((work) => ({
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
        workforces: shock.workforces.map((workforce) => ({
          workforce_type_id: workforce.workforce_type_id,
          amount: workforce.amount
        }))
      })),
      other_costs: otherCosts.map(cost => ({
        other_cost_type_id: cost.other_cost_type_id,
        amount: cost.amount
      }))
    }
  }, [selectedAssignmentId, expertiseDate, marketIncidenceRate])

  // Préparer les données pour la soumission d'évaluation
  const prepareSubmissionData = useCallback((
    ascertainments: CreateAscertainmentData['ascertainments'],
    shocks: Array<{
      shock_point_id: number
      shock_works: Array<{
        supply_id: number
        disassembly: boolean
        replacement: boolean
        repair: boolean
        paint: boolean
        control: boolean
        comment: string
        obsolescence_rate: number
        recovery_rate: number
        discount?: number
        amount: number
      }>
      workforces: Array<{
        workforce_type_id: number
        amount: number
      }>
    }>,
    otherCosts: Array<{
      other_cost_type_id: number
      amount: number
    }>
  ): EvaluationSubmissionRequest => {
    return {
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
        shock_works: shock.shock_works.map((work) => ({
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
        workforces: shock.workforces.map((workforce) => ({
          workforce_type_id: workforce.workforce_type_id,
          amount: workforce.amount
        }))
      })),
      other_costs: otherCosts.map(cost => ({
        other_cost_type_id: cost.other_cost_type_id,
        amount: cost.amount
      }))
    }
  }, [marketIncidenceRate])

  // Calculer l'évaluation
  const handleCalculateEvaluation = useCallback(async (
    ascertainments: CreateAscertainmentData['ascertainments'],
    shocks: Array<{
      shock_point_id: number
      shock_works: Array<{
        supply_id: number
        disassembly: boolean
        replacement: boolean
        repair: boolean
        paint: boolean
        control: boolean
        comment: string
        obsolescence_rate: number
        recovery_rate: number
        discount?: number
        amount: number
      }>
      paint_type_id: number
      hourly_rate_id: number
      with_tax: boolean
      workforces: Array<{
        workforce_type_id: number
        amount: number
      }>
    }>,
    otherCosts: Array<{
      other_cost_type_id: number
      amount: number
    }>
  ) => {
    if (!selectedAssignmentId) {
      toast.error('Veuillez sélectionner un dossier')
      return false
    }

    const calculationData = prepareCalculationData(ascertainments, shocks, otherCosts)
    return await calculateEvaluation(calculationData)
  }, [selectedAssignmentId, prepareCalculationData, calculateEvaluation])

  // Soumettre l'évaluation
  const handleSubmitEvaluation = useCallback(async (
    ascertainments: CreateAscertainmentData['ascertainments'],
    shocks: Array<{
      shock_point_id: number
      shock_works: Array<{
        supply_id: number
        disassembly: boolean
        replacement: boolean
        repair: boolean
        paint: boolean
        control: boolean
        comment: string
        obsolescence_rate: number
        recovery_rate: number
        discount?: number
        amount: number
      }>
      workforces: Array<{
        workforce_type_id: number
        amount: number
      }>
    }>,
    otherCosts: Array<{
      other_cost_type_id: number
      amount: number
    }>
  ) => {
    if (!selectedAssignmentId) {
      toast.error('Veuillez sélectionner un dossier')
      return false
    }

    const submissionData = prepareSubmissionData(ascertainments, shocks, otherCosts)
    const success = await submitEvaluation(parseInt(selectedAssignmentId), submissionData)
    
    if (success) {
      toast.success('Évaluation soumise avec succès')
      navigate({ to: '/administration/constat' })
    }
    
    return success
  }, [selectedAssignmentId, prepareSubmissionData, submitEvaluation, navigate])

  // Charger les données du dossier sélectionné
  const loadAssignmentData = useCallback(async (assignmentId: string) => {
    if (assignmentId) {
      await fetchAssignment(parseInt(assignmentId))
    }
  }, [fetchAssignment])

  return {
    // État
    selectedAssignmentId,
    setSelectedAssignmentId,
    marketIncidenceRate,
    setMarketIncidenceRate,
    expertiseDate,
    setExpertiseDate,
    calculating,
    submitting,
    calculationResult,
    submissionResult,
    currentAssignment,
    
    // Données de référence
    ascertainmentTypes,
    shockPoints,
    supplies,
    workforceTypes,
    otherCostTypes,
    paintTypes,
    hourlyRates,
    
    // Actions
    loadRequiredData,
    loadAssignmentData,
    handleCalculateEvaluation,
    handleSubmitEvaluation
  }
} 