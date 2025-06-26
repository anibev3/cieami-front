/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator } from 'lucide-react'

interface WorkforceType {
  id: number
  label: string
  code: string
  hourly_rate: number
}

interface Workforce {
  uid?: string
  id?: number
  workforce_type_id: number
  workforce_type_label?: string
  nb_hours: number
  work_fee?: string | number
  discount: number
  // Calculated amounts from API
  amount_excluding_tax?: number
  amount_tax?: number
  amount?: number
  rate?: number
  amount_ht?: number
  amount_tva?: number
  amount_ttc?: number
  hourly_rate_id?: string | number
  paint_type_id?: string | number
}

export function ShockWorkforceTable({
  workforceTypes,
  workforces,
  onUpdate,
  onAdd,
  onRemove
}: {
  workforceTypes: WorkforceType[]
  workforces: Workforce[]
  onUpdate: (index: number, field: keyof Workforce, value: any) => void
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  // Fonction de formatage des montants
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  // Calculer les totaux
  const totals = workforces.reduce((acc, workforce) => {
    return {
      hours: acc.hours + (workforce.nb_hours || 0),
      ht: acc.ht + (workforce.amount_excluding_tax || 0),
      tva: acc.tva + (workforce.amount_tax || 0),
      ttc: acc.ttc + (workforce.amount || 0),
    }
  }, { hours: 0, ht: 0, tva: 0, ttc: 0 })

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Main d'œuvre
        </h4>
        <div className="flex gap-2">
          <Button onClick={onAdd} className="text-white">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="border px-3 py-2 text-left font-medium">
                Désignation
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Tps(H)
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Remise (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Tx horr (FCFA)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-green-600">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-center font-medium text-blue-600">
                Montant TVA
              </th>
              <th className="border px-2 py-2 text-center font-medium text-purple-600">
                Montant TTC
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {workforces.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted-foreground py-8">
                  Aucune ligne de main d'œuvre
                </td>
              </tr>
            )}
            {workforces.map((row, i) => (
              <tr key={row.uid || row.id || i} className="hover:bg-gray-50 transition-colors">
                <td className="border px-3 py-2">
                  <Select 
                    value={row.workforce_type_id ? row.workforce_type_id.toString() : ''} 
                    onValueChange={v => onUpdate(i, 'workforce_type_id', Number(v))}
                  >
                    <SelectTrigger className={`w-full border rounded p-1 ${!row.workforce_type_id ? 'border-red-300 bg-red-50' : ''}`}>
                      <SelectValue placeholder={!row.workforce_type_id ? "⚠️ Sélectionner un type" : "Sélectionner..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {workforceTypes.map(w => (
                        <SelectItem key={w.id} value={w.id.toString()}>{w.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-16 border rounded p-1 text-center"
                    value={row.nb_hours}
                    onChange={e => onUpdate(i, 'nb_hours', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-16 border rounded p-1 text-center"
                    value={row.discount}
                    onChange={e => onUpdate(i, 'discount', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-gray-600 font-medium">
                    {formatCurrency(Number(row.work_fee || 0))}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-green-600 font-medium">
                    {formatCurrency(row.amount_excluding_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-blue-600 font-medium">
                    {formatCurrency(row.amount_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-purple-600 font-bold">
                    {formatCurrency(row.amount || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemove(i)}
                    className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Récapitulatif moderne */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total Heures</div>
            <div className="text-xl font-bold text-gray-800">{totals.hours}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Total HT</div>
            <div className="text-lg font-bold text-green-700">{formatCurrency(totals.ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Total TVA</div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(totals.tva)}</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Total TTC</div>
            <div className="text-lg font-bold text-purple-700">{formatCurrency(totals.ttc)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Récap</div>
            <div className="text-lg font-bold text-gray-800">{workforces.length} ligne(s)</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
