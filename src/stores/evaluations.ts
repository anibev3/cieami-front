import { create } from 'zustand'
import { toast } from 'sonner'
import evaluationService from '@/services/evaluationService'
import {
  EvaluationCalculationRequest,
  EvaluationCalculationResponse,
  EvaluationSubmissionRequest,
  EvaluationSubmissionResponse
} from '@/types/assignments'

interface EvaluationState {
  // État des données
  calculationResult: EvaluationCalculationResponse['data'] | null
  submissionResult: EvaluationSubmissionResponse['data'] | null
  loading: boolean
  calculating: boolean
  submitting: boolean
  error: string | null
  
  // Actions
  calculateEvaluation: (data: EvaluationCalculationRequest) => Promise<boolean>
  submitEvaluation: (assignmentId: number, data: EvaluationSubmissionRequest) => Promise<boolean>
  clearError: () => void
  clearResults: () => void
}

export const useEvaluationStore = create<EvaluationState>((set, _get) => ({
  // État initial
  calculationResult: null,
  submissionResult: null,
  loading: false,
  calculating: false,
  submitting: false,
  error: null,

  // Calculer l'évaluation
  calculateEvaluation: async (data: EvaluationCalculationRequest) => {
    set({ calculating: true, error: null })
    
    try {
      const response = await evaluationService.calculateEvaluation(data)
      
      if (response.status === 200) {
        set({ 
          calculationResult: response.data, 
          calculating: false 
        })
        toast.success('Calcul d\'évaluation effectué avec succès')
        return true
      } else {
        set({ 
          error: response.message || 'Erreur lors du calcul', 
          calculating: false 
        })
        toast.error(response.message || 'Erreur lors du calcul')
        return false
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du calcul d\'évaluation'
      set({ error: errorMessage, calculating: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Soumettre l'évaluation
  submitEvaluation: async (assignmentId: number, data: EvaluationSubmissionRequest) => {
    set({ submitting: true, error: null })
    
    try {
      const response = await evaluationService.submitEvaluation(assignmentId, data)
      
      if (response.status === 200) {
        set({ 
          submissionResult: response.data, 
          submitting: false 
        })
        toast.success('Évaluation soumise avec succès')
        return true
      } else {
        set({ 
          error: response.message || 'Erreur lors de la soumission', 
          submitting: false 
        })
        toast.error(response.message || 'Erreur lors de la soumission')
        return false
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la soumission de l\'évaluation'
      set({ error: errorMessage, submitting: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Effacer les erreurs
  clearError: () => {
    set({ error: null })
  },

  // Effacer les résultats
  clearResults: () => {
    set({ 
      calculationResult: null, 
      submissionResult: null 
    })
  }
})) 