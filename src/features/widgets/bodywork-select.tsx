import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
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
import { useBodyworksStore } from '@/stores/bodyworks'

interface BodyworkSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function BodyworkSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une carrosserie...",
  disabled = false
}: BodyworkSelectProps) {
  const [open, setOpen] = useState(false)
  const { bodyworks, loading, fetchBodyworks } = useBodyworksStore()

  useEffect(() => {
    if (bodyworks.length === 0) {
      fetchBodyworks()
    }
  }, [fetchBodyworks, bodyworks.length])

  const selectedBodywork = bodyworks.find(b => b.id.toString() === value)

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
          ) : selectedBodywork ? (
            selectedBodywork.label
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une carrosserie..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des carrosseries...
              </div>
            ) : bodyworks.length === 0 ? (
              <CommandEmpty>Aucune carrosserie trouvée.</CommandEmpty>
            ) : (
              <CommandGroup>
                {bodyworks.map((bodywork) => (
                  <CommandItem
                    key={bodywork.id}
                    value={bodywork.label}
                    onSelect={() => {
                      onValueChange(bodywork.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={
                        value === bodywork.id.toString()
                          ? 'mr-2 h-4 w-4 opacity-100'
                          : 'mr-2 h-4 w-4 opacity-0'
                      }
                    />
                    {bodywork.label}
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