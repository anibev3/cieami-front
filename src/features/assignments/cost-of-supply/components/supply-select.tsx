import { useState, useEffect } from 'react'
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
import { getSuppliesByVehicleModel } from '@/services/supplies'
import { SupplyPrice } from '@/types/supplies'

interface SupplySelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  vehicleModelId?: string
}

export function SupplySelect({
  value,
  onValueChange,
  placeholder = "Sélectionnez une fourniture...",
  disabled = false,
  vehicleModelId
}: SupplySelectProps) {
  const [open, setOpen] = useState(false)
  const [supplies, setSupplies] = useState<SupplyPrice[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSupplies = async () => {
      if (!vehicleModelId) {
        setSupplies([])
        return
      }

      setLoading(true)
      try {
        const response = await getSuppliesByVehicleModel(vehicleModelId)
        // Nouveau format : les données sont dans data.shockWorks.data
        const shockWorks = response.data.shockWorks
        setSupplies(shockWorks?.data || [])
      } catch (_error) {
        // Erreur lors du chargement des fournitures
        setSupplies([])
      } finally {
        setLoading(false)
      }
    }

    fetchSupplies()
  }, [vehicleModelId])

  const selectedSupply = Array.isArray(supplies) ? supplies.find(supply => supply.supply.id.toString() === value) : undefined

  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  // const getStatusBadge = (supplyPrice: SupplyPrice) => {
  //   const hasNewPrice = parseFloat(supplyPrice.new_amount) > 0
  //   const hasObsolescence = parseFloat(supplyPrice.obsolescence_rate || '0') > 0
  //   const hasRecovery = parseFloat(supplyPrice.recovery_amount || '0') > 0

  //   if (hasNewPrice) return 'Nouveau'
  //   if (hasObsolescence) return 'Obsolète'
  //   if (hasRecovery) return 'Récupération'
  //   return 'Standard'
  // }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'Nouveau':
  //       return 'text-green-600'
  //     case 'Obsolète':
  //       return 'text-red-600'
  //     case 'Récupération':
  //       return 'text-blue-600'
  //     default:
  //       return 'text-gray-600'
  //   }
  // }

  const renderSupplyInfo = (supplyPrice: SupplyPrice) => {
    // const status = getStatusBadge(supplyPrice)
    return (
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{supplyPrice.supply.label}</span>
          {/* <span className={`text-xs ml-2 ${getStatusColor(status)}`}>
            {status}
          </span> */}
        </div>
        {/* <div className="text-xs text-muted-foreground mt-1">
          {formatCurrency(supplyPrice.new_amount)}
        </div> */}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading || !vehicleModelId}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : !vehicleModelId ? (
            "Sélectionnez un modèle"
          ) : selectedSupply ? (
            renderSupplyInfo(selectedSupply)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une fourniture..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des fournitures...
              </div>
            ) : !vehicleModelId ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                Sélectionnez un modèle
              </div>
            ) : !Array.isArray(supplies) || supplies.length === 0 ? (
              <CommandEmpty>Aucune fourniture trouvée pour ce modèle.</CommandEmpty>
            ) : (
              // <CommandGroup>
              //   {supplies.map((supplyPrice) => (
              //     <CommandItem
              //       key={supplyPrice.id}
              //       value={`${supplyPrice.supply.label} ${supplyPrice.supply.description || ''}`}
              //       onSelect={() => {
              //         onValueChange(supplyPrice.supply.id.toString())
              //         setOpen(false)
              //       }}
              //       className="flex flex-col items-start p-3"
              //     >
              //       <div className="flex items-center justify-between w-full">
              //         <Check
              //           className={cn(
              //             "mr-2 h-4 w-4",
              //             value === supplyPrice.supply.id.toString() ? "opacity-100" : "opacity-0"
              //           )}
              //         />
              //       </div>
              //       {renderSupplyInfo(supplyPrice)}
              //     </CommandItem>
              //   ))}
                    // </CommandGroup>
              <CommandGroup>
                {supplies.map((supplyPrice) => (
                  <CommandItem
                    key={supplyPrice.id}
                    value={`${supplyPrice.supply.label} ${supplyPrice.supply.description || ''}`}
                    onSelect={() => {
                      onValueChange(supplyPrice.supply.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === supplyPrice.supply.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{supplyPrice.supply.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {supplyPrice.supply.label} - {formatCurrency(supplyPrice.new_amount_excluding_tax || '0')}
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