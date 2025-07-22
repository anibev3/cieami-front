/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator, Check, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  recovery_amoun: number
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

export function ShockSuppliesEvaluateTable({
  supplies,
  shockWorks,
  onUpdate,
  onAdd,
  onRemove,
  onValidateRow
}: {
  supplies: Supply[]
  shockWorks: ShockWork[]
  onUpdate: (index: number, field: keyof ShockWork, value: any) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onValidateRow: (index: number) => Promise<void>
}) {
  // État local pour gérer les modifications et la validation
  const [localShockWorks, setLocalShockWorks] = useState<ShockWork[]>(shockWorks)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [validatingRows, setValidatingRows] = useState<Set<number>>(new Set())

  // Mettre à jour les données locales quand les props changent
  useEffect(() => {
    setLocalShockWorks(shockWorks)
  }, [shockWorks])

  // Fonction de mise à jour locale
  const updateLocalShockWork = (index: number, field: keyof ShockWork, value: any) => {
    const updated = [...localShockWorks]
    updated[index] = { ...updated[index], [field]: value }
    setLocalShockWorks(updated)
    setModifiedRows(prev => new Set([...prev, index]))
  }

  // Fonction de validation d'une ligne
  const handleValidateRow = async (index: number) => {
    setValidatingRows(prev => new Set([...prev, index]))
    try {
      // Appliquer les modifications locales
      const shockWork = localShockWorks[index]
      Object.entries(shockWork).forEach(([field, value]) => {
        if (field !== 'uid') {
          onUpdate(index, field as keyof ShockWork, value)
        }
      })
      
      // Appeler la validation
      await onValidateRow(index)
      
      // Marquer comme non modifié
      setModifiedRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la validation:', error)
    } finally {
      setValidatingRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }
  }

  // Fonction de formatage des montants
  const formatCurrency = (amount: number) => {
    // return new Intl.NumberFormat('fr-FR', {
    //   style: 'currency',
    //   currency: 'XOF',
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 0,
    // }).format(amount || 0)

    return (amount / 1000).toFixed(3) || '0.000'
  }

  // Calculer les totaux
  const totals = localShockWorks.reduce((acc, work) => {
    return {
      obsolescence: acc.obsolescence + (work.obsolescence_amount || 0),
      recovery: acc.recovery + (work.recovery_amount || 0),
      new: acc.new + (work.new_amount || 0),
      obsolescence_ht: acc.obsolescence_ht + (work.obsolescence_amount_excluding_tax || 0),
      recovery_ht: acc.recovery_ht + (work.recovery_amount_excluding_tax || 0),
      new_ht: acc.new_ht + (work.new_amount_excluding_tax || 0),
      obsolescence_tva: acc.obsolescence_tva + (work.obsolescence_amount_tax || 0),
      recovery_tva: acc.recovery_tva + (work.recovery_amount_tax || 0),
      new_tva: acc.new_tva + (work.new_amount_tax || 0),
    }
  }, { 
    obsolescence: 0, recovery: 0, new: 0, 
    obsolescence_ht: 0, recovery_ht: 0, new_ht: 0,
    obsolescence_tva: 0, recovery_tva: 0, new_tva: 0
  })

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-base flex items-center gap-2">
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
              <th className="border px-3 py-2 text-left font-medium text-xs">
                Fournitures
              </th>

              <th className="border px-2 py-2 text-center font-medium text-xs">
                Remp
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Rep
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Peint
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Contrôle
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-left font-medium text-xs">
                Commentaire
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {localShockWorks.length === 0 && (
              <tr>
                <td colSpan={14} className="text-center text-muted-foreground py-8 text-xs">
                  Aucune fourniture ajoutée
                </td>
              </tr>
            )}
            {localShockWorks.map((row, i) => (
              <tr key={row.uid} className={`hover:bg-gray-50 transition-colors ${modifiedRows.has(i) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}>
                <td className="border px-3 py-2 text-xs">
                  <Select 
                    value={row.supply_id ? row.supply_id.toString() : ''} 
                    onValueChange={v => updateLocalShockWork(i, 'supply_id', Number(v))}
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

                <td className="border px-2 py-2 text-center text-xs">
                  <Checkbox 
                    checked={row.replacement} 
                    onCheckedChange={v => updateLocalShockWork(i, 'replacement', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-xs">
                  <Checkbox 
                    checked={row.repair} 
                    onCheckedChange={v => updateLocalShockWork(i, 'repair', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-xs">
                  <Checkbox 
                    checked={row.paint} 
                    onCheckedChange={v => updateLocalShockWork(i, 'paint', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-xs">
                  <Checkbox 
                    checked={row.control} 
                    onCheckedChange={v => updateLocalShockWork(i, 'control', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-xs">
                  <Input
                    type="number"
                    className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.amount}
                    onChange={e => updateLocalShockWork(i, 'amount', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-xs">
                  <Input
                    type="text"
                    className="rounded p-1 border-none focus:border-none focus:ring-0"
                    value={row.comment}
                    placeholder="Commentaire..."
                    onChange={e => updateLocalShockWork(i, 'comment', e.target.value)}
                  />
                </td>
               
                <td className="border px-2 py-2 text-center text-xs">
                  <div className="flex items-center justify-center gap-1">
                    {modifiedRows.has(i) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleValidateRow(i)}
                        disabled={validatingRows.has(i)}
                        className="h-6 w-6 hover:bg-green-50 hover:text-green-600"
                        title="Valider les modifications"
                      >
                        {validatingRows.has(i) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemove(i)}
                      className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                      title="Supprimer la ligne"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
    </div>
  )
} 