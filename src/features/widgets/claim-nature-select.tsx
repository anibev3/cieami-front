import * as React from 'react'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { useClaimNatureStore } from '@/stores/claimNatureStore'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface ClaimNatureSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
  showDescription?: boolean
}

export function ClaimNatureSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une nature de sinistre...",
  disabled = false,
  className,
  showStatus = false,
  showDescription = false
}: ClaimNatureSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { claimNatures, loading, fetchClaimNatures } = useClaimNatureStore()

  // Charger les natures de sinistres si pas encore chargées
  useEffect(() => {
    if (claimNatures.length === 0 && !loading) {
      fetchClaimNatures()
    }
  }, [claimNatures.length, loading, fetchClaimNatures])

  // Trouver la nature sélectionnée
  const selectedClaimNature = claimNatures.find(nature => nature.id === value)

  // Filtrer les natures basé sur la recherche
  const filteredClaimNatures = claimNatures.filter(nature =>
    nature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nature.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              !selectedClaimNature && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {selectedClaimNature ? (
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{selectedClaimNature.label}</span>
                {showStatus && (
                  <Badge 
                    variant={selectedClaimNature.status.code === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs",
                      selectedClaimNature.status.code === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {selectedClaimNature.status.label}
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
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Rechercher une nature de sinistre..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Chargement...
                  </span>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Aucune nature de sinistre trouvée.
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredClaimNatures.map((nature) => (
                <CommandItem
                  key={nature.id}
                  value={nature.id.toString()}
                  onSelect={() => {
                    onValueChange(nature.id === value ? null : nature.id)
                    setOpen(false)
                    setSearchTerm('')
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === nature.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{nature.label}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {nature.code}
                        </span>
                        {showDescription && nature.description && (
                          <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {nature.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {showStatus && (
                      <Badge 
                        variant={nature.status.code === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          "text-xs ml-2",
                          nature.status.code === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {nature.status.label}
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
      {/* {selectedClaimNature && !disabled && (
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
      )} */}
    </div>
  )
} 