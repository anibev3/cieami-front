import * as React from 'react'
import { useState } from 'react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
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
import { GeneralStatusDeadlineStatus } from '@/types/administration'

export interface StatusSelectStringProps {
  value?: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
  statuses: GeneralStatusDeadlineStatus[]
  loading?: boolean
}

export function StatusSelectString({
  value,
  onValueChange,
  placeholder = 'Sélectionner un statut...',
  disabled = false,
  className,
  showDescription = false,
  statuses,
  loading = false,
}: StatusSelectStringProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Normaliser la valeur pour la comparaison
  const normalizedValue = value !== null && value !== undefined ? String(value) : null
  const selectedStatus = statuses.find(status => String(status.id) === normalizedValue)

  const handleSelect = (statusId: string) => {
    if (normalizedValue === String(statusId)) {
      onValueChange(null)
    } else {
      onValueChange(statusId)
    }
    setOpen(false)
    setSearchQuery('')
  }

  // Filtrer les statuts selon la recherche
  const filteredStatuses = React.useMemo(() => {
    if (!searchQuery.trim()) return statuses
    
    const query = searchQuery.toLowerCase()
    return statuses.filter(status =>
      status.label.toLowerCase().includes(query) ||
      status.code.toLowerCase().includes(query) ||
      (status.description && status.description.toLowerCase().includes(query))
    )
  }, [statuses, searchQuery])

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
              !selectedStatus && 'text-muted-foreground',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedStatus ? (
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedStatus.label}</span>
                {selectedStatus.code && (
                  <span className="text-xs text-muted-foreground">
                    ({selectedStatus.code})
                  </span>
                )}
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Rechercher un statut..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement des statuts...
                </div>
              ) : filteredStatuses.length === 0 ? (
                <CommandEmpty>
                  {searchQuery
                    ? 'Aucun statut trouvé pour cette recherche.'
                    : 'Aucun statut disponible.'}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredStatuses.map((status) => (
                    <CommandItem
                      key={status.id}
                      value={`${status.label} ${status.code} ${status.description || ''}`}
                      onSelect={() => handleSelect(status.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          normalizedValue === String(status.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{status.label}</span>
                          {/* {status.code && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {status.code}
                            </span>
                          )} */}
                        </div>
                        {showDescription && status.description && (
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {status.description}
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
