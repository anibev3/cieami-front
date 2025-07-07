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
import { useVehicleStatesStore } from '@/stores/vehicle-states'
import { VehicleState } from '@/types/vehicle-states'

interface VehicleStateSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function VehicleStateSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un état...",
  disabled = false
}: VehicleStateSelectProps) {
  const [open, setOpen] = useState(false)
  const { vehicleStates, loading, fetchVehicleStates } = useVehicleStatesStore()

  useEffect(() => {
    if (vehicleStates.length === 0) {
      fetchVehicleStates()
    }
  }, [fetchVehicleStates, vehicleStates.length])

  const selectedState = vehicleStates.find(state => state.id.toString() === value)

  const renderStateInfo = (state: VehicleState) => {
    return (
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{state.label}</span>
        </div>
        {state.description && (
          <span className="text-xs text-muted-foreground mt-1">
            {state.description}
          </span>
        )}
        {state.code && (
          <span className="text-xs text-muted-foreground">
            Code: {state.code}
          </span>
        )}
      </div>
    )
  }

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
          ) : selectedState ? (
            renderStateInfo(selectedState)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un état..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des états...
              </div>
            ) : vehicleStates.length === 0 ? (
              <CommandEmpty>Aucun état trouvé.</CommandEmpty>
            ) : (
              <CommandGroup>
                {vehicleStates.map((state) => (
                  <CommandItem
                    key={state.id}
                    value={`${state.label} ${state.description || ''} ${state.code || ''}`}
                    onSelect={() => {
                      onValueChange(state.id.toString())
                      setOpen(false)
                    }}
                    className="flex flex-col items-start p-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === state.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    {renderStateInfo(state)}
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