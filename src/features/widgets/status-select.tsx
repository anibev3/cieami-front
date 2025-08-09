import React, { useState, useEffect } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Circle, ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStatusesStore } from '@/stores/statusesStore'

interface StatusSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
}

export function StatusSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un statut...",
  disabled = false,
  className,
  showDescription = false
}: StatusSelectProps) {
  const [open, setOpen] = useState(false)
  const { statuses, loading, fetchStatuses } = useStatusesStore()

  useEffect(() => {
    if (statuses.length === 0) {
      fetchStatuses()
    }
  }, [statuses.length, fetchStatuses])

  const selectedStatus = statuses.find(status => status.id === value)

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'text-green-600'
      case 'inactive':
        return 'text-gray-600'
      case 'pending':
        return 'text-yellow-600'
      case 'completed':
        return 'text-blue-600'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !selectedStatus && "text-muted-foreground"
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedStatus ? (
              <div className="flex items-center gap-2 truncate">
                <Circle className={cn("h-4 w-4", getStatusColor(selectedStatus.code))} />
                <span className="truncate">{selectedStatus.label}</span>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un statut..." />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement...
                </div>
              ) : (
                "Aucun statut trouvé."
              )}
            </CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.id}
                  value={`${status.label} ${status.code} ${status.description || ''}`}
                  onSelect={() => {
                    onValueChange(status.id === value ? null : status.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === status.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Circle className={cn("h-3 w-3", getStatusColor(status.code))} />
                        <span className="font-medium">{status.label}</span>
                      </div>
                      {showDescription && status.description && (
                        <span className="text-xs text-muted-foreground">
                          {status.description}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {status.code}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        </PopoverContent>
      </Popover>
      {selectedStatus && !disabled && !loading && (
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