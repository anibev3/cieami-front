import * as React from 'react'
import { Check, ChevronsUpDown, Search, FileText, X } from 'lucide-react'
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
import { useRemarkStore } from '@/stores/remarkStore'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

interface RemarkSelectProps {
  value?: number | null
  onValueChange: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showStatus?: boolean
  showDescription?: boolean
}

export function RemarkSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner une remarque...",
  disabled = false,
  className,
  showStatus = false,
  showDescription = false
}: RemarkSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { remarks, loading, fetchRemarks } = useRemarkStore()

  // Charger les remarques si pas encore chargées
  useEffect(() => {
    if (remarks.length === 0 && !loading) {
      fetchRemarks()
    }
  }, [remarks.length, loading, fetchRemarks])

  // Trouver la remarque sélectionnée
  const selectedRemark = remarks.find(remark => remark.id === value)

  // Filtrer les remarques basé sur la recherche
  const filteredRemarks = remarks.filter(remark =>
    remark.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !selectedRemark && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {selectedRemark ? (
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="truncate">{selectedRemark.label}</span>
                {showStatus && (
                  <Badge 
                    variant={selectedRemark.status.label === 'Actif(ve)' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs",
                      selectedRemark.status.label === 'Actif(ve)' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {selectedRemark.status.label}
                  </Badge>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Rechercher une remarque..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Chargement...
                  </span>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Aucune remarque trouvée.
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredRemarks.map((remark) => (
                <CommandItem
                  key={remark.id}
                  value={remark.id.toString()}
                  onSelect={() => {
                    onValueChange(remark.id === value ? null : remark.id)
                    setOpen(false)
                    setSearchTerm('')
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === remark.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          <FileText className="h-3 w-3 text-blue-600" />
                          {remark.label}
                        </span>
                        {showDescription && remark.description && (
                          <span 
                            className="text-xs text-muted-foreground mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ 
                              __html: remark.description.replace(/<[^>]*>/g, '').substring(0, 80) + '...' 
                            }}
                          />
                        )}
                      </div>
                    </div>
                    {showStatus && (
                      <Badge 
                        variant={remark.status.label === 'Actif(ve)' ? 'default' : 'secondary'}
                        className={cn(
                          "text-xs ml-2",
                          remark.status.label === 'Actif(ve)' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {remark.status.label}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        </PopoverContent>
      </Popover>
      {selectedRemark && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          aria-label="Effacer"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onValueChange(null) }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
} 