import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { 
  History, 
  Calculator, 
  Eye, 
  Trash2, 
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'

interface CalculationResult {
  shocks: any[]
  other_costs: any[]
  total_amount: number
  calculated_at?: string
}

interface CalculationHistorySheetProps {
  assignmentId: number
  currentCalculations: { [key: number]: CalculationResult }
  onViewCalculation: (shockIndex: number, calculationData: CalculationResult) => void
  onClearCalculation: (shockIndex: number) => void
}

export function CalculationHistorySheet({
  assignmentId,
  currentCalculations,
  onViewCalculation,
  onClearCalculation
}: CalculationHistorySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const calculationEntries = Object.entries(currentCalculations)
  const hasCalculations = calculationEntries.length > 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" />
          Historique des calculs
          {hasCalculations && (
            <Badge variant="secondary" className="ml-2">
              {calculationEntries.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Historique des calculs
          </SheetTitle>
          <SheetDescription>
            Consultez et gérez l'historique des calculs pour le dossier {assignmentId}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {hasCalculations ? (
            calculationEntries.map(([shockIndex, calculationData]) => (
              <Card key={shockIndex}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Point de choc {Number(shockIndex) + 1}
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Calculé
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Montant total :</span>
                      <p className="font-semibold text-lg">
                        {calculationData.total_amount?.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fournitures :</span>
                      <p className="font-semibold">
                        {calculationData.shocks?.[0]?.shock_works?.length || 0}
                      </p>
                    </div>
                  </div>

                  {calculationData.calculated_at && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Calculé le {new Date(calculationData.calculated_at).toLocaleString('fr-FR')}
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        onViewCalculation(Number(shockIndex), calculationData)
                        setIsOpen(false)
                      }}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Voir détails
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onClearCalculation(Number(shockIndex))}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun calcul effectué</h3>
              <p className="text-muted-foreground">
                Effectuez des calculs pour voir l'historique ici
              </p>
            </div>
          )}
        </div>

        {hasCalculations && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total des calculs :</span>
              <span className="font-semibold">
                {calculationEntries.length} point(s) de choc
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Montant global :</span>
              <span className="font-semibold text-lg text-blue-600">
                {Object.values(currentCalculations)
                  .reduce((total, calc) => total + (calc.total_amount || 0), 0)
                  .toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
} 