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
import { useColorsStore } from '@/stores/colors'
import { useDebounce } from '@/hooks/use-debounce'

interface ColorSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ColorSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une couleur...",
  disabled = false
}: ColorSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { colors, loading, fetchColors } = useColorsStore()
  
  // Debouncer la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Charger les couleurs initiales
  useEffect(() => {
    if (colors.length === 0 && !debouncedSearchQuery) {
      fetchColors(1, {})
    }
  }, [fetchColors, colors.length, debouncedSearchQuery])

  // Effectuer la recherche quand la query change
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchColors(1, { search: debouncedSearchQuery })
    } else if (debouncedSearchQuery === '') {
      // Recharger toutes les couleurs quand la recherche est vide
      fetchColors(1, {})
    }
  }, [debouncedSearchQuery, fetchColors])

  const selectedColor = colors.find(color => color.id.toString() === value)

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
          ) : selectedColor ? (
            selectedColor.label
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher une couleur..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des couleurs...
              </div>
            ) : colors.length === 0 ? (
              <CommandEmpty>
                {searchQuery ? 'Aucune couleur trouvée pour cette recherche.' : 'Aucune couleur trouvée.'}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {colors.map((color) => (
                  <CommandItem
                    key={color.id}
                    value={color.label}
                    onSelect={() => {
                      onValueChange(color.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={
                        value === color.id.toString()
                          ? 'mr-2 h-4 w-4 opacity-100'
                          : 'mr-2 h-4 w-4 opacity-0'
                      }
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{color.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {color.description} - {color.code}
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