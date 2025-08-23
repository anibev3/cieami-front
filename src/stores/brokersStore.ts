import { create } from 'zustand'
import { Entity, EntityFilters } from '@/types/administration'
import { entityService } from '@/services/entityService'
import { toast } from 'sonner'

interface BrokersState {
  brokers: Entity[]
  loading: boolean
  error: string | null
  fetchBrokers: (filters?: EntityFilters) => Promise<void>
}

export const useBrokersStore = create<BrokersState>((set) => ({
  brokers: [],
  loading: false,
  error: null,

  fetchBrokers: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await entityService.getAll({ ...filters, entity_type: '3' })
      set({ brokers: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des courtiers'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },
}))
