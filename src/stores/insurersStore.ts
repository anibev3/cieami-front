import { create } from 'zustand'
import { Insurer, InsurerFilters } from '@/services/insurerService'
import { insurerService } from '@/services/insurerService'

interface InsurersState {
  insurers: Insurer[]
  loading: boolean
  error: string | null
  fetchInsurers: (filters?: InsurerFilters) => Promise<void>
}

export const useInsurersStore = create<InsurersState>((set) => ({
  insurers: [],
  loading: false,
  error: null,

  fetchInsurers: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await insurerService.getAll(filters)
      set({ insurers: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des assureurs'
      set({ error: errorMessage, loading: false })
    }
  },
})) 