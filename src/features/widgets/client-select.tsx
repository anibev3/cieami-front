import { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { User, ChevronsUpDown, Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClientsStore } from '@/features/gestion/clients/store'
import { useDebounce } from '@/hooks/use-debounce'

interface ClientSelectProps {
  value?: number | string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ClientSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un client...",
  disabled = false,
  className
}: ClientSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { clients, loading, fetchClients } = useClientsStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les clients
  const searchClients = useCallback(async (query: string) => {
    await fetchClients({ search: query, page: 1 })
  }, [fetchClients])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      searchClients(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchClients])

  // Charger les clients au montage si aucun client n'est chargé
  useEffect(() => {
    if (clients.length === 0) {
      fetchClients()
    }
  }, [clients.length, fetchClients])

  // Les IDs sont des strings, pas des numbers
  const selectedClient = clients.find(client => client.id === value)
  
  // Debug logs supprimés

  // Réinitialiser la recherche quand le popover se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
      // Recharger tous les clients quand on ferme
      fetchClients()
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
              !selectedClient && "text-muted-foreground"
            )}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : selectedClient ? (
              <div className="flex items-center gap-2 truncate">
                <User className="h-4 w-4 text-blue-600" />
                <span className="truncate">{selectedClient.name}</span>
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
            placeholder="Rechercher un client..." 
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
                "Aucun client trouvé."
              )}
            </CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.name} ${client.email}`}
        onSelect={() => {
          onValueChange(client.id === value ? null : client.id)
          setOpen(false)
        }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.email}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        </PopoverContent>
      </Popover>
      {selectedClient && !disabled && !loading && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onValueChange(null)
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
} 