import { useEffect, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, ChevronsUpDown, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSuppliesStore } from '@/stores/supplies'
import { useDebounce } from '@/hooks/use-debounce'

interface Supply {
  id: string | number
  code?: string
  label: string
  description?: string
}

interface SupplySelectProps {
  value: string
  onValueChange: (value: string) => void
  supplies: Supply[]
  placeholder?: string
  className?: string
  showSelectedInfo?: boolean
  disabled?: boolean
  onCreateNew?: () => void
}

export function SupplySelect({
  value,
  onValueChange,
  supplies,
  placeholder = "🔍 Rechercher une fourniture...",
  className = "",
  showSelectedInfo = false,
  disabled = false,
  onCreateNew
}: SupplySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 200)

  const { supplies: apiSupplies, loading, fetchSupplies, fetchSupplyById } = useSuppliesStore()
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('')

  // Charger l'élément sélectionné s'il n'est pas dans la liste fournie
  useEffect(() => {
    if (value && String(value).length > 0) {
      const foundInSupplies = supplies.find(supply => String(supply.id) === String(value))
      if (foundInSupplies) {
        setSelectedSupply(foundInSupplies)
      } else {
        // L'élément n'est pas dans la liste fournie, le récupérer depuis l'API
        // L'ID peut être un string (hash ID) ou un number
        const supplyId = value
        if (supplyId) {
          fetchSupplyById(supplyId).then(supply => {
            if (supply) {
              // Garder l'ID tel quel (string ou number)
              setSelectedSupply({ ...supply, id: supply.id })
            }
          }).catch(() => {
            setSelectedSupply(null)
          })
        } else {
          setSelectedSupply(null)
        }
      }
    } else {
      setSelectedSupply(null)
    }
  }, [value, supplies, fetchSupplyById])

  useEffect(() => {
    if (debouncedSearch !== undefined && debouncedSearch.trim() !== '') {
      // Éviter les appels API en double pour la même recherche
      if (lastSearchQuery !== debouncedSearch.trim()) {
        setLastSearchQuery(debouncedSearch.trim())
        // Appel API en temps réel avec le paramètre search
        // Limiter le nombre de résultats pour éviter la surcharge
        void fetchSupplies(25, { search: debouncedSearch.trim() })
      }
    }
  }, [debouncedSearch, fetchSupplies, lastSearchQuery])

  // Réinitialiser la recherche à la fermeture
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setLastSearchQuery('')
    }
  }, [open])

  const hasValue = Boolean(value)
  const displaySupplies = searchQuery && searchQuery.trim() !== '' ? apiSupplies : supplies

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="xs"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left",
              !hasValue ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-50',
              className
            )}
            disabled={disabled}
          >
            {hasValue ? (
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 text-blue-500" />
                <span className="font-medium text-xs">{selectedSupply?.label}</span>
                {/* {selectedSupply?.code && (
                  <Badge variant="secondary" className="text-xs">
                    #{selectedSupply.code}
                  </Badge>
                )} */}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Rechercher une fourniture..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="space-y-2">
                  <p>{loading ? 'Chargement...' : 'Aucune fourniture trouvée'}</p>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {displaySupplies.map((supply) => (
                  <CommandItem
                    key={supply.id}
                    value={`${supply.label} ${supply.code || ''} ${supply.description || ''}`}
                    onSelect={() => {
                      onValueChange(String(supply.id))
                      setOpen(false)
                    }}
                    className="py-3"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Package className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{supply.label}</span>
                        {supply.description && (
                          <p className="text-xs text-gray-500 truncate">{supply.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {supply.code && (
                          <Badge variant="secondary" className="text-xs">
                            #{supply.code}
                          </Badge>
                        )}
                        {String(value) === String(supply.id) && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* {onCreateNew && (
                <div className="border-t p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false)
                      onCreateNew()
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une nouvelle fourniture
                  </Button>
                </div>
              )} */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* {hasValue && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange(0) }}
        >
          <X className="h-3 w-3" />
        </Button>
      )} */}
      </div>
      
      {showSelectedInfo && selectedSupply && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">{selectedSupply.label}</p>
              {selectedSupply.code && (
                <p className="text-xs text-blue-600">Code: {selectedSupply.code}</p>
              )}
              {selectedSupply.description && (
                <p className="text-xs text-blue-600 mt-1">{selectedSupply.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 