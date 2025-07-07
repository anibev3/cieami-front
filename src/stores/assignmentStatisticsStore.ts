import { create } from 'zustand'
import { AssignmentStatistics, AssignmentStatisticsFilters } from '@/types/assignments'
import { assignmentStatisticsService } from '@/services/assignmentStatisticsService'
import { toast } from 'sonner'

interface AssignmentStatisticsState {
  // État
  statistics: AssignmentStatistics | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchStatistics: (filters: AssignmentStatisticsFilters) => Promise<void>
  clearStatistics: () => void
  clearError: () => void
}

export const useAssignmentStatisticsStore = create<AssignmentStatisticsState>((set) => ({
  // État initial
  statistics: null,
  loading: false,
  error: null,

  // Actions
  fetchStatistics: async (filters: AssignmentStatisticsFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await assignmentStatisticsService.getStatistics(filters)
      set({ statistics: response, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  clearStatistics: () => {
    set({ statistics: null })
  },

  clearError: () => {
    set({ error: null })
  },
})) 