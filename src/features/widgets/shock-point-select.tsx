/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ChevronsUpDown, Plus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShockPoint {
  id: number
  code: string
  label: string
  description?: string
}

interface ShockPointSelectProps {
  value: number
  onValueChange: (value: number) => void
  shockPoints: ShockPoint[]
  placeholder?: string
  className?: string
  showSelectedInfo?: boolean
  disabled?: boolean
  onCreateNew?: () => void
}

export function ShockPointSelect({
  value,
  onValueChange,
  shockPoints,
  placeholder = "🔍 Rechercher un point de choc...",
  className = "",
  showSelectedInfo = false,
  disabled = false,
  onCreateNew
}: ShockPointSelectProps) {
  const [open, setOpen] = useState(false)
  
  // Vérifications de sécurité renforcées
  const validShockPoints = Array.isArray(shockPoints) 
    ? shockPoints.filter(point => point != null && typeof point === 'object' && 'id' in point && 'label' in point && 'code' in point)
    : []
  
  const selectedShockPoint = validShockPoints.find(point => point.id === value) || null
  const hasValue = value > 0 && selectedShockPoint != null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left",
              !hasValue ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-50',
              className
            )}
            disabled={disabled}
          >
            {hasValue && selectedShockPoint ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{selectedShockPoint.label || 'Point de choc'}</span>
                <Badge variant="secondary" className="text-xs">
                  #{selectedShockPoint.code || 'N/A'}
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher un point de choc..." />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="space-y-2">
                  <p>{validShockPoints.length === 0 ? 'Aucun point de choc trouvé' : 'Aucun résultat pour cette recherche'}</p>
                  {onCreateNew && validShockPoints.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpen(false)
                        onCreateNew()
                      }}
                      className="mx-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un nouveau point de choc
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {validShockPoints
                  .map((point) => {
                    // Vérification de sécurité supplémentaire
                    if (!point || typeof point !== 'object' || !('id' in point) || !('label' in point) || !('code' in point)) {
                      return null
                    }
                    
                    return (
                      <CommandItem
                        key={point.id}
                        value={`${point.label || ''} ${point.code || ''} ${point.description || ''}`}
                        onSelect={() => {
                          onValueChange(point.id)
                          setOpen(false)
                        }}
                        className="py-3"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{point.label || 'Sans nom'}</span>
                            {/* {point.description && (
                              <p className="text-xs text-gray-500 truncate">{point.description}</p>
                            )} */}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              #{point.code || 'N/A'}
                            </Badge>
                            {value === point.id && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    )
                  })
                  .filter(Boolean) // Filtrer les éléments null
                }
              </CommandGroup>
              {onCreateNew && validShockPoints.length === 0 && (
                <div className="border-t p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false)
                      onCreateNew()
                    }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un nouveau point de choc
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* {hasValue && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange(0) }}
        >
          <X className="h-3 w-3" />
        </Button>
      )} */}
      </div>
      
      {/* {showSelectedInfo && selectedShockPoint && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">{selectedShockPoint.label}</p>
              <p className="text-xs text-blue-600">Code: {selectedShockPoint.code}</p>
              {selectedShockPoint.description && (
                <p className="text-xs text-blue-600 mt-1">{selectedShockPoint.description}</p>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
} 