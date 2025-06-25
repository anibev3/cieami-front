/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface Supply {
  id: number
  label: string
  code: string
  price: number
}

interface ShockWork {
  uid: string
  supply_id: number
  disassembly: boolean
  replacement: boolean
  repair: boolean
  paint: boolean
  control: boolean
  comment: string
  obsolescence_rate: number
  recovery_rate: number
  amount: number
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
  return (
    <div className="border rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h4 className="font-semibold text-lg">Fournitures</h4>
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg h-10 px-6 flex items-center gap-2"
          onClick={onAdd}
        >
          <Plus className="h-5 w-5" />
          Ajouter une fourniture
        </Button>
      </div>
      <div className="overflow-x-auto px-6 pb-2">
        <table className="min-w-full text-[15px] border-b border-gray-200 "> 
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-2 text-left font-semibold">Fournitures</th>
              <th className="text-center font-semibold">Dém</th>
              <th className="text-center font-semibold">Remp</th>
              <th className="text-center font-semibold">Rep</th>
              <th className="text-center font-semibold">Peint</th>
              <th className="text-center font-semibold">Vte</th>
              <th className="text-center font-semibold">R</th>
              <th className="text-right font-semibold">Montant HT</th>
              <th className="text-left font-semibold">Commentaire</th>
              <th className="text-right font-semibold">Montant Calculé</th>
              <th className="text-right font-semibold">Montant TTC</th>
              <th className="text-right font-semibold">Montant TVA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shockWorks.length === 0 && (
              <tr>
                <td colSpan={13} className="text-center text-gray-400 py-6">Aucune fourniture</td>
              </tr>
            )}
            {shockWorks.map((work, i) => (
              <tr key={work.uid} className="border-b border-gray-100 hover:bg-gray-50 group">
                <td className="px-2 py-1">
                  <Select value={work.supply_id ? work.supply_id.toString() : ''} onValueChange={v => onUpdate(i, 'supply_id', Number(v))}>
                    <SelectTrigger className="w-44 h-9 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-200">
                      <SelectValue placeholder="Fourniture" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplies.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="text-center"><Checkbox checked={work.disassembly} onCheckedChange={v => onUpdate(i, 'disassembly', v)} /></td>
                <td className="text-center"><Checkbox checked={work.replacement} onCheckedChange={v => onUpdate(i, 'replacement', v)} /></td>
                <td className="text-center"><Checkbox checked={work.repair} onCheckedChange={v => onUpdate(i, 'repair', v)} /></td>
                <td className="text-center"><Checkbox checked={work.paint} onCheckedChange={v => onUpdate(i, 'paint', v)} /></td>
                <td className="text-center"><Input className="w-16 h-8 bg-gray-50 border border-gray-200 rounded-md text-center" type="number" value={work.obsolescence_rate} onChange={e => onUpdate(i, 'obsolescence_rate', Number(e.target.value))} /></td>
                <td className="text-center"><Input className="w-16 h-8 bg-gray-50 border border-gray-200 rounded-md text-center" type="number" value={work.recovery_rate} onChange={e => onUpdate(i, 'recovery_rate', Number(e.target.value))} /></td>
                <td className="text-right"><Input className="w-20 h-8 bg-gray-50 border border-gray-200 rounded-md text-right" type="number" value={work.amount} onChange={e => onUpdate(i, 'amount', Number(e.target.value))} /></td>
                <td className="text-left"><Input className="w-32 h-8 bg-gray-50 border border-gray-200 rounded-md" value={work.comment} onChange={e => onUpdate(i, 'comment', e.target.value)} /></td>
                <td className="text-right text-gray-400">—</td>
                <td className="text-right text-gray-400">—</td>
                <td className="text-right text-gray-400">—</td>
                <td className="text-right">
                  <button
                    className="rounded-full p-2 hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => onRemove(i)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Totaux (ligne en bas, fond gris très clair, texte bold) */}
      <div className="flex flex-wrap items-center justify-end gap-8 px-6 py-3 bg-gray-50 text-sm font-semibold rounded-b-xl border-t border-gray-100">
        <div>Total lignes : {shockWorks.length}</div>
        <div>Total HT : 0 CFA</div>
        <div>Total TVA : 0 CFA</div>
        <div>Total TTC : 0 CFA</div>
      </div>
    </div>
  )
} 