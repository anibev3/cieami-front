import { create } from 'zustand'
import { toast } from 'sonner'
import ascertainmentTypeService, {
  AscertainmentType,
  AscertainmentTypeResponse,
  CreateAscertainmentTypeData,
  UpdateAscertainmentTypeData,
  AscertainmentTypeFilters
} from '@/services/ascertainmentTypeService'

interface AscertainmentTypeState {
  // État des données
  ascertainmentTypes: AscertainmentType[]
  currentAscertainmentType: AscertainmentType | null
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
  fetchAscertainmentTypes: (filters?: AscertainmentTypeFilters) => Promise<void>
  fetchAscertainmentTypeById: (id: number) => Promise<void>
  createAscertainmentType: (data: CreateAscertainmentTypeData) => Promise<boolean>
  updateAscertainmentType: (id: number, data: UpdateAscertainmentTypeData) => Promise<boolean>
  deleteAscertainmentType: (id: number) => Promise<boolean>
  clearError: () => void
  clearCurrentAscertainmentType: () => void
}

export const useAscertainmentTypeStore = create<AscertainmentTypeState>((set, _get) => ({
  // État initial
  ascertainmentTypes: [],
  currentAscertainmentType: null,
  loading: false,
  error: null,
  pagination: null,

  // Récupérer tous les types de constat
  fetchAscertainmentTypes: async (filters?: AscertainmentTypeFilters) => {
    set({ loading: true, error: null })
    
    try {
      const response: AscertainmentTypeResponse = await ascertainmentTypeService.getAll(filters)
      
      set({
        ascertainmentTypes: response.data,
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
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des types de constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  // Récupérer un type de constat par ID
  fetchAscertainmentTypeById: async (id: number) => {
    set({ loading: true, error: null })
    
    try {
      const ascertainmentType = await ascertainmentTypeService.getById(id)
      set({ currentAscertainmentType: ascertainmentType, loading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération du type de constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  // Créer un nouveau type de constat
  createAscertainmentType: async (data: CreateAscertainmentTypeData): Promise<boolean> => {
    set({ loading: true, error: null })
    
    try {
      const newAscertainmentType = await ascertainmentTypeService.create(data)
      
      // Ajouter le nouveau type à la liste
      set(state => ({
        ascertainmentTypes: [newAscertainmentType, ...state.ascertainmentTypes],
        loading: false
      }))
      
      toast.success('Type de constat créé avec succès')
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création du type de constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Mettre à jour un type de constat
  updateAscertainmentType: async (id: number, data: UpdateAscertainmentTypeData): Promise<boolean> => {
    set({ loading: true, error: null })
    
    try {
      const updatedAscertainmentType = await ascertainmentTypeService.update(id, data)
      
      // Mettre à jour dans la liste
      set(state => ({
        ascertainmentTypes: state.ascertainmentTypes.map(item =>
          item.id === id ? updatedAscertainmentType : item
        ),
        currentAscertainmentType: state.currentAscertainmentType?.id === id 
          ? updatedAscertainmentType 
          : state.currentAscertainmentType,
        loading: false
      }))
      
      toast.success('Type de constat mis à jour avec succès')
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du type de constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Supprimer un type de constat
  deleteAscertainmentType: async (id: number): Promise<boolean> => {
    set({ loading: true, error: null })
    
    try {
      await ascertainmentTypeService.delete(id)
      
      // Retirer de la liste
      set(state => ({
        ascertainmentTypes: state.ascertainmentTypes.filter(item => item.id !== id),
        currentAscertainmentType: state.currentAscertainmentType?.id === id 
          ? null 
          : state.currentAscertainmentType,
        loading: false
      }))
      
      toast.success('Type de constat supprimé avec succès')
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du type de constat'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
      return false
    }
  },

  // Effacer l'erreur
  clearError: () => set({ error: null }),

  // Effacer le type de constat actuel
  clearCurrentAscertainmentType: () => set({ currentAscertainmentType: null })
})) 