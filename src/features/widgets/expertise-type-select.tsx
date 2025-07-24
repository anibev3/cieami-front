import React, { useState, useEffect } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, ChevronsUpDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useExpertiseTypesStore } from '@/stores/expertiseTypesStore'

interface ExpertiseTypeSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function ExpertiseTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un type d'expertise...",
  disabled = false,
  className,
  showStatus = false
}: ExpertiseTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const { expertiseTypes, loading, fetchExpertiseTypes } = useExpertiseTypesStore()

  useEffect(() => {
    if (expertiseTypes.length === 0) {
      fetchExpertiseTypes()
    }
  }, [expertiseTypes.length, fetchExpertiseTypes])

  const selectedType = expertiseTypes.find(type => type.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedType && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedType ? (
            <div className="flex items-center gap-2 truncate">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="truncate">{selectedType.label}</span>
              {showStatus && selectedType.status && (
                <Badge 
                  variant={selectedType.status.code === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs",
                    selectedType.status.code === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {selectedType.status.label}
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
          <CommandInput placeholder="Rechercher un type d'expertise..." />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement...
                </div>
              ) : (
                "Aucun type d'expertise trouvé."
              )}
            </CommandEmpty>
            <CommandGroup>
              {expertiseTypes.map((type) => (
                <CommandItem
                  key={type.id}
                  value={`${type.label} ${type.code || ''} ${type.description || ''}`}
                  onSelect={() => {
                    onValueChange(type.id === value ? null : type.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === type.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      {type.code && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {type.code}
                        </span>
                      )}
                    </div>
                    {showStatus && type.status && (
                      <Badge 
                        variant={type.status.code === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          "text-xs",
                          type.status.code === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {type.status.label}
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