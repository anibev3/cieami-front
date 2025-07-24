import React, { useState, useEffect } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wrench, ChevronsUpDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEntitiesStore } from '@/stores/entitiesStore'

interface RepairerSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function RepairerSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un réparateur...",
  disabled = false,
  className,
  showStatus = false
}: RepairerSelectProps) {
  const [open, setOpen] = useState(false)
  const { entities, loading, fetchEntities } = useEntitiesStore()

  // Filtrer seulement les réparateurs
  const repairers = entities.filter(entity => entity.entity_type?.code === 'repairer')

  useEffect(() => {
    if (entities.length === 0) {
      fetchEntities()
    }
  }, [entities.length, fetchEntities])

  const selectedRepairer = repairers.find(repairer => repairer.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedRepairer && "text-muted-foreground",
            className
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
          <CommandInput placeholder="Rechercher un réparateur..." />
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
                    onValueChange(repairer.id === value ? null : repairer.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === repairer.id ? "opacity-100" : "opacity-0"
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
  )
} 