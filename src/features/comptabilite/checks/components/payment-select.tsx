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
import { usePaymentStore } from '@/stores/paymentStore'
import { useDebounce } from '@/hooks/use-debounce'

interface PaymentSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PaymentSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez un paiement...",
  disabled = false
}: PaymentSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { payments, loading, fetchPayments } = usePaymentStore()
  
  // Debounce la recherche pour éviter trop d'appels API
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const handleSearch = useCallback(() => {
    fetchPayments(1, 50, debouncedSearchTerm)
  }, [fetchPayments, debouncedSearchTerm])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const selectedPayment = payments.find(payment => payment.id.toString() === value)

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
          ) : selectedPayment ? (
            <div className="flex flex-col items-start text-left">
              <span className="font-medium">{selectedPayment.reference}</span>
              <span className="text-xs text-muted-foreground">
                {parseFloat(selectedPayment.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })} - {selectedPayment.payment_method?.label || 'Méthode non définie'}
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
            placeholder="Rechercher un paiement..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des paiements...
              </div>
            ) : payments.length === 0 ? (
              <CommandEmpty>Aucun paiement trouvé.</CommandEmpty>
            ) : (
              <CommandGroup>
                {payments.map((payment) => (
                  <CommandItem
                    key={payment.id}
                    value={`${payment.reference} ${payment.payment_method?.label || 'Méthode non définie'} ${payment.assignment.reference}`}
                    onSelect={() => {
                      onValueChange(payment.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === payment.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{payment.reference}</span>
                      <span className="text-xs text-muted-foreground">
                        {parseFloat(payment.amount).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })} - {payment.payment_method?.label || 'Méthode non définie'}
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