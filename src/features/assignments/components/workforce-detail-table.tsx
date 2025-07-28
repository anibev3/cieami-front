import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrencyWithoutCurrencySymbol } from '@/utils/format-currency'
import { Clock, DollarSign, Calculator } from 'lucide-react'

interface Workforce {
  id: number
  nb_hours: string
  work_fee: string
  with_tax: number
  discount: string
  amount_excluding_tax: string
  amount_tax: string
  amount: string
  workforce_type: {
    id: number
    code: string
    label: string
    description: string
  }
}

interface WorkforceDetailTableProps {
  workforces: Workforce[]
}

export function WorkforceDetailTable({ workforces }: WorkforceDetailTableProps) {
  if (!workforces || workforces.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold">Main d'œuvre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8 text-[10px]">
            Aucune main d'œuvre enregistrée
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalAmountExcludingTax = workforces.reduce((sum, workforce) => 
    sum + parseFloat(workforce.amount_excluding_tax), 0
  )
  const _totalAmountTax = workforces.reduce((sum, workforce) => 
    sum + parseFloat(workforce.amount_tax), 0
  )
  const totalAmount = workforces.reduce((sum, workforce) => 
    sum + parseFloat(workforce.amount), 0
  )

  const totalHours = workforces.reduce((sum, workforce) => 
    sum + parseFloat(workforce.nb_hours), 0
  )

  const totalWorkFee = workforces.reduce((sum, workforce) => 
    sum + parseFloat(workforce.work_fee), 0
  )

  const totalDiscount = workforces.reduce((sum, workforce) => 
    sum + parseFloat(workforce.discount), 0
  )

  return (
    <div className="space-y-3">
      {/* Header with workforce info */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-[10px] flex items-center gap-2">
          <Calculator className="h-4 w-4 text-green-600" />
          Main d'œuvre
        </h4>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-[10px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="border px-3 py-2 text-left font-medium text-[10px]">
                Désignation
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Tps(H)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Remise (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Tx horr (FCFA)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-green-600 text-[10px]">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-center font-medium text-blue-600 text-[10px]">
                Montant TVA
              </th>
              <th className="border px-2 py-2 text-center font-medium text-purple-600 text-[10px]">
                Montant TTC
              </th>
            </tr>
          </thead>
          <tbody>
            {workforces.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-8 text-[10px]">
                  Aucune ligne de main d'œuvre
                </td>
              </tr>
            )}
            {workforces.map((workforce) => (
              <tr key={workforce.id} className="hover:bg-gray-50 transition-colors">
                {/* Désignation */}
                <td className="border px-3 py-2 text-bold text-[10px]">
                  <div>
                    <div className="font-medium text-[10px]">{workforce.workforce_type.label}</div>
                    {/* <div className="text-[10px] text-muted-foreground">
                      {workforce.workforce_type.description}
                    </div> */}
                    {/* <Badge variant="outline" className="text-[10px] mt-1">
                      {workforce.workforce_type.code}
                    </Badge> */}
                  </div>
                </td>
                {/* Tps(H) */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-2 w-2 text-muted-foreground" />
                    {parseFloat(workforce.nb_hours).toFixed(2)} h
                  </div>
                </td>
                {/* Remise (%) */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  {parseFloat(workforce.discount).toFixed(1)}%
                </td>
                {/* Tx horr (FCFA) */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <div className="flex items-center justify-center gap-1">
                    {/* <DollarSign className="h-2 w-2 text-muted-foreground" /> */}
                    {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.work_fee))}
                  </div>
                </td>
                {/* Montant HT */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <div className="text-green-600 text-[10px] font-medium">
                    {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.amount_excluding_tax))}
                  </div>
                </td>
                {/* Montant TVA */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <div className="text-blue-600 text-[10px] font-medium">
                    {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.amount_tax))}
                  </div>
                </td>
                {/* Montant TTC */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <div className="text-purple-600 text-[10px] font-bold">
                    {formatCurrencyWithoutCurrencySymbol(parseFloat(workforce.amount))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Récapitulatif moderne */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-around text-[10px]">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Récap</div>
            <div className="text-base font-bold text-gray-800">{workforces.length} ligne(s)</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total Heures</div>
            <div className="text-lg font-bold text-gray-800">{totalHours.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Taux horaire moy.</div>
            <div className="text-base font-bold text-gray-700">
              {workforces.length > 0 ? formatCurrencyWithoutCurrencySymbol(totalWorkFee / workforces.length) : '0.0'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Remise moy. (%)</div>
            <div className="text-base font-bold text-gray-700">
              {workforces.length > 0 ? (totalDiscount / workforces.length).toFixed(1) : '0'}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Total HT</div>
            <div className="text-base font-bold text-green-700">{formatCurrencyWithoutCurrencySymbol(totalAmountExcludingTax)}</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Total TTC</div>
            <div className="text-base font-bold text-purple-700">{formatCurrencyWithoutCurrencySymbol(totalAmount)}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 