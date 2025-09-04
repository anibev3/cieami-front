import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
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
import { useBankStore } from '@/stores/bankStore'
import { useDebounce } from '@/hooks/use-debounce'

interface BankSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function BankSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez une banque...",
  disabled = false
}: BankSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { banks, loading, fetchBanks } = useBankStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const handleSearch = useCallback(() => {
    fetchBanks(debouncedSearchTerm)
  }, [fetchBanks, debouncedSearchTerm])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const selectedBank = banks.find(bank => bank.id.toString() === value)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Réinitialiser la recherche quand le popover se ferme
      setSearchTerm('')
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedBank ? (
            <div className="flex flex-col items-start text-left">
              <span className="font-medium">{selectedBank.name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedBank.code}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Rechercher une banque..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des banques...
              </div>
            ) : banks.length === 0 ? (
              <CommandEmpty>Aucune banque trouvée.</CommandEmpty>
            ) : (
              <CommandGroup>
                {banks.map((bank) => (
                  <CommandItem
                    key={bank.id}
                    value={`${bank.name} ${bank.code}`}
                    onSelect={() => {
                      onValueChange(bank.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === bank.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{bank.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {bank.code}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 