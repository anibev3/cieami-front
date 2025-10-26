import { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { insurerRelationshipService } from '@/services/insurerRelationshipService'
import { useDebounce } from '@/hooks/use-debounce'
import { InsurerRelationship } from '@/types/insurer-relationships'
import { useUser } from '@/stores/authStore'

interface ExpertFirmSelectProps {
  value?: string | number | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
}

export function ExpertFirmSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un cabinet d'expertise...",
  disabled = false,
  className,
  showStatus = true
}: ExpertFirmSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [insurerRelationships, setInsurerRelationships] = useState<InsurerRelationship[]>([])
  const [loading, setLoading] = useState(false)
  
  // Récupérer l'utilisateur connecté
  const user = useUser()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les rattachements assureurs de l'utilisateur connecté
  const searchInsurerRelationships = useCallback(async (query: string) => {
    setLoading(true)
    try {
      const response = await insurerRelationshipService.list(1)
      // Filtrer uniquement les rattachements de l'assureur connecté
      const filtered = response.data.filter(rel => {
        const matchesUserInsurer = rel.insurer?.id === user?.entity?.id
        const matchesSearch = rel.expert_firm?.name?.toLowerCase().includes(query.toLowerCase())
        return matchesUserInsurer && matchesSearch
      })
      setInsurerRelationships(filtered)
    } catch (_error) {
      // Erreur silencieuse, gérée par l'interface utilisateur
    } finally {
      setLoading(false)
    }
  }, [user?.entity?.id])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      searchInsurerRelationships(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchInsurerRelationships])

  // Charger les rattachements au montage du composant
  useEffect(() => {
    if (insurerRelationships.length === 0) {
      searchInsurerRelationships('')
    }
  }, [insurerRelationships.length, searchInsurerRelationships])

  // Trouver l'élément sélectionné
  const selectedRelationship = insurerRelationships.find((rel) => rel.id === value)
  
  // Debug logs supprimés

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
      searchInsurerRelationships('')
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
                <Building className="h-4 w-4 text-purple-600" />
                <span className="truncate">
                  {selectedRelationship.expert_firm?.name}
                </span>
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
              placeholder="Rechercher un cabinet d'expertise..." 
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
                  "Aucun cabinet d'expertise trouvé."
                )}
              </CommandEmpty>
              <CommandGroup>
                {insurerRelationships.filter(rel => {
                  if (!searchQuery) return true
                  const search = searchQuery.toLowerCase()
                  return rel.expert_firm?.name?.toLowerCase().includes(search)
                }).map((relationship) => (
                  <CommandItem
                    key={relationship.id}
                    value={`${relationship.expert_firm?.name} ${relationship.insurer?.name || ''} ${relationship.status?.label || ''}`}
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
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{relationship.expert_firm?.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Cabinet d'expertise
                        </span>
                      </div>
                      {showStatus && relationship.status && (
                        <Badge 
                          variant={relationship.status.code === 'active' ? 'default' : 'secondary'}
                          className={cn(
                            "text-xs",
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