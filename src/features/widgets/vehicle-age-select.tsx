import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVehicleAgesStore } from '@/stores/vehicleAgesStore'
import { VehicleAge } from '@/services/vehicleAgeService'
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VehicleAgeSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
}

export function VehicleAgeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un âge de véhicule",
  disabled = false,
  className,
  showDescription = false
}: VehicleAgeSelectProps) {
  const { vehicleAges, loading, fetchVehicleAges } = useVehicleAgesStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      fetchVehicleAges()
      setIsInitialized(true)
    }
  }, [fetchVehicleAges, isInitialized])

  const selectedAge = vehicleAges.find(age => age.id.toString() === value)

  return (
    <div className={cn(className, "w-full flex items-center gap-1") }>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Chargement...</span>
              </div>
            ) : selectedAge ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedAge.label}</span>
              </div>
            ) : (
              placeholder
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {vehicleAges.map((age: VehicleAge) => (
            <SelectItem key={age.id} value={age.id.toString()}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{age.label}</span>
                {showDescription && age.description && (
                  <span className="text-xs text-muted-foreground">
                    {age.description}
                  </span>
                )}
                <span className="text-xs text-blue-600 font-mono">
                  {age.value} mois
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!!value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange('') }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// Hook personnalisé pour utiliser les âges de véhicules
export function useVehicleAges() {
  const { vehicleAges, loading, fetchVehicleAges } = useVehicleAgesStore()

  return {
    vehicleAges,
    loading,
    fetchVehicleAges
  }
} 