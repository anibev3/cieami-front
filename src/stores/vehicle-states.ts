import { create } from 'zustand'
import { vehicleStateService } from '@/services/vehicleStateService'
import { VehicleState, VehicleStateCreate, VehicleStateUpdate, VehicleStateFilters } from '@/types/vehicle-states'

interface VehicleStatesState {
  vehicleStates: VehicleState[]
  currentVehicleState: VehicleState | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  filters: VehicleStateFilters
}

interface VehicleStatesActions {
  // Actions
  fetchVehicleStates: (filters?: VehicleStateFilters) => Promise<void>
  fetchVehicleState: (id: number) => Promise<void>
  createVehicleState: (vehicleStateData: VehicleStateCreate) => Promise<void>
  updateVehicleState: (id: number, vehicleStateData: VehicleStateUpdate) => Promise<void>
  deleteVehicleState: (id: number) => Promise<void>
  setCurrentVehicleState: (vehicleState: VehicleState | null) => void
  setFilters: (filters: VehicleStateFilters) => void
  clearError: () => void
}

type VehicleStatesStore = VehicleStatesState & VehicleStatesActions

export const useVehicleStatesStore = create<VehicleStatesStore>((set, get) => ({
  // État initial
  vehicleStates: [],
  currentVehicleState: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
    from: 1,
    to: 1,
    total: 0,
  },
  filters: {
    search: '',
    page: 1
  },

  // Actions
  fetchVehicleStates: async (filters) => {
    set({ loading: true, error: null })
    
    try {
      const response = await vehicleStateService.getVehicleStates(filters)
      
      set({
        vehicleStates: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
        },
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des états de véhicules',
      })
    }
  },

  fetchVehicleState: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const vehicleState = await vehicleStateService.getVehicleState(id)
      set({ currentVehicleState: vehicleState, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement de l\'état de véhicule',
      })
    }
  },

  createVehicleState: async (vehicleStateData) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleStateService.createVehicleState(vehicleStateData)
      // Recharger la liste après création
      await get().fetchVehicleStates()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'état de véhicule',
      })
      throw error
    }
  },

  updateVehicleState: async (id, vehicleStateData) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleStateService.updateVehicleState(id, vehicleStateData)
      // Recharger la liste après mise à jour
      await get().fetchVehicleStates()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'état de véhicule',
      })
      throw error
    }
  },

  deleteVehicleState: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleStateService.deleteVehicleState(id)
      // Recharger la liste après suppression
      await get().fetchVehicleStates()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'état de véhicule',
      })
      throw error
    }
  },

  setCurrentVehicleState: (vehicleState) => {
    set({ currentVehicleState: vehicleState })
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 