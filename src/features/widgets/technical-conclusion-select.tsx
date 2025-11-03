import React, { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, ChevronsUpDown, Plus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TechnicalConclusion {
  id: number
  code: string
  label: string
  description: string
}

interface TechnicalConclusionSelectProps {
  value: number
  onValueChange: (value: number) => void
  technicalConclusions: TechnicalConclusion[]
  placeholder?: string
  className?: string
  showSelectedInfo?: boolean
  disabled?: boolean
  onCreateNew?: () => void
}

export function TechnicalConclusionSelect({
  value,
  onValueChange,
  technicalConclusions,
  placeholder = "🔍 Rechercher une conclusion technique...",
  className = "",
  showSelectedInfo = false,
  disabled = false,
  onCreateNew
}: TechnicalConclusionSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedTechnicalConclusion = technicalConclusions.find(conclusion => conclusion.id === value)
  const hasValue = value > 0

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
              "w-full justify-between",
              !hasValue && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            {hasValue ? (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="truncate">{selectedTechnicalConclusion?.label}</span>
                {selectedTechnicalConclusion?.code && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedTechnicalConclusion.code}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{placeholder}</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher une conclusion technique..." />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="space-y-2">
                  <p>Aucune conclusion technique trouvée</p>
                  {onCreateNew && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setOpen(false); onCreateNew(); }}
                      className="mx-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer une nouvelle conclusion
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {technicalConclusions.map((conclusion) => (
                  <CommandItem
                    key={conclusion.id}
                    value={`${conclusion.label} ${conclusion.code}`}
                    onSelect={() => {
                      onValueChange(conclusion.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === conclusion.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{conclusion.label}</span>
                      {/* {conclusion.code && (
                        <Badge variant="outline" className="text-xs">
                          {conclusion.code}
                        </Badge>
                      )} */}
                    </div>
                    {/* <div className="ml-auto text-xs text-muted-foreground">
                      {conclusion.description}
                    </div> */}
                  </CommandItem>
                ))}
              </CommandGroup>
              {onCreateNew && (
                <div className="border-t p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setOpen(false); onCreateNew(); }}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une nouvelle conclusion technique
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hasValue && !disabled && (
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
      )}
      </div>
      
      {showSelectedInfo && selectedTechnicalConclusion && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">{selectedTechnicalConclusion.label}</span>
            {selectedTechnicalConclusion.code && (
              <Badge variant="secondary" className="text-xs">
                {selectedTechnicalConclusion.code}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-600">
            {selectedTechnicalConclusion.description}
          </div>
        </div>
      )}
    </div>
  )
} 