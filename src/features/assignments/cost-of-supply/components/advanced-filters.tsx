import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface FiltersState {
  search: string
  priceRange: {
    min: string
    max: string
  }
  operations: {
    disassembly: boolean
    replacement: boolean
    repair: boolean
    paint: boolean
    control: boolean
  }
  status: {
    new: boolean
    obsolete: boolean
    recovery: boolean
    standard: boolean
  }
}

interface AdvancedFiltersProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
  onClearFilters: () => void
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof FiltersState, value: string | FiltersState['priceRange'] | FiltersState['operations'] | FiltersState['status']) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleOperationChange = (operation: keyof FiltersState['operations'], checked: boolean) => {
    onFiltersChange({
      ...filters,
      operations: {
        ...filters.operations,
        [operation]: checked
      }
    })
  }

  const handleStatusChange = (status: keyof FiltersState['status'], checked: boolean) => {
    onFiltersChange({
      ...filters,
      status: {
        ...filters.status,
        [status]: checked
      }
    })
  }

  const activeFiltersCount = [
    filters.search,
    filters.priceRange.min,
    filters.priceRange.max,
    ...Object.values(filters.operations),
    ...Object.values(filters.status)
  ].filter(Boolean).length

  return (
    <Card className="mb-4 shadow-none">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                Filtres avancés
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Recherche textuelle */}
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <Input
                id="search"
                placeholder="Rechercher dans les fournitures..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <Separator />

            {/* Plage de prix */}
            <div className="space-y-2">
              <Label>Plage de prix (XOF)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                    Prix minimum
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={filters.priceRange.min}
                    onChange={(e) => handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      min: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                    Prix maximum
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="∞"
                    value={filters.priceRange.max}
                    onChange={(e) => handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      max: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Opérations */}
            <div className="space-y-2">
              <Label>Opérations</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disassembly"
                    checked={filters.operations.disassembly}
                    onCheckedChange={(checked) => handleOperationChange('disassembly', checked as boolean)}
                  />
                  <Label htmlFor="disassembly" className="text-sm">Démontage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="replacement"
                    checked={filters.operations.replacement}
                    onCheckedChange={(checked) => handleOperationChange('replacement', checked as boolean)}
                  />
                  <Label htmlFor="replacement" className="text-sm">Remplacement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="repair"
                    checked={filters.operations.repair}
                    onCheckedChange={(checked) => handleOperationChange('repair', checked as boolean)}
                  />
                  <Label htmlFor="repair" className="text-sm">Réparation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paint"
                    checked={filters.operations.paint}
                    onCheckedChange={(checked) => handleOperationChange('paint', checked as boolean)}
                  />
                  <Label htmlFor="paint" className="text-sm">Peinture</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="control"
                    checked={filters.operations.control}
                    onCheckedChange={(checked) => handleOperationChange('control', checked as boolean)}
                  />
                  <Label htmlFor="control" className="text-sm">Contrôle</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Statuts */}
            <div className="space-y-2">
              <Label>Statuts</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new"
                    checked={filters.status.new}
                    onCheckedChange={(checked) => handleStatusChange('new', checked as boolean)}
                  />
                  <Label htmlFor="new" className="text-sm">Nouveau</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="obsolete"
                    checked={filters.status.obsolete}
                    onCheckedChange={(checked) => handleStatusChange('obsolete', checked as boolean)}
                  />
                  <Label htmlFor="obsolete" className="text-sm">Obsolète</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recovery"
                    checked={filters.status.recovery}
                    onCheckedChange={(checked) => handleStatusChange('recovery', checked as boolean)}
                  />
                  <Label htmlFor="recovery" className="text-sm">Récupération</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="standard"
                    checked={filters.status.standard}
                    onCheckedChange={(checked) => handleStatusChange('standard', checked as boolean)}
                  />
                  <Label htmlFor="standard" className="text-sm">Standard</Label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Effacer les filtres
              </Button>
              <div className="text-sm text-muted-foreground">
                {activeFiltersCount} filtre(s) actif(s)
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
} 