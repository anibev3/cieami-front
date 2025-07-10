import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'
import { VehicleGenre } from '@/services/vehicleGenreService'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleGenreSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
}

export function VehicleGenreSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un genre de véhicule",
  disabled = false,
  className,
  showDescription = false
}: VehicleGenreSelectProps) {
  const { vehicleGenres, loading, fetchVehicleGenres } = useVehicleGenresStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      fetchVehicleGenres()
      setIsInitialized(true)
    }
  }, [fetchVehicleGenres, isInitialized])

  const selectedGenre = vehicleGenres.find(genre => genre.id.toString() === value)

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={cn(className, "w-full")}>
        <SelectValue placeholder={placeholder}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Chargement...</span>
            </div>
          ) : selectedGenre ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedGenre.label}</span>
              {/* {showDescription && selectedGenre.description && (
                <span className="text-xs text-muted-foreground">
                  {selectedGenre.description}
                </span>
              )} */}
            </div>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {vehicleGenres.map((genre: VehicleGenre) => (
          <SelectItem key={genre.id} value={genre.id.toString()}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{genre.label}</span>
              {showDescription && genre.description && (
                <span className="text-xs text-muted-foreground">
                  {genre.description}
                </span>
              )}
              <span className="text-xs text-blue-600 font-mono">
                {genre.code}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Hook personnalisé pour utiliser les genres de véhicules
export function useVehicleGenres() {
  const { vehicleGenres, loading, fetchVehicleGenres } = useVehicleGenresStore()

  return {
    vehicleGenres,
    loading,
    fetchVehicleGenres
  }
} 