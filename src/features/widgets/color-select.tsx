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
import { useColorsStore } from '@/stores/colors'
import { Color } from '@/types/colors'

interface ColorSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ColorSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une couleur...",
  disabled = false
}: ColorSelectProps) {
  const [open, setOpen] = useState(false)
  const { colors, loading, fetchColors } = useColorsStore()

  useEffect(() => {
    if (colors.length === 0) {
      fetchColors()
    }
  }, [fetchColors, colors.length])

  const selectedColor = colors.find(color => color.id.toString() === value)

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

  const renderColorInfo = (color: Color) => {
    return (
      <div className="flex flex-col items-start text-left">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{color.label}</span>
          {color.status && (
            <span className={`text-xs ${getStatusColor(color.status.code)}`}>
              {color.status.label}
            </span>
          )}
        </div>
        {color.description && (
          <span className="text-xs text-muted-foreground mt-1">
            {color.description}
          </span>
        )}
        {color.code && (
          <span className="text-xs text-muted-foreground">
            Code: {color.code}
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
          ) : selectedColor ? (
            renderColorInfo(selectedColor)
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une couleur..." />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des couleurs...
              </div>
            ) : colors.length === 0 ? (
              <CommandEmpty>Aucune couleur trouvée.</CommandEmpty>
            ) : (
              <CommandGroup>
                {colors.map((color) => (
                  <CommandItem
                    key={color.id}
                    value={`${color.label} ${color.description || ''} ${color.code || ''}`}
                    onSelect={() => {
                      onValueChange(color.id.toString())
                      setOpen(false)
                    }}
                    className="flex flex-col items-start p-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === color.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    {renderColorInfo(color)}
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