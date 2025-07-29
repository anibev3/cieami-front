import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { useDebounce } from '@/hooks/use-debounce'
import { Entity } from '@/types/administration'

interface BrokerSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function BrokerSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un courtier...",
  disabled = false,
  className,
  showStatus = false
}: BrokerSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { entities, loading, fetchEntities } = useEntitiesStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les entités (courtiers)
  const searchEntities = useCallback(async (query: string) => {
    await fetchEntities({ search: query, entity_type: 'broker' })
  }, [fetchEntities])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      searchEntities(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchEntities])

  // Charger les entités au montage si aucune entité n'est chargée
  useEffect(() => {
    if (entities.length === 0) {
      fetchEntities()
    }
  }, [entities.length, fetchEntities])

  // Filtrer seulement les courtiers
  const brokers = entities.filter((entity: Entity) => entity.entity_type?.code === 'broker')

  const selectedBroker = brokers.find((broker: Entity) => broker.id === value)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
    }
  }

  const handleSelect = (currentValue: string) => {
    const brokerId = parseInt(currentValue)
    onValueChange(brokerId)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedBroker?.name}</span>
              {showStatus && selectedBroker?.status && (
                <Badge 
                  variant={selectedBroker.status.code === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {selectedBroker.status.label}
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Rechercher un courtier..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Chargement..." : "Aucun courtier trouvé."}
            </CommandEmpty>
            <CommandGroup>
              {brokers.map((broker: Entity) => (
                <CommandItem
                  key={broker.id}
                  value={broker.id.toString()}
                  onSelect={handleSelect}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{broker.name}</span>
                    {showStatus && broker.status && (
                      <Badge 
                        variant={broker.status.code === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {broker.status.label}
                      </Badge>
                    )}
                  </div>
                  {value === broker.id && (
                    <Check className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 