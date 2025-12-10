import * as React from 'react'
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2, X, Shield } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { useGeneralStatesStore } from '@/stores/generalStatesStore'
import { GeneralState } from '@/types/administration'

export interface GeneralStateSelectComboboxProps {
  value?: number | string | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
  autoFetch?: boolean
  generalStates?: GeneralState[]
  filterByStatus?: boolean // Filtrer uniquement les états actifs
}

export function GeneralStateSelectCombobox({
  value,
  onValueChange,
  placeholder = 'Sélectionner un état général...',
  disabled = false,
  className,
  showDescription = false,
  autoFetch = true,
  generalStates: externalGeneralStates,
  filterByStatus = true,
}: GeneralStateSelectComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { generalStates: storeGeneralStates, loading, fetchGeneralStates } = useGeneralStatesStore()
  
  // Utiliser les états généraux externes si fournis, sinon utiliser ceux du store
  const generalStates = externalGeneralStates || storeGeneralStates
  
  // Charger les états généraux si autoFetch est activé et qu'aucun état externe n'est fourni
  useEffect(() => {
    if (autoFetch && !externalGeneralStates && storeGeneralStates.length === 0) {
      fetchGeneralStates()
    }
  }, [autoFetch, externalGeneralStates, storeGeneralStates.length, fetchGeneralStates])

  // Filtrer les états généraux selon le statut si demandé
  const filteredGeneralStates = React.useMemo(() => {
    let states = generalStates
    
    // Filtrer uniquement les états actifs si demandé
    if (filterByStatus) {
      states = states.filter(state => !state.deleted_by && state.status?.code === 'active')
    }
    
    return states
  }, [generalStates, filterByStatus])

  // Normaliser la valeur pour la comparaison (gérer number et string)
  const normalizedValue = value !== null && value !== undefined ? Number(value) : null
  const selectedGeneralState = filteredGeneralStates.find(state => state.id === normalizedValue)

  const handleSelect = (stateId: number) => {
    if (normalizedValue === stateId) {
      onValueChange(null)
    } else {
      onValueChange(stateId)
    }
    setOpen(false)
    setSearchQuery('')
  }

  // Filtrer les états généraux selon la recherche
  const searchFilteredStates = React.useMemo(() => {
    if (!searchQuery.trim()) return filteredGeneralStates
    
    const query = searchQuery.toLowerCase()
    return filteredGeneralStates.filter(state =>
      state.label.toLowerCase().includes(query) ||
      state.code.toLowerCase().includes(query) ||
      (state.description && state.description.toLowerCase().includes(query))
    )
  }, [filteredGeneralStates, searchQuery])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              !selectedGeneralState && 'text-muted-foreground',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedGeneralState ? (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{selectedGeneralState.label}</span>
                {selectedGeneralState.code && (
                  <span className="text-xs text-muted-foreground">
                    ({selectedGeneralState.code})
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>{placeholder}</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Rechercher un état général..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement des états généraux...
                </div>
              ) : searchFilteredStates.length === 0 ? (
                <CommandEmpty>
                  {searchQuery
                    ? 'Aucun état général trouvé pour cette recherche.'
                    : 'Aucun état général disponible.'}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {searchFilteredStates.map((state) => (
                    <CommandItem
                      key={state.id}
                      value={`${state.label} ${state.code} ${state.description || ''}`}
                      onSelect={() => handleSelect(state.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          normalizedValue === state.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{state.label}</span>
                          {state.code && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {state.code}
                            </span>
                          )}
                        </div>
                        {showDescription && state.description && (
                          <span className="text-xs text-muted-foreground mt-0.5 ml-6">
                            {state.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {normalizedValue !== null && !disabled && !loading && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground shrink-0"
          aria-label="Effacer la sélection"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onValueChange(null)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
