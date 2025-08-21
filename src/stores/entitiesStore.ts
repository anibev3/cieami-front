import { create } from 'zustand'
import { Entity, CreateEntityData, UpdateEntityData, EntityFilters } from '@/types/administration'
import { entityService } from '@/services/entityService'
import { toast } from 'sonner'

interface EntitiesState {
  // État
  entities: Entity[]
  loading: boolean
  error: string | null
  selectedEntity: Entity | null
  lastFetchFilters: EntityFilters | null
  
  // Actions
  fetchEntities: (filters?: EntityFilters) => Promise<void>
  createEntity: (data: CreateEntityData) => Promise<void>
  updateEntity: (id: number, data: UpdateEntityData) => Promise<void>
  deleteEntity: (id: number) => Promise<void>
  enableEntity: (id: number) => Promise<void>
  disableEntity: (id: number) => Promise<void>
  setSelectedEntity: (entity: Entity | null) => void
  clearError: () => void
}

export const useEntitiesStore = create<EntitiesState>((set, get) => ({
  // État initial
  entities: [],
  loading: false,
  error: null,
  selectedEntity: null,
  lastFetchFilters: null,

  // Actions
  fetchEntities: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await entityService.getAll(filters)
      
      // Si c'est une recherche avec des filtres spécifiques, on remplace
      // Sinon, on ajoute aux entités existantes (pour éviter de perdre les sélections)
      if (filters && (filters.search || filters.entity_type)) {
        set({ entities: response.data, loading: false, lastFetchFilters: filters })
      } else {
        // Pour le chargement initial, on remplace
        set({ entities: response.data, loading: false, lastFetchFilters: filters })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des entités'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createEntity: async (data: CreateEntityData) => {
    try {
      set({ loading: true })
      const newEntity = await entityService.create(data)
      set(state => ({ 
        entities: [...state.entities, newEntity], 
        loading: false 
      }))
      toast.success('Entité créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateEntity: async (id: number, data: UpdateEntityData) => {
    try {
      set({ loading: true })
      const updatedEntity = await entityService.update(id, data)
      set(state => ({
        entities: state.entities.map(entity =>
          entity.id === id ? updatedEntity : entity
        ),
        loading: false
      }))
      toast.success('Entité mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteEntity: async (id: number) => {
    try {
      set({ loading: true })
      await entityService.delete(id)
      set(state => ({
        entities: state.entities.filter(entity => entity.id !== id),
        loading: false
      }))
      toast.success('Entité supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  enableEntity: async (id: number) => {
    try {
      set({ loading: true })
      const enabledEntity = await entityService.enable(id)
      set(state => ({
        entities: state.entities.map(entity =>
          entity.id === id ? enabledEntity : entity
        ),
        loading: false
      }))
      toast.success('Entité activée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'activation'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  disableEntity: async (id: number) => {
    try {
      set({ loading: true })
      const disabledEntity = await entityService.disable(id)
      set(state => ({
        entities: state.entities.map(entity =>
          entity.id === id ? disabledEntity : entity
        ),
        loading: false
      }))
      toast.success('Entité désactivée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la désactivation'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedEntity: (entity: Entity | null) => {
    set({ selectedEntity: entity })
  },

  clearError: () => {
    set({ error: null })
  },
})) 