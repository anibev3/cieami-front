/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { toast } from 'sonner'
import assignmentRealizationService, { RealizeAssignmentPayload } from '@/services/assignmentRealizationService'

interface AssignmentRealizationState {
  // État
  loading: boolean
  error: string | null
  assignment: any | null

  // Actions
  fetchAssignmentDetails: (assignmentId: string) => Promise<void>
  realizeAssignment: (assignmentId: string, payload: RealizeAssignmentPayload, isEdit?: boolean) => Promise<void>
  updateRealizeAssignment: (assignmentId: string, payload: RealizeAssignmentPayload, isEdit?: boolean) => Promise<void>
  clearError: () => void
  setAssignment: (assignment: any) => void
}

const getErrorMessage = (error: any): string => {
  // Gestion des erreurs API structurées
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const apiError = error.response.data.errors[0]
    if (apiError?.detail) {
      return typeof apiError.detail === 'string' 
        ? apiError.detail 
        : JSON.stringify(apiError.detail)
    } else if (apiError?.title) {
      return typeof apiError.title === 'string'
        ? apiError.title
        : JSON.stringify(apiError.title)
    }
  }
  // Gestion des erreurs API simples
  else if (error.response?.data?.message) {
    return typeof error.response.data.message === 'string'
      ? error.response.data.message
      : JSON.stringify(error.response.data.message)
  }
  
  // Message par défaut
  return error instanceof Error ? error.message : 'Une erreur est survenue'
}

export const useAssignmentRealizationStore = create<AssignmentRealizationState>((set) => ({
  // État initial
  loading: false,
  error: null,
  assignment: null,

  // Actions
  fetchAssignmentDetails: async (assignmentId: string) => {
    try {
      set({ loading: true, error: null })
      const response = await assignmentRealizationService.getAssignmentDetails(assignmentId)
      set({ assignment: response.data, loading: false })
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 3000,
      })
    }
  },

  realizeAssignment: async (assignmentId: string, payload: RealizeAssignmentPayload, isEdit = false) => {
    try {
      set({ loading: true, error: null })
      
      const response = await assignmentRealizationService.realizeAssignment(assignmentId, payload)
      
      // Mettre à jour l'assignment local avec les nouvelles données
      set(state => ({
        assignment: response.data ? { ...state.assignment, ...response.data } : state.assignment,
        loading: false
      }))
      
      const successMessage = isEdit 
        ? 'Réalisation modifiée avec succès' 
        : 'Dossier réalisé avec succès'
      
      toast.success(successMessage, {
        duration: 3000,
      })
      
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      set({ error: errorMessage, loading: false })
      
      toast.error(errorMessage, {
        duration: 5000,
      })
      
      throw error // Re-throw pour permettre au composant de gérer la navigation
    }
  },


  updateRealizeAssignment: async (assignmentId: string, payload: RealizeAssignmentPayload, isEdit = false) => {
    try {
      set({ loading: true, error: null })
      
      const response = await assignmentRealizationService.updateRealizeAssignment(assignmentId, payload)
      
      // Mettre à jour l'assignment local avec les nouvelles données
      set(state => ({
        assignment: response.data ? { ...state.assignment, ...response.data } : state.assignment,
        loading: false
      }))
      
      const successMessage = isEdit 
        ? 'Réalisation modifiée avec succès' 
        : 'Dossier réalisé avec succès'
      
      toast.success(successMessage, {
        duration: 3000,
      })
      
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      set({ error: errorMessage, loading: false })
      
      toast.error(errorMessage, {
        duration: 5000,
      })
      
      throw error // Re-throw pour permettre au composant de gérer la navigation
    }
  },
  clearError: () => {
    set({ error: null })
  },

  setAssignment: (assignment: any) => {
    set({ assignment })
  },
})) 