import { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { useDebounce } from '@/hooks/use-debounce'
import { Entity } from '@/types/administration'

interface EntitySelectProps {
  value?: string | number | null
  onValueChange: (value: string | number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function EntitySelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une entité...",
  disabled = false,
  className,
  showStatus = false,
}: EntitySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { entities, loading, fetchEntities } = useEntitiesStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les entités
  const searchEntities = useCallback(async (query: string) => {
    await fetchEntities({ search: query })
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

  // Normaliser la valeur pour la comparaison (gérer string et number)
  const normalizedValue = value !== null && value !== undefined ? String(value) : null
  const selectedEntity = entities.find((entity: Entity) => String(entity.id) === normalizedValue)

  // Réinitialiser la recherche quand le popover se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
      // Recharger toutes les entités quand on ferme
      fetchEntities()
    }
  }

  const handleSelect = (entityId: string) => {
    const entity = entities.find((e: Entity) => String(e.id) === entityId)
    if (entity) {
      if (normalizedValue === entityId) {
        onValueChange(null)
      } else {
        onValueChange(entity.id)
      }
    }
    setOpen(false)
    setSearchQuery('')
  }

  // Filtrer les entités selon la recherche
  const searchFilteredEntities = entities.filter((entity: Entity) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      entity.name?.toLowerCase().includes(query) ||
      entity.code?.toLowerCase().includes(query) ||
      entity.email?.toLowerCase().includes(query)
    )
  })

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !selectedEntity && "text-muted-foreground"
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedEntity ? (
              <div className="w-full flex items-center gap-2 truncate">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="truncate">{selectedEntity.name}</span>
                {showStatus && selectedEntity.status && (
                  <Badge 
                    variant={selectedEntity.status.code === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs",
                      selectedEntity.status.code === 'active' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    )}
                  >
                    {selectedEntity.status.label}
                  </Badge>
                )}
              </div>
            ) : (
              <>
                <Building className="mr-2 h-4 w-4" />
                {placeholder}
              </>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Rechercher une entité..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {loading ? "Chargement..." : "Aucune entité trouvée."}
              </CommandEmpty>
              <CommandGroup>
                {searchFilteredEntities.map((entity: Entity) => (
                  <CommandItem
                    key={entity.id}
                    value={String(entity.id)}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{entity.name}</span>
                        {entity.code && (
                          <span className="text-xs text-muted-foreground">{entity.code}</span>
                        )}
                      </div>
                      {showStatus && entity.status && (
                        <Badge 
                          variant={entity.status.code === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {entity.status.label}
                        </Badge>
                      )}
                    </div>
                    {normalizedValue === String(entity.id) && (
                      <Check className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange(null) }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
