import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useVehiclesStore } from '@/stores/vehicles'
import { Vehicle } from '@/types/vehicles'
import { useDebounce } from '@/hooks/use-debounce'

interface VehicleSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function VehicleSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un véhicule...",
  disabled = false
}: VehicleSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { vehicles, loading, fetchVehicles } = useVehiclesStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les véhicules
  const searchVehicles = useCallback(async (query: string) => {
    await fetchVehicles(1, { search: query })
  }, [fetchVehicles])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      searchVehicles(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchVehicles])

  // Charger les véhicules au montage si aucun véhicule n'est chargé
  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles()
    }
  }, [fetchVehicles, vehicles.length])

  const selectedVehicle = vehicles.find(vehicle => vehicle.id.toString() === value)

  // Réinitialiser la recherche quand le popover se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
      // Recharger tous les véhicules quand on ferme
      fetchVehicles()
    }
  }

  const renderVehicleInfo = (vehicle: Vehicle) => {
    return (
      <div className="flex items-center justify-between">
        
        <span className="font-medium">{vehicle.license_plate} - {vehicle.brand?.label}
          {/* {vehicle.vehicle_model?.label} */}
          
          </span>
        
        {/* <div className="text-xs text-muted-foreground mt-1">
          {vehicle.brand?.label} {vehicle.vehicle_model?.label}
        </div> */}
        {/* {vehicle.color && (
          <span className="text-xs text-muted-foreground">
            Couleur: {vehicle.color.label}
          </span>
        )}
        {vehicle.bodywork && (
          <span className="text-xs text-muted-foreground">
            Carrosserie: {vehicle.bodywork.label}
          </span>
        )} */}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedVehicle ? (
            renderVehicleInfo(selectedVehicle)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput 
            placeholder="Rechercher un véhicule..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des véhicules...
              </div>
            ) : vehicles.length === 0 ? (
              <CommandEmpty>Aucun véhicule trouvé.</CommandEmpty>
            ) : (
              <CommandGroup>
                {vehicles.map((vehicle) => (
                  <CommandItem
                    key={vehicle.id}
                    value={`${vehicle.license_plate} ${vehicle.brand?.label || ''} ${vehicle.vehicle_model?.label || ''} ${vehicle.color?.label || ''}`}
                    onSelect={() => {
                      onValueChange(vehicle.id.toString())
                      setOpen(false)
                    }}
                    className="flex items-start p-3"
                  >
                    {/* <div className="flex items-center justify-between w-full"> */}
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === vehicle.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                    {/* </div> */}
                    {renderVehicleInfo(vehicle)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 