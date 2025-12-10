import { create } from 'zustand'
import { FNESetting, CreateFNESettingData, UpdateFNESettingData } from '@/types/administration'
import { fneSettingService } from '@/services/fneSettingService'
import { toast } from 'sonner'

interface FNESettingsState {
  // État
  fneSettings: FNESetting[]
  loading: boolean
  error: string | null
  selectedFNESetting: FNESetting | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  
  // Actions
  fetchFNESettings: () => Promise<void>
  createFNESetting: (data: CreateFNESettingData) => Promise<void>
  updateFNESetting: (id: string, data: UpdateFNESettingData) => Promise<void>
  deleteFNESetting: (id: string) => Promise<void>
  enableFNESetting: (id: string) => Promise<void>
  disableFNESetting: (id: string) => Promise<void>
  setSelectedFNESetting: (setting: FNESetting | null) => void
  clearError: () => void
}

export const useFNESettingsStore = create<FNESettingsState>((set, get) => ({
  // État initial
  fneSettings: [],
  loading: false,
  error: null,
  selectedFNESetting: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    from: 1,
    to: 1,
    total: 0,
  },

  // Actions
  fetchFNESettings: async () => {
    try {
      set({ loading: true, error: null })
      const response = await fneSettingService.getAll()
      set({ 
        fneSettings: response.data, 
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des paramètres FNE'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createFNESetting: async (data: CreateFNESettingData) => {
    try {
      set({ loading: true })
      await fneSettingService.create(data)
      await get().fetchFNESettings()
      set({ loading: false })
      toast.success('Paramètre FNE créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateFNESetting: async (id: string, data: UpdateFNESettingData) => {
    try {
      set({ loading: true })
      await fneSettingService.update(id, data)
      await get().fetchFNESettings()
      set({ loading: false })
      toast.success('Paramètre FNE mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteFNESetting: async (id: string) => {
    try {
      set({ loading: true })
      await fneSettingService.delete(id)
      await get().fetchFNESettings()
      set({ loading: false })
      toast.success('Paramètre FNE supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  enableFNESetting: async (id: string) => {
    try {
      set({ loading: true })
      await fneSettingService.enable(id)
      await get().fetchFNESettings()
      set({ loading: false })
      toast.success('Paramètre FNE activé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'activation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  disableFNESetting: async (id: string) => {
    try {
      set({ loading: true })
      await fneSettingService.disable(id)
      await get().fetchFNESettings()
      set({ loading: false })
      toast.success('Paramètre FNE désactivé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la désactivation'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedFNESetting: (setting: FNESetting | null) => {
    set({ selectedFNESetting: setting })
  },

  clearError: () => {
    set({ error: null })
  },
}))
