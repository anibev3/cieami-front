/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wrench, ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { repairerRelationshipService } from '@/services/repairerRelationshipService'
import { RepairerRelationship } from '@/types/repairer-relationships'
import { useDebounce } from '@/hooks/use-debounce'

interface RepairerRelationshipSelectForInsurerProps {
  value?: string | number | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
  showExpertFirm?: boolean
  expertFirmId?: string | null // ID du cabinet d'expertise sélectionné
}

export function RepairerRelationshipSelectForInsurer({
  value,
  onValueChange,
  placeholder = "Sélectionner un rattachement réparateur...",
  disabled = false,
  className,
  showStatus = false,
  showExpertFirm = false,
  expertFirmId = null
}: RepairerRelationshipSelectForInsurerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [relationships, setRelationships] = useState<RepairerRelationship[]>([])
  const [loading, setLoading] = useState(false)
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les rattachements avec filtre expert_firm_id
  const fetchRelationships = useCallback(async (page = 1, expertFirmId?: string) => {
    setLoading(true)
    try {
      const queryParams = expertFirmId ? `expert_firm_id=${expertFirmId}` : undefined
      const response = await repairerRelationshipService.list(page, queryParams)
      setRelationships(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des rattachements réparateurs:', error)
      setRelationships([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les rattachements quand expertFirmId change
  useEffect(() => {
    if (expertFirmId) {
      fetchRelationships(1, expertFirmId)
    } else {
      setRelationships([])
    }
  }, [expertFirmId, fetchRelationships])

  const selectedRelationship = relationships.find((rel) => rel.id === value)

  // Filtrer les résultats en fonction de la recherche
  const filteredRelationships = relationships.filter((rel) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      rel.repairer.name.toLowerCase().includes(search) ||
      rel.repairer.code?.toLowerCase().includes(search) ||
      rel.expert_firm.name.toLowerCase().includes(search)
    )
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange(null)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedRelationship && "text-muted-foreground"
          )}
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedRelationship ? (
            <div className="w-full flex items-center gap-2 truncate">
              <Wrench className="h-4 w-4 text-orange-600" />
              <span className="truncate">{selectedRelationship.repairer.name}</span>
              {showExpertFirm && (
                <span className="text-xs text-muted-foreground">
                  ↔ {selectedRelationship.expert_firm.name}
                </span>
              )}
              {showStatus && selectedRelationship.status && (
                <Badge 
                  variant={selectedRelationship.status.code === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs ml-auto",
                    selectedRelationship.status.code === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  )}
                >
                  {selectedRelationship.status.label}
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <div className="flex items-center gap-1">
            {selectedRelationship && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Rechercher un rattachement..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {expertFirmId ? 
                "Aucun rattachement réparateur trouvé pour ce cabinet d'expertise." : 
                "Veuillez d'abord sélectionner un cabinet d'expertise."
              }
            </CommandEmpty>
            <CommandGroup>
              {filteredRelationships.map((relationship) => (
                <CommandItem
                  key={relationship.id}
                  value={`${relationship.repairer.name} ${relationship.repairer.code || ''} ${relationship.expert_firm.name}`}
                  onSelect={() => {
                    onValueChange(relationship.id === value ? null : relationship.id.toString())
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === relationship.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Wrench className="h-4 w-4 text-orange-500 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{relationship.repairer.name}</span>
                        {relationship.repairer.code && (
                          <span className="text-xs text-muted-foreground truncate">
                            {relationship.repairer.code}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      {showExpertFirm && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="truncate">{relationship.expert_firm.name}</span>
                        </div>
                      )}
                      {showStatus && relationship.status && (
                        <Badge 
                          variant={relationship.status.code === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs shrink-0",
                            relationship.status.code === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {relationship.status.label}
                        </Badge>
                      )}
                    </div>
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
