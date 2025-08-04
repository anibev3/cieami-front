/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Calculator, Check, GripVertical, ArrowUpDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { SupplySelect } from '@/features/widgets/supply-select'
import { SupplyMutateDialog } from '@/features/expertise/fournitures/components/supply-mutate-dialog'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
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

interface PaintType {
  id: number
  label: string
}

interface HourlyRate {
  id: number
  label: string
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

// Composant pour une ligne triable
interface SortableSupplyRowProps {
  row: ShockWork
  index: number
  supplies: Supply[]
  modifiedRows: Set<number>
  newRows: Set<number>
  isEvaluation: boolean
  updateLocalShockWork: (index: number, field: keyof ShockWork, value: any) => void
  handleCreateSupply: (index: number) => void
  handleValidateRow: (index: number) => Promise<void>
  onRemove: (index: number) => void
  _formatCurrency: (amount: number) => string
}

function SortableSupplyRow({
  row,
  index,
  supplies,
  modifiedRows,
  newRows,
  isEvaluation,
  updateLocalShockWork,
  handleCreateSupply,
  handleValidateRow,
  onRemove,
  _formatCurrency
}: SortableSupplyRowProps) {
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
      className={`hover:bg-gray-50 transition-colors ${modifiedRows.has(index) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''} ${newRows.has(index) ? 'bg-green-50 border-l-4 border-l-green-400' : ''} ${isDragging ? 'z-10 bg-white shadow-lg' : ''}`}
    >
      {/* Drag Handle */}
      <td className="border px-2 py-2 text-center text-[10px] w-8">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 flex justify-center"
        >
          <GripVertical className="h-3 w-3" />
        </div>
      </td>
      {/* Fournitures */}
      <td className="border px-3 py-2 text-[10px]">
        <SupplySelect
          value={row.supply_id}
          onValueChange={(value) => updateLocalShockWork(index, 'supply_id', value)}
          supplies={supplies}
          placeholder={!row.supply_id ? "⚠️ Sélectionner une fourniture" : "Sélectionner..."}
          onCreateNew={() => handleCreateSupply(index)}
        />
      </td>
      {/* Actions basées sur isEvaluation */}
      <td className="border text-center text-[10px]">
        <Checkbox 
          checked={isEvaluation ? row.control : row.disassembly} 
          onCheckedChange={v => updateLocalShockWork(index, isEvaluation ? 'control' : 'disassembly', v)} 
        />
      </td>
      <td className="border text-center text-[10px]">
        <Checkbox 
          checked={row.replacement} 
          onCheckedChange={v => updateLocalShockWork(index, 'replacement', v)} 
        />
      </td>
      <td className="border text-center text-[10px]">
        <Checkbox 
          checked={row.repair} 
          onCheckedChange={v => updateLocalShockWork(index, 'repair', v)} 
        />
      </td>
      <td className="border text-center text-[10px]">
        <Checkbox 
          checked={row.paint} 
          onCheckedChange={v => updateLocalShockWork(index, 'paint', v)} 
        />
      </td>
      {!isEvaluation && (
        <td className="border text-center text-[10px]">
          <Checkbox 
            checked={row.obsolescence}
            onCheckedChange={v => updateLocalShockWork(index, 'obsolescence', v)} 
          />
        </td>
      )}
      {/* Montant HT */}
      <td className="border px-2 text-center text-[10px] w-40">
        <Input
          type="number"
          className="w-full rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
          value={row.amount}
          onChange={e => updateLocalShockWork(index, 'amount', Number(e.target.value))}
        />
      </td>
      {/* Remise */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <Input
          type="number"
          className="rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
          value={row.discount}
          onChange={e => updateLocalShockWork(index, 'discount', Number(e.target.value))}
        />
      </td>
      {/* Remise Calculé */}
      <td className="border px-2 py-2 text-center text-[10px] w-40">
        <div className={`font-bold ${(row.new_amount_excluding_tax || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
          {_formatCurrency(row.amount - (row.discount_amount || 0))}
        </div>
      </td>
      {/* Vétuste (%) */}
      <td className="border px-2 text-center text-[10px]">
        <Input
          type="number"
          className="rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
          value={row.obsolescence_rate}
          onChange={e => updateLocalShockWork(index, 'obsolescence_rate', Number(e.target.value))}
        />
      </td>
      {/* Vétuste calculée */}
      <td className="border px-2 text-center text-[10px] w-40">
        <div className="text-gray-600 font-medium">
          {_formatCurrency(row.new_amount_excluding_tax || 0)}
        </div>
      </td>
      {/* Montant TTC */}
      <td className="border px-2 py-2 text-center text-[10px] w-35">
        <div className={`font-bold ${(row.new_amount || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
          <Input
            type="number"
            className="rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
            value={row.recovery_amount || 0}
            onChange={e => updateLocalShockWork(index, 'recovery_amount', Number(e.target.value))}
          />
        </div>
      </td>
      {/* Actions */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <div className="flex items-center justify-center gap-1">
          {modifiedRows.has(index) && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleValidateRow(index)}
              className="h-5 w-5 hover:bg-green-50 hover:text-green-600"
              title={newRows.has(index) ? "Valider l'ajout" : "Valider les modifications"}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(index)}
            className="h-5 w-5 hover:bg-red-50 hover:text-red-600"
            title="Supprimer la ligne"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function ShockSuppliesEditTable({
  supplies,
  shockWorks,
  onUpdate,
  // onAdd,
  onRemove,
  onValidateRow,
  onSupplyCreated,
  isEvaluation = false,
  // Nouvelles props pour type de peinture et taux horaire
  paintTypes = [],
  hourlyRates = [],
  paintTypeId,
  hourlyRateId,
  onPaintTypeChange,
  onHourlyRateChange,
  // Props pour la réorganisation
  shockId,
  onReorderSave,
  hasReorderChanges = false,
  // Callback pour rafraîchir les données du dossier
  onAssignmentRefresh
}: {
  supplies: Supply[]
  shockWorks: ShockWork[]
  onUpdate: (index: number, updatedWork: ShockWork) => Promise<void>
  onAdd: (shockWorkData?: any) => Promise<void>
  onRemove: (index: number) => void
  onValidateRow: (index: number) => Promise<void>
  onSupplyCreated?: (newSupply: any) => void
  isEvaluation?: boolean
  // Nouvelles props pour type de peinture et taux horaire
  paintTypes?: PaintType[]
  hourlyRates?: HourlyRate[]
  paintTypeId?: number
  hourlyRateId?: number
  onPaintTypeChange?: (value: number) => void
  onHourlyRateChange?: (value: number) => void
  // Props pour la réorganisation
  shockId?: number
  onReorderSave?: (shockWorkIds: number[]) => Promise<void>
  hasReorderChanges?: boolean
  // Callback pour rafraîchir les données du dossier
  onAssignmentRefresh?: () => void
}) {
  // État local pour gérer les modifications et la validation
  const [localShockWorks, setLocalShockWorks] = useState<ShockWork[]>(shockWorks)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [_validatingRows, setValidatingRows] = useState<Set<number>>(new Set())
  const [newRows, setNewRows] = useState<Set<number>>(new Set()) // Lignes nouvellement ajoutées
  const [showCreateSupplyModal, setShowCreateSupplyModal] = useState(false)
  const [currentSupplyIndex, setCurrentSupplyIndex] = useState<number | null>(null)
  const [hasLocalReorderChanges, setHasLocalReorderChanges] = useState(false)

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
        setHasLocalReorderChanges(true)
        
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

        // Mettre à jour les indices des nouvelles lignes
        const newNewRows = new Set<number>()
        newRows.forEach(oldIdx => {
          let newIdx = oldIdx
          if (oldIdx === oldIndex) {
            newIdx = newIndex
          } else if (oldIndex < newIndex && oldIdx > oldIndex && oldIdx <= newIndex) {
            newIdx = oldIdx - 1
          } else if (oldIndex > newIndex && oldIdx >= newIndex && oldIdx < oldIndex) {
            newIdx = oldIdx + 1
          }
          newNewRows.add(newIdx)
        })
        setNewRows(newNewRows)
      }
    }
  }

  // Fonction pour sauvegarder la réorganisation
  const handleReorderSave = async () => {
    if (!onReorderSave || !shockId) return
    
    const shockWorkIds = localShockWorks
      .filter(work => work.id && work.id > 0) // Seulement les éléments avec un ID valide (pas les nouveaux)
      .map(work => work.id!)
    
    if (shockWorkIds.length === 0) {
      toast.error('Aucun élément à réorganiser trouvé')
      return
    }
    
    await onReorderSave(shockWorkIds)
    setHasLocalReorderChanges(false)
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
    setLocalShockWorks(prev => [...prev, newWork])
    setNewRows(prev => new Set([...prev, localShockWorks.length])) // Marquer comme nouvelle ligne
    // onAdd(newWork) // Appeler la fonction parent pour créer en base
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
      
      if (newRows.has(index)) {
        // Nouvelle ligne - API POST /shock-works avec le nouveau payload
        if (!shockId || !paintTypeId) {
          toast.error('ID du choc ou type de peinture manquant')
          return
        }
        
        const payload = {
          shock_id: shockId.toString(),
          paint_type_id: paintTypeId.toString(),
          shock_works: [
            {
              supply_id: shockWork.supply_id.toString(),
              disassembly: shockWork.disassembly,
              replacement: shockWork.replacement,
              repair: shockWork.repair,
              paint: shockWork.paint,
              obsolescence: shockWork.obsolescence || false,
              control: shockWork.control,
              obsolescence_rate: Number(shockWork.obsolescence_rate),
              recovery_amount: Number(shockWork.recovery_amount || 0),
              discount: Number(shockWork.discount),
              amount: Number(shockWork.amount),
              comment: shockWork.comment || ""
            }
          ]
        }
        
        // Appel API direct
        await axiosInstance.post(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}`, payload)
        
        toast.success('Fourniture créée avec succès')
        
        // Rafraîchir les données du dossier
        if (onAssignmentRefresh) {
          onAssignmentRefresh()
        }
      } else {
        // Ligne existante - utiliser la logique existante
        await onUpdate(index, shockWork)
        await onValidateRow(index)
      }
      
      // Marquer comme non modifié et non nouveau
      setModifiedRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
      setNewRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    } catch (error: any) {
      void error // Ignore l'erreur pour le linting
      toast.error(newRows.has(index) ? 'Erreur lors de la création de la fourniture' : 'Erreur lors de la mise à jour')
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
    setLocalShockWorks(prev => prev.filter((_, i) => i !== index))
    setModifiedRows(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    setNewRows(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    onRemove(index)
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
        <div className="flex gap-2 items-center">
          {/* Bouton de réorganisation */}
          {(hasLocalReorderChanges || hasReorderChanges) && shockId && (
            <Button 
              variant="outline" 
              size="xs"
              onClick={handleReorderSave}
              className="text-purple-600 text-xs border-purple-200 hover:bg-purple-50"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Réorganiser
            </Button>
          )}
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

      {/* Autres informations - seulement si les props sont fournies */}
      {(paintTypeId !== undefined || hourlyRateId !== undefined) && (
        <div className="border rounded bg-gray-50 p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paintTypeId !== undefined && (
              <div>
                <Label className="text-xs font-medium mb-2">Type de peinture</Label>
                <Select 
                  value={paintTypeId ? paintTypeId.toString() : ''} 
                  onValueChange={(value) => onPaintTypeChange?.(Number(value))}
                >
                  <SelectTrigger className={`w-full border rounded p-2 ${!paintTypeId ? 'border-red-300 bg-red-50' : ''}`}>
                    <SelectValue placeholder={!paintTypeId ? "⚠️ Sélectionner un type" : "Sélectionner..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {paintTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {hourlyRateId !== undefined && (
              <div>
                <Label className="text-xs font-medium mb-2">Taux horaire</Label>
                <Select 
                  value={hourlyRateId ? hourlyRateId.toString() : ''} 
                  onValueChange={(value) => onHourlyRateChange?.(Number(value))}
                >
                  <SelectTrigger className={`w-full border rounded p-2 ${!hourlyRateId ? 'border-red-300 bg-red-50' : ''}`}>
                    <SelectValue placeholder={!hourlyRateId ? "⚠️ Sélectionner un taux" : "Sélectionner..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {hourlyRates.map((rate) => (
                      <SelectItem key={rate.id} value={rate.id.toString()}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border text-[10px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="border px-2 py-2 text-center font-medium text-[10px] w-8">
                  <GripVertical className="h-3 w-3 mx-auto text-gray-400" />
                </th>
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
                    Vét
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
                <th className="border px-2 py-2 text-center font-medium text-[10px]">
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
                    <td colSpan={14} className="text-center text-muted-foreground py-8 text-[10px]">
                      Aucune fourniture ajoutée
                    </td>
                  </tr>
                )}
                {localShockWorks.map((row, i) => (
                  <SortableSupplyRow
                    key={row.uid}
                    row={row}
                    index={i}
                    supplies={supplies}
                    modifiedRows={modifiedRows}
                    newRows={newRows}
                    isEvaluation={isEvaluation}
                    updateLocalShockWork={updateLocalShockWork}
                    handleCreateSupply={handleCreateSupply}
                    handleValidateRow={handleValidateRow}
                    onRemove={handleRemoveRow}
                    _formatCurrency={formatCurrency}
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