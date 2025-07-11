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
  
  // Actions
  fetchVehicleAges: () => Promise<void>
  createVehicleAge: (data: CreateVehicleAgeData) => Promise<void>
  updateVehicleAge: (id: number, data: UpdateVehicleAgeData) => Promise<void>
  deleteVehicleAge: (id: number) => Promise<void>
  setSelectedVehicleAge: (vehicleAge: VehicleAge | null) => void
  clearError: () => void
}

export const useVehicleAgesStore = create<VehicleAgesState>((set) => ({
  // État initial
  vehicleAges: [],
  loading: false,
  error: null,
  selectedVehicleAge: null,

  // Actions
  fetchVehicleAges: async () => {
    try {
      set({ loading: true, error: null })
      const response = await vehicleAgeService.getAll()
      set({ vehicleAges: response.data, loading: false })
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
      set(state => ({ 
        vehicleAges: [...state.vehicleAges, newVehicleAge], 
        loading: false 
      }))
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
      set(state => ({
        vehicleAges: state.vehicleAges.map(vehicleAge =>
          vehicleAge.id === id ? updatedVehicleAge : vehicleAge
        ),
        loading: false
      }))
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
      set(state => ({
        vehicleAges: state.vehicleAges.filter(vehicleAge => vehicleAge.id !== id),
        loading: false
      }))
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

  clearError: () => {
    set({ error: null })
  },
})) 