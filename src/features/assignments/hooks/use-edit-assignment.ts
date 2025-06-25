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
  total_amount: number
  created_at: string
  updated_at: string
}

export function useEditAssignment(assignmentId: number) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Charger l'assignation
  const loadAssignment = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`)
      setAssignment(response.data.data)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }, [assignmentId])

  // Sauvegarder l'assignation
  const saveAssignment = useCallback(async (payload: unknown, redirectToReport = false) => {
    setSaving(true)
    try {
      await axiosInstance.put(`${API_CONFIG.ENDPOINTS.ASSIGNMENTS}/${assignmentId}`, payload)
      setHasUnsavedChanges(false)
      toast.success('L\'assignation a été éditée avec succès')
      
      // Redirection conditionnelle
      if (redirectToReport) {
        navigate({ to: `/assignments/report/${assignmentId}` })
      }
      
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
    goBack
  }
} 