import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrendingDown, Calendar, DollarSign, Car, Calculator } from 'lucide-react'
import { TheoreticalValueCalculationResult } from '@/services/depreciationTableService'
import { formatCurrency } from '@/utils/format-currency'

interface TheoreticalValueResultProps {
  result: TheoreticalValueCalculationResult
}

export function TheoreticalValueResult({ result }: TheoreticalValueResultProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateDepreciationAmount = () => {
    return result.vehicle_new_value - result.theorical_vehicle_market_value
  }

  const depreciationAmount = calculateDepreciationAmount()

  return (
    <Card className="animate-in slide-in-from-right duration-500 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <Calculator className="h-5 w-5" />
          Résultat du calcul
        </CardTitle>
        <CardDescription>
          Valeur vénale théorique calculée avec succès
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Valeur principale */}
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-sm text-muted-foreground mb-2">Valeur vénale théorique</div>
          <div className="text-3xl font-bold text-green-700">
            {formatCurrency(result.theorical_vehicle_market_value)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            FCFA
          </div>
        </div>

        <Separator />

        {/* Détails du calcul */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Détails du calcul</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Valeur neuve */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Valeur neuve</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {formatCurrency(result.vehicle_new_value)}
              </Badge>
            </div>

            {/* Taux de dépréciation */}
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Taux de dépréciation</span>
              </div>
              <Badge variant="outline" className="font-mono text-orange-700">
                {result.theorical_depreciation_rate}%
              </Badge>
            </div>

            {/* Montant de la dépréciation */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Montant déprécié</span>
              </div>
              <Badge variant="outline" className="font-mono text-red-700">
                {formatCurrency(depreciationAmount)}
              </Badge>
            </div>

            {/* Âge du véhicule */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Âge du véhicule</span>
              </div>
              <Badge variant="outline" className="font-mono text-purple-700">
                {result.vehicle_age} mois
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informations temporelles */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Informations temporelles</h4>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Première mise en circulation</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(result.first_entry_into_circulation_date)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Date d'expertise</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(result.expertise_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Résumé visuel */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Résumé</div>
            <div className="text-lg font-semibold text-gray-800">
              Le véhicule a perdu {result.theorical_depreciation_rate}% de sa valeur
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              soit {formatCurrency(depreciationAmount)} en {result.vehicle_age} mois
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 