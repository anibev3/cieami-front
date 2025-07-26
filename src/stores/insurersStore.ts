import { create } from 'zustand'
import { Insurer } from '@/services/insurerService'
import { insurerService } from '@/services/insurerService'

interface InsurersState {
  insurers: Insurer[]
  loading: boolean
  error: string | null
  fetchInsurers: () => Promise<void>
}

export const useInsurersStore = create<InsurersState>((set) => ({
  insurers: [],
  loading: false,
  error: null,

  fetchInsurers: async () => {
    try {
      set({ loading: true, error: null })
      const response = await insurerService.getAll()
      set({ insurers: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des assureurs'
      set({ error: errorMessage, loading: false })
    }
  },
})) 