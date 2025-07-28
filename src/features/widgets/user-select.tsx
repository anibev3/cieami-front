import React, { useState, useEffect, useCallback } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, ChevronsUpDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUsersStore } from '@/stores/usersStore'
import { UserRole, Status, UserFilters } from '@/types/administration'
import { useDebounce } from '@/hooks/use-debounce'

interface UserSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
  filterRole?: string // Pour filtrer par rôle spécifique
}

export function UserSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un utilisateur...",
  disabled = false,
  className,
  showStatus = false,
  filterRole
}: UserSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { users, loading, fetchUsers } = useUsersStore()

  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fonction pour rechercher les utilisateurs
  const searchUsers = useCallback(async (query: string) => {
    const filters: UserFilters = { search: query }
    if (filterRole) {
      filters.role = filterRole
    }
    await fetchUsers(filters)
  }, [fetchUsers, filterRole])

  // Effect pour déclencher la recherche quand la requête debounced change
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      searchUsers(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, searchUsers])

  // Charger les utilisateurs au montage si aucun utilisateur n'est chargé
  useEffect(() => {
    if (users.length === 0) {
      const filters: UserFilters = {}
      if (filterRole) {
        filters.role = filterRole
      }
      fetchUsers(filters)
    }
  }, [users.length, fetchUsers, filterRole])

  // Filtrer les utilisateurs par rôle si spécifié (pour l'affichage local)
  const filteredUsers = filterRole 
    ? users.filter(user => user.role.name === filterRole)
    : users

  const selectedUser = filteredUsers.find(user => user.id === value)

  // Réinitialiser la recherche quand le popover se ferme
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery('')
      // Recharger tous les utilisateurs quand on ferme
      const filters: UserFilters = {}
      if (filterRole) {
        filters.role = filterRole
      }
      fetchUsers(filters)
    }
  }

  const getRoleLabel = (role: UserRole) => {
    return role.label
  }

  const getStatusColor = (status: Status) => {
    switch (status.code) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'invited':
        return 'bg-blue-100 text-blue-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            !selectedUser && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedUser ? (
            <div className="flex items-center gap-2 truncate">
              <User className="h-4 w-4 text-purple-600" />
              <span className="truncate">{selectedUser.name}</span>
              {showStatus && (
                <Badge 
                  variant="secondary"
                  className={cn("text-xs", getStatusColor(selectedUser.status))}
                >
                  {selectedUser.status.label}
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
            placeholder="Rechercher un utilisateur..." 
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
                "Aucun utilisateur trouvé."
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.name} ${user.email} ${getRoleLabel(user.role)}`}
                  onSelect={() => {
                    onValueChange(user.id === value ? null : user.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    {showStatus && (
                      <Badge 
                        variant="secondary"
                        className={cn("text-xs", getStatusColor(user.status))}
                      >
                        {user.status.label}
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