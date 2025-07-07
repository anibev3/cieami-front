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
import { useBrandsStore } from '@/stores/brands'
import { Brand } from '@/types/brands'

interface BrandSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function BrandSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une marque...",
  disabled = false
}: BrandSelectProps) {
  const [open, setOpen] = useState(false)
  const { brands, loading, fetchBrands } = useBrandsStore()

  useEffect(() => {
    if (brands.length === 0) {
      fetchBrands()
    }
  }, [fetchBrands, brands.length])

  const selectedBrand = brands.find(brand => brand.id.toString() === value)

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'active':
        return 'text-green-600'
      case 'inactive':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const renderBrandInfo = (brand: Brand) => {
    return (
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{brand.label}</span>
          {brand.status && (
            <span className={`text-xs ${getStatusColor(brand.status.code)}`}>
              {brand.status.label}
            </span>
          )}
        </div>
        {brand.description && (
          <span className="text-xs text-muted-foreground mt-1">
            {brand.description}
          </span>
        )}
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
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : selectedBrand ? (
            renderBrandInfo(selectedBrand)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une marque..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des marques...
              </div>
            ) : brands.length === 0 ? (
              <CommandEmpty>Aucune marque trouvée.</CommandEmpty>
            ) : (
              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={`${brand.label} ${brand.description || ''}`}
                    onSelect={() => {
                      onValueChange(brand.id.toString())
                      setOpen(false)
                    }}
                    className="flex flex-col items-start p-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === brand.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    {renderBrandInfo(brand)}
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