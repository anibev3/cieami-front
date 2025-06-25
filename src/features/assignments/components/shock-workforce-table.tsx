/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'

interface WorkforceType {
  id: number
  label: string
  code: string
  hourly_rate: number
}

interface Workforce {
  workforce_type_id: number
  workforce_type_label: string
  nb_hours: number
  work_fee: string
  discount: number
  amount_excluding_tax: number
  amount_tax: number
  amount: number
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
  // Calculs totaux (exemple, à adapter)
  const totalHours = workforces.reduce((sum, w) => sum + (w.nb_hours || 0), 0)

  return (
    <div className="border rounded-lg bg-white mt-6">
      <div className="flex justify-between items-center px-4 pt-4">
        <h4 className="font-semibold text-base">Main d'œuvre</h4>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ligne
        </Button>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-muted text-xs">
              <th className="px-2 py-1 text-left">Désignation</th>
              <th>Tps(H)</th>
              <th>Remise (%)</th>
              <th>Tx horr (FCFA)</th>
              <th>Montant HT</th>
              <th>Montant TVA</th>
              <th>Montant TTC</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {workforces.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted-foreground py-4">Aucune ligne</td>
              </tr>
            )}
            {workforces.map((w, i) => (
              <tr key={i} className="bg-white border-b align-top">
                <td className="px-2 py-1">
                  <Select value={w.workforce_type_id ? w.workforce_type_id.toString() : ''} onValueChange={v => onUpdate(i, 'workforce_type_id', Number(v))}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Désignation" />
                    </SelectTrigger>
                    <SelectContent>
                      {workforceTypes.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td><Input className="w-16" type="number" value={w.nb_hours} onChange={e => onUpdate(i, 'nb_hours', Number(e.target.value))} /></td>
                <td><Input className="w-16" type="number" value={w.discount} onChange={e => onUpdate(i, 'discount', Number(e.target.value))} /></td>
                <td><Input className="w-20" type="number" value={w.work_fee} onChange={e => onUpdate(i, 'work_fee', e.target.value)} /></td>
                <td className="text-muted-foreground">—</td>
                <td className="text-muted-foreground">—</td>
                <td className="text-muted-foreground">—</td>
                <td>
                  <Button size="icon" variant="ghost" onClick={() => onRemove(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Totaux (exemple, à adapter selon calculs) */}
      <div className="flex justify-end gap-8 px-4 pb-2 text-xs text-muted-foreground">
        <div>Total Heures : {totalHours}</div>
        <div>Total HT : 0 CFA</div>
        <div>Total TVA : 0 CFA</div>
        <div>Total TTC : 0 CFA</div>
        <div>Récap : {workforces.length} ligne(s)</div>
      </div>
    </div>
  )
} 


// // ... existing code ...
//   return (
// -    <div className="border rounded-lg bg-white mt-6">
// -      <div className="flex justify-between items-center px-4 pt-4">
// -        <h4 className="font-semibold text-base">Main d'œuvre</h4>
// -        <Button size="sm" variant="outline" onClick={onAdd}>
// -          <Plus className="mr-2 h-4 w-4" />
// -          Ajouter une ligne
// -        </Button>
// -      </div>
// -      <div className="overflow-x-auto p-4">
// -        <table className="min-w-full border-separate border-spacing-y-2">
// -          <thead>
// -            <tr className="bg-muted text-xs">
// -              <th className="px-2 py-1 text-left">Désignation</th>
// -              <th>Tps(H)</th>
// -              <th>Remise (%)</th>
// -              <th>Tx horr (FCFA)</th>
// -              <th>Montant HT</th>
// -              <th>Montant TVA</th>
// -              <th>Montant TTC</th>
// -              <th></th>
// -            </tr>
// -          </thead>
// -          <tbody>
// -            {workforces.length === 0 && (
// -              <tr>
// -                <td colSpan={8} className="text-center text-muted-foreground py-4">Aucune ligne</td>
// -              </tr>
// -            )}
// -            {workforces.map((w, i) => (
// -              <tr key={i} className="bg-white border-b align-top">
// -                <td className="px-2 py-1">
// -                  <Select value={w.workforce_type_id ? w.workforce_type_id.toString() : ''} onValueChange={v => onUpdate(i, 'workforce_type_id', Number(v))}>
// -                    <SelectTrigger className="w-36">
// -                      <SelectValue placeholder="Désignation" />
// -                    </SelectTrigger>
// -                    <SelectContent>
// -                      {workforceTypes.map(type => (
// -                        <SelectItem key={type.id} value={type.id.toString()}>{type.label}</SelectItem>
// -                      ))}
// -                    </SelectContent>
// -                  </Select>
// -                </td>
// -                <td><Input className="w-16" type="number" value={w.nb_hours} onChange={e => onUpdate(i, 'nb_hours', Number(e.target.value))} /></td>
// -                <td><Input className="w-16" type="number" value={w.discount} onChange={e => onUpdate(i, 'discount', Number(e.target.value))} /></td>
// -                <td><Input className="w-20" type="number" value={w.work_fee} onChange={e => onUpdate(i, 'work_fee', e.target.value)} /></td>
// -                <td className="text-muted-foreground">—</td>
// -                <td className="text-muted-foreground">—</td>
// -                <td className="text-muted-foreground">—</td>
// -                <td>
// -                  <Button size="icon" variant="ghost" onClick={() => onRemove(i)}>
// -                    <Trash2 className="h-4 w-4 text-destructive" />
// -                  </Button>
// -                </td>
// -              </tr>
// -            ))}
// -          </tbody>
// -        </table>
// -      </div>
// -      {/* Totaux (exemple, à adapter selon calculs) */}
// -      <div className="flex justify-end gap-8 px-4 pb-2 text-xs text-muted-foreground">
// -        <div>Total Heures : {totalHours}</div>
// -        <div>Total HT : 0 CFA</div>
// -        <div>Total TVA : 0 CFA</div>
// -        <div>Total TTC : 0 CFA</div>
// -        <div>Récap : {workforces.length} ligne(s)</div>
// -      </div>
// -    </div>
// +    <div className="border rounded-xl bg-white shadow-sm mt-6">
// +      <div className="flex items-center justify-between px-6 pt-6 pb-2">
// +        <h4 className="font-semibold text-lg">Main d'œuvre</h4>
// +        <Button
// +          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg h-10 px-6 flex items-center gap-2"
// +          onClick={onAdd}
// +        >
// +          <Plus className="h-5 w-5" />
// +          Ajouter une ligne
// +        </Button>
// +      </div>
// +      <div className="overflow-x-auto px-6 pb-2">
// +        <table className="min-w-full text-[15px]">
// +          <thead>
// +            <tr className="border-b border-gray-200">
// +              <th className="py-2 px-2 text-left font-semibold">Désignation</th>
// +              <th className="text-center font-semibold">Tps(H)</th>
// +              <th className="text-center font-semibold">Remise (%)</th>
// +              <th className="text-center font-semibold">Tx horr (FCFA)</th>
// +              <th className="text-right font-semibold">Montant HT</th>
// +              <th className="text-right font-semibold">Montant TVA</th>
// +              <th className="text-right font-semibold">Montant TTC</th>
// +              <th></th>
// +            </tr>
// +          </thead>
// +          <tbody>
// +            {workforces.length === 0 && (
// +              <tr>
// +                <td colSpan={8} className="text-center text-gray-400 py-6">Aucune ligne</td>
// +              </tr>
// +            )}
// +            {workforces.map((w, i) => (
// +              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 group">
// +                <td className="px-2 py-1">
// +                  <Select value={w.workforce_type_id ? w.workforce_type_id.toString() : ''} onValueChange={v => onUpdate(i, 'workforce_type_id', Number(v))}>
// +                    <SelectTrigger className="w-44 h-9 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-200">
// +                      <SelectValue placeholder="Désignation" />
// +                    </SelectTrigger>
// +                    <SelectContent>
// +                      {workforceTypes.map(type => (
// +                        <SelectItem key={type.id} value={type.id.toString()}>{type.label}</SelectItem>
// +                      ))}
// +                    </SelectContent>
// +                  </Select>
// +                </td>
// +                <td className="text-center"><Input className="w-16 h-8 bg-gray-50 border border-gray-200 rounded-md text-center" type="number" value={w.nb_hours} onChange={e => onUpdate(i, 'nb_hours', Number(e.target.value))} /></td>
// +                <td className="text-center"><Input className="w-16 h-8 bg-gray-50 border border-gray-200 rounded-md text-center" type="number" value={w.discount} onChange={e => onUpdate(i, 'discount', Number(e.target.value))} /></td>
// +                <td className="text-center"><Input className="w-20 h-8 bg-gray-50 border border-gray-200 rounded-md text-center" type="number" value={w.work_fee} onChange={e => onUpdate(i, 'work_fee', e.target.value)} /></td>
// +                <td className="text-right text-gray-400">0 F CFA</td>
// +                <td className="text-right text-gray-400">0 F CFA</td>
// +                <td className="text-right text-gray-400">0 F CFA</td>
// +                <td className="text-right">
// +                  <button
// +                    className="rounded-full p-2 hover:bg-red-50 hover:text-red-600 transition"
// +                    onClick={() => onRemove(i)}
// +                    title="Supprimer"
// +                  >
// +                    <Trash2 className="h-5 w-5" />
// +                  </button>
// +                </td>
// +              </tr>
// +            ))}
// +          </tbody>
// +        </table>
// +      </div>
// +      {/* Totaux (ligne en bas, fond gris très clair, texte bold) */}
// +      <div className="flex flex-wrap items-center justify-end gap-8 px-6 py-3 bg-gray-50 text-sm font-semibold rounded-b-xl border-t border-gray-100">
// +        <div>Total Heures : {totalHours}</div>
// +        <div>Total HT : 0 F CFA</div>
// +        <div>Total TVA : 0 F CFA</div>
// +        <div>Total TTC : 0 F CFA</div>
// +        <div>Récap : {workforces.length} ligne(s)</div>
// +      </div>
// +    </div>
//   )
// // ... existing code ...