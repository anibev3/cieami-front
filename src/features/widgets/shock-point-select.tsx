import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Check } from 'lucide-react'

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
}

export function ShockPointSelect({
  value,
  onValueChange,
  shockPoints,
  placeholder = "🔍 Choisir un point de choc...",
  className = "",
  showSelectedInfo = false,
  disabled = false
}: ShockPointSelectProps) {
  const selectedShockPoint = shockPoints.find(point => point.id === value)
  const hasValue = value > 0

  return (
    <div className="space-y-3">
      <div className="relative">
        <Select 
          value={value.toString()} 
          onValueChange={(newValue) => onValueChange(Number(newValue))}
          disabled={disabled}
        >
          <SelectTrigger 
            className={`w-full h-12 text-left ${!hasValue ? 'border-orange-300 bg-orange-50' : 'border-blue-300 bg-blue-50'} ${className}`}
          >
            <SelectValue placeholder={!hasValue ? placeholder : "Point de choc sélectionné"} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {shockPoints.map((point) => (
              <SelectItem key={point.id} value={point.id.toString()} className="py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{point.label}</span>
                  <span className="text-xs text-gray-500 ml-auto">#{point.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 