import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
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
import { usePaymentMethodStore } from '@/stores/paymentMethodStore'

interface PaymentMethodSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PaymentMethodSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez une méthode...",
  disabled = false
}: PaymentMethodSelectProps) {
  const [open, setOpen] = useState(false)
  const { paymentMethods, loading, fetchPaymentMethods } = usePaymentMethodStore()

  useEffect(() => {
    if (paymentMethods.length === 0) {
      fetchPaymentMethods()
    }
  }, [fetchPaymentMethods, paymentMethods.length])

  const selectedMethod = paymentMethods.find(method => method.id.toString() === value)

  return (
    <div className="flex items-center gap-1 w-full">
      <Popover open={open} onOpenChange={setOpen}>
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
            ) : selectedMethod ? (
              selectedMethod.label
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une méthode..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des méthodes...
              </div>
            ) : paymentMethods.length === 0 ? (
              <CommandEmpty>Aucune méthode trouvée.</CommandEmpty>
            ) : (
              <CommandGroup>
                {paymentMethods.map((method) => (
                  <CommandItem
                    key={method.id}
                    value={method.label}
                    onSelect={() => {
                      onValueChange(method.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === method.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {method.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        </PopoverContent>
      </Popover>
      {!!value && !disabled && !loading && (
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