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
  
  // Actions
  fetchVehicleEnergies: () => Promise<void>
  createVehicleEnergy: (data: CreateVehicleEnergyData) => Promise<void>
  updateVehicleEnergy: (id: number, data: UpdateVehicleEnergyData) => Promise<void>
  deleteVehicleEnergy: (id: number) => Promise<void>
  setSelectedVehicleEnergy: (vehicleEnergy: VehicleEnergy | null) => void
  clearError: () => void
}

export const useVehicleEnergiesStore = create<VehicleEnergiesState>((set) => ({
  // État initial
  vehicleEnergies: [],
  loading: false,
  error: null,
  selectedVehicleEnergy: null,

  // Actions
  fetchVehicleEnergies: async () => {
    try {
      set({ loading: true, error: null })
      const response = await vehicleEnergyService.getAll()
      set({ vehicleEnergies: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des énergies de véhicules'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createVehicleEnergy: async (data: CreateVehicleEnergyData) => {
    try {
      set({ loading: true })
      const newVehicleEnergy = await vehicleEnergyService.create(data)
      set(state => ({ 
        vehicleEnergies: [...state.vehicleEnergies, newVehicleEnergy], 
        loading: false 
      }))
      toast.success('Énergie de véhicule créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updateVehicleEnergy: async (id: number, data: UpdateVehicleEnergyData) => {
    try {
      set({ loading: true })
      const updatedVehicleEnergy = await vehicleEnergyService.update(id, data)
      set(state => ({
        vehicleEnergies: state.vehicleEnergies.map(vehicleEnergy =>
          vehicleEnergy.id === id ? updatedVehicleEnergy : vehicleEnergy
        ),
        loading: false
      }))
      toast.success('Énergie de véhicule mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deleteVehicleEnergy: async (id: number) => {
    try {
      set({ loading: true })
      await vehicleEnergyService.delete(id)
      set(state => ({
        vehicleEnergies: state.vehicleEnergies.filter(vehicleEnergy => vehicleEnergy.id !== id),
        loading: false
      }))
      toast.success('Énergie de véhicule supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedVehicleEnergy: (vehicleEnergy: VehicleEnergy | null) => {
    set({ selectedVehicleEnergy: vehicleEnergy })
  },

  clearError: () => {
    set({ error: null })
  },
})) 