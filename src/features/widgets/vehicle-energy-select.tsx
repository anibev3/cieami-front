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
import { Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <div className={cn(className, "w-full flex items-center gap-1")}>
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
            ) : selectedEnergy ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedEnergy.label}</span>
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

// Hook personnalisé pour utiliser les énergies de véhicules
export function useVehicleEnergies() {
  const { vehicleEnergies, loading, fetchVehicleEnergies } = useVehicleEnergiesStore()

  return {
    vehicleEnergies,
    loading,
    fetchVehicleEnergies
  }
} 