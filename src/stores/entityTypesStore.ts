import { create } from 'zustand'
import { EntityType, CreateEntityTypeData, UpdateEntityTypeData } from '@/types/administration'
import { entityTypeService } from '@/services/entityTypeService'
import { toast } from 'sonner'

interface EntityTypesState {
  // État
  entityTypes: EntityType[]
  loading: boolean
  error: string | null
  selectedEntityType: EntityType | null
  
  // Actions
  fetchEntityTypes: () => Promise<void>
  createEntityType: (data: CreateEntityTypeData) => Promise<void>
  updateEntityType: (id: number, data: UpdateEntityTypeData) => Promise<void>
  deleteEntityType: (id: number) => Promise<void>
  enableEntityType: (id: number) => Promise<void>
  disableEntityType: (id: number) => Promise<void>
  setSelectedEntityType: (entityType: EntityType | null) => void
  clearError: () => void
}

export const useEntityTypesStore = create<EntityTypesState>((set) => ({
  // État initial
  entityTypes: [],
  loading: false,
  error: null,
  selectedEntityType: null,

  // Actions
  fetchEntityTypes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await entityTypeService.getAll()
      set({ entityTypes: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des types d\'entité'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createEntityType: async (data: CreateEntityTypeData) => {
    try {
      set({ loading: true })
      const newEntityType = await entityTypeService.create(data)
      set(state => ({ 
        entityTypes: [...state.entityTypes, newEntityType], 
        loading: false 
      }))
      toast.success('Type d\'entité créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateEntityType: async (id: number, data: UpdateEntityTypeData) => {
    try {
      set({ loading: true })
      const updatedEntityType = await entityTypeService.update(id, data)
      set(state => ({
        entityTypes: state.entityTypes.map(et =>
          et.id === id ? updatedEntityType : et
        ),
        loading: false
      }))
      toast.success('Type d\'entité mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteEntityType: async (id: number) => {
    try {
      set({ loading: true })
      await entityTypeService.delete(id)
      set(state => ({
        entityTypes: state.entityTypes.filter(et => et.id !== id),
        loading: false
      }))
      toast.success('Type d\'entité supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  enableEntityType: async (id: number) => {
    try {
      set({ loading: true })
      const enabledEntityType = await entityTypeService.enable(id)
      set(state => ({
        entityTypes: state.entityTypes.map(et =>
          et.id === id ? enabledEntityType : et
        ),
        loading: false
      }))
      toast.success('Type d\'entité activé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'activation'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  disableEntityType: async (id: number) => {
    try {
      set({ loading: true })
      const disabledEntityType = await entityTypeService.disable(id)
      set(state => ({
        entityTypes: state.entityTypes.map(et =>
          et.id === id ? disabledEntityType : et
        ),
        loading: false
      }))
      toast.success('Type d\'entité désactivé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la désactivation'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedEntityType: (entityType: EntityType | null) => {
    set({ selectedEntityType: entityType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 