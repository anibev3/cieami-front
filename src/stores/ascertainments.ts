import { create } from 'zustand'
import { toast } from 'sonner'
import ascertainmentService, {
  Ascertainment,
  AscertainmentResponse,
  CreateAscertainmentData,
  UpdateAscertainmentData,
  AscertainmentFilters
} from '@/services/ascertainmentService'

interface AscertainmentState {
  // État des données
  ascertainments: Ascertainment[]
  currentAscertainment: Ascertainment | null
  loading: boolean
  error: string | null
  
  // Pagination
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
    from: number
    to: number
  } | null
  
  // Actions
  fetchAscertainments: (filters?: AscertainmentFilters) => Promise<void>
  fetchAscertainmentById: (id: number) => Promise<void>
  createAscertainment: (data: CreateAscertainmentData) => Promise<boolean>
  updateAscertainment: (id: number, data: UpdateAscertainmentData) => Promise<boolean>
  deleteAscertainment: (id: number) => Promise<boolean>
  clearError: () => void
  clearCurrentAscertainment: () => void
}

export const useAscertainmentStore = create<AscertainmentState>((set, _get) => ({
  // État initial
  ascertainments: [],
  currentAscertainment: null,
  loading: false,
  error: null,
  pagination: null,

  // Récupérer tous les constats
  fetchAscertainments: async (filters?: AscertainmentFilters) => {
    set({ loading: true, error: null })
    
    try {
      const response: AscertainmentResponse = await ascertainmentService.getAll(filters)
      
      set({
        ascertainments: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
          from: response.meta.from,
          to: response.meta.to
        },
        loading: false
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des constats'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  // Récupérer un constat par ID
  fetchAscertainmentById: async (id: number) => {
    set({ loading: true, error: null })
    
    try {
      const response = await ascertainmentService.getById(id)
      set({ currentAscertainment: response.data, loading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération du constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  // Créer un nouveau constat
  createAscertainment: async (data: CreateAscertainmentData): Promise<boolean> => {
    set({ loading: true, error: null })
    
    try {
      const response = await ascertainmentService.create(data)
      
      // Ajouter le nouveau constat à la liste
      set(state => ({
        ascertainments: [response.data, ...state.ascertainments],
        loading: false
      }))
      
      toast.success(response.message || 'Constat créé avec succès')
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Mettre à jour un constat
  updateAscertainment: async (id: number, data: UpdateAscertainmentData): Promise<boolean> => {
    set({ loading: true, error: null })
    
    try {
      const response = await ascertainmentService.update(id, data)
      
      // Mettre à jour dans la liste
      set(state => ({
        ascertainments: state.ascertainments.map(item =>
          item.id === id ? response.data : item
        ),
        currentAscertainment: state.currentAscertainment?.id === id 
          ? response.data 
          : state.currentAscertainment,
        loading: false
      }))
      
      toast.success(response.message || 'Constat mis à jour avec succès')
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Supprimer un constat
  deleteAscertainment: async (id: number): Promise<boolean> => {
    set({ loading: true, error: null })
    
    try {
      await ascertainmentService.delete(id)
      
      // Retirer de la liste
      set(state => ({
        ascertainments: state.ascertainments.filter(item => item.id !== id),
        currentAscertainment: state.currentAscertainment?.id === id 
          ? null 
          : state.currentAscertainment,
        loading: false
      }))
      
      toast.success('Constat supprimé avec succès')
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Effacer l'erreur
  clearError: () => set({ error: null }),

  // Effacer le constat actuel
  clearCurrentAscertainment: () => set({ currentAscertainment: null })
})) 