/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator, Check, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import React from 'react'
import { SupplySelect } from '@/features/widgets/supply-select'
import { SupplyMutateDialog } from '@/features/expertise/fournitures/components/supply-mutate-dialog'

interface Supply {
  id: number
  label: string
  code?: string
  description?: string
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
  obsolescence?: boolean
  comment: string
  obsolescence_rate: number
  recovery_amount?: number
  discount: number
  amount: number
  // Calculated amounts from API
  obsolescence_amount_excluding_tax?: number
  obsolescence_amount_tax?: number
  obsolescence_amount?: number
  recovery_amount_excluding_tax?: number
  recovery_amount_tax?: number
  new_amount_excluding_tax?: number
  new_amount_tax?: number
  new_amount?: number
  discount_amount?: number
  // Nouvelles propriétés de l'API
  discount_amount_excluding_tax?: number
  discount_amount_tax?: number
  amount_excluding_tax?: number
  amount_tax?: number
}

export function ShockSuppliesEditTable({
  supplies,
  shockWorks,
  onUpdate,
  onAdd,
  onRemove,
  onValidateRow,
  onSupplyCreated,
  isEvaluation = false
}: {
  supplies: Supply[]
  shockWorks: ShockWork[]
  onUpdate: (index: number, updatedWork: ShockWork) => Promise<void>
  onAdd: (shockWorkData?: any) => Promise<void>
  onRemove: (index: number) => void
  onValidateRow: (index: number) => Promise<void>
  onSupplyCreated?: (newSupply: any) => void
  isEvaluation?: boolean
}) {
  // État local pour gérer les modifications et la validation
  const [localShockWorks, setLocalShockWorks] = useState<ShockWork[]>(shockWorks)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [validatingRows, setValidatingRows] = useState<Set<number>>(new Set())
  const [newRows, setNewRows] = useState<Set<number>>(new Set()) // Lignes nouvellement ajoutées
  const [showCreateSupplyModal, setShowCreateSupplyModal] = useState(false)
  const [currentSupplyIndex, setCurrentSupplyIndex] = useState<number | null>(null)

  // Mettre à jour les données locales quand les props changent
  useEffect(() => {
    console.log('ShockSuppliesEditTable - shockWorks reçues:', shockWorks)
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
      obsolescence: false,
      comment: '',
      obsolescence_rate: 0,
      recovery_amount: 0,
      discount: 0,
      amount: 0
    }
    
    const updated = [...localShockWorks, newWork]
    setLocalShockWorks(updated)
    setNewRows(prev => new Set([...prev, updated.length - 1]))
    setModifiedRows(prev => new Set([...prev, updated.length - 1]))
  }

  // Fonction pour ouvrir le modal de création de fourniture
  const handleCreateSupply = (index: number) => {
    setCurrentSupplyIndex(index >= 0 ? index : null)
    setShowCreateSupplyModal(true)
  }

  // Fonction pour gérer la création réussie d'une fourniture
  const handleSupplyCreated = (newSupply: any) => {
    if (currentSupplyIndex !== null) {
      // Sélectionner automatiquement la nouvelle fourniture dans la ligne existante
      updateLocalShockWork(currentSupplyIndex, 'supply_id', newSupply.id)
      setCurrentSupplyIndex(null)
    } else {
      // Si créé depuis le bouton principal, ajouter une nouvelle ligne avec la fourniture
      handleAddNewRow()
      // La nouvelle ligne sera ajoutée avec la fourniture sélectionnée
      setTimeout(() => {
        const newIndex = localShockWorks.length
        updateLocalShockWork(newIndex, 'supply_id', newSupply.id)
      }, 100)
    }
    onSupplyCreated?.(newSupply)
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
      discount_amount: acc.discount_amount + (work.discount_amount || 0)
    }
  }, { 
    obsolescence: 0, recovery: 0, new: 0, 
    obsolescence_ht: 0, recovery_ht: 0, new_ht: 0,
    obsolescence_tva: 0, recovery_tva: 0, new_tva: 0,
    discount_amount: 0
  })

  return (
    <div className="space-y-3">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Fourniture(s)
        </h4>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => handleCreateSupply(-1)}
            className="text-yellow-600 text-xs border-yellow-200 hover:bg-yellow-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une fourniture
          </Button>
          <Button onClick={handleAddNewRow} size="xs" className="text-white text-xs">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
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
                {isEvaluation ? 'Ctrl' : 'D/p'}
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
              {!isEvaluation && (
                <th className="border px-2 py-2 text-center font-medium text-[10px]">
                  Vétusté
                </th>
              )}
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
              {/* <th className="border px-2 py-2 text-left font-medium text-[10px]">
                Commentaire
              </th> */}
              <th className="border px-2 py-2 text-center font-medium text-[10px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {localShockWorks.length === 0 && (
              <tr>
                <td colSpan={16} className="text-center text-muted-foreground py-8 text-[10px]">
                  Aucune fourniture ajoutée
                </td>
              </tr>
            )}
       
            {localShockWorks.map((row, i) => (
              <tr key={row.uid} className={`hover:bg-gray-50 transition-colors ${modifiedRows.has(i) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}>
                {/* Fournitures */}
                <td className="border px-3 py-2 text-[10px]">
                  <SupplySelect
                    value={row.supply_id}
                    onValueChange={(value) => updateLocalShockWork(i, 'supply_id', value)}
                    supplies={supplies}
                    placeholder={!row.supply_id ? "⚠️ Sélectionner une fourniture" : "Sélectionner..."}
                    onCreateNew={() => handleCreateSupply(i)}
                  />
                </td>
                {/* 'Ctrl' : 'D/p' */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={isEvaluation ? row.control : row.disassembly} 
                    onCheckedChange={v => updateLocalShockWork(i, isEvaluation ? 'control' : 'disassembly', v)} 
                  />
                </td>
                {/* Remp */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.replacement} 
                    onCheckedChange={v => updateLocalShockWork(i, 'replacement', v)} 
                  />
                </td>
                {/* Rep */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.repair} 
                    onCheckedChange={v => updateLocalShockWork(i, 'repair', v)} 
                  />
                </td>
                {/* Peint */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Checkbox 
                    checked={row.paint} 
                    onCheckedChange={v => updateLocalShockWork(i, 'paint', v)} 
                  />
                </td>
                {/* Vétusté */}
                {!isEvaluation && (
                  <td className="border px-2 py-2 text-center text-[10px]">
                    <Checkbox 
                      checked={row.obsolescence} 
                      onCheckedChange={v => updateLocalShockWork(i, 'obsolescence', v)} 
                    />
                  </td>
                )}
                {/* Montant HT */}
                <td className="border px-2 text-center text-[10px]">
                  <Input
                    type="number"
                    className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.amount}
                    onChange={e => updateLocalShockWork(i, 'amount', Number(e.target.value))}
                  />
                </td>
                {/* Remise */}
                <td className="border px-2 py-2 text-center text-[10px]">
                  <Input
                    type="number"
                    className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.discount}
                    onChange={e => updateLocalShockWork(i, 'discount', Number(e.target.value))}
                  />
                </td>
                {/* Remise Calculé */}
                <td className="border px-2 py-2 text-center text-[10px]">

                  <div className={`font-bold ${(row.new_amount_excluding_tax || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {/* {formatCurrency(row.amount - (row?.discount_amount_excluding_tax || 0))} */}
                    {formatCurrency((row.amount || 0) -(row.discount_amount_excluding_tax || 0) )}
                  </div>
                </td>
                {/* Vétuste (%) */}
                <td className="border px-2 text-center text-[10px]">
                  <Input
                    type="number"
                    className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
                    value={row.obsolescence_rate}
                    onChange={e => updateLocalShockWork(i, 'obsolescence_rate', Number(e.target.value))}
                  />
                </td>
                {/* Vétuste calculée */}
                <td className="border px-2 text-center text-[10px]">
                  {formatCurrency(row.amount - (row.obsolescence_amount_excluding_tax || 0))}
                </td>
                {/* Montant TTC */}
                <td className="border px-2 py-2 text-center text-[10px] w-35">
                  <div className={`font-bold ${(row.new_amount || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    <Input
                      type="number"
                      className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
                      value={row.new_amount}
                      onChange={e => updateLocalShockWork(i, 'new_amount', Number(e.target.value))}
                    />
                  </div>
                </td>
                {/* Commentaire */}
                {/* <td className="border px-2 py-2 text-[10px]">
                  <Input
                    type="text"
                    className="rounded w-20 p-1 border-none focus:border-none focus:ring-0"
                    value={row.comment}
                    placeholder="Commentaire..."
                    onChange={e => updateLocalShockWork(i, 'comment', e.target.value)}
                  />
                </td> */}
                {/* Actions */}
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
        <div className="text-[10px] text-center items-center flex justify-around">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total lignes</div>
            <div className="text-lg font-bold text-gray-800">{localShockWorks.length}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté TTC</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Remise TTC</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.discount_amount)}</div>
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

      {/* Modal de création de fourniture */}
      <SupplyMutateDialog
        open={showCreateSupplyModal}
        onOpenChange={setShowCreateSupplyModal}
        onSuccess={handleSupplyCreated}
      />
    </div>
  )
} 