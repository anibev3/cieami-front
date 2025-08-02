import { useState, useEffect } from 'react'
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
import { useVehicleModelsStore } from '@/stores/vehicle-models'
import { useDebounce } from '@/hooks/use-debounce'

interface VehicleModelSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  brandId?: string
}

export function VehicleModelSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez un modèle de véhicule...",
  disabled = false,
  brandId
}: VehicleModelSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { vehicleModels, loading, fetchVehicleModels } = useVehicleModelsStore()
  
  // Debouncer la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    // Construire les filtres de base
    const baseFilters = brandId 
      ? { brand_id: brandId } 
      : { is_selected: true }

    // Ajouter la recherche si elle existe
    const filters = debouncedSearchQuery 
      ? { ...baseFilters, search: debouncedSearchQuery }
      : baseFilters

    // Charger les modèles avec les filtres appropriés
    fetchVehicleModels(1, filters)
  }, [fetchVehicleModels, brandId, debouncedSearchQuery])

  const selectedVehicleModel = vehicleModels.find(model => model.id.toString() === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading || !brandId}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : !brandId ? (
            "Sélectionnez une marque"
          ) : selectedVehicleModel ? (
            <div className="flex items-center text-left">
              <span className="font-medium text-sm">{selectedVehicleModel.brand?.label}</span>
              <span className="ml-2 text-xs text-muted-foreground"> - {selectedVehicleModel.label} </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher un modèle..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des modèles...
              </div>
            ) : !brandId ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                Sélectionnez une marque
              </div>
            ) : vehicleModels.length === 0 ? (
              <CommandEmpty>
                {searchQuery ? 'Aucun modèle trouvé pour cette recherche.' : 'Aucun modèle trouvé pour cette marque.'}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {vehicleModels.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={`${model.label} ${model.brand?.label} ${model.code}`}
                    onSelect={() => {
                      onValueChange(model.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === model.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{model.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {model.brand?.label} - {model.code}
                      </span>
                    </div>
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