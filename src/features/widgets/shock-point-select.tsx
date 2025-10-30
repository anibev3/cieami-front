/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ChevronsUpDown, Plus, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'

interface ShockPoint {
  id: string
  code: string
  label: string
  description?: string
}

interface ShockPointSelectProps {
  value: string
  onValueChange: (value: string) => void
  shockPoints?: ShockPoint[] // Optionnel maintenant car on charge depuis l'API
  placeholder?: string
  className?: string
  showSelectedInfo?: boolean
  disabled?: boolean
  onCreateNew?: () => void
  searchEndpoint?: string // Endpoint personnalisé pour la recherche
}

export function ShockPointSelect({
  value,
  onValueChange,
  shockPoints = [],
  placeholder = "🔍 Rechercher un point de choc...",
  className = "",
  showSelectedInfo = false,
  disabled = false,
  onCreateNew,
  searchEndpoint = API_CONFIG.ENDPOINTS.SHOCK_POINTS
}: ShockPointSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<ShockPoint[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedShockPoint, setSelectedShockPoint] = useState<ShockPoint | null>(null)
  
  // Charger la liste initiale des points de choc
  const loadInitialShockPoints = useCallback(async () => {
    setIsSearching(true)
    try {
      const response = await axiosInstance.get(`${searchEndpoint}?per_page=50`)
      if (response.status === 200) {
        setSearchResults(response.data.data || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des points de choc:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchEndpoint])

  // Fonction de recherche API avec debounce
  const searchShockPoints = useCallback(async (query: string) => {
    if (!query.trim()) {
      // Si pas de requête, charger la liste initiale
      loadInitialShockPoints()
      return
    }

    setIsSearching(true)
    try {
      const response = await axiosInstance.get(`${searchEndpoint}?search=${encodeURIComponent(query)}&per_page=20`)
      if (response.status === 200) {
        setSearchResults(response.data.data || [])
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des points de choc:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchEndpoint, loadInitialShockPoints])

  // Charger la liste initiale au montage du composant
  useEffect(() => {
    loadInitialShockPoints()
  }, [loadInitialShockPoints])

  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchShockPoints(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchShockPoints])

  // Charger le point de choc sélectionné
  useEffect(() => {
  const loadSelectedShockPoint = async () => {
      if (value && String(value).length > 0) {
        try {
          const response = await axiosInstance.get(`${searchEndpoint}/${value}`)
          if (response.status === 200) {
            const data = response.data.data || response.data
            // Normaliser l'id en string
            setSelectedShockPoint({ ...data, id: String(data.id) })
          }
        } catch (error) {
          console.error('Erreur lors du chargement du point de choc sélectionné:', error)
          setSelectedShockPoint(null)
        }
      } else {
        setSelectedShockPoint(null)
      }
    }

    loadSelectedShockPoint()
  }, [value, searchEndpoint])

  // Utiliser les résultats de recherche ou les points de choc fournis
  const availableShockPoints = searchResults.length > 0 ? searchResults : shockPoints
  const validShockPoints = Array.isArray(availableShockPoints) 
    ? availableShockPoints
        .map((p: any) => ({ ...p, id: String(p.id) }))
        .filter(point => point != null && typeof point === 'object' && 'id' in point && 'label' in point && 'code' in point)
    : []
  
  const hasValue = Boolean(value) && selectedShockPoint != null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left",
              !hasValue ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-50',
              className
            )}
            disabled={disabled}
          >
            {hasValue && selectedShockPoint ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{selectedShockPoint.label || 'Point de choc'}</span>
                <Badge variant="secondary" className="text-xs">
                  #{selectedShockPoint.code || 'N/A'}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Rechercher un point de choc..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isSearching && (
                <div className="py-6 text-center text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Recherche en cours...</span>
                  </div>
                </div>
              )}
              {!isSearching && validShockPoints.length === 0 && (
                <CommandEmpty className="py-6 text-center text-sm">
                  <div className="space-y-2">
                    <p>
                      {searchQuery.trim() 
                        ? 'Aucun résultat pour cette recherche' 
                        : 'Aucun point de choc disponible'
                      }
                    </p>
                    {/* {onCreateNew && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setOpen(false)
                          onCreateNew()
                        }}
                        className="mx-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Créer un nouveau point de choc
                      </Button>
                    )} */}
                  </div>
                </CommandEmpty>
              )}
              <CommandGroup>
                {validShockPoints
                  .map((point) => {
                    // Vérification de sécurité supplémentaire
                    if (!point || typeof point !== 'object' || !('id' in point) || !('label' in point) || !('code' in point)) {
                      return null
                    }
                    
                    return (
                      <CommandItem
                        key={point.id}
                        value={`${point.label || ''} ${point.code || ''} ${point.description || ''}`}
                        onSelect={() => {
                          onValueChange(String(point.id))
                          setOpen(false)
                        }}
                        className="py-3"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{point.label || 'Sans nom'}</span>
                            {/* {point.description && (
                              <p className="text-xs text-gray-500 truncate">{point.description}</p>
                            )} */}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              #{point.code || 'N/A'}
                            </Badge>
                            {String(value) === String(point.id) && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    )
                  })
                  .filter(Boolean) // Filtrer les éléments null
                }
              </CommandGroup>
              {onCreateNew && validShockPoints.length === 0 && !isSearching && (
                <div className="border-t p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false)
                      onCreateNew()
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un nouveau point de choc
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* {hasValue && !disabled && (
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
      )} */}
      </div>
      
      {/* {showSelectedInfo && selectedShockPoint && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">{selectedShockPoint.label}</p>
              <p className="text-xs text-blue-600">Code: {selectedShockPoint.code}</p>
              {selectedShockPoint.description && (
                <p className="text-xs text-blue-600 mt-1">{selectedShockPoint.description}</p>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
} 