import { create } from 'zustand'
import { Entity, EntityFilters, CreateEntityData } from '@/types/administration'
import { entityService } from '@/services/entityService'
import { toast } from 'sonner'

interface RepairersState {
  repairers: Entity[]
  loading: boolean
  error: string | null
  fetchRepairers: (filters?: EntityFilters) => Promise<void>
  createRepairer: (data: CreateEntityData) => Promise<void>
}

export const useRepairersStore = create<RepairersState>((set) => ({
  repairers: [],
  loading: false,
  error: null,

  fetchRepairers: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await entityService.getAll({ ...filters, entity_type: 'repairer' })
      set({ repairers: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des réparateurs'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createRepairer: async (data: CreateEntityData) => {
    try {
      set({ loading: true })
      const newRepairer = await entityService.create({ ...data, entity_type_code: 'repairer' })
      set(state => ({ 
        repairers: [...state.repairers, newRepairer], 
        loading: false 
      }))
      toast.success('Réparateur créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },
}))
