import { useState, useEffect } from 'react'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
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
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AscertainmentTypeSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function AscertainmentTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un type",
  disabled = false,
  className,
  showStatus = false
}: AscertainmentTypeSelectProps) {
  const { ascertainmentTypes, loading, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [ascertainmentTypes.length, fetchAscertainmentTypes])

  const selectedType = ascertainmentTypes.find(type => type.id === value)

  const getStatusBadgeVariant = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'default'
      case 'inactive':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedType ? (
            <div className="flex items-center space-x-2">
              <span>{selectedType.label}</span>
              {showStatus && (
                <Badge variant={getStatusBadgeVariant(selectedType.status.code)}>
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
          <CommandInput placeholder="Rechercher un type de constat..." />
          <CommandList>
            <CommandEmpty>Aucun type de constat trouvé.</CommandEmpty>
            <CommandGroup>
              {ascertainmentTypes.map((type) => (
                <CommandItem
                  key={type.id}
                  value={`${type.label} ${type.code} ${type.description}`}
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
                      <span className="text-xs text-muted-foreground font-mono">
                        {type.code}
                      </span>
                    </div>
                    {showStatus && (
                      <Badge variant={getStatusBadgeVariant(type.status.code)}>
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

// Version avec multiple sélection
interface AscertainmentTypeMultiSelectProps {
  value?: number[]
  onValueChange: (value: number[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  maxItems?: number
}

export function AscertainmentTypeMultiSelect({
  value = [],
  onValueChange,
  placeholder = "Sélectionner des types de constat...",
  disabled = false,
  className,
  maxItems
}: AscertainmentTypeMultiSelectProps) {
  const { ascertainmentTypes, loading, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [ascertainmentTypes.length, fetchAscertainmentTypes])

  const selectedTypes = ascertainmentTypes.filter(type => value.includes(type.id))

  const handleSelect = (typeId: number) => {
    const newValue = value.includes(typeId)
      ? value.filter(id => id !== typeId)
      : [...value, typeId]
    
    if (!maxItems || newValue.length <= maxItems) {
      onValueChange(newValue)
    }
  }

  const displayText = selectedTypes.length > 0
    ? `${selectedTypes.length} type${selectedTypes.length > 1 ? 's' : ''} sélectionné${selectedTypes.length > 1 ? 's' : ''}`
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            displayText
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher des types de constat..." />
          <CommandList>
            <CommandEmpty>Aucun type de constat trouvé.</CommandEmpty>
            <CommandGroup>
              {ascertainmentTypes.map((type) => (
                <CommandItem
                  key={type.id}
                  value={`${type.label} ${type.code} ${type.description}`}
                  onSelect={() => handleSelect(type.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(type.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {type.code}
                    </span>
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