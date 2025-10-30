/* eslint-disable no-console */
import { create } from 'zustand'
import { vehicleService } from '@/services/vehicleService'
import { Vehicle, VehicleCreate, VehicleUpdate, VehicleFilters } from '@/types/vehicles'

interface VehiclesState {
  vehicles: Vehicle[]
  currentVehicle: Vehicle | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
}

interface VehiclesActions {
  // Actions
  fetchVehicles: (page?: number, filters?: VehicleFilters) => Promise<void>
  fetchVehicle: (id: string) => Promise<void>
  createVehicle: (vehicleData: VehicleCreate) => Promise<void>
  updateVehicle: (id: string, vehicleData: VehicleUpdate) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>
  setCurrentVehicle: (vehicle: Vehicle | null) => void
  clearError: () => void
}

type VehiclesStore = VehiclesState & VehiclesActions

export const useVehiclesStore = create<VehiclesStore>((set, get) => ({
  // État initial
  vehicles: [],
  currentVehicle: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  // Actions
  fetchVehicles: async (page = 1, filters) => {
    set({ loading: true, error: null })
    
    try {
      const response = await vehicleService.getVehicles(page, filters)
      
      set({
        vehicles: response.data,
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
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des véhicules',
      })
    }
  },

  fetchVehicle: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const vehicle = await vehicleService.getVehicle(id)
      set({ currentVehicle: vehicle, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement du véhicule',
      })
    }
  },

  createVehicle: async (vehicleData) => {
    console.log('createVehicle called with data:', vehicleData)
    set({ loading: true, error: null })
    
    try {
      const result = await vehicleService.createVehicle(vehicleData)
      console.log('Vehicle created successfully:', result)
      // Recharger la liste après création
      await get().fetchVehicles(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      console.error('Error in createVehicle:', error)
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création du véhicule',
      })
      throw error
    }
  },

  updateVehicle: async (id, vehicleData) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleService.updateVehicle(id, vehicleData)
      // Recharger la liste après mise à jour
      await get().fetchVehicles(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du véhicule',
      })
      throw error
    }
  },

  deleteVehicle: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await vehicleService.deleteVehicle(id)
      // Recharger la liste après suppression
      await get().fetchVehicles(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression du véhicule',
      })
      throw error
    }
  },

  setCurrentVehicle: (vehicle) => {
    set({ currentVehicle: vehicle })
  },

  clearError: () => {
    set({ error: null })
  },
})) 