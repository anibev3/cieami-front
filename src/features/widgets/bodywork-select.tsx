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
import { useDebounce } from '@/hooks/use-debounce'

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
  const [searchQuery, setSearchQuery] = useState('')
  const { bodyworks, loading, fetchBodyworks } = useBodyworksStore()
  
  // Debouncer la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Charger les carrosseries initiales
  useEffect(() => {
    if (bodyworks.length === 0 && !debouncedSearchQuery) {
      fetchBodyworks(1, {})
    }
  }, [fetchBodyworks, bodyworks.length, debouncedSearchQuery])

  // Effectuer la recherche quand la query change
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchBodyworks(1, { search: debouncedSearchQuery })
    } else if (debouncedSearchQuery === '') {
      // Recharger toutes les carrosseries quand la recherche est vide
      fetchBodyworks(1, {})
    }
  }, [debouncedSearchQuery, fetchBodyworks])

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
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher une carrosserie..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des carrosseries...
              </div>
            ) : bodyworks.length === 0 ? (
              <CommandEmpty>
                {searchQuery ? 'Aucune carrosserie trouvée pour cette recherche.' : 'Aucune carrosserie trouvée.'}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {bodyworks.map((bodywork) => (
                  <CommandItem
                    key={bodywork.id}
                    value={bodywork?.label}
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
                    <div className="flex flex-col">
                      <span className="font-medium">{bodywork?.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {bodywork?.description} - {bodywork?.code}
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