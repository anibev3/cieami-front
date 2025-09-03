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
      month: 'short'
    })
  }

  const calculateDepreciationAmount = () => {
    return result.vehicle_new_value - result.theorical_vehicle_market_value
  }

  const depreciationAmount = calculateDepreciationAmount()

  return (
    <Card className="animate-in slide-in-from-right duration-500 shadow-none h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-600 text-lg">
          <Calculator className="h-4 w-4" />
          Résultat du calcul
        </CardTitle>
        <CardDescription className="text-sm">
          Valeur vénale théorique calculée
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Valeurs principales - Layout optimisé */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Valeur principale */}
          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-xs text-muted-foreground mb-1">Valeur vénale théorique</div>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(result.vehicle_market_value)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              FCFA
            </div>
          </div>
          
          {/* Valeur finale du marché */}
          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-xs text-muted-foreground mb-1">Valeur finale du marché</div>
            <div className="text-xl font-bold text-purple-700">
              {formatCurrency(result.theorical_vehicle_market_value)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Après incidences
            </div>
          </div>
        </div>
        
        {/* Résumé visuel */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Résumé</div>
            <div className="text-base font-semibold text-gray-800">
              Le véhicule a perdu {result.theorical_depreciation_rate}% de sa valeur
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              soit {formatCurrency(depreciationAmount)} en {result.vehicle_age} mois
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Différence temporelle: {result.year_diff} an(s) {result.month_diff} mois
            </div>
          </div>
        </div>

        <Separator />

        {/* Détails du calcul */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">Détails du calcul</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Valeur neuve */}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium">Valeur neuve</span>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {formatCurrency(result.vehicle_new_value)}
              </Badge>
            </div>

            {/* Taux de dépréciation */}
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-orange-600" />
                <span className="text-xs font-medium">Taux dépréciation</span>
              </div>
              <Badge variant="outline" className="font-mono text-orange-700 text-xs">
                {result.theorical_depreciation_rate}%
              </Badge>
            </div>

            {/* Montant de la dépréciation */}
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium">Montant déprécié</span>
              </div>
              <Badge variant="outline" className="font-mono text-red-700 text-xs">
                {formatCurrency(depreciationAmount)}
              </Badge>
            </div>

            {/* Âge du véhicule */}
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Car className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium">Âge véhicule</span>
              </div>
              <Badge variant="outline" className="font-mono text-purple-700 text-xs">
                {result.vehicle_age} mois
              </Badge>
            </div>

            {/* Différence en années et mois */}
            <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg col-span-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-indigo-600" />
                <span className="text-xs font-medium">Différence temporelle</span>
              </div>
              <Badge variant="outline" className="font-mono text-indigo-700 text-xs">
                {result.year_diff} an(s) {result.month_diff} mois
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informations temporelles */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">Informations temporelles</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium">Mise en circulation</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(result.first_entry_into_circulation_date)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium">Date expertise</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(result.expertise_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Incidences et valeur finale */}
        <div className="space-y-3">
          <h4 className="font-semibold text-base">Incidences et valeur finale</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Incidence kilométrique */}
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-yellow-600" />
                <span className="text-xs font-medium">Incidence km</span>
              </div>
              <Badge variant="outline" className="font-mono text-yellow-700 text-xs">
                {formatCurrency(result.kilometric_incidence)}
              </Badge>
            </div>

            {/* Incidence du marché */}
            <div className="flex items-center justify-between p-2 bg-teal-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-teal-600" />
                <span className="text-xs font-medium">Incidence marché</span>
              </div>
              <Badge variant="outline" className="font-mono text-teal-700 text-xs">
                {formatCurrency(result.market_incidence)}
              </Badge>
            </div>

            {/* Taux d'incidence du marché */}
            <div className="flex items-center justify-between p-2 bg-cyan-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-cyan-600" />
                <span className="text-xs font-medium">Taux incidence</span>
              </div>
              <Badge variant="outline" className="font-mono text-cyan-700 text-xs">
                {result.market_incidence_rate}%
              </Badge>
            </div>

            {/* Statut de la valeur */}
            <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium">Statut</span>
              </div>
              <Badge variant={result.is_up ? "default" : "secondary"} className="font-mono text-xs">
                {result.is_up ? "En hausse" : "En baisse"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 