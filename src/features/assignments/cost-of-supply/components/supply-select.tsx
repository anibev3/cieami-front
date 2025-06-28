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
import { useSuppliesStore } from '@/stores/supplies'

interface SupplySelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function SupplySelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez une fourniture...",
  disabled = false
}: SupplySelectProps) {
  const [open, setOpen] = useState(false)
  const { supplies, loading, fetchSupplies } = useSuppliesStore()

  useEffect(() => {
    if (supplies.length === 0) {
      fetchSupplies()
    }
  }, [fetchSupplies, supplies.length])

  const selectedSupply = supplies.find(supply => supply.id.toString() === value)

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
          ) : selectedSupply ? (
            <div className="flex flex-col items-start text-left">
              <span className="font-medium">{selectedSupply.label}</span>
              <span className="text-xs text-muted-foreground">
                {selectedSupply.code}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une fourniture..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des fournitures...
              </div>
            ) : supplies.length === 0 ? (
              <CommandEmpty>Aucune fourniture trouvée.</CommandEmpty>
            ) : (
              <CommandGroup>
                {supplies.map((supply) => (
                  <CommandItem
                    key={supply.id}
                    value={`${supply.label} ${supply.code}`}
                    onSelect={() => {
                      onValueChange(supply.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === supply.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{supply.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {supply.code}
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