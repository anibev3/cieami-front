import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'

// Hook personnalisé pour utiliser les genres de véhicules
export function useVehicleGenres() {
  const { vehicleGenres, loading, fetchVehicleGenres } = useVehicleGenresStore()

  return {
    vehicleGenres,
    loading,
    fetchVehicleGenres
  }
}
