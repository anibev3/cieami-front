import { useEffect, useState, useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useVehicleGenresStore } from '@/stores/vehicleGenresStore'
import { VehicleGenre } from '@/services/vehicleGenreService'
import { Loader2, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'

interface VehicleGenreSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showDescription?: boolean
  enableSearch?: boolean
  searchPlaceholder?: string
}

export function VehicleGenreSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un genre de véhicule",
  disabled = false,
  className,
  showDescription = false,
  enableSearch = true,
  searchPlaceholder = "Rechercher un genre..."
}: VehicleGenreSelectProps) {
  const { vehicleGenres, loading, fetchVehicleGenres } = useVehicleGenresStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Fonction de recherche avec API
  const searchVehicleGenres = useCallback(async (search: string) => {
    try {
      await fetchVehicleGenres({ search, page: 1 })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la recherche:', error)
    }
  }, [fetchVehicleGenres])

  // Charger les données initiales
  useEffect(() => {
    if (!isInitialized) {
      fetchVehicleGenres()
      setIsInitialized(true)
    }
  }, [fetchVehicleGenres, isInitialized])

  // Effectuer la recherche quand le terme de recherche change
  useEffect(() => {
    if (isInitialized && enableSearch && debouncedSearchTerm !== '') {
      searchVehicleGenres(debouncedSearchTerm)
    } else if (isInitialized && enableSearch && debouncedSearchTerm === '') {
      // Recharger tous les genres si la recherche est vide
      fetchVehicleGenres()
    }
  }, [debouncedSearchTerm, searchVehicleGenres, fetchVehicleGenres, isInitialized, enableSearch])

  // Réinitialiser la recherche quand le select se ferme
  useEffect(() => {
    if (!isOpen && enableSearch) {
      setSearchTerm('')
    }
  }, [isOpen, enableSearch])

  const selectedGenre = vehicleGenres.find(genre => genre.id.toString() === value)
  
  // Log pour déboguer
  // eslint-disable-next-line no-console
  console.log('VehicleGenreSelect - value:', value)
  // eslint-disable-next-line no-console
  console.log('VehicleGenreSelect - vehicleGenres:', vehicleGenres)
  // eslint-disable-next-line no-console
  console.log('VehicleGenreSelect - selectedGenre:', selectedGenre)

  return (
    <div className={cn(className, "w-full flex items-center gap-1") }>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || loading}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Chargement...</span>
              </div>
            ) : selectedGenre ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedGenre.label}</span>
              </div>
            ) : (
              placeholder
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {enableSearch && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          {vehicleGenres.length === 0 && !loading ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm ? 'Aucun genre trouvé' : 'Aucun genre disponible'}
            </div>
          ) : (
            vehicleGenres.map((genre: VehicleGenre) => (
              <SelectItem key={genre.id} value={genre.id.toString()}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{genre.label}</span>
                  {showDescription && genre.description && (
                    <span className="text-xs text-muted-foreground">
                      {genre.description}
                    </span>
                  )}
                  <span className="text-xs text-blue-600 font-mono">
                    {genre.code}
                  </span>
                </div>
              </SelectItem>
            ))
          )}
          {loading && (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Recherche...</span>
              </div>
            </div>
          )}
        </SelectContent>
      </Select>
      {!!value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange('') }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
