import { useState, useEffect, useMemo } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
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
import { useRoleStore } from '@/stores/roleStore'
import { Role } from '@/services/roleService'
import { useDebounce } from '@/hooks/use-debounce'

interface RoleSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
}

export function RoleSelector({
  value,
  onValueChange,
  placeholder = "Sélectionner un rôle...",
  disabled = false,
  className,
  required = false
}: RoleSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { roles, loading, fetchRoles } = useRoleStore()
  
  // Debounce de la recherche pour éviter trop d'appels API
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Charger les rôles au montage et quand la recherche change
  useEffect(() => {
    fetchRoles(debouncedSearch ? { search: debouncedSearch } : undefined)
  }, [debouncedSearch, fetchRoles])

  // Filtrer les rôles localement aussi pour une meilleure UX
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles
    return roles.filter(role => 
      role.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [roles, searchQuery])

  const selectedRole = roles.find(role => role.name === value)

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? '' : currentValue)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedRole ? (
            <span className="truncate">{selectedRole.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Rechercher un rôle..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Chargement...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {searchQuery ? "Aucun rôle trouvé." : "Aucun rôle disponible."}
                </CommandEmpty>
                <CommandGroup>
                  {filteredRoles.map((role) => (
                    <CommandItem
                      key={role.name}
                      value={role.name}
                      onSelect={() => handleSelect(role.name)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === role.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{role.label}</span>
                        {role.description && (
                          <span className="text-xs text-muted-foreground">
                            {role.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
