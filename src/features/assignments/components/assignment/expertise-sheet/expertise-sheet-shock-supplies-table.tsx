/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator, Check, GripVertical, ArrowUpDown, ChevronDown, ChevronUp, SaveAll, Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { SupplySelect } from '@/features/widgets/supply-select'
import { SupplyMutateDialog } from '@/features/expertise/fournitures/components/supply-mutate-dialog'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { useSuppliesStore } from '@/stores/supplies'
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
  id: string
  label: string
  code?: string
  description?: string
  price?: number
}

interface PaintType {
  id: string
  label: string
}

interface HourlyRate {
  id: string
  label: string
}

interface ShockWork {
  id?: string
  uid: string
  supply_id: string
  supply?: {
    id: string
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
interface ExpertiseSheetSortableSupplyRowProps {  
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

function ExpertiseSheetSortableSupplyRow({
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
}: ExpertiseSheetSortableSupplyRowProps) {
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
          value={String(row.supply_id || '')}
          onValueChange={(value) => updateLocalShockWork(index, 'supply_id', value)}
          supplies={supplies}
          placeholder={!row.supply_id ? "⚠️ Sélectionner une fourniture" : "Sélectionner..."}
          onCreateNew={() => handleCreateSupply(index)}
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
      {/* Actions basées sur isEvaluation */}
      {/* <td className="border text-center text-[10px]">
        <Checkbox 
          checked={isEvaluation ? row.control : row.disassembly} 
          onCheckedChange={v => updateLocalShockWork(index, isEvaluation ? 'control' : 'disassembly', v)} 
        />
      </td> */}
      <td className="border text-center text-[10px]">
        <Checkbox 
          checked={row.control} 
          onCheckedChange={v => updateLocalShockWork(index, 'control', v)} 
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
      {/* <td className="border px-2 text-center text-[10px] w-40">
        <Input
          type="number"
          className="w-full rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
          value={row.amount}
          onChange={e => updateLocalShockWork(index, 'amount', Number(e.target.value))}
        />
      </td> */}
      {/* Remise */}
      {/* <td className="border px-2 py-2 text-center text-[10px]">
        <Input
          type="number"
          className="rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
          value={row.discount}
          onChange={e => updateLocalShockWork(index, 'discount', Number(e.target.value))}
        />
      </td> */}
      {/* Remise Calculé */}
      {/* <td className="border px-2 py-2 text-center text-[10px] w-40">
        <div className={`font-bold ${(row.new_amount_excluding_tax || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
          {_formatCurrency(row.amount - (row.discount_amount_excluding_tax || 0))}
        </div>
      </td> */}
      {/* Vétuste (%) */}
      {/* <td className="border px-2 text-center text-[10px]">
        <Input
          type="number"
          className="rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
          value={row.obsolescence_rate}
          onChange={e => updateLocalShockWork(index, 'obsolescence_rate', Number(e.target.value))}
        />
      </td> */}
      {/* Vétuste calculée */}
      {/* <td className="border px-2 text-center text-[10px] w-40">
        <div className="text-gray-600 font-medium">
          {_formatCurrency(row.new_amount_excluding_tax || 0)}
        </div>
      </td> */}
      {/* Montant TTC */}
      {/* <td className="border px-2 py-2 text-center text-[10px] w-35">
        <div className={`font-bold ${(row.new_amount || 0) >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
          <Input
            type="number"
            className="rounded p-1 text-center border-none focus:border-none focus:ring-0 text-[10px]"
            value={row.recovery_amount || 0}
            onChange={e => updateLocalShockWork(index, 'recovery_amount', Number(e.target.value))}
          />
        </div>
      </td> */}
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

export function ExpertiseSheetShockSuppliesTable({
  supplies,
  shockWorks,
  onUpdate,
  // onAdd,
  onRemove,
  onValidateRow,
  onSupplyCreated,
  isEvaluation = false,
  // Nouvelles props pour type de peinture et taux horaire
  // paintTypes = [],
  // hourlyRates = [],
  paintTypeId,
  // hourlyRateId,
  // onPaintTypeChange,
  // onHourlyRateChange,
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
  paintTypeId?: string
  hourlyRateId?: string
  onPaintTypeChange?: (value: string) => void
  onHourlyRateChange?: (value: string) => void
  // Props pour la réorganisation
  shockId?: string
  onReorderSave?: (shockWorkIds: string[]) => Promise<void>
  hasReorderChanges?: boolean
  // Callback pour rafraîchir les données du dossier
  onAssignmentRefresh?: () => void
}) {
  // Utiliser le store de fournitures pour récupérer les détails des fournitures manquantes
  const { fetchSupplyById } = useSuppliesStore()
  // État local pour gérer les modifications et la validation
  const [localShockWorks, setLocalShockWorks] = useState<ShockWork[]>(shockWorks)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [_validatingRows, setValidatingRows] = useState<Set<number>>(new Set())
  const [newRows, setNewRows] = useState<Set<number>>(new Set()) // Lignes nouvellement ajoutées
  const [showCreateSupplyModal, setShowCreateSupplyModal] = useState(false)
  const [currentSupplyIndex, setCurrentSupplyIndex] = useState<number | null>(null)
  const [hasLocalReorderChanges, setHasLocalReorderChanges] = useState(false)
  const [tableExpanded, setTableExpanded] = useState(true)
  // État pour les fournitures récupérées dynamiquement
  const [fetchedSupplies, setFetchedSupplies] = useState<Map<string, Supply>>(new Map())
  // État pour la validation en masse
  const [isValidatingAll, setIsValidatingAll] = useState(false)
  const [validationProgress, setValidationProgress] = useState({ current: 0, total: 0 })
  const [failedValidations, setFailedValidations] = useState<Array<{ index: number; error: string; work: ShockWork }>>([])

  // Senseurs pour le drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Clé pour le localStorage basée sur le shockId
  const localStorageKey = `expertise-shock-supplies-pending-${shockId || 'new'}`

  // Sauvegarder les modifications dans le localStorage
  useEffect(() => {
    if (modifiedRows.size > 0 || newRows.size > 0) {
      const pendingData = {
        shockId,
        localShockWorks,
        modifiedRows: Array.from(modifiedRows),
        newRows: Array.from(newRows),
        timestamp: Date.now()
      }
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(pendingData))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Impossible de sauvegarder dans localStorage:', error)
      }
    } else {
      // Nettoyer le localStorage si tout est validé
      try {
        localStorage.removeItem(localStorageKey)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Impossible de nettoyer localStorage:', error)
      }
    }
  }, [localShockWorks, modifiedRows, newRows, shockId, localStorageKey])

  // Restaurer les modifications depuis le localStorage au chargement
  useEffect(() => {
    if (!shockId) return
    
    try {
      const savedData = localStorage.getItem(localStorageKey)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Vérifier que les données sont récentes (moins de 24h)
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000
        if (isRecent && parsed.shockId === shockId && parsed.localShockWorks) {
          // Demander confirmation avant de restaurer
          const shouldRestore = window.confirm(
            'Des modifications non sauvegardées ont été détectées. Voulez-vous les restaurer ?'
          )
          if (shouldRestore) {
            setLocalShockWorks(parsed.localShockWorks)
            setModifiedRows(new Set(parsed.modifiedRows || []))
            setNewRows(new Set(parsed.newRows || []))
            toast.info('Modifications restaurées')
          } else {
            localStorage.removeItem(localStorageKey)
          }
        } else {
          // Nettoyer les données anciennes
          localStorage.removeItem(localStorageKey)
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Erreur lors de la restauration depuis localStorage:', error)
    }
  }, [shockId, localStorageKey])

  // Mettre à jour les données locales quand les props changent
  // Mais préserver les lignes non validées (nouvelles ou modifiées)
  useEffect(() => {
    // Si on a des modifications en cours, fusionner intelligemment au lieu de remplacer
    if (modifiedRows.size > 0 || newRows.size > 0) {
      setLocalShockWorks(prev => {
        // Créer une map des shockWorks du serveur par leur ID pour comparaison rapide
        const serverWorksMap = new Map<string | number, ShockWork>()
        shockWorks.forEach(work => {
          if (work.id) {
            serverWorksMap.set(String(work.id), work)
          }
        })

        const merged: ShockWork[] = []
        const processedServerIds = new Set<string | number>()

        // D'abord, traiter toutes les lignes locales
        prev.forEach((localWork, localIndex) => {
          const isModified = modifiedRows.has(localIndex)
          const isNew = newRows.has(localIndex)

          // Si c'est une nouvelle ligne (sans ID), toujours la garder
          if (isNew && !localWork.id) {
            merged.push(localWork)
            return
          }

          // Si c'est une ligne modifiée ou nouvelle avec ID, garder la version locale
          if (isModified || isNew) {
            merged.push(localWork)
            if (localWork.id) {
              processedServerIds.add(String(localWork.id))
            }
            return
          }

          // Si c'est une ligne existante non modifiée, utiliser la version du serveur si disponible
          if (localWork.id) {
            const idKey = String(localWork.id)
            if (serverWorksMap.has(idKey)) {
              merged.push(serverWorksMap.get(idKey)!)
              processedServerIds.add(idKey)
            } else {
              // Si la ligne n'existe plus sur le serveur mais n'est pas marquée comme supprimée localement, la garder
              merged.push(localWork)
            }
          } else {
            // Ligne sans ID et non marquée comme nouvelle, la garder pour éviter les pertes
            merged.push(localWork)
          }
        })

        // Ensuite, ajouter les nouvelles lignes du serveur qui n'existent pas encore localement
        shockWorks.forEach(serverWork => {
          if (serverWork.id) {
            const idKey = String(serverWork.id)
            if (!processedServerIds.has(idKey)) {
              merged.push(serverWork)
            }
          }
        })

        return merged
      })
    } else {
      // Pas de modifications en cours, on peut simplement remplacer
      setLocalShockWorks(shockWorks)
    }
  }, [shockWorks, modifiedRows, newRows])

  // Récupérer automatiquement les fournitures manquantes
  useEffect(() => {
    const fetchMissingSupplies = async () => {
      const missingSupplyIds = new Set<string>()
      
      // Identifier les fournitures manquantes
      localShockWorks.forEach(work => {
        const id = String(work?.supply_id || '')
        if (id && !supplies.find(s => String(s.id) === id) && !fetchedSupplies.has(id)) {
          missingSupplyIds.add(id)
        }
      })
      
      // Récupérer les fournitures manquantes
      for (const supplyId of missingSupplyIds) {
        try {
          const maybeNum = Number(supplyId)
          if (!Number.isNaN(maybeNum) && maybeNum > 0) {
            const supply = await fetchSupplyById(maybeNum)
            setFetchedSupplies(prev => new Map(prev).set(String(supplyId), { ...supply, id: String(supply.id) }))
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération de la fourniture ${supplyId}:`, error)
        }
      }
    }
    
    fetchMissingSupplies()
  }, [localShockWorks, supplies, fetchedSupplies, fetchSupplyById])

  // Fonction de mise à jour locale
  const updateLocalShockWork = async (index: number, field: keyof ShockWork, value: any) => {
    const updated = [...localShockWorks]
    updated[index] = { ...updated[index], [field]: value }
    setLocalShockWorks(updated)
    setModifiedRows(prev => new Set([...prev, index]))
    
    // Si c'est une sélection de fourniture, récupérer ses détails si nécessaire
    if (field === 'supply_id' && value && typeof value === 'string') {
      const supplyId = value
      if (!supplies.find(s => String(s.id) === supplyId) && !fetchedSupplies.has(supplyId)) {
        try {
          const maybeNum = Number(supplyId)
          if (!Number.isNaN(maybeNum) && maybeNum > 0) {
            const supply = await fetchSupplyById(maybeNum)
            setFetchedSupplies(prev => new Map(prev).set(String(supplyId), { ...supply, id: String(supply.id) }))
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération de la fourniture ${supplyId}:`, error)
        }
      }
    }
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
      .filter(work => work.id && work.id) // Seulement les éléments avec un ID valide (pas les nouveaux)
      .map(work => String(work.id!))
    
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
      supply_id: '',
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
      updateLocalShockWork(currentSupplyIndex, 'supply_id', String(newSupply.id))
      setCurrentSupplyIndex(null)
    } else {
      // Si créé depuis le bouton principal, ajouter une nouvelle ligne avec la fourniture
      handleAddNewRow()
      // La nouvelle ligne sera ajoutée avec la fourniture sélectionnée
      setTimeout(() => {
        const newIndex = localShockWorks.length
        updateLocalShockWork(newIndex, 'supply_id', String(newSupply.id))
      }, 100)
    }
    onSupplyCreated?.(newSupply)
  }

  // Fonction de validation en masse de toutes les lignes modifiées/nouvelles
  const handleValidateAll = async () => {
    const allPendingIndices = Array.from(new Set([...modifiedRows, ...newRows])).sort((a, b) => a - b)
    
    if (allPendingIndices.length === 0) {
      toast.info('Aucune modification à valider')
      return
    }

    setIsValidatingAll(true)
    setValidationProgress({ current: 0, total: allPendingIndices.length })
    setFailedValidations([])

    const successful: number[] = []
    const failed: Array<{ index: number; error: string; work: ShockWork }> = []

    try {
      // Séparer les nouvelles lignes et les lignes modifiées
      const newIndices = allPendingIndices.filter(idx => newRows.has(idx))
      const modifiedIndices = allPendingIndices.filter(idx => !newRows.has(idx))

      // Traiter d'abord les nouvelles lignes (peuvent être groupées)
      if (newIndices.length > 0) {
        if (!shockId || !paintTypeId) {
          toast.error('ID du choc ou type de peinture manquant')
          setIsValidatingAll(false)
          return
        }

        // Grouper les nouvelles lignes par batch de 10 pour éviter les timeouts
        const batchSize = 10
        for (let i = 0; i < newIndices.length; i += batchSize) {
          const batch = newIndices.slice(i, i + batchSize)
          
          try {
            const payload = {
              shock_id: shockId,
              paint_type_id: paintTypeId || '',
              shock_works: batch.map(index => {
                const work = localShockWorks[index]
                return {
                  supply_id: String(work.supply_id || ''),
                  disassembly: work.disassembly,
                  replacement: work.replacement,
                  repair: work.repair,
                  paint: work.paint,
                  obsolescence: work.obsolescence || false,
                  control: work.control,
                  obsolescence_rate: Number(work.obsolescence_rate),
                  recovery_amount: Number(work.recovery_amount || 0),
                  discount: Number(work.discount),
                  amount: Number(work.amount),
                  comment: work.comment || ""
                }
              })
            }

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 30000)
            )

            await Promise.race([
              axiosInstance.post(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}`, payload),
              timeoutPromise
            ])

            // Marquer toutes les lignes du batch comme réussies
            batch.forEach(index => {
              successful.push(index)
              setValidationProgress(prev => ({ ...prev, current: prev.current + 1 }))
            })
          } catch (error: any) {
            // En cas d'erreur sur un batch, marquer toutes les lignes comme échouées
            batch.forEach(index => {
              failed.push({
                index,
                error: error.message || 'Erreur lors de la création',
                work: localShockWorks[index]
              })
            })
          }
        }
      }

      // Traiter les lignes modifiées individuellement
      for (const index of modifiedIndices) {
        try {
          const work = localShockWorks[index]
          await onUpdate(index, work)
          await onValidateRow(index)
          successful.push(index)
          setValidationProgress(prev => ({ ...prev, current: prev.current + 1 }))
        } catch (error: any) {
          failed.push({
            index,
            error: error.message || 'Erreur lors de la mise à jour',
            work: localShockWorks[index]
          })
        }
      }

      // Mettre à jour les états
      const successfulSet = new Set(successful)
      setModifiedRows(prev => {
        const newSet = new Set(prev)
        successfulSet.forEach(idx => newSet.delete(idx))
        return newSet
      })
      setNewRows(prev => {
        const newSet = new Set(prev)
        successfulSet.forEach(idx => newSet.delete(idx))
        return newSet
      })

      // Afficher les résultats
      if (failed.length === 0) {
        toast.success(`Toutes les ${successful.length} modification(s) ont été validées avec succès`)
        // Rafraîchir les données
        if (onAssignmentRefresh) {
          onAssignmentRefresh()
        }
        // Nettoyer le localStorage
        try {
          localStorage.removeItem(localStorageKey)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Erreur lors du nettoyage localStorage:', error)
        }
      } else {
        setFailedValidations(failed)
        toast.warning(
          `${successful.length} modification(s) validée(s), ${failed.length} échec(s)`,
          { duration: 5000 }
        )
      }
    } catch (error: any) {
      toast.error('Erreur lors de la validation en masse')
      // eslint-disable-next-line no-console
      console.error('Erreur validation en masse:', error)
    } finally {
      setIsValidatingAll(false)
      setValidationProgress({ current: 0, total: 0 })
    }
  }

  // Fonction pour réessayer les validations échouées
  const handleRetryFailed = async () => {
    if (failedValidations.length === 0) return

    setIsValidatingAll(true)
    setValidationProgress({ current: 0, total: failedValidations.length })

    const retrySuccessful: number[] = []
    const retryFailed: Array<{ index: number; error: string; work: ShockWork }> = []

    for (const { index, work } of failedValidations) {
      try {
        if (newRows.has(index)) {
          // Nouvelle ligne
          if (!shockId || !paintTypeId) {
            retryFailed.push({ index, error: 'ID du choc ou type de peinture manquant', work })
            continue
          }

          const payload = {
            shock_id: shockId,
            paint_type_id: paintTypeId || '',
            shock_works: [{
              supply_id: String(work.supply_id || ''),
              disassembly: work.disassembly,
              replacement: work.replacement,
              repair: work.repair,
              paint: work.paint,
              obsolescence: work.obsolescence || false,
              control: work.control,
              obsolescence_rate: Number(work.obsolescence_rate),
              recovery_amount: Number(work.recovery_amount || 0),
              discount: Number(work.discount),
              amount: Number(work.amount),
              comment: work.comment || ""
            }]
          }

          await axiosInstance.post(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}`, payload)
        } else {
          // Ligne modifiée
          await onUpdate(index, work)
          await onValidateRow(index)
        }

        retrySuccessful.push(index)
        setValidationProgress(prev => ({ ...prev, current: prev.current + 1 }))
      } catch (error: any) {
        retryFailed.push({
          index,
          error: error.message || 'Erreur lors de la nouvelle tentative',
          work
        })
      }
    }

    // Mettre à jour les états
    const successfulSet = new Set(retrySuccessful)
    setModifiedRows(prev => {
      const newSet = new Set(prev)
      successfulSet.forEach(idx => newSet.delete(idx))
      return newSet
    })
    setNewRows(prev => {
      const newSet = new Set(prev)
      successfulSet.forEach(idx => newSet.delete(idx))
      return newSet
    })

    if (retryFailed.length === 0) {
      toast.success('Toutes les tentatives de réessai ont réussi')
      setFailedValidations([])
      if (onAssignmentRefresh) {
        onAssignmentRefresh()
      }
      try {
        localStorage.removeItem(localStorageKey)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Erreur lors du nettoyage localStorage:', error)
      }
    } else {
      setFailedValidations(retryFailed)
      toast.warning(
        `${retrySuccessful.length} réessai(s) réussi(s), ${retryFailed.length} échec(s) restant(s)`
      )
    }

    setIsValidatingAll(false)
    setValidationProgress({ current: 0, total: 0 })
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
          shock_id: shockId,
          paint_type_id: paintTypeId || '',
          shock_works: [
            {
              supply_id: String(shockWork.supply_id || ''),
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
        
        // Appel API direct avec timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 15000)
        )
        
        await Promise.race([
          axiosInstance.post(`${API_CONFIG.ENDPOINTS.SHOCK_WORKS}`, payload),
          timeoutPromise
        ])
        
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
      
      // Nettoyer le localStorage si plus de modifications
      if (modifiedRows.size === 1 && newRows.size === 0) {
        try {
          localStorage.removeItem(localStorageKey)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Erreur lors du nettoyage localStorage:', error)
        }
      }
    } catch (error: any) {
      if (error.message === 'Timeout') {
        toast.error('Délai d\'attente dépassé. Le dossier contient beaucoup de données.')
      } else {
        toast.error(newRows.has(index) ? 'Erreur lors de la création de la fourniture' : 'Erreur lors de la mise à jour')
      }
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

  // Construire une liste de fournitures qui inclut celles manquantes présentes dans les lignes pré-remplies
  const combinedSupplies: Supply[] = useMemo(() => {
    const byId = new Map<string, Supply>()
    
    // D'abord, ajouter toutes les fournitures existantes
    ;(supplies || []).forEach((s) => {
      if (s && typeof s.id !== 'undefined') byId.set(String(s.id), { ...s, id: String(s.id) })
    })
    
    // Ajouter les fournitures récupérées dynamiquement
    fetchedSupplies.forEach((supply, id) => {
      byId.set(String(id), { ...supply, id: String(supply.id) })
    })
    
    // Ensuite, traiter les fournitures des lignes de travail
    ;(localShockWorks || []).forEach((work) => {
      const id = String(work?.supply_id || '')
      if (id) {
        // Si la fourniture n'existe pas encore dans la liste, la créer
        if (!byId.has(String(id))) {
          // Essayer de trouver la fourniture dans la liste des fournitures disponibles
          const foundSupply = supplies.find(s => String(s.id) === String(id))
          
          if (foundSupply) {
            // Utiliser les données de la fourniture trouvée
            byId.set(String(id), { ...foundSupply, id: String(foundSupply.id) })
          } else {
            // Fallback : utiliser les données disponibles dans work ou créer un placeholder
            const label = work?.supply_label || work?.supply?.label || `Fourniture #${id}`
            byId.set(id, {
              id: String(id),
              label,
              code: work?.supply?.code,
              price: work?.supply?.price,
            } as Supply)
          }
        } else {
          // Si elle existe mais a un supply_label plus récent, mettre à jour le label
          const existingSupply = byId.get(String(id))!
          const newLabel = work?.supply_label || work?.supply?.label
          if (newLabel && newLabel !== existingSupply.label) {
            byId.set(String(id), {
              ...existingSupply,
              label: newLabel
            })
          }
        }
      }
    })
    
    return Array.from(byId.values())
  }, [supplies, localShockWorks, fetchedSupplies])


  return (
    <div className="space-y-3">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Fourniture(s)
          </h4>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setTableExpanded(!tableExpanded)}
            className="p-1 h-6 w-6"
          >
            {tableExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          {/* Bouton de validation en masse */}
          {(modifiedRows.size > 0 || newRows.size > 0) && (
            <Button 
              variant="default" 
              size="xs"
              onClick={handleValidateAll}
              disabled={isValidatingAll}
              className="bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              {isValidatingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validation... ({validationProgress.current}/{validationProgress.total})
                </>
              ) : (
                <>
                  <SaveAll className="mr-2 h-4 w-4" />
                  {/* Valider toutes les ({modifiedRows.size + newRows.size}) ligne(s) */}
                  Valider les ligne(s)
                </>
              )}
            </Button>
          )}
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
          {/* <Button 
            variant="outline" 
            size="xs"
            onClick={() => handleCreateSupply(-1)}
            className="text-yellow-600 text-xs border-yellow-200 hover:bg-yellow-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer une fourniture  
          </Button> */}
          {/* <Button onClick={handleAddNewRow} size="xs" className="text-white text-xs">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne de fourniture
          </Button> */}
        </div>
      </div>

     

      {tableExpanded ? (
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
                    Remp
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Rep
                  </th>
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Peint
                  </th>
                  {/* <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    {isEvaluation ? 'Ctrl' : 'D/p'}
                  </th> */}
                  <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Ctrl
                  </th>
                  {!isEvaluation && (
                    <th className="border px-2 py-2 text-center font-medium text-[10px]">
                      Vét
                    </th>
                  )}
                  {/* <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Montant HT
                  </th> */}
                  {/* <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Remise
                  </th> */}
                  {/* <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Remise Calculé
                  </th> */}
                  {/* <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Vétuste (%)
                  </th> */}
                  {/* <th className="border px-2 py-2 text-center font-medium text-[10px]">
                    Vétuste calculée
                  </th> */}
                  {/* <th className="border px-2 py-2 text-center font-medium text-purple-600 text-[10px]">
                    Montant TTC
                  </th> */}
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
                    <ExpertiseSheetSortableSupplyRow
                      key={row.uid}
                      row={row}
                      index={i}
                      supplies={combinedSupplies}
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
      ) : (
        // Vue réduite avec informations compactes et design moderne
        <div className="space-y-4">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Total Fournitures</p>
                  <p className="text-2xl font-bold text-blue-800">{localShockWorks.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">Montant Final</p>
                  <p className="text-lg font-bold text-green-800">{formatCurrency(totals.new)}</p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">€</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">Vétusté</p>
                  <p className="text-lg font-bold text-purple-800">{formatCurrency(totals.obsolescence)}</p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium">Remise</p>
                  <p className="text-lg font-bold text-orange-800">{formatCurrency(totals.discount_amount)}</p>
                </div>
                <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-end'>
        <Button onClick={handleAddNewRow} size="xs" className="text-white text-xs">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne de fourniture
        </Button>
      </div>

      {/* Affichage des erreurs de validation */}
      {failedValidations.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-semibold text-red-800">
              {failedValidations.length} validation(s) échouée(s)
            </h5>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={handleRetryFailed}
                disabled={isValidatingAll}
                className="text-red-600 border-red-200 hover:bg-red-100"
              >
                Réessayer
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setFailedValidations([])}
                className="text-red-600 hover:bg-red-100"
              >
                Ignorer
              </Button>
            </div>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {failedValidations.map(({ index, error, work }) => (
              <div key={index} className="text-xs text-red-700">
                <span className="font-medium">Ligne {index + 1}:</span> {work.supply_label || work.supply_id} - {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Récapitulatif moderne */}
      {tableExpanded && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
        <div className="text-xs flex flex-wrap gap-4 justify-around">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total lignes</div>
            <div className="text-lg font-bold text-gray-800">{localShockWorks.length}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Vetusté TTC</div>
            <div className="text-base font-bold text-gray-700">{formatCurrency(totals.obsolescence)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Remise TTC</div>
            <div className="text-base font-bold text-gray-700">{formatCurrency(totals.discount_amount)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Récupération TTC</div>
            <div className="text-base font-bold text-gray-700">{formatCurrency(totals.recovery)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Montant Final HT</div>
            <div className={`text-base font-bold ${totals.new_ht >= 0 ? 'text-gray-700' : 'text-red-600'}`}>
              {formatCurrency(totals.new_ht)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Montant Final TTC</div>
            <div className={`text-base font-bold ${totals.new >= 0 ? 'text-gray-700' : 'text-red-600'}`}>
              {formatCurrency(totals.new)}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Modal de création de fourniture */}
      <SupplyMutateDialog
        open={showCreateSupplyModal}
        onOpenChange={setShowCreateSupplyModal}
        onSuccess={handleSupplyCreated}
      />
    </div>
  )
}