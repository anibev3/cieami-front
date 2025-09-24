import { create } from 'zustand'
import { 
  VehicleAge, 
  CreateVehicleAgeData, 
  UpdateVehicleAgeData 
} from '@/services/vehicleAgeService'
import { vehicleAgeService } from '@/services/vehicleAgeService'
import { toast } from 'sonner'

interface VehicleAgesState {
  // État
  vehicleAges: VehicleAge[]
  loading: boolean
  error: string | null
  selectedVehicleAge: VehicleAge | null
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
  fetchVehicleAges: (filters?: { search?: string; page?: number }) => Promise<void>
  createVehicleAge: (data: CreateVehicleAgeData) => Promise<void>
  updateVehicleAge: (id: number, data: UpdateVehicleAgeData) => Promise<void>
  deleteVehicleAge: (id: number) => Promise<void>
  setSelectedVehicleAge: (vehicleAge: VehicleAge | null) => void
  setFilters: (filters: { search: string; page: number }) => void
  clearError: () => void
}

export const useVehicleAgesStore = create<VehicleAgesState>((set, get) => ({
  // État initial
  vehicleAges: [],
  loading: false,
  error: null,
  selectedVehicleAge: null,
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
  fetchVehicleAges: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await vehicleAgeService.getAll(filters)
      set({ 
        vehicleAges: response.data, 
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
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des âges de véhicules'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createVehicleAge: async (data: CreateVehicleAgeData) => {
    try {
      set({ loading: true })
      const newVehicleAge = await vehicleAgeService.create(data)
      await get().fetchVehicleAges()
      set({ loading: false })
      toast.success('Âge de véhicule créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateVehicleAge: async (id: number, data: UpdateVehicleAgeData) => {
    try {
      set({ loading: true })
      const updatedVehicleAge = await vehicleAgeService.update(id, data)
      await get().fetchVehicleAges()
      set({ loading: false })
      toast.success('Âge de véhicule mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteVehicleAge: async (id: number) => {
    try {
      set({ loading: true })
      await vehicleAgeService.delete(id)
      await get().fetchVehicleAges()
      set({ loading: false })
      toast.success('Âge de véhicule supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedVehicleAge: (vehicleAge: VehicleAge | null) => {
    set({ selectedVehicleAge: vehicleAge })
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 