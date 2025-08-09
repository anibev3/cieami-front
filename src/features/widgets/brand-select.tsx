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
import { useBrandsStore } from '@/stores/brands'
import { useDebounce } from '@/hooks/use-debounce'

interface BrandSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function BrandSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une marque...",
  disabled = false
}: BrandSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { brands, loading, fetchBrands } = useBrandsStore()
  
  // Debouncer la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Charger les marques initiales
  useEffect(() => {
    if (brands.length === 0 && !debouncedSearchQuery) {
      fetchBrands(1, {})
    }
  }, [fetchBrands, brands.length, debouncedSearchQuery])

  // Effectuer la recherche quand la query change
  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchBrands(1, { search: debouncedSearchQuery })
    } else if (debouncedSearchQuery === '') {
      // Recharger toutes les marques quand la recherche est vide
      fetchBrands(1, {})
    }
  }, [debouncedSearchQuery, fetchBrands])

  const selectedBrand = brands.find(brand => brand.id.toString() === value)

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
            ) : selectedBrand ? (
              selectedBrand.label
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher une marque..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des marques...
              </div>
            ) : brands.length === 0 ? (
              <CommandEmpty>
                {searchQuery ? 'Aucune marque trouvée pour cette recherche.' : 'Aucune marque trouvée.'}
              </CommandEmpty>
            ) : (                  
              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={`${brand.label} ${brand.description || ''}`}
                    onSelect={() => {
                      onValueChange(brand.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === brand.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{brand.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {brand.description} - {brand.code}
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