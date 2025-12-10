/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

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
  assignment_type: {
    id: number
    code: string
    label: string
    description: string
  }
  expertise_type: {
    id: number
    code: string
    label: string
    description: string
  }
  total_amount: number
  created_at: string
  updated_at: string
  // Nouvelles propriétés pour les données complètes
  shocks?: ApiShock[]
  other_costs?: ApiOtherCost[]
  emails?: Array<{ email: string }>
}

// Types pour les données de l'API
interface ApiSupply {
  id: number
  label: string
  description: string
}

interface ApiWorkforceType {
  id: number
  label: string
}

interface ApiShockWork {
  id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  control: boolean
  in_order: boolean
  comment: string | null
  obsolescence_rate: string
  obsolescence_amount_excluding_tax: string
  obsolescence_amount_tax: string
  obsolescence_amount: string
  recovery_amoun: string
  recovery_amount_excluding_tax: string
  recovery_amount_tax: string
  recovery_amount: string
  new_amount_excluding_tax: string
  new_amount_tax: string
  new_amount: string
  amount_excluding_tax: string | null
  amount_tax: string | null
  amount: string | null
  supply: ApiSupply
}

interface ApiWorkforce {
  id: number
  workforce_type: ApiWorkforceType
  nb_hours: string
  work_fee: string
  discount: string
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  all_paint?: boolean
}

interface ApiShockPoint {
  id: number
  code: string
  label: string
  description: string
}

interface ApiShock {
  id: number
  obsolescence_amount_excluding_tax: string | null
  obsolescence_amount_tax: string | null
  obsolescence_amount: string | null
  recovery_amount_excluding_tax: string | null
  recovery_amount_tax: string | null
  recovery_amount: string | null
  new_amount_excluding_tax: string | null
  new_amount_tax: string | null
  new_amount: string | null
  workforce_amount_excluding_tax: string | null
  workforce_amount_tax: string | null
  workforce_amount: string | null
  amount_excluding_tax: string | null
  amount_tax: string | null
  amount: string | null
  shock_point: ApiShockPoint
  shock_works: ApiShockWork[]
  workforces: ApiWorkforce[]
}

interface ApiOtherCost {
  id: number
  other_cost_type_id: number
  amount: string
}

// Interface pour les données formatées des shocks
export interface FormattedShockData {
  uid: string
  shock_point_id: number
  shock_works: Array<{
    uid: string
    supply_id: number
    disassembly: boolean
    replacement: boolean
    repair: boolean
    paint: boolean
    control: boolean
    comment: string
    obsolescence_rate: number
    // recovery_amount: number
    discount: number
    amount: number
    // Données calculées
    obsolescence_amount_excluding_tax?: number
    obsolescence_amount_tax?: number
    obsolescence_amount?: number
    recovery_amount_excluding_tax?: number
    recovery_amount_tax?: number
    recovery_amount?: number
    new_amount_excluding_tax?: number
    new_amount_tax?: number
    new_amount?: number
    discount_amount?: number
  }>
  paint_type_id: number
  hourly_rate_id: number
  workforces: Array<{
    uid: string
    workforce_type_id: number
    workforce_type_label: string
    nb_hours: number
    work_fee: string
    discount: number
    amount_excluding_tax: number
    amount_tax: number
    amount: number
    all_paint?: boolean
  }>
  comment: string
  with_tax: boolean
}

export function useEditAssignment(assignmentId: string) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [formattedShocks, setFormattedShocks] = useState<FormattedShockData[]>([])

  // Fonction pour formater les données des shocks de l'API
  const formatShocksFromAPI = useCallback((apiShocks: ApiShock[]): FormattedShockData[] => {
    return apiShocks.map(shock => ({
      uid: crypto.randomUUID(), // Générer un UID unique
      shock_point_id: shock.shock_point?.id || 0,
      shock_works: shock.shock_works?.map((work: ApiShockWork) => ({
        uid: crypto.randomUUID(),
        supply_id: work.supply?.id || 0,
        disassembly: work.disassembly || false,
        replacement: work.replacement || false,
        repair: work.repair || false,
        paint: work.paint || false,
        control: work.control || false,
        in_order: work.in_order || false,
        comment: work.comment || '',
        obsolescence_rate: parseFloat(work.obsolescence_rate) || 0,
        recovery_amoun: parseFloat(work.recovery_amoun) || 0,
          discount: 0, // Valeur par défaut pour les données existantes
        amount: parseFloat(work.amount || '0') || 0,
        // Données calculées
        obsolescence_amount_excluding_tax: parseFloat(work.obsolescence_amount_excluding_tax) || 0,
        obsolescence_amount_tax: parseFloat(work.obsolescence_amount_tax) || 0,
        obsolescence_amount: parseFloat(work.obsolescence_amount) || 0,
        recovery_amount_excluding_tax: parseFloat(work.recovery_amount_excluding_tax) || 0,
        recovery_amount_tax: parseFloat(work.recovery_amount_tax) || 0,
        recovery_amount: parseFloat(work.recovery_amount) || 0,
        new_amount_excluding_tax: parseFloat(work.new_amount_excluding_tax) || 0,
        new_amount_tax: parseFloat(work.new_amount_tax) || 0,
        new_amount: parseFloat(work.new_amount) || 0,
          discount_amount: 0, // Valeur par défaut pour les données existantes
      })) || [],
      paint_type_id: 1, // Valeur par défaut
      hourly_rate_id: 1, // Valeur par défaut
      workforces: shock.workforces?.map((workforce: ApiWorkforce) => ({
        uid: crypto.randomUUID(),
        workforce_type_id: workforce.workforce_type?.id || 0,
        workforce_type_label: workforce.workforce_type?.label || '',
        nb_hours: parseFloat(workforce.nb_hours) || 0,
        work_fee: workforce.work_fee?.toString() || '0',
        discount: parseFloat(workforce.discount) || 0,
        amount_excluding_tax: parseFloat(workforce.amount_excluding_tax) || 0,
        amount_tax: parseFloat(workforce.amount_tax) || 0,
        amount: parseFloat(workforce.amount) || 0,
        all_paint: workforce.all_paint || false,
      })) || [],
      comment: '',
      with_tax: true,
    }))
  }, [])

  // Charger l'assignation
  const loadAssignment = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
      const assignmentData = response.data.data
      setAssignment(assignmentData)
      
      // Formater les shocks si ils existent
      if (assignmentData.shocks && assignmentData.shocks.length > 0) {
        const formatted = formatShocksFromAPI(assignmentData.shocks)
        setFormattedShocks(formatted)
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }, [assignmentId, formatShocksFromAPI])

  // Sauvegarder l'assignation
  const saveAssignment = useCallback(async (payload: unknown, _redirectToReport = false) => {
    setSaving(true)
    try {
      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS_EDIT}/${assignmentId}`, payload)
      setHasUnsavedChanges(false)
      toast.success('L\'assignation a été éditée avec succès')
      
      // Redirection conditionnelle
      // if (redirectToReport) {
      //   navigate({ to: `/assignments/report/${assignmentId}` })
      // }
      
      return true
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de l\'édition:', error)
      toast.error('Une erreur est survenue lors de l\'édition')
      return false
    } finally {
      setSaving(false)
    }
  }, [assignmentId, navigate])

  // Navigation
  const goBack = useCallback(() => {
    navigate({ to: '/assignments' })
  }, [navigate])

  // Charger les données au montage
  useEffect(() => {
    if (assignmentId) {
      loadAssignment()
    }
  }, [assignmentId, loadAssignment])

  return {
    loading,
    assignment,
    saving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveAssignment,
    goBack,
    formattedShocks,
    setFormattedShocks
  }
} 