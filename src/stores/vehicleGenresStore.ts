import { create } from 'zustand'
import { 
  VehicleGenre, 
  CreateVehicleGenreData, 
  UpdateVehicleGenreData 
} from '@/services/vehicleGenreService'
import { vehicleGenreService } from '@/services/vehicleGenreService'
import { toast } from 'sonner'

interface VehicleGenresState {
  // État
  vehicleGenres: VehicleGenre[]
  loading: boolean
  error: string | null
  selectedVehicleGenre: VehicleGenre | null
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
  fetchVehicleGenres: (filters?: { search?: string; page?: number }) => Promise<void>
  createVehicleGenre: (data: CreateVehicleGenreData) => Promise<void>
  updateVehicleGenre: (id: number, data: UpdateVehicleGenreData) => Promise<void>
  deleteVehicleGenre: (id: number) => Promise<void>
  setSelectedVehicleGenre: (vehicleGenre: VehicleGenre | null) => void
  setFilters: (filters: { search: string; page: number }) => void
  clearError: () => void
}

export const useVehicleGenresStore = create<VehicleGenresState>((set, get) => ({
  // État initial
  vehicleGenres: [],
  loading: false,
  error: null,
  selectedVehicleGenre: null,
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
  fetchVehicleGenres: async (filters) => {
    try {
      set({ loading: true, error: null })
      const response = await vehicleGenreService.getAll(filters)
      set({ 
        vehicleGenres: response.data, 
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
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des genres de véhicules'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createVehicleGenre: async (data: CreateVehicleGenreData) => {
    try {
      set({ loading: true })
      const newVehicleGenre = await vehicleGenreService.create(data)
      await get().fetchVehicleGenres()
      set({ loading: false })
      toast.success('Genre de véhicule créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateVehicleGenre: async (id: number, data: UpdateVehicleGenreData) => {
    try {
      set({ loading: true })
      const updatedVehicleGenre = await vehicleGenreService.update(id, data)
      await get().fetchVehicleGenres()
      set({ loading: false })
      toast.success('Genre de véhicule mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteVehicleGenre: async (id: number) => {
    try {
      set({ loading: true })
      await vehicleGenreService.delete(id)
      await get().fetchVehicleGenres()
      set({ loading: false })
      toast.success('Genre de véhicule supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedVehicleGenre: (vehicleGenre: VehicleGenre | null) => {
    set({ selectedVehicleGenre: vehicleGenre })
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 