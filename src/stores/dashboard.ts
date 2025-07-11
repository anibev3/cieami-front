import { create } from 'zustand'
import { toast } from 'sonner'
import { dashboardService, DashboardStats } from '@/services/dashboardService'

interface DashboardStore {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  fetchStats: () => Promise<void>
  clearError: () => void
}

export const useDashboardStore = create<DashboardStore>((set, _get) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null })
    
    try {
      const stats = await dashboardService.getAllStats()
      set({ stats, loading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 