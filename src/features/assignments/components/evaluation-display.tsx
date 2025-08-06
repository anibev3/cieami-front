import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  BarChart3, 
  Car, 
  Calendar, 
  TrendingDown, 
  DollarSign,
  Clock,
  Fuel,
  Gauge
} from 'lucide-react'

interface Vehicle {
  id: number
  license_plate: string
  type: string | null
  option: string | null
  mileage: string | null
  serial_number: string | null
  first_entry_into_circulation_date: string
  technical_visit_date: string | null
  fiscal_power: number
  payload: number
  nb_seats: number
  new_market_value: string
  brand_id: number
  vehicle_model_id: number
  color_id: number
  bodywork_id: number | null
  vehicle_genre_id: number
  vehicle_energy_id: number
  status_id: number
  created_by: number
  created_at: string
  updated_by: number
  updated_at: string
  deleted_by: number | null
  deleted_at: string | null
  vehicle_genre: {
    id: number
    code: string
    max_mileage_essence_per_year: string
    max_mileage_diesel_per_year: string
    label: string
    description: string
    status_id: number
    created_by: number | null
    created_at: string
    updated_by: number | null
    updated_at: string
    deleted_by: number | null
    deleted_at: string | null
  }
  vehicle_energy: {
    id: number
    code: string
    label: string
    description: string
    status_id: number
    created_by: number | null
    created_at: string
    updated_by: number | null
    updated_at: string
    deleted_by: number | null
    deleted_at: string | null
  }
}

interface Evaluation {
  vehicle: Vehicle
  expertise_date: string
  first_entry_into_circulation_date: string
  vehicle_new_value: string
  vehicle_age: number
  vehicle_max_mileage_essence_per_year: string
  diff_year: number
  diff_month: number
  theorical_depreciation_rate: string
  theorical_vehicle_market_value: number
  market_incidence_rate: number | null
  less_value_work: number
  is_up: boolean
  kilometric_incidence: number
  market_incidence: number
  vehicle_market_value: number
}


// "evaluation": {
//     "theorical_depreciation_rate": "11.66",
//     "theorical_vehicle_market_value": 37,
//     "market_incidence_rate": 0,
//     "less_value_work": "351096.00",
//     "is_up": true,
//     "kilometric_incidence": 120000,
//     "market_incidence": 0,
//     "vehicle_market_value": 119963,
//     "vehicle_age": 8,
//     "diff_year": 1,
//     "diff_month": 8,
// }


interface EditableEvaluationData {
  theorical_depreciation_rate: string | number
  theorical_vehicle_market_value: number
  market_incidence_rate: number
  less_value_work: number
  is_up: boolean
  kilometric_incidence: number
  market_incidence: number
  vehicle_market_value: number
  vehicle_age: number
  diff_year: number
  diff_month: number
}

interface EvaluationDisplayProps {
  evaluations: Evaluation[]
  onEvaluationChange?: (evaluationData: EditableEvaluationData) => void
}

export function EvaluationDisplay({ evaluations, onEvaluationChange }: EvaluationDisplayProps) {
  // États pour les champs modifiables de l'évaluation
  const [editableEvaluation, setEditableEvaluation] = useState<EditableEvaluationData | null>(null)

  // Initialiser les valeurs modifiables à partir de la première évaluation
  useEffect(() => {
    if (evaluations.length > 0 && !editableEvaluation) {
      const firstEvaluation = evaluations[0]
      setEditableEvaluation({
        theorical_depreciation_rate: firstEvaluation.theorical_depreciation_rate || '',
        theorical_vehicle_market_value: firstEvaluation.theorical_vehicle_market_value || 0,
        market_incidence_rate: firstEvaluation.market_incidence_rate || 0,
        less_value_work: firstEvaluation.less_value_work || 0,
        is_up: firstEvaluation.is_up || false,
        kilometric_incidence: firstEvaluation.kilometric_incidence || 0,
        market_incidence: firstEvaluation.market_incidence || 0,
        vehicle_market_value: firstEvaluation.vehicle_market_value || 0,
        vehicle_age: firstEvaluation.vehicle_age || 0,
        diff_year: firstEvaluation.diff_year || 0,
        diff_month: firstEvaluation.diff_month || 0,
      })
    }
  }, [evaluations, editableEvaluation])

  // Fonction pour mettre à jour les valeurs modifiables
  const updateEditableField = (field: keyof EditableEvaluationData, value: string | number | boolean) => {
    if (!editableEvaluation) return
    
    const updatedEvaluation: EditableEvaluationData = {
      ...editableEvaluation,
      [field]: value
    }
    setEditableEvaluation(updatedEvaluation)
    
    // Notifier le parent des changements
    if (onEvaluationChange) {
      onEvaluationChange(updatedEvaluation)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getAgeColor = (age: number) => {
    if (age <= 24) return 'text-green-600 bg-green-50'
    if (age <= 60) return 'text-blue-600 bg-blue-50'
    if (age <= 120) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getAgeLabel = (age: number) => {
    if (age <= 24) return 'Jeune'
    if (age <= 60) return 'Moyen'
    if (age <= 120) return 'Âgé'
    return 'Très âgé'
  }

  if (evaluations.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          Résultats d'évaluation provenant du calcul
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {evaluations.length} évaluation(s)
          </Badge>
        </h2>
      </div>

      <div className="grid gap-6">
        {evaluations.map((evaluation, index) => (
          <Card key={index} className="overflow-hidden border-2 border-purple-100 hover:border-purple-200 transition-colors">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-800">
                    {evaluation.vehicle.license_plate}
                  </span>
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    {evaluation.vehicle.vehicle_genre.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getAgeColor(evaluation.vehicle_age)}>
                    {getAgeLabel(evaluation.vehicle_age)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {evaluation.vehicle_age} mois
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {/* Informations du véhicule */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-3 border border-gray-200 p-3 rounded-md">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-500" />
                    Informations véhicule
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marque/Modèle:</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Énergie:</span>
                      <span className="font-medium">{evaluation.vehicle.vehicle_energy.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puissance fiscale:</span>
                      <span className="font-medium">{evaluation.vehicle.fiscal_power} CV</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Places:</span>
                      <span className="font-medium">{evaluation.vehicle.nb_seats}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border border-gray-200 p-3 rounded-md">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    Dates importantes
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'expertise:</span>
                      <span className="font-medium">{formatDate(evaluation.expertise_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">1ère mise en circulation:</span>
                      <span className="font-medium">{formatDate(evaluation.first_entry_into_circulation_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Âge:</span>
                      <span className="font-medium">{evaluation.diff_year}a {evaluation.diff_month % 12}m</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border border-gray-200 p-3 rounded-md">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-orange-500" />
                    Kilométrage
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max essence/an:</span>
                      <span className="font-medium">{parseInt(evaluation.vehicle_max_mileage_essence_per_year).toLocaleString('fr-FR')} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incidence kilométrique:</span>
                      <span className="font-medium">{evaluation.kilometric_incidence.toLocaleString('fr-FR')} km</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Tableau des valeurs */}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Élément
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Valeur
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Détails
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          Valeur neuve
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                        {formatCurrency(Number(evaluation.vehicle_new_value))}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {/* Taux dépréciation: {evaluation.theorical_depreciation_rate}% */}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Âge à la date d'expertise
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editableEvaluation?.vehicle_age || '0'}
                            onChange={(e) => updateEditableField('vehicle_age', Number(e.target.value))}
                            className="w-20 h-8 text-sm font-semibold text-gray-900 bg-gray-50 border-gray-200 focus:border-gray-400"
                            step="1"
                          />
                          <span className="text-sm">mois</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-blue-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-blue-600" />
                          Taux d'incidence marché
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-900 font-semibold">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editableEvaluation?.market_incidence_rate || '0'}
                            onChange={(e) => updateEditableField('market_incidence_rate', Number(e.target.value))}
                            className="w-20 h-8 text-sm font-semibold text-blue-900 bg-blue-50 border-blue-200 focus:border-blue-400"
                            step="0.01"
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-purple-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-purple-600" />
                          Différence en années
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-purple-900 font-semibold">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editableEvaluation?.diff_year || '0'}
                            onChange={(e) => updateEditableField('diff_year', Number(e.target.value))}
                            className="w-20 h-8 text-sm font-semibold text-purple-900 bg-purple-50 border-purple-200 focus:border-purple-400"
                            step="1"
                          />
                          <span className="text-sm">années</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-orange-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-orange-600" />
                          Différence en mois
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-orange-900 font-semibold">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editableEvaluation?.diff_month || '0'}
                            onChange={(e) => updateEditableField('diff_month', Number(e.target.value))}
                            className="w-20 h-8 text-sm font-semibold text-orange-900 bg-orange-50 border-orange-200 focus:border-orange-400"
                            step="1"
                          />
                          <span className="text-sm">mois</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Coefficient de dépréciation théorique
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-red-900 font-bold">
                        <Input
                          type="number"
                          value={editableEvaluation?.theorical_depreciation_rate || '0'}
                          onChange={(e) => updateEditableField('theorical_depreciation_rate', e.target.value)}
                          className="w-32 h-8 text-sm font-bold text-red-900 bg-red-50 border-red-200 focus:border-red-400"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Valeur vénale théorique
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-red-900 font-bold">
                        <Input
                          type="number"
                          value={editableEvaluation?.theorical_vehicle_market_value || '0'}
                          onChange={(e) => updateEditableField('theorical_vehicle_market_value', Number(e.target.value))}
                          className="w-32 h-8 text-sm font-bold text-red-900 bg-red-50 border-red-200 focus:border-red-400"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>


                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Moins-value travaux de remise en état
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-red-900 font-bold">
                        <Input
                          type="number"
                          value={editableEvaluation?.less_value_work || '0'}
                          onChange={(e) => updateEditableField('less_value_work', Number(e.target.value))}
                          className="w-32 h-8 text-sm font-bold text-red-900 bg-red-50 border-red-200 focus:border-red-400"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>


                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          {editableEvaluation?.is_up ? 'Plus-value incidence kilométrique' : 'Moins-value incidence kilométrique'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-red-900 font-bold">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editableEvaluation?.kilometric_incidence || '0'}
                            onChange={(e) => updateEditableField('kilometric_incidence', Number(e.target.value))}
                            className="w-28 h-8 text-sm font-bold text-red-900 bg-red-50 border-red-200 focus:border-red-400"
                            step="1"
                          />
                          <Checkbox
                            checked={editableEvaluation?.is_up || false}
                            onCheckedChange={(checked) => updateEditableField('is_up', checked)}
                            className="ml-2"
                          />
                          <span className="text-xs text-gray-600">Plus-value</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Plus-value incidence du marché
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-red-900 font-bold">
                        <Input
                          type="number"
                          value={editableEvaluation?.market_incidence || '0'}
                          onChange={(e) => updateEditableField('market_incidence', Number(e.target.value))}
                          className="w-32 h-8 text-sm font-bold text-red-900 bg-red-50 border-red-200 focus:border-red-400"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Modifiable
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-lg font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Valeur vénale
                        </div>
                      </td>
                      <td className="px-4 py-4 text-lg text-red-900 font-bold">
                        <Input
                          type="number"
                          value={editableEvaluation?.vehicle_market_value || '0'}
                          onChange={(e) => updateEditableField('vehicle_market_value', Number(e.target.value))}
                          className="w-40 h-10 text-lg font-bold text-red-900 bg-red-50 border-red-200 focus:border-red-400"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-4 text-lg text-gray-500">
                        Modifiable
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Résumé en badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  <Clock className="h-3 w-3 mr-1" />
                  {evaluation.vehicle_age} mois
                </Badge>
                <Badge variant="outline" className="border-green-200 text-green-700">
                  <Fuel className="h-3 w-3 mr-1" />
                  {evaluation.vehicle.vehicle_energy.label}
                </Badge>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  <Gauge className="h-3 w-3 mr-1" />
                  {evaluation.vehicle.fiscal_power} CV
                </Badge>
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  <Car className="h-3 w-3 mr-1" />
                  {evaluation.vehicle.nb_seats} places
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 