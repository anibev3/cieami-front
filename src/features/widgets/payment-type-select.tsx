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
import { usePaymentTypeStore } from '@/stores/paymentTypeStore'

interface PaymentTypeSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PaymentTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez un type...",
  disabled = false
}: PaymentTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const { paymentTypes, loading, fetchPaymentTypes } = usePaymentTypeStore()

  useEffect(() => {
    if (paymentTypes.length === 0) {
      fetchPaymentTypes()
    }
  }, [fetchPaymentTypes, paymentTypes.length])

  const selectedType = paymentTypes.find(type => type.id.toString() === value)

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
            ) : selectedType ? (
              selectedType.label
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un type..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des types...
              </div>
            ) : paymentTypes.length === 0 ? (
              <CommandEmpty>Aucun type trouvé.</CommandEmpty>
            ) : (
              <CommandGroup>
                {paymentTypes.map((type) => (
                  <CommandItem
                    key={type.id}
                    value={type.label}
                    onSelect={() => {
                      onValueChange(type.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === type.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {type.label}
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