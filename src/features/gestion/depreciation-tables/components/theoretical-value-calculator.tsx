import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calculator, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDepreciationTablesStore } from '@/stores/depreciationTablesStore'
import { TheoreticalValueCalculationData } from '@/services/depreciationTableService'
import { VehicleGenreSelect, VehicleEnergySelect } from '@/features/widgets'

export function TheoreticalValueCalculator() {
  const { calculateTheoreticalValue, calculatingTheoreticalValue, theoreticalValueError } = useDepreciationTablesStore()
  
  const [formData, setFormData] = useState<TheoreticalValueCalculationData>({
    first_entry_into_circulation_date: '',
    expertise_date: '',
    vehicle_genre_id: '',
    vehicle_energy_id: '',
    vehicle_new_value: 0,
    vehicle_mileage: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_entry_into_circulation_date) {
      newErrors.first_entry_into_circulation_date = 'La date de première mise en circulation est requise'
    }

    if (!formData.expertise_date) {
      newErrors.expertise_date = 'La date d\'expertise est requise'
    }

    // Validation de la date d'expertise
    if (formData.first_entry_into_circulation_date && formData.expertise_date) {
      const firstEntryDate = new Date(formData.first_entry_into_circulation_date)
      const expertiseDate = new Date(formData.expertise_date)
      
      if (expertiseDate <= firstEntryDate) {
        newErrors.expertise_date = 'La date d\'expertise doit être postérieure à la date de première mise en circulation'
      }
    }

    if (!formData.vehicle_genre_id) {
      newErrors.vehicle_genre_id = 'Le genre de véhicule est requis'
    }

    if (!formData.vehicle_energy_id) {
      newErrors.vehicle_energy_id = 'L\'énergie du véhicule est requise'
    }

    if (formData.vehicle_new_value <= 0) {
      newErrors.vehicle_new_value = 'La valeur neuve doit être supérieure à 0'
    }



    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await calculateTheoreticalValue(formData)
    } catch (_error) {
      // L'erreur est déjà gérée dans le store
    }
  }

  const handleReset = () => {
    setFormData({
      first_entry_into_circulation_date: '',
      expertise_date: '',
      vehicle_genre_id: '',
      vehicle_energy_id: '',
      vehicle_new_value: 0,
      vehicle_mileage: 0,
    })
    setErrors({})
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calcul de valeur théorique
        </CardTitle>
        <CardDescription>
          Remplissez les informations du véhicule pour calculer sa valeur vénale théorique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {theoreticalValueError && (
            <Alert variant="destructive">
              <AlertDescription>{theoreticalValueError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_entry_date">Date de première mise en circulation *</Label>
              <Input
                id="first_entry_date"
                type="date"
                value={formData.first_entry_into_circulation_date}
                onChange={(e) => {
                  setFormData(f => ({ 
                    ...f, 
                    first_entry_into_circulation_date: e.target.value
                  }))
                  // Réinitialiser l'erreur de date d'expertise si elle existe
                  if (errors.expertise_date) {
                    setErrors(prev => ({ ...prev, expertise_date: '' }))
                  }
                }}
                className={cn(
                  errors.first_entry_into_circulation_date && "border-destructive"
                )}
              />
              {errors.first_entry_into_circulation_date && (
                <p className="text-sm text-destructive">{errors.first_entry_into_circulation_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise_date">Date d'expertise *</Label>
              <Input
                id="expertise_date"
                type="date"
                value={formData.expertise_date}
                onChange={(e) => {
                  setFormData(f => ({ 
                    ...f, 
                    expertise_date: e.target.value
                  }))
                }}
                min={formData.first_entry_into_circulation_date}
                className={cn(
                  errors.expertise_date && "border-destructive"
                )}
              />
              {errors.expertise_date && (
                <p className="text-sm text-destructive">{errors.expertise_date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Genre de véhicule *</Label>
              <VehicleGenreSelect
                value={formData.vehicle_genre_id}
                onValueChange={(value) => setFormData(f => ({ ...f, vehicle_genre_id: value }))}
                placeholder="Sélectionner un genre"
              />
              {errors.vehicle_genre_id && (
                <p className="text-sm text-destructive">{errors.vehicle_genre_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Énergie du véhicule *</Label>
              <VehicleEnergySelect
                value={formData.vehicle_energy_id}
                onValueChange={(value) => setFormData(f => ({ ...f, vehicle_energy_id: value }))}
                placeholder="Sélectionner une énergie"
              />
              {errors.vehicle_energy_id && (
                <p className="text-sm text-destructive">{errors.vehicle_energy_id}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new_value">Valeur neuve (FCFA) *</Label>
              <div className="relative">
                <Input
                  id="new_value"
                  type="number"
                  // min="0"
                  // step="1000"
                  value={formData.vehicle_new_value || '1'}
                  onChange={(e) => setFormData(f => ({ ...f, vehicle_new_value: Number(e.target.value) || 0 }))}
                  placeholder="Ex: 10000000"
                  className={cn(
                    "pr-8",
                    errors.vehicle_new_value && "border-destructive"
                  )}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  FCFA
                </span>
              </div>
              {errors.vehicle_new_value && (
                <p className="text-sm text-destructive">{errors.vehicle_new_value}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Kilométrage (km) *</Label>
              <div className="relative">
                <Input
                  id="mileage"
                  type="number"
                  value={formData.vehicle_mileage || 0}
                  onChange={(e) => setFormData(f => ({ ...f, vehicle_mileage: Number(e.target.value) || 0 }))}
                  placeholder="Ex: 50000"
                  className={cn(
                    "pr-8",
                    errors.vehicle_mileage && "border-destructive"
                  )}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  km
                </span>
              </div>
              {errors.vehicle_mileage && (
                <p className="text-sm text-destructive">{errors.vehicle_mileage}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={calculatingTheoreticalValue}
              className="flex-1"
            >
              {calculatingTheoreticalValue ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calcul en cours...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculer la valeur
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={calculatingTheoreticalValue}
            >
              Réinitialiser
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 