/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator, Check, Loader2, GripVertical } from 'lucide-react'
import { useState, useEffect } from 'react'
// import { Separator } from '@/components/ui/separator'
import { SupplySelect } from '@/features/widgets/supply-select'
import { SupplyMutateDialog } from '@/features/expertise/fournitures/components/supply-mutate-dialog'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Supply {
  id: number
  label: string
  code?: string
  description?: string
  price?: number
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
}

// Composant pour une ligne triable
interface SortableRowProps {
  row: ShockWork
  index: number
  supplies: Supply[]
  modifiedRows: Set<number>
  validatingRows: Set<number>
  isEvaluation: boolean
  updateLocalShockWork: (index: number, field: keyof ShockWork, value: any) => void
  handleCreateSupply: (index: number) => void
  handleValidateRow: (index: number) => Promise<void>
  onRemove: (index: number) => void
  formatCurrency: (amount: number | undefined) => string
}

function SortableRow({
  row,
  index,
  supplies,
  modifiedRows,
  validatingRows,
  isEvaluation,
  updateLocalShockWork,
  handleCreateSupply,
  handleValidateRow,
  onRemove,
  formatCurrency
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.uid })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors ${modifiedRows.has(index) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''} ${isDragging ? 'z-10 bg-white shadow-lg' : ''}`}
    >
      {/* Drag Handle */}
      <td className="border px-2 py-2 text-center text-xs w-8">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 flex justify-center"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </td>
      {/* Fournitures */}
      <td className="border px-3 py-2 text-xs">
        <SupplySelect
          value={row.supply_id}
          onValueChange={(value) => updateLocalShockWork(index, 'supply_id', value)}
          supplies={supplies}
          placeholder={!row.supply_id ? "⚠️ Sélectionner une fourniture" : "Sélectionner..."}
          onCreateNew={() => handleCreateSupply(index)}
        />
      </td>
      {/* 'Ctrl' : 'D/p' */}
      <td className="border px-2 py-2 text-center text-xs">
        <Checkbox 
          checked={isEvaluation ? row.control : row.disassembly} 
          onCheckedChange={v => updateLocalShockWork(index, isEvaluation ? 'control' : 'disassembly', v)} 
        />
      </td>
      {/* Remp */}
      <td className="border px-2 py-2 text-center text-xs">
        <Checkbox 
          checked={row.replacement} 
          onCheckedChange={v => updateLocalShockWork(index, 'replacement', v)} 
        />
      </td>
      {/* Rep */}
      <td className="border px-2 py-2 text-center text-xs">
        <Checkbox 
          checked={row.repair} 
          onCheckedChange={v => updateLocalShockWork(index, 'repair', v)} 
        />
      </td>
      {/* Peint */}
      <td className="border px-2 py-2 text-center text-xs">
        <Checkbox 
          checked={row.paint} 
          onCheckedChange={v => updateLocalShockWork(index, 'paint', v)} 
        />
      </td>
      {/* Vétusté */}
      {!isEvaluation && (
        <td className="border px-2 py-2 text-center text-xs">
          <Checkbox 
            checked={row.obsolescence}
            onCheckedChange={v => updateLocalShockWork(index, 'obsolescence', v)} 
          />
        </td>
      )}
      {/* Montant HT */}
      <td className="border px-2 text-center text-xs w-40">
        <Input
          type="number"
          className="w-full rounded p-1 text-center border-none focus:border-none focus:ring-0"
          value={row.amount}
          onChange={e => updateLocalShockWork(index, 'amount', Number(e.target.value))}
        />
      </td>
      {/* Remise */}
      <td className="border px-2 py-2 text-center text-xs">
        <Input
          type="number"
          className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
          value={row.discount}
          onChange={e => updateLocalShockWork(index, 'discount', Number(e.target.value))}
        />
      </td>
      {/* Remise Calculé */}
      <td className="border px-2 py-2 text-center text-xs w-40">
        <div className={`font-bold ${(row.new_amount_excluding_tax || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
          {formatCurrency(row?.amount - (row?.discount_amount_excluding_tax || 0))}
        </div>
      </td>
      {/* Vétuste (%) */}
      <td className="border px-2 text-center text-xs">
        <Input
          type="number"
          className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
          value={row.obsolescence_rate}
          onChange={e => updateLocalShockWork(index, 'obsolescence_rate', Number(e.target.value))}
        />
      </td>
      {/* Vétuste calculée */}
      <td className="border px-2 text-center text-xs w-40">
        {formatCurrency(row.new_amount_excluding_tax)}
      </td>
      {/* Montant TTC */}
      <td className="border px-2 py-2 text-center text-xs w-35">
        <div className={`font-bold ${(row.new_amount || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
          <Input
            type="number"
            className="rounded p-1 text-center border-none focus:border-none focus:ring-0"
            value={row.recovery_amount || 0}
            onChange={e => updateLocalShockWork(index, 'recovery_amount', Number(e.target.value))}
          />
        </div>
      </td>
      {/* Actions */}
      <td className="border px-2 py-2 text-center text-xs">
        <div className="flex items-center justify-center gap-1">
          {modifiedRows.has(index) && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleValidateRow(index)}
              disabled={validatingRows.has(index)}
              className="h-6 w-6 hover:bg-green-50 hover:text-green-600"
              title="Valider les modifications"
            >
              {validatingRows.has(index) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(index)}
            className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
            title="Supprimer la ligne"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function ShockSuppliesTable({
  supplies,
  shockWorks,
  onUpdate,
  onAdd,
  onRemove,
  onValidateRow,
  onSupplyCreated,
  onReorder,
  isEvaluation = false
}: {
  supplies: Supply[]
  shockWorks: ShockWork[]
  onUpdate: (index: number, field: keyof ShockWork, value: any) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onValidateRow: (index: number) => Promise<void>
  onSupplyCreated?: (newSupply: any) => void
  onReorder?: (reorderedWorks: ShockWork[]) => void
  isEvaluation?: boolean
}) {
  // État local pour gérer les modifications et la validation
  const [localShockWorks, setLocalShockWorks] = useState<ShockWork[]>(shockWorks)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [validatingRows, setValidatingRows] = useState<Set<number>>(new Set())
  const [showCreateSupplyModal, setShowCreateSupplyModal] = useState(false)
  const [currentSupplyIndex, setCurrentSupplyIndex] = useState<number | null>(null)

  // Senseurs pour le drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  // Fonction pour gérer le drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localShockWorks.findIndex(item => item.uid === active.id)
      const newIndex = localShockWorks.findIndex(item => item.uid === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(localShockWorks, oldIndex, newIndex)
        setLocalShockWorks(newOrder)
        
        // Communiquer le changement d'ordre au composant parent
        onReorder?.(newOrder)
        
        // Mettre à jour les indices modifiés
        const newModifiedRows = new Set<number>()
        modifiedRows.forEach(oldIdx => {
          let newIdx = oldIdx
          if (oldIdx === oldIndex) {
            newIdx = newIndex
          } else if (oldIndex < newIndex && oldIdx > oldIndex && oldIdx <= newIndex) {
            newIdx = oldIdx - 1
          } else if (oldIndex > newIndex && oldIdx >= newIndex && oldIdx < oldIndex) {
            newIdx = oldIdx + 1
          }
          newModifiedRows.add(newIdx)
        })
        setModifiedRows(newModifiedRows)

        // Mettre à jour les indices en cours de validation
        const newValidatingRows = new Set<number>()
        validatingRows.forEach(oldIdx => {
          let newIdx = oldIdx
          if (oldIdx === oldIndex) {
            newIdx = newIndex
          } else if (oldIndex < newIndex && oldIdx > oldIndex && oldIdx <= newIndex) {
            newIdx = oldIdx - 1
          } else if (oldIndex > newIndex && oldIdx >= newIndex && oldIdx < oldIndex) {
            newIdx = oldIdx + 1
          }
          newValidatingRows.add(newIdx)
        })
        setValidatingRows(newValidatingRows)
      }
    }
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
      onAdd()
      // La nouvelle ligne sera ajoutée avec la fourniture sélectionnée
      setTimeout(() => {
        const newIndex = localShockWorks.length
        updateLocalShockWork(newIndex, 'supply_id', newSupply.id)
      }, 100)
    }
    onSupplyCreated?.(newSupply)
  }

  // Fonction de formatage des montants
  const formatCurrency = (amount: number | undefined) => {
    // return new Intl.NumberFormat('fr-FR', {
    //   style: 'currency',
    //   currency: 'XOF',
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 0,
    // }).format(amount || 0)

    return ((amount || 0) / 1000).toFixed(3) || '0.000'
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
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-base flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Fournitures
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
          <div className="flex gap-2">
            <Button onClick={onAdd} size="xs" className="text-white text-xs">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une ligne
            </Button>
          </div>
        </div>

      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-gray-50 border-b">
                <th className="border px-2 py-2 text-center font-medium text-xs w-8">
                  <GripVertical className="h-4 w-4 mx-auto text-gray-400" />
                </th>
              <th className="border px-3 py-2 text-left font-medium text-xs">
                Fournitures
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                {isEvaluation ? 'Ctrl' : 'D/p'}
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
              {!isEvaluation && (
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Vétusté
              </th>
              )}
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Montant HT
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Remise
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Remise Calculé
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Vétuste (%)
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Vétuste calculée
              </th>
              <th className="border px-2 py-2 text-center font-medium text-purple-600 text-xs">
                Montant TTC
              </th>
              <th className="border px-2 py-2 text-center font-medium text-xs">
                Actions
              </th>
            </tr>
          </thead>
            <SortableContext
              items={localShockWorks.map(work => work.uid)}
              strategy={verticalListSortingStrategy}
            >
          <tbody>
            {localShockWorks.length === 0 && (
              <tr>
                    <td colSpan={15} className="text-center text-muted-foreground py-8 text-xs">
                  Aucune fourniture ajoutée
                </td>
              </tr>
            )}
            {localShockWorks.map((row, i) => (
                  <SortableRow
                    key={row.uid}
                    row={row}
                    index={i}
                    supplies={supplies}
                    modifiedRows={modifiedRows}
                    validatingRows={validatingRows}
                    isEvaluation={isEvaluation}
                    updateLocalShockWork={updateLocalShockWork}
                    handleCreateSupply={handleCreateSupply}
                    handleValidateRow={handleValidateRow}
                    onRemove={onRemove}
                    formatCurrency={formatCurrency}
                  />
            ))}
          </tbody>
            </SortableContext>
        </table>
      </div>
      </DndContext>

      {/* Récapitulatif moderne */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
        <div className="text-xs flex flex-wrap gap-4 justify-around">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total lignes</div>
            <div className="text-lg font-bold text-gray-800">{localShockWorks.length}</div>
          </div>
          
          {/* <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté HT</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence_ht)}</div>
          </div> */}
          {/* <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté TVA</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence_tva)}</div>
          </div> */}
          <div className="text-center">
            <div className="text-blue-600 font-medium">Vetusté TTC</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.obsolescence)}</div>
          </div>

          <div className="text-center">
            <div className="text-blue-600 font-medium">Remise TTC</div>
            <div className="text-base font-bold text-blue-700">{formatCurrency(totals.discount_amount)}</div>
          </div>
          {/* <div className="text-center">
            <div className="text-green-600 font-medium">Récupération HT</div>
            <div className="text-base font-bold text-green-700">{formatCurrency(totals.recovery_ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Récupération TVA</div>
            <div className="text-base font-bold text-green-700">{formatCurrency(totals.recovery_tva)}</div>
          </div> */}
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