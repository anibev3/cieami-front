import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVehicleEnergiesStore } from '@/stores/vehicleEnergiesStore'
import { VehicleEnergy } from '@/services/vehicleEnergyService'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VehicleEnergySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
}

export function VehicleEnergySelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une énergie de véhicule",
  disabled = false,
  className,
  showDescription = false
}: VehicleEnergySelectProps) {
  const { vehicleEnergies, loading, fetchVehicleEnergies } = useVehicleEnergiesStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      fetchVehicleEnergies()
      setIsInitialized(true)
    }
  }, [fetchVehicleEnergies, isInitialized])

  const selectedEnergy = vehicleEnergies.find(energy => energy.id.toString() === value)
  
  // Log pour déboguer
  // eslint-disable-next-line no-console
  console.log('VehicleEnergySelect - value:', value)
  // eslint-disable-next-line no-console
  console.log('VehicleEnergySelect - vehicleEnergies:', vehicleEnergies)
  // eslint-disable-next-line no-console
  console.log('VehicleEnergySelect - selectedEnergy:', selectedEnergy)

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
          ) : selectedEnergy ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedEnergy.label}</span>
              {/* {showDescription && selectedEnergy.description && (
                <span className="text-xs text-muted-foreground">
                  {selectedEnergy.description}
                </span>
              )} */}
            </div>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {vehicleEnergies.map((energy: VehicleEnergy) => (
          <SelectItem key={energy.id} value={energy.id.toString()}>
            <div className="flex flex-col items-start">
              <span className="font-medium">{energy.label}</span>
              {showDescription && energy.description && (
                <span className="text-xs text-muted-foreground">
                  {energy.description}
                </span>
              )}
              <span className="text-xs text-blue-600 font-mono">
                {energy.code}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Hook personnalisé pour utiliser les énergies de véhicules
export function useVehicleEnergies() {
  const { vehicleEnergies, loading, fetchVehicleEnergies } = useVehicleEnergiesStore()

  return {
    vehicleEnergies,
    loading,
    fetchVehicleEnergies
  }
} 