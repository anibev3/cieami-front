/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator, Check, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import React from 'react'
import { Separator } from '@/components/ui/separator'

interface Supply {
  id: number
  label: string
  code?: string
  price?: number
}

interface ShockWork {
  id?: number
  uid: string
  supply_id: number
  supply?: {
    id: number
    label: string
    code?: string
    price?: number
  }
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

export function ShockSuppliesEditTable({
  supplies,
  shockWorks,
  onUpdate,
  onAdd,
  onRemove,
  onValidateRow
}: {
  supplies: Supply[]
  shockWorks: ShockWork[]
  onUpdate: (index: number, updatedWork: ShockWork) => Promise<void>
  onAdd: (shockWorkData?: any) => Promise<void>
  onRemove: (index: number) => void
  onValidateRow: (index: number) => Promise<void>
}) {
  // État local pour gérer les modifications et la validation
  const [localShockWorks, setLocalShockWorks] = useState<ShockWork[]>(shockWorks)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [validatingRows, setValidatingRows] = useState<Set<number>>(new Set())
  const [newRows, setNewRows] = useState<Set<number>>(new Set()) // Lignes nouvellement ajoutées

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

  // Fonction pour ajouter une nouvelle ligne localement
  const handleAddNewRow = () => {
    const newWork: ShockWork = {
      uid: crypto.randomUUID(),
      supply_id: 0,
      disassembly: false,
      replacement: false,
      repair: false,
      paint: false,
      control: false,
      comment: '',
      obsolescence_rate: 0,
      recovery_amoun: 0,
      amount: 0
    }
    
    const updated = [...localShockWorks, newWork]
    setLocalShockWorks(updated)
    setNewRows(prev => new Set([...prev, updated.length - 1]))
    setModifiedRows(prev => new Set([...prev, updated.length - 1]))
  }

  // Fonction de validation d'une ligne
  const handleValidateRow = async (index: number) => {
    setValidatingRows(prev => new Set([...prev, index]))
    try {
      const shockWork = localShockWorks[index]
      // Si c'est une nouvelle ligne, appeler onAdd (API POST)
      if (newRows.has(index)) {
        await onAdd(shockWork)
        setNewRows(prev => {
          const newSet = new Set(prev)
          newSet.delete(index)
          return newSet
        })
      } else {
        // Appeler onUpdate une seule fois avec tout l'objet
        await onUpdate(index, shockWork)
        // Appeler la validation si besoin (pour feedback UI)
        await onValidateRow(index)
      }
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

  // Fonction de suppression d'une ligne
  const handleRemoveRow = (index: number) => {
    // Si c'est une nouvelle ligne, juste la supprimer localement
    if (newRows.has(index)) {
      const updated = localShockWorks.filter((_, i) => i !== index)
      setLocalShockWorks(updated)
      setNewRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
      setModifiedRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    } else {
      // Sinon, appeler onRemove (API DELETE)
      onRemove(index)
    }
  }

  // Fonction de formatage des montants
  const formatCurrency = (amount: number) => {
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
    <div className="space-y-3">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Fournitures
        </h4>
        <div className="flex gap-2">
          <Button onClick={handleAddNewRow} className=" text-white">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une fourniture
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-[10px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="border px-3 py-2 text-left font-medium text-[10px]">
                Fournitures
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Dém
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
                Vte (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                R (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-left font-medium text-[10px]">
                Commentaire
              </th>
              <th className="border px-2 py-2 text-center font-medium text-blue-600 text-[10px]">
                Vetusté
              </th>
              <th className="border px-2 py-2 text-center font-medium text-green-600 text-[10px]">
                Récupération
              </th>
              <th className="border px-2 py-2 text-center font-medium text-purple-600 text-[10px]">
                Montant Final
              </th>
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {localShockWorks.length === 0 && (
              <tr>
                <td colSpan={14} className="text-center text-muted-foreground py-8 text-[10px]">
                  Aucune fourniture ajoutée
                </td>
              </tr>
            )}
       
            {localShockWorks.map((row, i) => (
              <tr key={row.uid} className={`hover:bg-gray-50 transition-colors ${modifiedRows.has(i) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}>
                <td className="border px-3 py-2 text-[10px]">
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
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.disassembly} 
                    onCheckedChange={v => updateLocalShockWork(i, 'disassembly', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.replacement} 
                    onCheckedChange={v => updateLocalShockWork(i, 'replacement', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.repair} 
                    onCheckedChange={v => updateLocalShockWork(i, 'repair', v)} 
                  />
                </td>
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.paint} 
                    onCheckedChange={v => updateLocalShockWork(i, 'paint', v)} 
                  />
                </td>
                <td className="border px-2 text-center text-[10px]">
                  <Input
                    type="number"
                    className="rounded w-17 p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.obsolescence_rate}
                    onChange={e => updateLocalShockWork(i, 'obsolescence_rate', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 text-center text-[10px]">
                  <Input
                    type="number"
                    className="rounded w-17 p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.recovery_amoun}
                    onChange={e => updateLocalShockWork(i, 'recovery_amoun', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Input
                    type="number"
                    className="rounded w-25 p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.amount}
                    onChange={e => updateLocalShockWork(i, 'amount', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-[10px]">
                  <Input
                    type="text"
                    className="rounded w-20 p-1 border-none focus:border-none focus:ring-0"
                    value={row.comment}
                    placeholder="Commentaire..."
                    onChange={e => updateLocalShockWork(i, 'comment', e.target.value)}
                  />
                </td>
                <td className="border w-35 px-2 py-2 text-center text-[10px]">
                  <div className="text-blue-600 font-medium">
                    {formatCurrency(row.obsolescence_amount || 0)}
                  </div>
                  <Separator className="my-1" />
                  <div className="text-[8px] text-gray-500">
                    HT: {formatCurrency(row.obsolescence_amount_excluding_tax || 0)}
                  </div>
                  <div className="text-[8px] text-gray-500">
                    TVA: {formatCurrency(row.obsolescence_amount_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center text-[10px] w-35">
                  <div className="text-green-600 font-medium">
                    {formatCurrency(row.recovery_amount || 0)}
                  </div>
                  <Separator className="my-1" />
                  <div className="text-[8px] text-gray-500">
                    HT: {formatCurrency(row.recovery_amount_excluding_tax || 0)}
                  </div>
                  <div className="text-[8px] text-gray-500">
                    TVA: {formatCurrency(row.recovery_amount_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center text-[10px] w-35">
                  <div className={`font-bold ${(row.new_amount || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {formatCurrency(row.new_amount || 0)}
                  </div>
                  <Separator className="my-1" />
                  <div className="text-[8px] text-gray-500">
                    HT: {formatCurrency(row.new_amount_excluding_tax || 0)}
                  </div>
                  <div className="text-[8px] text-gray-500">
                    TVA: {formatCurrency(row.new_amount_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center text-[10px]">
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
                      onClick={() => handleRemoveRow(i)}
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

      {/* Récapitulatif moderne */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-9 gap-4 text-[10px]">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total lignes</div>
            <div className="text-lg font-bold text-gray-800">{localShockWorks.length}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté HT</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence_ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté TVA</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence_tva)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté TTC</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence)}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Récupération HT</div>
            <div className="text-base font-bold text-green-700">{formatCurrency(totals.recovery_ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Récupération TVA</div>
            <div className="text-base font-bold text-green-700">{formatCurrency(totals.recovery_tva)}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Récupération TTC</div>
            <div className="text-base font-bold text-green-700">{formatCurrency(totals.recovery)}</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Montant Final HT</div>
            <div className={`text-base font-bold ${totals.new_ht >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
              {formatCurrency(totals.new_ht)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Montant Final TTC</div>
            <div className={`text-base font-bold ${totals.new >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
              {formatCurrency(totals.new)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 