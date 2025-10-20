import React, { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wrench, ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRepairersStore } from '@/stores/repairersStore'
import { useDebounce } from '@/hooks/use-debounce'
interface RepairerSelectProps {
  value?: string | number | null
  onValueChange: (value: string | number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
  valueKey?: 'id' | 'code'
}

export function RepairerSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un réparateur...",
  disabled = false,
  className,
  showStatus = false,
  valueKey = 'id'
}: RepairerSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { repairers, loading, fetchRepairers } = useRepairersStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les réparateurs
  const searchRepairers = useCallback(async (query: string) => {
    await fetchRepairers({ search: query })
  }, [fetchRepairers])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      searchRepairers(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchRepairers])

  // Charger les réparateurs au montage
  useEffect(() => {
    if (repairers.length === 0) {
      fetchRepairers()
    }
  }, [repairers.length, fetchRepairers])

  const getValueForRepairer = (repairer: (typeof repairers)[number]): string | number | undefined => {
    return valueKey === 'id' ? repairer.id : repairer.code
  }
  const selectedRepairer = repairers.find(repairer => getValueForRepairer(repairer) === value)

  // Réinitialiser la recherche quand le popover se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
      // Recharger tous les réparateurs quand on ferme
      fetchRepairers()
    }
  }

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
              !selectedRepairer && "text-muted-foreground"
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedRepairer ? (
              <div className="flex items-center gap-2 truncate">
                <Wrench className="h-4 w-4 text-orange-600" />
                <span className="truncate">{selectedRepairer.name}</span>
                {showStatus && selectedRepairer.status && (
                  <Badge 
                    variant={selectedRepairer.status.code === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs",
                      selectedRepairer.status.code === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {selectedRepairer.status.label}
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
            placeholder="Rechercher un réparateur..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement...
                </div>
              ) : (
                "Aucun réparateur trouvé."
              )}
            </CommandEmpty>
            <CommandGroup>
              {repairers.map((repairer) => (
                <CommandItem
                  key={repairer.id}
                  value={`${repairer.name} ${repairer.code || ''} ${repairer.email || ''}`}
                  onSelect={() => {
                    const selectedValue = getValueForRepairer(repairer)
                    onValueChange(selectedValue === value ? null : (selectedValue ?? null))
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === getValueForRepairer(repairer) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{repairer.name}</span>
                      {repairer.code && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {repairer.code}
                        </span>
                      )}
                    </div>
                    {showStatus && repairer.status && (
                      <Badge 
                        variant={repairer.status.code === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          "text-xs",
                          repairer.status.code === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {repairer.status.label}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        </PopoverContent>
      </Popover>
      {selectedRepairer && !disabled && !loading && (
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