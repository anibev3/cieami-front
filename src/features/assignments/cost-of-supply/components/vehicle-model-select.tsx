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

interface VehicleModelSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function VehicleModelSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez un modèle de véhicule...",
  disabled = false
}: VehicleModelSelectProps) {
  const [open, setOpen] = useState(false)
  const { vehicleModels, loading, fetchVehicleModels } = useVehicleModelsStore()

  useEffect(() => {
    if (vehicleModels.length === 0) {
      fetchVehicleModels()
    }
  }, [fetchVehicleModels, vehicleModels.length])

  const selectedVehicleModel = vehicleModels.find(model => model.id.toString() === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        <Command>
          <CommandInput placeholder="Rechercher un modèle..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des modèles...
              </div>
            ) : vehicleModels.length === 0 ? (
              <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
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