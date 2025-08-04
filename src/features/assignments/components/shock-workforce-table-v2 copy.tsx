/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Calculator, Loader2, Check, X, GripVertical, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { workforceService } from '@/services/workforce-service'
import { useWorkforceTypesStore } from '@/stores/workforce-types'
import { useHourlyRatesStore } from '@/stores/hourly-rates'
import { usePaintTypesStore } from '@/stores/paint-types'
import { WorkforceTypeSelect } from '@/features/widgets/workforce-type-select'
import { WorkforceTypeMutateDialog } from '@/features/expertise/type-main-oeuvre/components/workforce-type-mutate-dialog'
import { WorkforceType } from '@/types/workforce-types'
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

interface PaintType {
  id: number
  label: string
}

interface HourlyRate {
  id: number
  label: string
}

interface Workforce {
  uid?: string
  id?: number
  workforce_type_id: number
  workforce_type_label?: string
  nb_hours: number | string
  work_fee?: string | number
  discount: number | string
  with_tax?: boolean | number
  // Calculated amounts from API
  amount_excluding_tax?: number | string
  amount_tax?: number | string
  amount?: number | string
  rate?: number | string
  amount_ht?: number | string
  amount_tva?: number | string
  amount_ttc?: number | string
  hourly_rate_id?: string | number
  paint_type_id?: string | number
  // Champ pour la peinture partielle/totale (workforce_type_id = 1)
  all_paint?: boolean
  // Additional fields for display
  workforce_type?: {
    id: number
    code: string
    label: string
    description?: string
  }
  // Nouvelles clés de l'API
  paint_type?: {
    id: number
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  hourly_rate?: {
    id: number
    value: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
}

interface ShockWorkforceTableV2Props {
  shockId: number
  workforces: Workforce[]
  onUpdate: (updatedWorkforces: Workforce[]) => void
  onAdd?: (workforceData?: any) => Promise<void> // Nouvelle prop pour l'API POST
  onAssignmentRefresh?: () => void // Callback pour rafraîchir les données du dossier
  // Nouvelles props pour la cohérence avec shock-workforce-table.tsx
  workforceTypes?: any[]
  paintTypes?: PaintType[]
  hourlyRates?: HourlyRate[]
  paintTypeId?: number
  hourlyRateId?: number
  withTax?: boolean
  onPaintTypeChange?: (value: number) => void
  onHourlyRateChange?: (value: number) => void
  onWithTaxChange?: (value: boolean) => void
  onWorkforceTypeCreated?: (newWorkforceType: any) => void
  // Props pour la réorganisation
  onReorderSave?: (workforceIds: number[]) => Promise<void>
  hasReorderChanges?: boolean
}

// Composant pour une ligne triable
interface SortableWorkforceRowProps {
  row: Workforce
  index: number
  workforceTypes: WorkforceType[]
  modifiedRows: Set<number>
  newRows: Set<number>
  updateLocalWorkforce: (index: number, field: keyof Workforce, value: any) => void
  handleCreateWorkforceType: (index: number) => void
  saveWorkforce: (index: number) => Promise<void>
  handleRemoveRow: (index: number) => Promise<void>
  cancelChanges: (index: number) => void
  hasChanges: (index: number) => boolean
  formatCurrency: (amount: number | string) => string
  getWorkforceTypeId: (workforce: Workforce) => number
  updatingId: number | null
}

function SortableWorkforceRow({
  row,
  index,
  workforceTypes,
  modifiedRows,
  newRows,
  updateLocalWorkforce,
  handleCreateWorkforceType,
  saveWorkforce,
  handleRemoveRow,
  cancelChanges,
  hasChanges,
  formatCurrency,
  getWorkforceTypeId,
  updatingId
}: SortableWorkforceRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.uid || row.id || index })

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
      {/* Désignation */}
      <td className="border px-3 py-2 text-[10px]">
        <WorkforceTypeSelect
          value={getWorkforceTypeId(row)}
          onValueChange={(value) => updateLocalWorkforce(index, 'workforce_type_id', value)}
          workforceTypes={workforceTypes as any}
          placeholder={!getWorkforceTypeId(row) ? "⚠️ Sélectionner un type" : "Sélectionner..."}
          onCreateNew={() => handleCreateWorkforceType(index)}
        />
      </td>
            {/* Colonne peinture partielle/totale si workforce_type_id = 1 */}
      {row.workforce_type_id === 1 ? (
        <td className="border px-2 py-2 text-center text-[10px]">
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              checked={row.all_paint || false}
              onCheckedChange={(checked) => updateLocalWorkforce(index, 'all_paint', checked)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className="text-xs text-gray-600">
              {row.all_paint ? 'Complète' : 'Partielle'}
            </span>
          </div>
        </td>
      ): (
        <td className="border px-2 py-2 text-center text-[10px]">
          <span className="text-xs text-gray-600">
            {/* {row.all_paint ? 'Totale' : 'Partielle'} */}
          </span>
        </td>
      )}
      {/* Tps(H) */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <Input
          type="number"
          className="w-full border rounded p-1 text-center text-[10px]"
          value={row.nb_hours}
          onChange={e => updateLocalWorkforce(index, 'nb_hours', Number(e.target.value))}
        />
      </td>
      {/* Remise (%) */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <Input
          type="number"
          className="w-full border rounded p-1 text-center text-[10px]"
          value={row.discount}
          onChange={e => updateLocalWorkforce(index, 'discount', Number(e.target.value))}
        />
      </td>
      {/* Tx horr (FCFA) */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <div className="text-gray-600 font-medium">
          {formatCurrency(row.work_fee || 0)}
        </div>
      </td>
      {/* Montant HT */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <div className="text-green-600 font-medium">
          {formatCurrency(row.amount_excluding_tax || 0)}
        </div>
      </td>
      {/* Montant TVA */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <div className="text-blue-600 font-medium">
          {formatCurrency(row.amount_tax || 0)}
        </div>
      </td>
      {/* Montant TTC */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <div className="text-purple-600 font-bold">
          {formatCurrency(row.amount || 0)}
        </div>
      </td>

      {/* Actions */}
      <td className="border px-2 py-2 text-center text-[10px]">
        <div className="flex items-center justify-center gap-1">
          {hasChanges(index) && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => saveWorkforce(index)}
              disabled={updatingId === (row.id || index)}
              className="h-5 w-5 hover:bg-green-50 hover:text-green-600"
              title="Sauvegarder"
            >
              {updatingId === (row.id || index) ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </Button>
          )}
          {hasChanges(index) && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => cancelChanges(index)}
              className="h-5 w-5 hover:bg-yellow-50 hover:text-yellow-600"
              title="Annuler"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleRemoveRow(index)}
            className="h-5 w-5 hover:bg-red-50 hover:text-red-600"
            title="Supprimer"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function ShockWorkforceTableV2({
  shockId,
  workforces,
  onUpdate,
  onAdd,
  onAssignmentRefresh,
  workforceTypes: externalWorkforceTypes,
  paintTypes: externalPaintTypes,
  hourlyRates: externalHourlyRates,
  paintTypeId,
  hourlyRateId,
  withTax = true,
  onPaintTypeChange,
  onHourlyRateChange,
  onWithTaxChange,
  onWorkforceTypeCreated,
  onReorderSave,
  hasReorderChanges = false
}: ShockWorkforceTableV2Props) {
  const [localWorkforces, setLocalWorkforces] = useState<Workforce[]>(workforces)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [originalValues, setOriginalValues] = useState<Record<number, Partial<Workforce>>>({})
  const [newRows, setNewRows] = useState<Set<number>>(new Set()) // Lignes nouvellement ajoutées
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set()) // Lignes modifiées
  const [showCreateWorkforceTypeModal, setShowCreateWorkforceTypeModal] = useState(false)
  const [currentWorkforceIndex, setCurrentWorkforceIndex] = useState<number | null>(null)
  const [localWithTax, setLocalWithTax] = useState<boolean>(withTax)
  const [updatingWithTax, setUpdatingWithTax] = useState<boolean>(false)
  const [updatingPaintType, setUpdatingPaintType] = useState<boolean>(false)
  const [updatingHourlyRate, setUpdatingHourlyRate] = useState<boolean>(false)
  const [hasLocalReorderChanges, setHasLocalReorderChanges] = useState(false)

  // Senseurs pour le drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Utiliser les stores ou les props externes
  const { workforceTypes: storeWorkforceTypes, loading: workforceTypesLoading, fetchWorkforceTypes } = useWorkforceTypesStore()
  const { hourlyRates: storeHourlyRates, loading: hourlyRatesLoading, fetchHourlyRates } = useHourlyRatesStore()
  const { paintTypes: storePaintTypes, loading: paintTypesLoading, fetchPaintTypes } = usePaintTypesStore()

  // Utiliser les données externes si fournies, sinon les stores
  const workforceTypes = externalWorkforceTypes || storeWorkforceTypes
  const hourlyRates = externalHourlyRates || storeHourlyRates
  const paintTypes = externalPaintTypes || storePaintTypes

  // Mettre à jour les données locales quand les props changent
  useEffect(() => {
    setLocalWorkforces(workforces)
  }, [workforces])

  // Mettre à jour localWithTax quand la prop withTax change
  useEffect(() => {
    setLocalWithTax(withTax)
  }, [withTax])

  // Charger les données nécessaires seulement si pas fournies en props
  useEffect(() => {
    const loadData = async () => {
      if (!externalWorkforceTypes || !externalHourlyRates || !externalPaintTypes) {
        try {
          await Promise.all([
            !externalWorkforceTypes && fetchWorkforceTypes(),
            !externalHourlyRates && fetchHourlyRates(),
            !externalPaintTypes && fetchPaintTypes()
          ].filter(Boolean))
        } catch (_error) {
          toast.error('Erreur lors du chargement des données')
        }
      }
    }

    loadData()
  }, [fetchWorkforceTypes, fetchHourlyRates, fetchPaintTypes, externalWorkforceTypes, externalHourlyRates, externalPaintTypes])

  // Fonction pour obtenir l'ID du type de main d'œuvre
  const getWorkforceTypeId = (workforce: Workforce): number => {
    if (workforce.workforce_type_id && workforce.workforce_type_id > 0) {
      return workforce.workforce_type_id
    }
    if (workforce.workforce_type?.id) {
      return workforce.workforce_type.id
    }
    return 0
  }

  // Fonction de formatage des montants
  const formatCurrency = (amount: number | string) => {
    return (Number(amount) / 1000).toFixed(3) || '0.000'
  }

  // Fonction pour calculer les totaux
  const calculateTotals = (workforces: Workforce[]) => {
    return workforces.reduce((acc, workforce) => {
      return {
        hours: acc.hours + Number(workforce.nb_hours || 0),
        ht: acc.ht + Number(workforce.amount_excluding_tax || 0),
        tva: acc.tva + Number(workforce.amount_tax || 0),
        ttc: acc.ttc + Number(workforce.amount || 0),
        work_fee_total: acc.work_fee_total + (Number(workforce.work_fee) || 0),
        discount_total: acc.discount_total + (Number(workforce.discount) || 0),
      }
    }, { hours: 0, ht: 0, tva: 0, ttc: 0, work_fee_total: 0, discount_total: 0 })
  }

  // Fonction pour mettre à jour une ligne localement
  const updateLocalWorkforce = (index: number, field: keyof Workforce, value: any) => {
    const updated = [...localWorkforces]
    updated[index] = { ...updated[index], [field]: value }
    setLocalWorkforces(updated)
    setModifiedRows(prev => new Set([...prev, index]))
  }

  // Fonction pour gérer le drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localWorkforces.findIndex(item => item.uid === active.id)
      const newIndex = localWorkforces.findIndex(item => item.uid === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(localWorkforces, oldIndex, newIndex)
        setLocalWorkforces(newOrder)
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
    if (!onReorderSave) return
    
    const workforceIds = localWorkforces
      .filter(workforce => workforce.id && workforce.id > 0) // Seulement les éléments avec un ID valide (pas les nouveaux)
      .map(workforce => workforce.id!)
    
    if (workforceIds.length === 0) {
      toast.error('Aucun élément à réorganiser trouvé')
      return
    }
    
    await onReorderSave(workforceIds)
    setHasLocalReorderChanges(false)
  }

  // Fonction pour ouvrir le modal de création de type de main d'œuvre
  const handleCreateWorkforceType = (index: number) => {
    setCurrentWorkforceIndex(index >= 0 ? index : null)
    setShowCreateWorkforceTypeModal(true)
  }

  // Fonction pour gérer la création réussie d'un type de main d'œuvre
  const handleWorkforceTypeCreated = (newWorkforceType: any) => {
    if (currentWorkforceIndex !== null) {
      // Sélectionner automatiquement le nouveau type dans la ligne existante
      updateLocalWorkforce(currentWorkforceIndex, 'workforce_type_id', newWorkforceType.id)
      setCurrentWorkforceIndex(null)
    } else {
      // Si créé depuis le bouton principal, ajouter une nouvelle ligne avec le type
      handleAddNewRow()
      // La nouvelle ligne sera ajoutée avec le type sélectionné
      setTimeout(() => {
        const newIndex = localWorkforces.length
        updateLocalWorkforce(newIndex, 'workforce_type_id', newWorkforceType.id)
      }, 100)
    }
    onWorkforceTypeCreated?.(newWorkforceType)
  }

  // Fonction pour sauvegarder une ligne existante
  const saveWorkforce = async (index: number) => {
    const workforce = localWorkforces[index]
    if (!workforce.id) return

    try {
      setUpdatingId(workforce.id)
      
      // Préparer les données pour l'API
      const updateData = {
        workforce_type_id: getWorkforceTypeId(workforce).toString(),
        nb_hours: Number(workforce.nb_hours),
        discount: Number(workforce.discount),
        // hourly_rate_id: workforce.hourly_rate_id?.toString() || (hourlyRates.length > 0 ? hourlyRates[0].id.toString() : "1"),
        hourly_rate_id: hourlyRateId?.toString(),
        // paint_type_id: workforce.paint_type_id?.toString() || (paintTypes.length > 0 ? paintTypes[0].id.toString() : "1"),
        paint_type_id: paintTypeId?.toString(),
        with_tax: localWithTax
      }

      // Appel API pour mettre à jour
      await workforceService.updateWorkforce(workforce.id, updateData)
      
      // Mettre à jour les données parent avec les nouvelles propriétés
      const updatedWorkforces = [...localWorkforces]
      updatedWorkforces[index] = {
        ...updatedWorkforces[index],
        paint_type: workforce.paint_type,
        hourly_rate: workforce.hourly_rate
      }
      onUpdate(updatedWorkforces)
      
      // Sauvegarder les valeurs originales
      setOriginalValues(prev => ({
        ...prev,
        [workforce.id!]: { ...workforce }
      }))
      
      toast.success('Main d\'œuvre mise à jour avec succès')
      
      // Rafraîchir les données du dossier
      if (onAssignmentRefresh) {
        onAssignmentRefresh()
      }
    } catch (_error) {
      toast.error('Erreur lors de la mise à jour de la main d\'œuvre')
      
      // Restaurer les valeurs originales en cas d'erreur
      const original = originalValues[workforce.id!]
      if (original) {
        updateLocalWorkforce(index, 'nb_hours', original.nb_hours)
        updateLocalWorkforce(index, 'discount', original.discount)
        updateLocalWorkforce(index, 'workforce_type_id', original.workforce_type_id)
        updateLocalWorkforce(index, 'hourly_rate_id', original.hourly_rate_id)
        updateLocalWorkforce(index, 'paint_type_id', original.paint_type_id)
        updateLocalWorkforce(index, 'paint_type', original.paint_type)
        updateLocalWorkforce(index, 'hourly_rate', original.hourly_rate)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  // Fonction pour ajouter une nouvelle ligne localement
  const handleAddNewRow = () => {
    const newWorkforce: Workforce = {
      uid: crypto.randomUUID(),
      workforce_type_id: 0,
      nb_hours: 0,
      discount: 0,
      with_tax: localWithTax,
      work_fee: 0,
      amount_excluding_tax: 0,
      amount_tax: 0,
      amount: 0,
      // hourly_rate_id: hourlyRates.length > 0 ? hourlyRates[0].id : 0,
      hourly_rate_id: hourlyRateId?.toString(),
      // paint_type_id: paintTypes.length > 0 ? paintTypes[0].id : 0,
      paint_type_id: paintTypeId?.toString(),
      // Initialiser les nouvelles propriétés
      paint_type: paintTypes.length > 0 ? {
        id: paintTypes[0].id,
        code: paintTypes[0].label,
        label: paintTypes[0].label,
        description: paintTypes[0].label,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } : undefined,
      hourly_rate: hourlyRates.length > 0 ? {
        id: hourlyRates[0].id,
        value: hourlyRates[0].label,
        label: hourlyRates[0].label,
        description: hourlyRates[0].label,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } : undefined
    }
    
    const updated = [...localWorkforces, newWorkforce]
    setLocalWorkforces(updated)
    setNewRows(prev => new Set([...prev, updated.length - 1]))
    setModifiedRows(prev => new Set([...prev, updated.length - 1]))
    // Ne pas appeler onUpdate ici, seulement lors de la validation
  }

  // Fonction de validation d'une ligne
  const handleValidateRow = async (index: number) => {
    const workforce = localWorkforces[index]
    
    if (newRows.has(index)) {
      // Nouvelle ligne, appeler onAdd (API POST)
      if (onAdd) {
        try {
          setCreatingId(workforce.uid || '')
          
          const workforceData = {
            workforce_type_id: getWorkforceTypeId(workforce),
            nb_hours: Number(workforce.nb_hours),
            discount: Number(workforce.discount),
            with_tax: localWithTax,
            // hourly_rate_id: workforce.hourly_rate_id,
            hourly_rate_id: hourlyRateId?.toString(),
            // paint_type_id: workforce.paint_type_id,
            paint_type_id: paintTypeId?.toString()
          }
          
          await onAdd(workforceData)
          
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
          
          toast.success('Main d\'œuvre créée avec succès')
        } catch (_error) {
          toast.error('Erreur lors de la création de la main d\'œuvre')
        } finally {
          setCreatingId(null)
        }
      }
    } else {
      // Ligne existante, utiliser la logique existante
      await saveWorkforce(index)
    }
  }

  // Fonction pour supprimer une ligne
  const handleRemoveRow = async (index: number) => {
    const workforce = localWorkforces[index]
    
    if (newRows.has(index)) {
      // Ligne temporaire, la supprimer localement
      const updated = localWorkforces.filter((_, i) => i !== index)
      setLocalWorkforces(updated)
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
      onUpdate(updated)
    } else if (workforce.id) {
      // Ligne existante, la supprimer via l'API
      try {
        await workforceService.deleteWorkforce(workforce.id)
        const updated = localWorkforces.filter((_, i) => i !== index)
        setLocalWorkforces(updated)
        onUpdate(updated)
        toast.success('Main d\'œuvre supprimée avec succès')
      } catch (_error) {
        toast.error('Erreur lors de la suppression de la main d\'œuvre')
      }
    }
  }

  // Fonction pour annuler les modifications
  const cancelChanges = (index: number) => {
    const workforce = localWorkforces[index]
    
    if (newRows.has(index)) {
      // C'est une nouvelle ligne, la supprimer
      const updated = localWorkforces.filter((_, i) => i !== index)
      setLocalWorkforces(updated)
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
      onUpdate(updated)
    } else if (workforce.id) {
      // C'est une ligne existante, restaurer les valeurs originales
      const original = originalValues[workforce.id]
      if (original) {
        updateLocalWorkforce(index, 'nb_hours', original.nb_hours)
        updateLocalWorkforce(index, 'discount', original.discount)
        updateLocalWorkforce(index, 'workforce_type_id', original.workforce_type_id)
        updateLocalWorkforce(index, 'hourly_rate_id', original.hourly_rate?.id)
        updateLocalWorkforce(index, 'paint_type_id', original.paint_type?.id)
        updateLocalWorkforce(index, 'paint_type', original.paint_type)
        updateLocalWorkforce(index, 'hourly_rate', original.hourly_rate)
      }
    }
  }

  // Fonction pour vérifier si une ligne a été modifiée
  const hasChanges = (index: number) => {
    return modifiedRows.has(index) || newRows.has(index)
  }

  // Fonction pour gérer le changement de type de peinture
  const handlePaintTypeChange = async (value: number) => {
    onPaintTypeChange?.(value)
    
    // Mettre à jour toutes les workforces locales avec le nouveau paint_type
    const selectedPaintType = paintTypes.find(pt => pt.id === value)
    if (selectedPaintType) {
      const updatedWorkforces = localWorkforces.map(workforce => ({
        ...workforce,
        paint_type_id: value,
        paint_type: {
          id: selectedPaintType.id,
          code: selectedPaintType.label,
          label: selectedPaintType.label,
          description: selectedPaintType.label,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }))
      setLocalWorkforces(updatedWorkforces)
    }
    
    // Si il y a des workforces avec un ID, mettre à jour via l'API
    const existingWorkforce = localWorkforces.find(w => w.id)
    if (existingWorkforce) {
      setUpdatingPaintType(true)
      try {
        // Préparer les données pour l'API
        const updateData = {
          workforce_type_id: getWorkforceTypeId(existingWorkforce).toString(),
          nb_hours: Number(existingWorkforce.nb_hours),
          discount: Number(existingWorkforce.discount),
          // hourly_rate_id: existingWorkforce.hourly_rate_id?.toString() || (hourlyRates.length > 0 ? hourlyRates[0].id.toString() : "1"),
          hourly_rate_id: hourlyRateId?.toString(),
          paint_type_id: value.toString(),
          with_tax: localWithTax
        }

        // Appel API pour mettre à jour
        await workforceService.updateWorkforce(existingWorkforce.id!, updateData)
        
        toast.success('Type de peinture mis à jour avec succès')
        
        // Rafraîchir les données du dossier
        if (onAssignmentRefresh) {
          onAssignmentRefresh()
        }
      } catch (_error) {
        toast.error('Erreur lors de la mise à jour du type de peinture')
      } finally {
        setUpdatingPaintType(false)
      }
    }
  }

  // Fonction pour gérer le changement de taux horaire
  const handleHourlyRateChange = async (value: number) => {
    onHourlyRateChange?.(value)
    
    // Mettre à jour toutes les workforces locales avec le nouveau hourly_rate
    const selectedHourlyRate = hourlyRates.find(hr => hr.id === value)
    if (selectedHourlyRate) {
      const updatedWorkforces = localWorkforces.map(workforce => ({
        ...workforce,
        hourly_rate_id: value,
        work_fee: selectedHourlyRate.label, // Mettre à jour le work_fee avec la nouvelle valeur
        hourly_rate: {
          id: selectedHourlyRate.id,
          value: selectedHourlyRate.label,
          label: selectedHourlyRate.label,
          description: selectedHourlyRate.label,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }))
      setLocalWorkforces(updatedWorkforces)
    }
    
    // Si il y a des workforces avec un ID, mettre à jour via l'API
    const existingWorkforce = localWorkforces.find(w => w.id)
    if (existingWorkforce) {
      setUpdatingHourlyRate(true)
      try {
        // Préparer les données pour l'API
        const updateData = {
          workforce_type_id: getWorkforceTypeId(existingWorkforce).toString(),
          nb_hours: Number(existingWorkforce.nb_hours),
          discount: Number(existingWorkforce.discount),
          hourly_rate_id: value.toString(),
          // paint_type_id: existingWorkforce.paint_type_id?.toString() || (paintTypes.length > 0 ? paintTypes[0].id.toString() : "1"),
          paint_type_id: paintTypeId?.toString(),
          with_tax: localWithTax
        }

        // Appel API pour mettre à jour
        await workforceService.updateWorkforce(existingWorkforce.id!, updateData)
        
        toast.success('Taux horaire mis à jour avec succès')
        
        // Rafraîchir les données du dossier
        if (onAssignmentRefresh) {
          onAssignmentRefresh()
        }
      } catch (_error) {
        toast.error('Erreur lors de la mise à jour du taux horaire')
      } finally {
        setUpdatingHourlyRate(false)
      }
    }
  }

  // Fonction pour gérer le changement de withTax
  const handleWithTaxChange = async (checked: boolean) => {
    setLocalWithTax(checked)
    onWithTaxChange?.(checked)
    
    // Si il y a des workforces avec un ID, mettre à jour via l'API
    const existingWorkforce = localWorkforces.find(w => w.id)
    if (existingWorkforce) {
      setUpdatingWithTax(true)
      try {
        // Utiliser la première workforce existante pour déclencher la mise à jour
        const firstWorkforce = existingWorkforce
        // Préparer les données pour l'API
        const updateData = {
          workforce_type_id: getWorkforceTypeId(firstWorkforce).toString(),
          nb_hours: Number(firstWorkforce.nb_hours),
          discount: Number(firstWorkforce.discount),
          // hourly_rate_id: firstWorkforce.hourly_rate_id?.toString() || (hourlyRates.length > 0 ? hourlyRates[0].id.toString() : "1"),
          hourly_rate_id: hourlyRateId?.toString(),
          // paint_type_id: firstWorkforce.paint_type_id?.toString() || (paintTypes.length > 0 ? paintTypes[0].id.toString() : "1"),
          paint_type_id: paintTypeId?.toString(),
          with_tax: checked
        }

        // Appel API pour mettre à jour
        await workforceService.updateWorkforce(firstWorkforce.id!, updateData)
        
        toast.success('Paramètre TVA mis à jour avec succès')
        
        // Rafraîchir les données du dossier
        if (onAssignmentRefresh) {
          onAssignmentRefresh()
        }
      } catch (_error) {
          toast.error('Erreur lors de la mise à jour du paramètre TVA')
        // Restaurer l'ancienne valeur en cas d'erreur
        setLocalWithTax(!checked)
        onWithTaxChange?.(!checked)
      } finally {
        setUpdatingWithTax(false)
      }
    }
  }

  const totals = calculateTotals(localWorkforces)
  const isLoading = workforceTypesLoading || hourlyRatesLoading || paintTypesLoading

  // Vérifier si on a des lignes avec workforce_type_id = 1 pour afficher la colonne peinture
  const hasPaintWorkforce = localWorkforces.some(workforce => workforce.workforce_type_id === 1)

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Main d'œuvre(s)
        </h4>
        <div className="flex gap-2 items-center">
          {/* Bouton de réorganisation */}
          {(hasLocalReorderChanges || hasReorderChanges) && (
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
            onClick={() => handleCreateWorkforceType(-1)}
            className="text-green-600 text-xs border-green-200 hover:bg-green-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un type
          </Button>
          <Button 
            onClick={handleAddNewRow}
            className="text-white text-xs"
            size="xs"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>
      </div>

      {/* Autres informations - seulement si les props sont fournies */}
      {(paintTypeId !== undefined || hourlyRateId !== undefined || withTax !== undefined) && (
        <div className="border rounded bg-gray-50 p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {paintTypeId !== undefined && (
              <div className="relative">
                <Label className="text-xs font-medium mb-2">Type de peinture</Label>
                <Select 
                  value={paintTypeId ? paintTypeId.toString() : ''} 
                  onValueChange={(value) => handlePaintTypeChange(Number(value))}
                  disabled={updatingPaintType}
                >
                  <SelectTrigger className={`w-full border rounded p-2 ${!paintTypeId ? 'border-red-300 bg-red-50' : ''} ${updatingPaintType ? 'opacity-50' : ''}`}>
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
                {updatingPaintType && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">Mise à jour...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {hourlyRateId !== undefined && (
              <div className="relative">
                <Label className="text-xs font-medium mb-2">Taux horaire</Label>
                <Select 
                  value={hourlyRateId ? hourlyRateId.toString() : ''} 
                  onValueChange={(value) => handleHourlyRateChange(Number(value))}
                  disabled={updatingHourlyRate}
                >
                  <SelectTrigger className={`w-full border rounded p-2 ${!hourlyRateId ? 'border-red-300 bg-red-50' : ''} ${updatingHourlyRate ? 'opacity-50' : ''}`}>
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
                {updatingHourlyRate && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">Mise à jour...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {withTax !== undefined && (
              <div className="h-full">
                <div className="h-full flex justify-between items-center space-y-2 p-3 bg-white rounded-lg border border-gray-200 w-full relative">
                  {updatingWithTax && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        <span className="text-xs text-green-600">Mise à jour...</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 py-1 mt-2">
                    <Checkbox
                      checked={localWithTax}
                      onCheckedChange={(checked) => handleWithTaxChange(checked as boolean)}
                      disabled={updatingWithTax}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <span className="text-xs text-gray-600">
                      {localWithTax ? 'Avec TVA (18%)' : 'Sans TVA'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 py-1 mt-2">
                    <div className={`w-3 h-3 rounded-full ${localWithTax ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <Label className="text-xs font-medium text-gray-700">Calcul TVA</Label>
                  </div>

                  {localWithTax && (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      ✓ TVA incluse
                    </div>
                  )}
                </div>
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
                <th className="border px-3 py-2 text-left font-medium">
                  Désignation
                </th>
              {/* Colonne peinture conditionnelle */}
              {hasPaintWorkforce ? (
                <th className="border px-2 py-2 text-center font-medium text-blue-600">
                  Type Peinture
                </th>
              ): (
                <th className="border text-center font-medium text-blue-600">
                  
                </th>
              )} 
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
          <SortableContext
            items={localWorkforces.map((workforce, index) => workforce.uid || workforce.id || index)}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {localWorkforces.length === 0 && (
                <tr>
                  <td colSpan={hasPaintWorkforce ? 10 : 9} className="text-center text-muted-foreground py-8">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      'Aucune ligne de main d\'œuvre'
                    )}
                  </td>
                </tr>
              )}
              {localWorkforces.map((row, i) => (
                <SortableWorkforceRow
                  key={row.uid || row.id || i}
                  row={row}
                  index={i}
                  workforceTypes={workforceTypes}
                  modifiedRows={modifiedRows}
                  newRows={newRows}
                  updateLocalWorkforce={updateLocalWorkforce}
                  handleCreateWorkforceType={handleCreateWorkforceType}
                  saveWorkforce={saveWorkforce}
                  handleRemoveRow={handleRemoveRow}
                  cancelChanges={cancelChanges}
                  hasChanges={hasChanges}
                  formatCurrency={formatCurrency}
                  getWorkforceTypeId={getWorkforceTypeId}
                  updatingId={updatingId}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </div>
    </DndContext>

      {/* Récapitulatif moderne */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-around text-xs">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Récap</div>
            <div className="text-base font-bold text-gray-800">{localWorkforces.length} ligne(s)</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total Heures</div>
            <div className="text-lg font-bold text-gray-800">{totals.hours}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Taux horaire moy.</div>
            <div className="text-base font-bold text-gray-700">
              {localWorkforces.length > 0 ? formatCurrency(totals.work_fee_total / localWorkforces.length) : '0.000'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Remise moy. (%)</div>
            <div className="text-base font-bold text-gray-700">
              {localWorkforces.length > 0 ? (totals.discount_total / localWorkforces.length).toFixed(1) : '0'}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Total HT</div>
            <div className="text-base font-bold text-green-700">{formatCurrency(totals.ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Total TTC</div>
            <div className="text-base font-bold text-purple-700">{formatCurrency(totals.ttc)}</div>
          </div>
        </div>
      </div>

      {/* Modal de création de type de main d'œuvre */}
      <WorkforceTypeMutateDialog
        open={showCreateWorkforceTypeModal}
        onOpenChange={setShowCreateWorkforceTypeModal}
        mode="create"
        onSuccess={handleWorkforceTypeCreated}
      />
    </div>
  )
} 