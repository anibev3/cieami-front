/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'
import { 
  StatisticsData, 
  StatisticsFilters, 
  StatisticsType,
  AssignmentStatisticsFilters,
  PaymentStatisticsFilters,
  InvoiceStatisticsFilters
} from '@/types/statistics'
import { statisticsService } from '@/services/statisticsService'
import { toast } from 'sonner'

interface StatisticsState {
  // État
  statistics: StatisticsData | null
  loading: boolean
  error: string | null
  currentType: StatisticsType
  
  // Actions
  fetchStatistics: (type: StatisticsType, filters: StatisticsFilters) => Promise<void>
  clearStatistics: () => void
  clearError: () => void
  setCurrentType: (type: StatisticsType) => void
  downloadExport: (exportUrl: string) => Promise<void>
}

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  // État initial
  statistics: null,
  loading: false,
  error: null,
  currentType: 'assignments',

  // Actions
  fetchStatistics: async (type: StatisticsType, filters: StatisticsFilters) => {
    try {
      set({ loading: true, error: null, currentType: type })
      const response = await statisticsService.getStatistics(type, filters)
      set({ statistics: response, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des statistiques'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 3000,
      })
    }
  },

  clearStatistics: () => {
    set({ statistics: null })
  },

  clearError: () => {
    set({ error: null })
  },

  setCurrentType: (type: StatisticsType) => {
    set({ currentType: type })
  },

  downloadExport: async (exportUrl: string) => {
    try {
      await statisticsService.downloadExport(exportUrl)
      toast.success('Export téléchargé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement'
      toast.error(errorMessage, {
        duration: 3000,
      })
    }
  },
}))

// Hooks spécialisés pour chaque type de statistique
export const useAssignmentStatistics = () => {
  const store = useStatisticsStore()
  
  return {
    ...store,
    fetchStatistics: (filters: AssignmentStatisticsFilters) => 
      store.fetchStatistics('assignments', filters),
  }
}

export const usePaymentStatistics = () => {
  const store = useStatisticsStore()
  
  return {
    ...store,
    fetchStatistics: (filters: PaymentStatisticsFilters) => 
      store.fetchStatistics('payments', filters),
  }
}

export const useInvoiceStatistics = () => {
  const store = useStatisticsStore()
  
  return {
    ...store,
    fetchStatistics: (filters: InvoiceStatisticsFilters) => 
      store.fetchStatistics('invoices', filters),
  }
}
