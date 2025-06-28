/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator } from 'lucide-react'

interface Supply {
  id: number
  label: string
  code: string
  price: number
}

interface ShockWork {
  uid: string
  supply_id: number
  supply_label?: string
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  control: boolean
  comment: string
  obsolescence_rate: number
  recovery_rate: number
  amount: number
  // Calculated amounts from API
  obsolescence_amount_excluding_tax?: number
  obsolescence_amount_tax?: number
  obsolescence_amount?: number
  recovery_amount_excluding_tax?: number
  recovery_amount_tax?: number
  recovery_amount?: number
  new_amount_excluding_tax?: number
  new_amount_tax?: number
  new_amount?: number
}

export function ShockSuppliesTable({
  supplies,
  shockWorks,
  onUpdate,
  onAdd,
  onRemove
}: {
  supplies: Supply[]
  shockWorks: ShockWork[]
  onUpdate: (index: number, field: keyof ShockWork, value: any) => void
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
  const totals = shockWorks.reduce((acc, work) => {
    return {
      obsolescence: acc.obsolescence + (work.obsolescence_amount || 0),
      recovery: acc.recovery + (work.recovery_amount || 0),
      new: acc.new + (work.new_amount || 0),
      obsolescence_ht: acc.obsolescence_ht + (work.obsolescence_amount_excluding_tax || 0),
      recovery_ht: acc.recovery_ht + (work.recovery_amount_excluding_tax || 0),
      new_ht: acc.new_ht + (work.new_amount_excluding_tax || 0),
    }
  }, { 
    obsolescence: 0, recovery: 0, new: 0, 
    obsolescence_ht: 0, recovery_ht: 0, new_ht: 0 
  })

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Fournitures
        </h4>
        <div className="flex gap-2">
          <Button onClick={onAdd} className=" text-white">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une fourniture
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="border px-3 py-2 text-left font-medium">
                Fournitures
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Dém
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Remp
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Rep
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Peint
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Vte (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                R (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-left font-medium">
                Commentaire
              </th>
              <th className="border px-2 py-2 text-center font-medium text-blue-600">
                Vetusté
              </th>
              <th className="border px-2 py-2 text-center font-medium text-green-600">
                Récupération
              </th>
              <th className="border px-2 py-2 text-center font-medium text-purple-600">
                Montant Final
              </th>
              <th className="border px-2 py-2 text-center font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shockWorks.length === 0 && (
              <tr>
                <td colSpan={13} className="text-center text-muted-foreground py-8">
                  Aucune fourniture ajoutée
                </td>
              </tr>
            )}
            {shockWorks.map((row, i) => (
              <tr key={row.uid} className="hover:bg-gray-50 transition-colors">
                <td className="border px-3 py-2">
                  <Select 
                    value={row.supply_id ? row.supply_id.toString() : ''} 
                    onValueChange={v => onUpdate(i, 'supply_id', Number(v))}
                  >
                    <SelectTrigger className={`w-full border rounded p-1 ${!row.supply_id ? 'border-red-300 bg-red-50' : ''}`}>
                      <SelectValue placeholder={!row.supply_id ? "⚠️ Sélectionner une fourniture" : "Sélectionner..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {supplies.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="border px-2 py-2 text-center">
                  <Checkbox 
                    checked={row.disassembly} 
                    onCheckedChange={v => onUpdate(i, 'disassembly', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Checkbox 
                    checked={row.replacement} 
                    onCheckedChange={v => onUpdate(i, 'replacement', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Checkbox 
                    checked={row.repair} 
                    onCheckedChange={v => onUpdate(i, 'repair', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Checkbox 
                    checked={row.paint} 
                    onCheckedChange={v => onUpdate(i, 'paint', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-16 border rounded p-1 text-center"
                    value={row.obsolescence_rate}
                    onChange={e => onUpdate(i, 'obsolescence_rate', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-16 border rounded p-1 text-center"
                    value={row.recovery_rate}
                    onChange={e => onUpdate(i, 'recovery_rate', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-20 border rounded p-1 text-center"
                    value={row.amount}
                    onChange={e => onUpdate(i, 'amount', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2">
                  <Input
                    type="text"
                    className="w-32 border rounded p-1"
                    value={row.comment}
                    placeholder="Commentaire..."
                    onChange={e => onUpdate(i, 'comment', e.target.value)}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-blue-600 font-medium">
                    {formatCurrency(row.obsolescence_amount || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    HT: {formatCurrency(row.obsolescence_amount_excluding_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-green-600 font-medium">
                    {formatCurrency(row.recovery_amount || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    HT: {formatCurrency(row.recovery_amount_excluding_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className={`font-bold ${(row.new_amount || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {formatCurrency(row.new_amount || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    HT: {formatCurrency(row.new_amount_excluding_tax || 0)}
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
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-6 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total lignes</div>
            <div className="text-xl font-bold text-gray-800">{shockWorks.length}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté</div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(totals.obsolescence)}</div>
            <div className="text-xs text-gray-500">HT: {formatCurrency(totals.obsolescence_ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Récupération</div>
            <div className="text-lg font-bold text-green-700">{formatCurrency(totals.recovery)}</div>
            <div className="text-xs text-gray-500">HT: {formatCurrency(totals.recovery_ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Montant Final</div>
            <div className={`text-lg font-bold ${totals.new >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
              {formatCurrency(totals.new)}
            </div>
            <div className="text-xs text-gray-500">HT: {formatCurrency(totals.new_ht)}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 