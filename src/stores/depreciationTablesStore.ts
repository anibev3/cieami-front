import { create } from 'zustand'
import { 
  DepreciationTable, 
  CreateDepreciationTableData, 
  UpdateDepreciationTableData,
  TheoreticalValueCalculationData,
  TheoreticalValueCalculationResult,
  DepreciationTableFilters
} from '@/services/depreciationTableService'
import { depreciationTableService } from '@/services/depreciationTableService'
import { toast } from 'sonner'

interface ApiError {
  response?: {
    data?: {
      errors?: Record<string, string[]>
      message?: string
    }
  }
}

interface DepreciationTablesState {
  // État
  depreciationTables: DepreciationTable[]
  loading: boolean
  error: string | null
  selectedDepreciationTable: DepreciationTable | null
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  } | null
  
  // État pour le calcul de valeur théorique
  theoreticalValueResult: TheoreticalValueCalculationResult | null
  calculatingTheoreticalValue: boolean
  theoreticalValueError: string | null
  
  // Actions
  fetchDepreciationTables: (filters?: DepreciationTableFilters) => Promise<void>
  createDepreciationTable: (data: CreateDepreciationTableData) => Promise<void>
  updateDepreciationTable: (id: number, data: UpdateDepreciationTableData) => Promise<void>
  deleteDepreciationTable: (id: number) => Promise<void>
  setSelectedDepreciationTable: (depreciationTable: DepreciationTable | null) => void
  clearError: () => void
  
  // Actions pour le calcul de valeur théorique
  calculateTheoreticalValue: (data: TheoreticalValueCalculationData) => Promise<void>
  clearTheoreticalValueResult: () => void
}

export const useDepreciationTablesStore = create<DepreciationTablesState>((set) => ({
  // État initial
  depreciationTables: [],
  loading: false,
  error: null,
  selectedDepreciationTable: null,
  pagination: null,
  theoreticalValueResult: null,
  calculatingTheoreticalValue: false,
  theoreticalValueError: null,

  // Actions
  fetchDepreciationTables: async (filters?: DepreciationTableFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await depreciationTableService.getAll(filters)
      set({ 
        depreciationTables: response.data, 
        pagination: {
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
          from: response.meta.from,
          to: response.meta.to
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des tableaux de dépréciation'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createDepreciationTable: async (data: CreateDepreciationTableData) => {
    try {
      set({ loading: true })
      const newDepreciationTable = await depreciationTableService.create(data)
      set(state => ({ 
        depreciationTables: [...state.depreciationTables, newDepreciationTable], 
        loading: false 
      }))
      toast.success('Tableau de dépréciation créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateDepreciationTable: async (id: number, data: UpdateDepreciationTableData) => {
    try {
      set({ loading: true })
      const updatedDepreciationTable = await depreciationTableService.update(id, data)
      set(state => ({
        depreciationTables: state.depreciationTables.map(depreciationTable =>
          depreciationTable.id === id ? updatedDepreciationTable : depreciationTable
        ),
        loading: false
      }))
      toast.success('Tableau de dépréciation mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteDepreciationTable: async (id: number) => {
    try {
      set({ loading: true })
      await depreciationTableService.delete(id)
      set(state => ({
        depreciationTables: state.depreciationTables.filter(depreciationTable => depreciationTable.id !== id),
        loading: false
      }))
      toast.success('Tableau de dépréciation supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedDepreciationTable: (depreciationTable: DepreciationTable | null) => {
    set({ selectedDepreciationTable: depreciationTable })
  },

  clearError: () => {
    set({ error: null })
  },

  // Actions pour le calcul de valeur théorique
  calculateTheoreticalValue: async (data: TheoreticalValueCalculationData) => {
    try {
      set({ calculatingTheoreticalValue: true, theoreticalValueError: null })
      const result = await depreciationTableService.calculateTheoreticalValue(data)
      set({ 
        theoreticalValueResult: result, 
        calculatingTheoreticalValue: false 
      })
      toast.success('Calcul de valeur théorique effectué avec succès')
    } catch (error: unknown) {
      let errorMessage = 'Erreur lors du calcul'
      
      // Gestion des erreurs de validation de l'API
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as ApiError
        if (apiError.response?.data?.errors) {
          const apiErrors = apiError.response.data.errors
          const errorMessages = Object.values(apiErrors).flat()
          errorMessage = errorMessages.join(', ')
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      set({ 
        theoreticalValueError: errorMessage, 
        calculatingTheoreticalValue: false 
      })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  clearTheoreticalValueResult: () => {
    set({ 
      theoreticalValueResult: null, 
      theoreticalValueError: null 
    })
  },
})) 