import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
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
import { VehicleModel } from '@/types/vehicle-models'

interface VehicleModelSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function VehicleModelSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un modèle...",
  disabled = false
}: VehicleModelSelectProps) {
  const [open, setOpen] = useState(false)
  const { vehicleModels, loading, fetchVehicleModels } = useVehicleModelsStore()

  useEffect(() => {
    if (vehicleModels.length === 0) {
      fetchVehicleModels()
    }
  }, [fetchVehicleModels, vehicleModels.length])

  const selectedModel = vehicleModels.find(model => model.id.toString() === value)

  const renderModelInfo = (model: VehicleModel) => {
    return (
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{model.label}</span>
        </div>
        {model.description && (
          <span className="text-xs text-muted-foreground mt-1">
            {model.description}
          </span>
        )}
        {model.code && (
          <span className="text-xs text-muted-foreground">
            Code: {model.code}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 w-full">
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
            ) : selectedModel ? (
              renderModelInfo(selectedModel)
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
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
                    value={`${model.label} ${model.description || ''} ${model.code || ''}`}
                    onSelect={() => {
                      onValueChange(model.id.toString())
                      setOpen(false)
                    }}
                    className="flex flex-col items-start p-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === model.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    {renderModelInfo(model)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        </PopoverContent>
      </Popover>
      {!!value && !disabled && !loading && (
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