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
  
  // Actions
  fetchVehicleGenres: () => Promise<void>
  createVehicleGenre: (data: CreateVehicleGenreData) => Promise<void>
  updateVehicleGenre: (id: number, data: UpdateVehicleGenreData) => Promise<void>
  deleteVehicleGenre: (id: number) => Promise<void>
  setSelectedVehicleGenre: (vehicleGenre: VehicleGenre | null) => void
  clearError: () => void
}

export const useVehicleGenresStore = create<VehicleGenresState>((set) => ({
  // État initial
  vehicleGenres: [],
  loading: false,
  error: null,
  selectedVehicleGenre: null,

  // Actions
  fetchVehicleGenres: async () => {
    try {
      set({ loading: true, error: null })
      const response = await vehicleGenreService.getAll()
      set({ vehicleGenres: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des genres de véhicules'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createVehicleGenre: async (data: CreateVehicleGenreData) => {
    try {
      set({ loading: true })
      const newVehicleGenre = await vehicleGenreService.create(data)
      set(state => ({ 
        vehicleGenres: [...state.vehicleGenres, newVehicleGenre], 
        loading: false 
      }))
      toast.success('Genre de véhicule créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updateVehicleGenre: async (id: number, data: UpdateVehicleGenreData) => {
    try {
      set({ loading: true })
      const updatedVehicleGenre = await vehicleGenreService.update(id, data)
      set(state => ({
        vehicleGenres: state.vehicleGenres.map(vehicleGenre =>
          vehicleGenre.id === id ? updatedVehicleGenre : vehicleGenre
        ),
        loading: false
      }))
      toast.success('Genre de véhicule mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deleteVehicleGenre: async (id: number) => {
    try {
      set({ loading: true })
      await vehicleGenreService.delete(id)
      set(state => ({
        vehicleGenres: state.vehicleGenres.filter(vehicleGenre => vehicleGenre.id !== id),
        loading: false
      }))
      toast.success('Genre de véhicule supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedVehicleGenre: (vehicleGenre: VehicleGenre | null) => {
    set({ selectedVehicleGenre: vehicleGenre })
  },

  clearError: () => {
    set({ error: null })
  },
})) 