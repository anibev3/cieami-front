import React, { useState, useEffect } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, ChevronsUpDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInsurersStore } from '@/stores/insurersStore'

interface InsurerSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function InsurerSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un assureur...",
  disabled = false,
  className,
  showStatus = false
}: InsurerSelectProps) {
  const [open, setOpen] = useState(false)
  const { insurers, loading, fetchInsurers } = useInsurersStore()

  useEffect(() => {
    if (insurers.length === 0) {
      fetchInsurers()
    }
  }, [insurers.length, fetchInsurers])

  const selectedInsurer = insurers.find(insurer => insurer.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedInsurer && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedInsurer ? (
            <div className="w-full flex items-center gap-2 truncate">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="truncate">{selectedInsurer.name}</span>
              {showStatus && selectedInsurer.status && (
                <Badge 
                  variant={selectedInsurer.status.code === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs",
                    selectedInsurer.status.code === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {selectedInsurer.status.label}
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
          <CommandInput placeholder="Rechercher un assureur..." />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement...
                </div>
              ) : (
                "Aucun assureur trouvé."
              )}
            </CommandEmpty>
            <CommandGroup>
              {insurers.map((insurer) => (
                <CommandItem
                  key={insurer.id}
                  value={`${insurer.name} ${insurer.code || ''} ${insurer.email || ''}`}
                  onSelect={() => {
                    onValueChange(insurer.id === value ? null : insurer.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === insurer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{insurer.name}</span>
                      {insurer.code && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {insurer.code}
                        </span>
                      )}
                    </div>
                    {showStatus && insurer.status && (
                      <Badge 
                        variant={insurer.status.code === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          "text-xs",
                          insurer.status.code === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {insurer.status.label}
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