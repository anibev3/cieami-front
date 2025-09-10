import { create } from 'zustand'
import { vehicleModelService } from '@/services/vehicleModelService'
import { VehicleModel, VehicleModelCreate, VehicleModelUpdate, VehicleModelFilters } from '@/types/vehicle-models'

interface VehicleModelsState {
  vehicleModels: VehicleModel[]
  currentVehicleModel: VehicleModel | null
  loading: boolean
  error: string | null
  filters: {
    search: string
    status: string
    brand_id: string
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
}

interface VehicleModelsActions {
  // Actions
  fetchVehicleModels: (page?: number, filters?: VehicleModelFilters) => Promise<void>
  fetchVehicleModel: (id: number) => Promise<void>
  createVehicleModel: (vehicleModelData: VehicleModelCreate) => Promise<void>
  updateVehicleModel: (id: number, vehicleModelData: VehicleModelUpdate) => Promise<void>
  deleteVehicleModel: (id: number) => Promise<void>
  setCurrentVehicleModel: (vehicleModel: VehicleModel | null) => void
  setFilters: (filters: Partial<VehicleModelsState['filters']>) => void
  setPage: (page: number) => void
  clearError: () => void
}

type VehicleModelsStore = VehicleModelsState & VehicleModelsActions

export const useVehicleModelsStore = create<VehicleModelsStore>((set, get) => ({
  // État initial
  vehicleModels: [],
  currentVehicleModel: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    brand_id: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  // Actions
  fetchVehicleModels: async (page, filters) => {
    const state = get()
    const currentPage = page || state.pagination.currentPage
    const currentFilters = filters || {
      search: state.filters.search || undefined,
      status: state.filters.status || undefined,
      brand_id: state.filters.brand_id || undefined,
    }
    
    set({ loading: true, error: null })
    
    try {
      const response = await vehicleModelService.getVehicleModels(currentPage, currentFilters)
      
      set({
        vehicleModels: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des modèles de véhicules',
      })
    }
  },

  fetchVehicleModel: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const vehicleModel = await vehicleModelService.getVehicleModel(id)
      set({ currentVehicleModel: vehicleModel, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement du modèle de véhicule',
      })
    }
  },

  createVehicleModel: async (vehicleModelData) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleModelService.createVehicleModel(vehicleModelData)
      // Recharger la liste après création
      await get().fetchVehicleModels(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création du modèle de véhicule',
      })
      throw error
    }
  },

  updateVehicleModel: async (id, vehicleModelData) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleModelService.updateVehicleModel(id, vehicleModelData)
      // Recharger la liste après mise à jour
      await get().fetchVehicleModels(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du modèle de véhicule',
      })
      throw error
    }
  },

  deleteVehicleModel: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleModelService.deleteVehicleModel(id)
      // Recharger la liste après suppression
      await get().fetchVehicleModels(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression du modèle de véhicule',
      })
      throw error
    }
  },

  setCurrentVehicleModel: (vehicleModel) => {
    set({ currentVehicleModel: vehicleModel })
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, currentPage: 1 } // Reset to page 1 when filters change
    }))
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page }
    }))
  },

  clearError: () => {
    set({ error: null })
  },
})) 