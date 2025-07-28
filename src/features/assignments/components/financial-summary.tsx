import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Receipt,
  Wrench
} from 'lucide-react'

interface FinancialSummaryProps {
  shockAmountExcludingTax: string
  shockAmountTax: string
  shockAmount: string
  otherCostAmountExcludingTax: string
  otherCostAmountTax: string
  otherCostAmount: string
  receiptAmountExcludingTax: string
  receiptAmountTax: string
  receiptAmount: string
  totalAmountExcludingTax: string
  totalAmountTax: string
  totalAmount: string
}

export function FinancialSummary({
  shockAmountExcludingTax,
  shockAmountTax,
  shockAmount,
  otherCostAmountExcludingTax,
  otherCostAmountTax,
  otherCostAmount,
  receiptAmountExcludingTax,
  receiptAmountTax,
  receiptAmount,
  totalAmountExcludingTax,
  totalAmountTax,
  totalAmount
}: FinancialSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Résumé financier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Dépenses */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Dépenses
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chocs */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Chocs</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Montant HT:</span>
                    <span>{formatCurrency(parseFloat(shockAmountExcludingTax))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span>{formatCurrency(parseFloat(shockAmountTax))}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total TTC:</span>
                    <span className="text-red-600">{formatCurrency(parseFloat(shockAmount))}</span>
                  </div>
                </div>
              </div>

              {/* Autres coûts */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Autres coûts</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Montant HT:</span>
                    <span>{formatCurrency(parseFloat(otherCostAmountExcludingTax))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span>{formatCurrency(parseFloat(otherCostAmountTax))}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total TTC:</span>
                    <span className="text-red-600">{formatCurrency(parseFloat(otherCostAmount))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recettes */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Recettes
            </h4>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-4 w-4 text-green-500" />
                <span className="font-medium">Recettes</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Montant HT:</span>
                  <span>{formatCurrency(parseFloat(receiptAmountExcludingTax))}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA:</span>
                  <span>{formatCurrency(parseFloat(receiptAmountTax))}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total TTC:</span>
                  <span className="text-green-600">{formatCurrency(parseFloat(receiptAmount))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total global */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-3">
              Total global
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-muted-foreground text-sm">Total HT</div>
                <div className="font-semibold text-lg">
                  {formatCurrency(parseFloat(totalAmountExcludingTax))}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Total TVA</div>
                <div className="font-semibold text-lg">
                  {formatCurrency(parseFloat(totalAmountTax))}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">Total TTC</div>
                <div className="font-semibold text-xl text-blue-600">
                  {formatCurrency(parseFloat(totalAmount))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 