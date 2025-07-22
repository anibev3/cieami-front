import { create } from 'zustand'
import { ClaimNature, CreateClaimNatureData, UpdateClaimNatureData } from '@/types/administration'
import { claimNatureService } from '@/services/claimNatureService'
import { toast } from 'sonner'

interface ClaimNatureState {
  // État
  claimNatures: ClaimNature[]
  loading: boolean
  error: string | null
  selectedClaimNature: ClaimNature | null
  
  // Actions
  fetchClaimNatures: () => Promise<void>
  createClaimNature: (data: CreateClaimNatureData) => Promise<void>
  updateClaimNature: (id: number, data: UpdateClaimNatureData) => Promise<void>
  deleteClaimNature: (id: number) => Promise<void>
  setSelectedClaimNature: (claimNature: ClaimNature | null) => void
  clearError: () => void
}

export const useClaimNatureStore = create<ClaimNatureState>((set) => ({
  // État initial
  claimNatures: [],
  loading: false,
  error: null,
  selectedClaimNature: null,

  // Actions
  fetchClaimNatures: async () => {
    try {
      set({ loading: true, error: null })
      const response = await claimNatureService.getAll()
      set({ claimNatures: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des natures de sinistres'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createClaimNature: async (data: CreateClaimNatureData) => {
    try {
      set({ loading: true })
      const newClaimNature = await claimNatureService.create(data)
      set(state => ({ 
        claimNatures: [...state.claimNatures, newClaimNature], 
        loading: false 
      }))
      toast.success('Nature de sinistre créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateClaimNature: async (id: number, data: UpdateClaimNatureData) => {
    try {
      set({ loading: true })
      const updatedClaimNature = await claimNatureService.update(id, data)
      set(state => ({
        claimNatures: state.claimNatures.map(claimNature =>
          claimNature.id === id ? updatedClaimNature : claimNature
        ),
        loading: false
      }))
      toast.success('Nature de sinistre mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteClaimNature: async (id: number) => {
    try {
      set({ loading: true })
      await claimNatureService.delete(id)
      set(state => ({
        claimNatures: state.claimNatures.filter(claimNature => claimNature.id !== id),
        loading: false
      }))
      toast.success('Nature de sinistre supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedClaimNature: (claimNature: ClaimNature | null) => {
    set({ selectedClaimNature: claimNature })
  },

  clearError: () => {
    set({ error: null })
  },
})) 