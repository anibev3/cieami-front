import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

interface EvaluationDisplayProps {
  evaluations: Evaluation[]
}

export function EvaluationDisplay({ evaluations }: EvaluationDisplayProps) {
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
                <div className="space-y-3">
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

                <div className="space-y-3">
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

                <div className="space-y-3">
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
                          Valeur théorique
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                        {formatCurrency(evaluation.theorical_vehicle_market_value)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Taux dépréciation: {evaluation.theorical_depreciation_rate}%
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          Valeur marché
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                        {formatCurrency(evaluation.vehicle_market_value)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Incidence marché: {evaluation.market_incidence.toLocaleString('fr-FR')}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 bg-red-50">
                      <td className="px-4 py-4 text-sm font-medium text-red-900">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          Moins-value
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-red-900 font-bold">
                        {formatCurrency(evaluation.less_value_work)}
                      </td>
                      <td className="px-4 py-4 text-sm text-red-700">
                        {evaluation.is_up ? 'Valeur en hausse' : 'Valeur en baisse'}
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