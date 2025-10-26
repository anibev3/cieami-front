/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link2, ChevronsUpDown, Check, Loader2, X, Building } from 'lucide-react'
import { cn } from '@/lib/utils'
import { insurerRelationshipService } from '@/services/insurerRelationshipService'
import { InsurerRelationship } from '@/types/insurer-relationships'
import { useDebounce } from '@/hooks/use-debounce'

interface InsurerRelationshipSelectProps {
  value?: string | number | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
  showExpertFirm?: boolean
}

export function InsurerRelationshipSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un rattachement...",
  disabled = false,
  className,
  showStatus = true,
  showExpertFirm = false
}: InsurerRelationshipSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [relationships, setRelationships] = useState<InsurerRelationship[]>([])
  const [loading, setLoading] = useState(false)
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les rattachements
  const fetchRelationships = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response = await insurerRelationshipService.list(page)
      setRelationships(response.data)
    } catch (error) {
      console.error('❌ Erreur lors du chargement des rattachements assureurs:', error)
      setRelationships([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    // Ne pas recharger à chaque changement de recherche, utiliser le filtrage côté client
    // Le filtrage se fait dans filteredRelationships
  }, [debouncedSearchQuery])

  // Charger les rattachements au montage
  useEffect(() => {
    fetchRelationships(1)
  }, [fetchRelationships])

  const selectedRelationship = relationships.find((rel) => rel.id === value)
  
  // Debug logs supprimés

  // Filtrer les résultats en fonction de la recherche
  const filteredRelationships = relationships.filter((rel) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      rel.insurer?.name?.toLowerCase().includes(search) ||
      rel.expert_firm?.name?.toLowerCase().includes(search) ||
      rel.insurer?.code?.toLowerCase().includes(search)
    )
  })

  // Réinitialiser la recherche quand le popover se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
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
                <Link2 className="h-4 w-4 text-blue-600" />
                <span className="truncate">{selectedRelationship.insurer.name}</span>
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
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : (
                  "Aucun rattachement trouvé."
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredRelationships.map((relationship) => (
                  <CommandItem
                    key={relationship.id}
                    value={`${relationship.insurer.name} ${relationship.insurer.code || ''} ${relationship.expert_firm.name}`}
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
                        <Building className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate">{relationship.insurer.name}</span>
                          {showExpertFirm && (
                            <span className="text-xs text-muted-foreground truncate">
                              Cabinet: {relationship.expert_firm.name}
                            </span>
                          )}
                          {relationship.insurer.code && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {relationship.insurer.code}
                            </span>
                          )}
                        </div>
                      </div>
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
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedRelationship && !disabled && !loading && (
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

