import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatCurrencyWithoutCurrencySymbol } from '@/utils/format-currency'
import { 
  Wrench, 
  Paintbrush, 
  Settings, 
  RotateCcw, 
  Package
} from 'lucide-react'

interface ShockWork {
  id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  obsolescence: boolean
  control: boolean
  comment: string | null
  amount: string
  obsolescence_rate: string
  obsolescence_amount_excluding_tax: string
  obsolescence_amount_tax: string
  obsolescence_amount: string
  recovery_amount_excluding_tax: string
  recovery_amount_tax: string
  recovery_amount: string
  discount: string
  discount_amount_excluding_tax: string
  discount_amount_tax: string
  discount_amount: string
  new_amount_excluding_tax: string
  new_amount_tax: string
  new_amount: string
  supply: {
    id: number
    label: string
    description: string
  }
}

interface Shock {
  id: number
  shock_point: {
    id: number
    code: string
    label: string
    description: string
  }
  shock_works: ShockWork[]
  amount_excluding_tax: string
  amount_tax: string
  amount: string
}

interface ShockDetailTableProps {
  shocks: Shock[]
}

export function ShockDetailTable({ shocks }: ShockDetailTableProps) {
  if (!shocks || shocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-semibold">Points de choc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8 text-[10px]">
            Aucun point de choc enregistré
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {shocks.map((shock) => (
        <div key={shock.id} className="space-y-3">
          {/* Header with shock point info */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-[10px] flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-600" />
              {shock.shock_point.label}
              <Badge variant="outline" className="text-[10px]">
                {shock.shock_point.code}
              </Badge>
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-[10px]">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="border px-3 py-2 text-left font-medium text-[10px]">
                    Fournitures
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    D/p
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Remp
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Rep
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Peint
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Vétusté
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Montant HT
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Remise
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Remise Calculé
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Vétuste (%)
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Vétuste calculée
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-purple-600 text-[10px]">
                    Montant TTC
                  </th>
                </tr>
              </thead>
              <tbody>
                {shock.shock_works.length === 0 && (
                  <tr>
                    <td colSpan={12} className="text-center text-muted-foreground py-8 text-[10px]">
                      Aucune fourniture enregistrée
                    </td>
                  </tr>
                )}
                {shock.shock_works.map((work) => (
                  <tr key={work.id} className="hover:bg-gray-50 transition-colors">
                    {/* Fournitures */}
                    <td className="border px-3 py-2 text-[10px]">
                      <div>
                        <div className="font-medium text-[10px]">{work.supply.label}</div>
                        {/* <div className="text-[10px] text-muted-foreground">
                          {work.supply.description}
                        </div> */}
                      </div>
                    </td>
                    {/* D/p */}
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {work.disassembly ? (
                        <Badge variant="secondary" className="text-[10px]">
                          <Settings className="h-2 w-2" />
                          {/* Dépose */}
                        </Badge>
                      ) : '-'}
                    </td>
                    {/* Remp */}
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {work.replacement ? (
                        <Badge variant="default" className="text-[10px]">
                          <Package className="h-2 w-2" />
                          {/* Remplacement */}
                        </Badge>
                      ) : '-'}
                    </td>
                    {/* Rep */}
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {work.repair ? (
                        <Badge variant="outline" className="text-[10px]">
                          <Wrench className="h-2 w-2" />
                          {/* Réparation */}
                        </Badge>
                      ) : '-'}
                    </td>
                    {/* Peint */}
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {work.paint ? (
                        <Badge variant="secondary" className="text-[10px]">
                          <Paintbrush className="h-2 w-2" />
                          {/* Peinture */}
                        </Badge>
                      ) : '-'}
                    </td>
                    {/* Vétusté */}
                    <td className="border px-2 py-2 text-center text-[10px]">
                      {work.obsolescence ? (
                        <Badge variant="destructive" className="text-[10px]">
                          <RotateCcw className="h-2 w-2" />
                          {/* Obsolescence */}
                        </Badge>
                      ) : '-'}
                    </td>
                    {/* Montant HT */}
                    <td className="border px-2 text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(work.new_amount_excluding_tax))}
                    </td>
                    {/* Remise */}
                    <td className="border px-2 py-2 text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(work.discount_amount_excluding_tax || '0'))}
                    </td>
                    {/* Remise Calculé */}
                    <td className="border px-2 py-2 text-[10px]">
                      <div className={`font-bold ${(parseFloat(work.new_amount_excluding_tax) - parseFloat(work.discount_amount_excluding_tax || '0')) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                        {formatCurrencyWithoutCurrencySymbol(parseFloat(work.new_amount_excluding_tax) - parseFloat(work.discount_amount_excluding_tax || '0'))}
                      </div>
                    </td>
                    {/* Vétuste (%) */}
                    <td className="border px-2 text-[10px]">
                      {work.obsolescence_rate}%
                    </td>
                    {/* Vétuste calculée */}
                    <td className="border px-2 text-[10px]">
                      {formatCurrencyWithoutCurrencySymbol(parseFloat(work.obsolescence_amount_excluding_tax))}
                    </td>
                    {/* Montant TTC */}
                    <td className="border px-2 py-2 text-[10px] w-35">
                      <div className={`font-bold ${parseFloat(work.new_amount) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                        {formatCurrencyWithoutCurrencySymbol(parseFloat(work.new_amount))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Récapitulatif moderne */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
            <div className="text-[10px] text-center items-center flex justify-around">
              <div className="text-center">
                <div className="text-gray-600 font-medium">Total lignes</div>
                <div className="text-lg font-bold text-gray-800">{shock.shock_works.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-medium">Vetusté TTC</div>
                <div className="text-base font-bold text-blue-700">
                  {formatCurrency(shock.shock_works.reduce((sum, work) => sum + parseFloat(work.obsolescence_amount), 0))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-medium">Remise TTC</div>
                <div className="text-base font-bold text-blue-700">
                  {formatCurrency(shock.shock_works.reduce((sum, work) => sum + parseFloat(work.discount_amount || '0'), 0))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-medium">Récupération TTC</div>
                <div className="text-base font-bold text-green-700">
                  {formatCurrency(shock.shock_works.reduce((sum, work) => sum + parseFloat(work.recovery_amount), 0))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-medium">Montant Final HT</div>
                <div className={`text-base font-bold ${parseFloat(shock.amount_excluding_tax) >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
                  {formatCurrency(parseFloat(shock.amount_excluding_tax))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-medium">Montant Final TTC</div>
                <div className={`text-base font-bold ${parseFloat(shock.amount) >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
                  {formatCurrency(parseFloat(shock.amount))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 