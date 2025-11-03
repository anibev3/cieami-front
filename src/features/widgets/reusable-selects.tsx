/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEditData } from '@/features/assignments/hooks/use-edit-data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Calculator, Users, Palette, Clock } from 'lucide-react'

// Types d'interfaces
interface BaseType {
  id: string
  label: string
  code: string
  description?: string
}

// Props communes pour tous les composants
interface BaseSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
  showError?: boolean
  errorMessage?: string
  options?: any[] // optionnel, pour override
}

// Composant Select pour OtherCostType
export function OtherCostTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un type de coût",
  label = "Type de coût",
  required = false,
  disabled = false,
  className = "",
  showError = false,
  errorMessage = "Veuillez sélectionner un type de coût",
  options
}: BaseSelectProps) {
  const { otherCostTypes, loading } = useEditData()
  const data = options || otherCostTypes

  if (loading) return <div className="text-xs text-gray-500">Chargement...</div>
  if (!data || data.length === 0) return <div className="text-xs text-red-500">Aucun type de coût disponible</div>

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex items-center gap-1">
        <Select
          value={value || ''}
          onValueChange={val => onValueChange(val)}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${!value ? 'border-red-300 bg-red-50' : ''} ${showError ? 'border-red-300 bg-red-50' : ''}`}>
            <SelectValue placeholder={!value ? `⚠️ ${placeholder}` : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {data.map(type => (
              <SelectItem key={type.id} value={String(type.id)}>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-purple-600" />
                  <span>{type.label}</span>
                  <span className="text-xs text-gray-500 ml-auto">#{type.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!value && !disabled && (
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
      {showError && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}

// Composant Select pour WorkforceType
export function WorkforceTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un type de main d'œuvre",
  label = "Type de main d'œuvre",
  required = false,
  disabled = false,
  className = "",
  showError = false,
  errorMessage = "Veuillez sélectionner un type de main d'œuvre",
  options
}: BaseSelectProps) {
  const { workforceTypes, loading } = useEditData()
  const data = options || workforceTypes

  if (loading) return <div className="text-xs text-gray-500">Chargement...</div>
  if (!data || data.length === 0) return <div className="text-xs text-red-500">Aucun type de main d'œuvre disponible</div>

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex items-center gap-1">
        <Select
          value={value || ''}
          onValueChange={val => onValueChange(val)}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${!value ? 'border-red-300 bg-red-50' : ''} ${showError ? 'border-red-300 bg-red-50' : ''}`}>
            <SelectValue placeholder={!value ? `⚠️ ${placeholder}` : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {data.map(type => (
              <SelectItem key={type.id} value={String(type.id)}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>{type.label}</span>
                  <span className="text-xs text-gray-500 ml-auto">#{type.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!value && !disabled && (
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
      {showError && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}

// Composant Select pour PaintType
export function PaintTypeSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un type de peinture",
  label = "Type de peinture",
  required = false,
  disabled = false,
  className = "",
  showError = false,
  errorMessage = "Veuillez sélectionner un type de peinture",
  options
}: BaseSelectProps) {
  const { paintTypes, loading } = useEditData()
  const data = options || paintTypes

  if (loading) return <div className="text-xs text-gray-500">Chargement...</div>
  if (!data || data.length === 0) return <div className="text-xs text-red-500">Aucun type de peinture disponible</div>

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex items-center gap-1">
        <Select
          value={value || ''}
          onValueChange={val => onValueChange(val)}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${!value ? 'border-red-300 bg-red-50' : ''} ${showError ? 'border-red-300 bg-red-50' : ''}`}>
            <SelectValue placeholder={!value ? `⚠️ ${placeholder}` : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {data.map(type => (
              <SelectItem key={type.id} value={String(type.id)}>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-green-600" />
                  <span>{type.label}</span>
                  <span className="text-xs text-gray-500 ml-auto">#{type.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!value && !disabled && (
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
      {showError && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}

// Composant Select pour HourlyRate
export function HourlyRateSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un taux horaire",
  label = "Taux horaire",
  required = false,
  disabled = false,
  className = "",
  showError = false,
  errorMessage = "Veuillez sélectionner un taux horaire",
  options
}: BaseSelectProps) {
  const { hourlyRates, loading } = useEditData()
  const data = options || hourlyRates

  if (loading) return <div className="text-xs text-gray-500">Chargement...</div>
  if (!data || data.length === 0) return <div className="text-xs text-red-500">Aucun taux horaire disponible</div>

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="flex items-center gap-1">
        <Select
          value={value || ''}
          onValueChange={val => onValueChange(val)}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${!value ? 'border-red-300 bg-red-50' : ''} ${showError ? 'border-red-300 bg-red-50' : ''}`}>
            <SelectValue placeholder={!value ? `⚠️ ${placeholder}` : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {data.map(rate => (
              <SelectItem key={rate.id} value={String(rate.id)}>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>{rate.label}</span>
                  {rate.rate && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {rate.rate.toLocaleString('fr-FR')} FCFA/h
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!value && !disabled && (
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
      {showError && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}

// Composant générique pour afficher les informations d'un élément sélectionné
export function SelectedItemInfo({
  type,
  selectedId,
  items,
  className = ""
}: {
  type: 'otherCost' | 'workforce' | 'paint' | 'hourlyRate'
  selectedId: string
  items: BaseType[]
  className?: string
}) {
  const selectedItem = items.find(item => String(item.id) === selectedId)
  
  if (!selectedItem) return null

  const getIcon = () => {
    switch (type) {
      case 'otherCost': return <Calculator className="h-4 w-4 text-purple-600" />
      case 'workforce': return <Users className="h-4 w-4 text-blue-600" />
      case 'paint': return <Palette className="h-4 w-4 text-green-600" />
      case 'hourlyRate': return <Clock className="h-4 w-4 text-orange-600" />
    }
  }

  const getColor = () => {
    switch (type) {
      case 'otherCost': return 'from-purple-50 to-blue-50 border-purple-200'
      case 'workforce': return 'from-blue-50 to-indigo-50 border-blue-200'
      case 'paint': return 'from-green-50 to-emerald-50 border-green-200'
      case 'hourlyRate': return 'from-orange-50 to-amber-50 border-orange-200'
    }
  }

  return (
    <div className={`bg-gradient-to-r ${getColor()} border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <span className="text-sm font-semibold text-gray-800">Élément sélectionné</span>
      </div>
      <div className="text-xs text-gray-700">
        <p className="text-sm font-medium">{selectedItem.label}</p>
        <p className="text-xs text-gray-500 mt-1">Code: {selectedItem.code}</p>
        {selectedItem.description && (
          <p className="text-xs text-gray-600 mt-1">{selectedItem.description}</p>
        )}
      </div>
    </div>
  )
} 