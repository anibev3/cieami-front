import { create } from 'zustand'
import { 
  VehicleEnergy, 
  CreateVehicleEnergyData, 
  UpdateVehicleEnergyData 
} from '@/services/vehicleEnergyService'
import { vehicleEnergyService } from '@/services/vehicleEnergyService'
import { toast } from 'sonner'

interface VehicleEnergiesState {
  // État
  vehicleEnergies: VehicleEnergy[]
  loading: boolean
  error: string | null
  selectedVehicleEnergy: VehicleEnergy | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  filters: {
    search: string
    page: number
  }
  
  // Actions
  fetchVehicleEnergies: (filters?: { search?: string; page?: number }) => Promise<void>
  createVehicleEnergy: (data: CreateVehicleEnergyData) => Promise<void>
  updateVehicleEnergy: (id: number, data: UpdateVehicleEnergyData) => Promise<void>
  deleteVehicleEnergy: (id: number) => Promise<void>
  setSelectedVehicleEnergy: (vehicleEnergy: VehicleEnergy | null) => void
  setFilters: (filters: { search: string; page: number }) => void
  clearError: () => void
}

export const useVehicleEnergiesStore = create<VehicleEnergiesState>((set, get) => ({
  // État initial
  vehicleEnergies: [],
  loading: false,
  error: null,
  selectedVehicleEnergy: null,
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
  fetchVehicleEnergies: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await vehicleEnergyService.getAll(filters)
      set({ 
        vehicleEnergies: response.data, 
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
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des énergies de véhicules'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createVehicleEnergy: async (data: CreateVehicleEnergyData) => {
    try {
      set({ loading: true })
      const newVehicleEnergy = await vehicleEnergyService.create(data)
      await get().fetchVehicleEnergies()
      set({ loading: false })
      toast.success('Énergie de véhicule créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateVehicleEnergy: async (id: number, data: UpdateVehicleEnergyData) => {
    try {
      set({ loading: true })
      const updatedVehicleEnergy = await vehicleEnergyService.update(id, data)
      await get().fetchVehicleEnergies()
      set({ loading: false })
      toast.success('Énergie de véhicule mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteVehicleEnergy: async (id: number) => {
    try {
      set({ loading: true })
      await vehicleEnergyService.delete(id)
      await get().fetchVehicleEnergies()
      set({ loading: false })
      toast.success('Énergie de véhicule supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedVehicleEnergy: (vehicleEnergy: VehicleEnergy | null) => {
    set({ selectedVehicleEnergy: vehicleEnergy })
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 