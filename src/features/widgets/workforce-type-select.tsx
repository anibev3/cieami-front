import React, { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, ChevronsUpDown, Plus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkforceType {
  id: number
  label: string
  code: string
  hourly_rate: number
}

interface WorkforceTypeSelectProps {
  value: number
  onValueChange: (value: number) => void
  workforceTypes: WorkforceType[]
  placeholder?: string
  className?: string
  showSelectedInfo?: boolean
  disabled?: boolean
  onCreateNew?: () => void
}

export function WorkforceTypeSelect({
  value,
  onValueChange,
  workforceTypes,
  placeholder = "🔍 Rechercher un type de main d'œuvre...",
  className = "",
  showSelectedInfo = false,
  disabled = false,
  onCreateNew
}: WorkforceTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedWorkforceType = workforceTypes.find(type => type.id === value)
  const hasValue = value > 0

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !hasValue && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            {hasValue ? (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="truncate">{selectedWorkforceType?.label}</span>
                {/* {selectedWorkforceType?.code && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedWorkforceType.code}
                  </Badge>
                )} */}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{placeholder}</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher un type de main d'œuvre..." />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="space-y-2">
                  <p>Aucun type de main d'œuvre trouvé</p>
                  {onCreateNew && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpen(false); onCreateNew(); }}
                      className="mx-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un nouveau type
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {workforceTypes.map((workforceType) => (
                  <CommandItem
                    key={workforceType.id}
                    value={`${workforceType.label} ${workforceType.code}`}
                    onSelect={() => {
                      onValueChange(workforceType.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === workforceType.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{workforceType.label}</span>
                      {workforceType.code && (
                        <Badge variant="outline" className="text-xs">
                          {workforceType.code}
                        </Badge>
                      )}
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {workforceType.hourly_rate} FCFA/h
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {onCreateNew && (
                <div className="border-t p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setOpen(false); onCreateNew(); }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un nouveau type de main d'œuvre
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hasValue && !disabled && (
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
      )}
      </div>
      
      {showSelectedInfo && selectedWorkforceType && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">{selectedWorkforceType.label}</span>
            {selectedWorkforceType.code && (
              <Badge variant="secondary" className="text-xs">
                {selectedWorkforceType.code}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-600">
            Taux horaire: {selectedWorkforceType.hourly_rate} FCFA/h
          </div>
        </div>
      )}
    </div>
  )
} 