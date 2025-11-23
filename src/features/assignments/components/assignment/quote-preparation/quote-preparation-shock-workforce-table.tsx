/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Calculator, Loader2, Check, X, GripVertical, ArrowUpDown, ChevronDown, ChevronUp, SaveAll } from 'lucide-react'
import { toast } from 'sonner'
import { workforceService } from '@/services/workforce-service'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
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
  id: string
  label: string
}

interface HourlyRate {
  id: string
  label: string
}

interface Workforce {
  uid?: string
  id?: string | number
  workforce_type_id: string | number
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
  hourly_rate_id?: string
  paint_type_id?: string
  // Champ pour la peinture partielle/totale (workforce_type_id = 1)
  all_paint?: boolean
  // Additional fields for display
  workforce_type?: {
    id: string | number
    code: string
    label: string
    description?: string
  }
  // Nouvelles clés de l'API
  paint_type?: {
    id: string
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  hourly_rate?: {
    id: string
    value: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
}

interface QuotePreparationShockWorkforceTableV2Props {
  shockId: string | number
  workforces: Workforce[]
  onUpdate: (updatedWorkforces: Workforce[]) => void
  onAdd?: (workforceData?: any) => Promise<void> // Prop optionnelle - maintenant géré en interne
  onAssignmentRefresh?: () => void // Callback pour rafraîchir les données du dossier
  // Nouvelles props pour la cohérence avec shock-workforce-table.tsx
  workforceTypes?: any[]
  paintTypes?: PaintType[]
  hourlyRates?: HourlyRate[]
  paintTypeId?: string
  hourlyRateId?: string
  withTax?: boolean
  onPaintTypeChange?: (value: string) => void
  onHourlyRateChange?: (value: string) => void
  onWithTaxChange?: (value: boolean) => void
  onWorkforceTypeCreated?: (newWorkforceType: any) => void
  // Props pour la réorganisation
  onReorderSave?: (workforceIds: string[] | number[]) => Promise<void>
  hasReorderChanges?: boolean
}

// Composant pour une ligne triable
interface QuotePreparationSortableWorkforceRowProps {
  row: Workforce
  index: number
  workforceTypes: WorkforceType[]
  modifiedRows: Set<number>
  newRows: Set<number>
  updateLocalWorkforce: (index: number, field: keyof Workforce, value: any) => void
  handleCreateWorkforceType: (index: number) => void
  handleValidateRow: (index: number) => Promise<void>
  handleRemoveRow: (index: number) => Promise<void>
  cancelChanges: (index: number) => void
  hasChanges: (index: number) => boolean
  formatCurrency: (amount: number | string) => string
  getWorkforceTypeId: (workforce: Workforce) => string | number
  updatingId: string | number | null
}

function QuotePreparationSortableWorkforceRow({
  row,
  index,
  workforceTypes,
  modifiedRows,
  newRows,
  updateLocalWorkforce,
  handleCreateWorkforceType,
  handleValidateRow,
  handleRemoveRow,
  cancelChanges,
  hasChanges,
  formatCurrency,
  getWorkforceTypeId,
  updatingId
}: QuotePreparationSortableWorkforceRowProps) {
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
          value={(() => {
            const idVal = getWorkforceTypeId(row)
            if (!idVal || idVal === '' || idVal === 0 || String(idVal) === '0') return ''
            return String(idVal)
          })()}
          onValueChange={(value) => updateLocalWorkforce(index, 'workforce_type_id', String(value))}
          workforceTypes={workforceTypes as any}
          placeholder={!getWorkforceTypeId(row) ? "⚠️ Sélectionner un type" : "Sélectionner..."}
          onCreateNew={() => handleCreateWorkforceType(index)}
        />
      </td>
            {/* Colonne peinture partielle/totale si workforce_type_id = 1 */}
      {(row.workforce_type_id === 1 || String(row.workforce_type_id) === '1' || String(row.workforce_type_id) === 'workforcetype_eLgoNjw3jE0MB') ? (
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
              onClick={() => handleValidateRow(index)}
              disabled={updatingId === String(row.id || index)}
              className="h-5 w-5 hover:bg-green-50 hover:text-green-600"
              title={newRows.has(index) ? "Valider l'ajout" : "Sauvegarder"}
            >
              {String(updatingId) === String(row.id || index) ? (
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

export function QuotePreparationShockWorkforceTable({
  shockId,
  workforces,
  onUpdate,
  onAdd: _onAdd, // Préfixé pour indiquer qu'il n'est pas utilisé
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
}: QuotePreparationShockWorkforceTableV2Props) {
  const [localWorkforces, setLocalWorkforces] = useState<Workforce[]>(workforces)
  const [updatingId, setUpdatingId] = useState<string | number | null>(null)
  const [originalValues, setOriginalValues] = useState<Record<string | number, Partial<Workforce>>>({})
  const [newRows, setNewRows] = useState<Set<number>>(new Set()) // Lignes nouvellement ajoutées
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set()) // Lignes modifiées
  const [showCreateWorkforceTypeModal, setShowCreateWorkforceTypeModal] = useState(false)
  const [currentWorkforceIndex, setCurrentWorkforceIndex] = useState<number | null>(null)
  const [localWithTax, setLocalWithTax] = useState<boolean>(withTax)
  const [updatingWithTax, setUpdatingWithTax] = useState<boolean>(false)
  const [updatingPaintType, setUpdatingPaintType] = useState<boolean>(false)
  const [updatingHourlyRate, setUpdatingHourlyRate] = useState<boolean>(false)
  const [hasLocalReorderChanges, setHasLocalReorderChanges] = useState(false)
  const [tableExpanded, setTableExpanded] = useState(true)
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null)
  // État pour la validation en masse
  const [isValidatingAll, setIsValidatingAll] = useState(false)
  const [validationProgress, setValidationProgress] = useState({ current: 0, total: 0 })
  const [failedValidations, setFailedValidations] = useState<Array<{ index: number; error: string; workforce: Workforce }>>([])

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

  // Clé pour le localStorage basée sur le shockId
  const localStorageKey = `shock-workforce-pending-${shockId || 'new'}`

  // Sauvegarder les modifications dans le localStorage
  useEffect(() => {
    if (modifiedRows.size > 0 || newRows.size > 0) {
      const pendingData = {
        shockId,
        localWorkforces,
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
  }, [localWorkforces, modifiedRows, newRows, shockId, localStorageKey])

  // Restaurer les modifications depuis le localStorage au chargement
  useEffect(() => {
    if (!shockId) return
    
    try {
      const savedData = localStorage.getItem(localStorageKey)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Vérifier que les données sont récentes (moins de 24h)
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000
        if (isRecent && parsed.shockId === shockId && parsed.localWorkforces) {
          // Demander confirmation avant de restaurer
          const shouldRestore = window.confirm(
            'Des modifications non sauvegardées ont été détectées. Voulez-vous les restaurer ?'
          )
          if (shouldRestore) {
            setLocalWorkforces(parsed.localWorkforces)
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
      setLocalWorkforces(prev => {
        // Créer une map des workforces du serveur par leur ID pour comparaison rapide
        const serverWorkforcesMap = new Map<string | number, Workforce>()
        workforces.forEach(workforce => {
          if (workforce.id) {
            serverWorkforcesMap.set(String(workforce.id), workforce)
          }
        })

        const merged: Workforce[] = []
        const processedServerIds = new Set<string | number>()

        // D'abord, traiter toutes les lignes locales
        prev.forEach((localWorkforce, localIndex) => {
          const isModified = modifiedRows.has(localIndex)
          const isNew = newRows.has(localIndex)

          // Si c'est une nouvelle ligne (sans ID), toujours la garder
          if (isNew && !localWorkforce.id) {
            merged.push(localWorkforce)
            return
          }

          // Si c'est une ligne modifiée ou nouvelle avec ID, garder la version locale
          if (isModified || isNew) {
            merged.push(localWorkforce)
            if (localWorkforce.id) {
              processedServerIds.add(String(localWorkforce.id))
            }
            return
          }

          // Si c'est une ligne existante non modifiée, utiliser la version du serveur si disponible
          if (localWorkforce.id) {
            const idKey = String(localWorkforce.id)
            if (serverWorkforcesMap.has(idKey)) {
              merged.push(serverWorkforcesMap.get(idKey)!)
              processedServerIds.add(idKey)
            } else {
              // Si la ligne n'existe plus sur le serveur mais n'est pas marquée comme supprimée localement, la garder
              merged.push(localWorkforce)
            }
          } else {
            // Ligne sans ID et non marquée comme nouvelle, la garder pour éviter les pertes
            merged.push(localWorkforce)
          }
        })

        // Ensuite, ajouter les nouvelles lignes du serveur qui n'existent pas encore localement
        workforces.forEach(serverWorkforce => {
          if (serverWorkforce.id) {
            const idKey = String(serverWorkforce.id)
            if (!processedServerIds.has(idKey)) {
              merged.push(serverWorkforce)
            }
          }
        })

        return merged
      })
    } else {
      // Pas de modifications en cours, on peut simplement remplacer
    setLocalWorkforces(workforces)
    }
  }, [workforces, modifiedRows, newRows])

  // Synchroniser les données locales avec les props externes (paintTypeId, hourlyRateId)
  useEffect(() => {
    if (paintTypeId && hourlyRateId) {
      setLocalWorkforces(prev => {
        // Éviter la boucle infinie en vérifiant si les données ont vraiment changé
        const needsUpdate = prev.some(workforce => 
          workforce.paint_type_id !== paintTypeId || workforce.hourly_rate_id !== hourlyRateId
        )
        
        if (needsUpdate) {
          return prev.map(workforce => ({
            ...workforce,
            paint_type_id: paintTypeId,
            hourly_rate_id: hourlyRateId
          }))
        }
        
        return prev // Retourner la référence existante si pas de changement
      })
    }
  }, [paintTypeId, hourlyRateId])

  // Debug: Afficher les valeurs reçues (commenté pour éviter l'erreur de linter)
  // useEffect(() => {
  //   console.log('🔍 ShockWorkforceTableV2 Debug:', {
  //     paintTypeId,
  //     hourlyRateId,
  //     withTax,
  //     workforcesCount: workforces.length,
  //     firstWorkforce: workforces[0],
  //     paintTypesCount: paintTypes.length,
  //     hourlyRatesCount: hourlyRates.length
  //   })
  // }, [paintTypeId, hourlyRateId, withTax, workforces, paintTypes, hourlyRates])

  // Mettre à jour localWithTax quand la prop withTax change
  useEffect(() => {
    if (withTax !== undefined) {
      setLocalWithTax(withTax)
    }
  }, [withTax])

  // Charger les données nécessaires seulement si pas fournies en props
  // Utiliser un ref pour éviter les appels multiples
  const dataLoadedRef = useRef(false)
  
  useEffect(() => {
    // Si les données sont déjà chargées via ref, ne pas recharger
    if (dataLoadedRef.current) return
    
    const loadData = async () => {
      // Vérifier si les données externes sont fournies ET non vides
      const hasExternalWorkforceTypes = externalWorkforceTypes && externalWorkforceTypes.length > 0
      const hasExternalHourlyRates = externalHourlyRates && externalHourlyRates.length > 0
      const hasExternalPaintTypes = externalPaintTypes && externalPaintTypes.length > 0
      
      // Si toutes les données sont fournies, ne pas charger
      if (hasExternalWorkforceTypes && hasExternalHourlyRates && hasExternalPaintTypes) {
        dataLoadedRef.current = true
        return
      }
      
      // Charger seulement les données manquantes
      try {
        dataLoadedRef.current = true
          // Ajouter un timeout pour éviter le blocage
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
          
          await Promise.race([
            Promise.all([
            !hasExternalWorkforceTypes && fetchWorkforceTypes(),
            !hasExternalHourlyRates && fetchHourlyRates(),
            !hasExternalPaintTypes && fetchPaintTypes()
            ].filter(Boolean)),
            timeoutPromise
          ])
        } catch (_error) {
        // Ne pas afficher d'erreur si les données sont déjà disponibles via les stores
        if (!hasExternalWorkforceTypes || !hasExternalHourlyRates || !hasExternalPaintTypes) {
          // toast.error('Erreur lors du chargement des données (timeout)')
        }
        dataLoadedRef.current = false // Réinitialiser en cas d'erreur
      }
    }

    loadData()
  }, [fetchWorkforceTypes, fetchHourlyRates, fetchPaintTypes, externalWorkforceTypes, externalHourlyRates, externalPaintTypes])

  // Nettoyer le timeout à la destruction du composant
  useEffect(() => {
    return () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
    }
  }, [refreshTimeout])

  // Fonction pour obtenir l'ID du type de main d'œuvre
  const getWorkforceTypeId = (workforce: Workforce): string | number => {
    if (workforce.workforce_type_id) {
      const idStr = String(workforce.workforce_type_id)
      if (idStr && idStr !== '0' && idStr !== '') {
        return workforce.workforce_type_id
      }
    }
    if (workforce.workforce_type?.id) {
      const idStr = String(workforce.workforce_type.id)
      if (idStr && idStr !== '0' && idStr !== '') {
        return workforce.workforce_type.id
      }
    }
    return ''
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

  // Fonction pour rafraîchir les données avec délai pour éviter les appels trop fréquents
  const delayedRefresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
    }
    
    const timeout = setTimeout(() => {
      if (onAssignmentRefresh) {
        onAssignmentRefresh()
      }
      setRefreshTimeout(null)
    }, 2000) // Délai de 2 secondes pour éviter les appels trop fréquents
    
    setRefreshTimeout(timeout)
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
      .filter(workforce => workforce.id) // Seulement les éléments avec un ID valide (pas les nouveaux)
      .map(workforce => String(workforce.id!))
    
    if (workforceIds.length === 0) {
      toast.error('Aucun élément à réorganiser trouvé')
      return
    }
    
    await onReorderSave(workforceIds)
    setHasLocalReorderChanges(false)
    
    // Réinitialiser les états de modification après réorganisation réussie
    setModifiedRows(new Set())
    setNewRows(new Set())
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
        workforce_type_id: String(getWorkforceTypeId(workforce)),
        nb_hours: Number(workforce.nb_hours),
        discount: Number(workforce.discount),
        // hourly_rate_id: workforce.hourly_rate_id || (hourlyRates.length > 0 ? hourlyRates[0].id : ""),
        hourly_rate_id: hourlyRateId || '',
        // paint_type_id: workforce.paint_type_id || (paintTypes.length > 0 ? paintTypes[0].id : ""),
        paint_type_id: paintTypeId || '',
        with_tax: localWithTax,
        all_paint: workforce.all_paint || false
      }

      // Appel API pour mettre à jour
      await workforceService.updateWorkforce(String(workforce.id), updateData)
      
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
      
      // Retirer la ligne des lignes modifiées après sauvegarde réussie
      setModifiedRows(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
      
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
        updateLocalWorkforce(index, 'all_paint', original.all_paint)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  // Fonction pour ajouter une nouvelle ligne localement
  const handleAddNewRow = () => {
      const newWorkforce: Workforce = {
      uid: crypto.randomUUID(),
      workforce_type_id: '',
      nb_hours: 0,
      discount: 0,
      with_tax: localWithTax,
      work_fee: 0,
      amount_excluding_tax: 0,
      amount_tax: 0,
      amount: 0,
      // hourly_rate_id: hourlyRates.length > 0 ? hourlyRates[0].id : '',
      hourly_rate_id: hourlyRateId || '',
      // paint_type_id: paintTypes.length > 0 ? paintTypes[0].id : '',
      paint_type_id: paintTypeId || '',
      // Initialiser les nouvelles propriétés
      paint_type: paintTypes.length > 0 ? {
        id: String(paintTypes[0].id),
        code: paintTypes[0].label,
        label: paintTypes[0].label,
        description: paintTypes[0].label,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } : undefined,
      hourly_rate: hourlyRates.length > 0 ? {
        id: String(hourlyRates[0].id),
        value: hourlyRates[0].label,
        label: hourlyRates[0].label,
        description: hourlyRates[0].label,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } : undefined,
      all_paint: false // Initialiser all_paint à false pour les nouvelles lignes
    }
    
    const updated = [...localWorkforces, newWorkforce]
    setLocalWorkforces(updated)
    setNewRows(prev => new Set([...prev, updated.length - 1]))
    setModifiedRows(prev => new Set([...prev, updated.length - 1]))
    // Ne pas appeler onUpdate ici, seulement lors de la validation
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
    const failed: Array<{ index: number; error: string; workforce: Workforce }> = []

    try {
      // Séparer les nouvelles lignes et les lignes modifiées
      const newIndices = allPendingIndices.filter(idx => newRows.has(idx))
      const modifiedIndices = allPendingIndices.filter(idx => !newRows.has(idx))

      // Traiter d'abord les nouvelles lignes (peuvent être groupées)
      if (newIndices.length > 0) {
        if (!shockId) {
          toast.error('ID du choc manquant')
          setIsValidatingAll(false)
          return
        }

        // Grouper les nouvelles lignes par batch de 10 pour éviter les timeouts
        const batchSize = 10
        for (let i = 0; i < newIndices.length; i += batchSize) {
          const batch = newIndices.slice(i, i + batchSize)
          
          try {
            const payload = {
              shock_id: String(shockId),
              hourly_rate_id: hourlyRateId || "1",
              with_tax: localWithTax ? 1 : 0,
              paint_type_id: paintTypeId || "1",
              workforces: batch.map(index => {
                const workforce = localWorkforces[index]
                return {
                  workforce_type_id: String(getWorkforceTypeId(workforce)),
                  nb_hours: Number(workforce.nb_hours),
                  discount: Number(workforce.discount),
                  all_paint: workforce.all_paint || false
                }
              })
            }

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 30000)
            )

            await Promise.race([
              axiosInstance.post(`${API_CONFIG.ENDPOINTS.WORKFORCES}`, payload),
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
                workforce: localWorkforces[index]
              })
            })
          }
        }
      }

      // Traiter les lignes modifiées individuellement
      for (const index of modifiedIndices) {
        try {
          await saveWorkforce(index)
          successful.push(index)
          setValidationProgress(prev => ({ ...prev, current: prev.current + 1 }))
        } catch (error: any) {
          failed.push({
            index,
            error: error.message || 'Erreur lors de la mise à jour',
            workforce: localWorkforces[index]
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
          delayedRefresh()
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
    const retryFailed: Array<{ index: number; error: string; workforce: Workforce }> = []

    for (const { index, workforce } of failedValidations) {
      try {
        if (newRows.has(index)) {
          // Nouvelle ligne
          if (!shockId) {
            retryFailed.push({ index, error: 'ID du choc manquant', workforce })
            continue
          }

          const payload = {
            shock_id: String(shockId),
            hourly_rate_id: hourlyRateId || "1",
            with_tax: localWithTax ? 1 : 0,
            paint_type_id: paintTypeId || "1",
            workforces: [{
              workforce_type_id: String(getWorkforceTypeId(workforce)),
              nb_hours: Number(workforce.nb_hours),
              discount: Number(workforce.discount),
              all_paint: workforce.all_paint || false
            }]
          }

          await axiosInstance.post(`${API_CONFIG.ENDPOINTS.WORKFORCES}`, payload)
        } else {
          // Ligne modifiée
          await saveWorkforce(index)
        }

        retrySuccessful.push(index)
        setValidationProgress(prev => ({ ...prev, current: prev.current + 1 }))
      } catch (error: any) {
        retryFailed.push({
          index,
          error: error.message || 'Erreur lors de la nouvelle tentative',
          workforce
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
        delayedRefresh()
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
    const workforce = localWorkforces[index]
    
    if (newRows.has(index)) {
      // Nouvelle ligne, faire l'appel API POST avec le nouveau payload
      try {
        setUpdatingId(workforce.id || index)
        
        // Construire le payload selon l'API
        const payload = {
          shock_id: String(shockId),
          hourly_rate_id: hourlyRateId || "1",
          with_tax: localWithTax ? 1 : 0,
          paint_type_id: paintTypeId || "1",
          workforces: [
            {
              workforce_type_id: String(getWorkforceTypeId(workforce)),
              nb_hours: Number(workforce.nb_hours),
              discount: Number(workforce.discount),
              all_paint: workforce.all_paint || false
            }
          ]
        }
        
        // Appel API direct
        await axiosInstance.post(`${API_CONFIG.ENDPOINTS.WORKFORCES}`, payload)
        
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
        
        // Rafraîchir les données du dossier avec délai
        delayedRefresh()
      } catch (error: any) {
        void error // Ignore l'erreur pour le linting
        toast.error('Erreur lors de la création de la main d\'œuvre')
      } finally {
        setUpdatingId(null)
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
        await workforceService.deleteWorkforce(String(workforce.id))
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
        updateLocalWorkforce(index, 'hourly_rate_id', original.hourly_rate?.id ? String(original.hourly_rate.id) : undefined)
        updateLocalWorkforce(index, 'paint_type_id', original.paint_type?.id ? String(original.paint_type.id) : undefined)
        updateLocalWorkforce(index, 'paint_type', original.paint_type)
        updateLocalWorkforce(index, 'hourly_rate', original.hourly_rate)
        updateLocalWorkforce(index, 'all_paint', original.all_paint)
        
        // Retirer la ligne des lignes modifiées après restauration
        setModifiedRows(prev => {
          const newSet = new Set(prev)
          newSet.delete(index)
          return newSet
        })
      }
    }
  }

  // Fonction pour vérifier si une ligne a été modifiée
  const hasChanges = (index: number) => {
    return modifiedRows.has(index) || newRows.has(index)
  }

  // Fonction pour gérer le changement de type de peinture
  const handlePaintTypeChange = async (value: string) => {
    
    // Appeler le callback parent en premier pour mettre à jour la prop
    onPaintTypeChange?.(value)
    
    // Mettre à jour toutes les workforces locales avec le nouveau paint_type
    // Normaliser les IDs pour la comparaison (peut être string ou number selon la source)
    const selectedPaintType = paintTypes.find(pt => {
      const ptId = String(pt.id || '')
      const valueNormalized = String(value || '')
      return ptId === valueNormalized
    })
    
    if (selectedPaintType) {
      const updatedWorkforces = localWorkforces.map(workforce => ({
        ...workforce,
        paint_type_id: value,
        paint_type: {
          id: String(selectedPaintType.id),
          code: selectedPaintType.label,
          label: selectedPaintType.label,
          description: selectedPaintType.label,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }))
      setLocalWorkforces(updatedWorkforces)
    } else {
      // Si le type de peinture n'est pas trouvé, mettre à jour quand même l'ID
      const updatedWorkforces = localWorkforces.map(workforce => ({
        ...workforce,
        paint_type_id: value
      }))
      setLocalWorkforces(updatedWorkforces)
    }
    
    // Mettre à jour toutes les workforces existantes via l'API
    const existingWorkforces = localWorkforces.filter(w => w.id)
    if (existingWorkforces.length > 0) {
      setUpdatingPaintType(true)
      try {
        // Limiter le nombre de mises à jour simultanées pour éviter la surcharge
        const batchSize = 5
        for (let i = 0; i < existingWorkforces.length; i += batchSize) {
          const batch = existingWorkforces.slice(i, i + batchSize)
          await Promise.all(batch.map(async (workforce) => {
            const updateData = {
              workforce_type_id: String(getWorkforceTypeId(workforce)),
              nb_hours: Number(workforce.nb_hours),
              discount: Number(workforce.discount),
              hourly_rate_id: hourlyRateId || workforce.hourly_rate_id || "1",
              paint_type_id: value,
              with_tax: localWithTax,
              all_paint: workforce.all_paint || false
            }

            await workforceService.updateWorkforce(String(workforce.id!), updateData)
          }))
          
          // Petite pause entre les lots pour éviter la surcharge
          if (i + batchSize < existingWorkforces.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
        
        // Retirer toutes les lignes des lignes modifiées après mise à jour réussie
        setModifiedRows(new Set())
        
        toast.success('Type de peinture mis à jour avec succès')
        
        // Rafraîchir les données du dossier avec délai
        delayedRefresh()
      } catch (_error) {
        // console.error('Erreur lors de la mise à jour du type de peinture:', _error)
        toast.error('Erreur lors de la mise à jour du type de peinture')
      } finally {
        setUpdatingPaintType(false)
      }
    }
  }

  // Fonction pour gérer le changement de taux horaire
  const handleHourlyRateChange = async (value: string) => {
    
    // Appeler le callback parent en premier pour mettre à jour la prop
    onHourlyRateChange?.(value)
    
    // Mettre à jour toutes les workforces locales avec le nouveau hourly_rate
    // Normaliser les IDs pour la comparaison (peut être string ou number selon la source)
    const selectedHourlyRate = hourlyRates.find(hr => {
      const hrId = String(hr.id || '')
      const valueNormalized = String(value || '')
      return hrId === valueNormalized
    })
    
    if (selectedHourlyRate) {
      const updatedWorkforces = localWorkforces.map(workforce => ({
        ...workforce,
        hourly_rate_id: value,
        work_fee: selectedHourlyRate.label, // Mettre à jour le work_fee avec la nouvelle valeur
        hourly_rate: {
          id: String(selectedHourlyRate.id),
          value: selectedHourlyRate.label,
          label: selectedHourlyRate.label,
          description: selectedHourlyRate.label,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }))
      setLocalWorkforces(updatedWorkforces)
    } else {
      // Si le taux horaire n'est pas trouvé, mettre à jour quand même l'ID
      const updatedWorkforces = localWorkforces.map(workforce => ({
        ...workforce,
        hourly_rate_id: value
      }))
      setLocalWorkforces(updatedWorkforces)
    }
    
    // Mettre à jour toutes les workforces existantes via l'API
    const existingWorkforces = localWorkforces.filter(w => w.id)
    if (existingWorkforces.length > 0) {
      setUpdatingHourlyRate(true)
      try {
        // Limiter le nombre de mises à jour simultanées pour éviter la surcharge
        const batchSize = 5
        for (let i = 0; i < existingWorkforces.length; i += batchSize) {
          const batch = existingWorkforces.slice(i, i + batchSize)
          await Promise.all(batch.map(async (workforce) => {
            const updateData = {
              workforce_type_id: String(getWorkforceTypeId(workforce)),
              nb_hours: Number(workforce.nb_hours),
              discount: Number(workforce.discount),
              hourly_rate_id: value,
              paint_type_id: paintTypeId || workforce.paint_type_id || "1",
              with_tax: localWithTax,
              all_paint: workforce.all_paint || false
            }

            await workforceService.updateWorkforce(String(workforce.id!), updateData)
          }))
          
          // Petite pause entre les lots pour éviter la surcharge
          if (i + batchSize < existingWorkforces.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
        
        // Retirer toutes les lignes des lignes modifiées après mise à jour réussie
        setModifiedRows(new Set())
        
        toast.success('Taux horaire mis à jour avec succès')
        
        // Rafraîchir les données du dossier avec délai
        delayedRefresh()
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
    
    // Mettre à jour toutes les workforces existantes via l'API
    const existingWorkforces = localWorkforces.filter(w => w.id)
    if (existingWorkforces.length > 0) {
      setUpdatingWithTax(true)
      try {
        // Limiter le nombre de mises à jour simultanées pour éviter la surcharge
        const batchSize = 5
        for (let i = 0; i < existingWorkforces.length; i += batchSize) {
          const batch = existingWorkforces.slice(i, i + batchSize)
          await Promise.all(batch.map(async (workforce) => {
            const updateData = {
              workforce_type_id: String(getWorkforceTypeId(workforce)),
              nb_hours: Number(workforce.nb_hours),
              discount: Number(workforce.discount),
              hourly_rate_id: hourlyRateId || workforce.hourly_rate_id || "1",
              paint_type_id: paintTypeId || workforce.paint_type_id || "1",
              with_tax: checked,
              all_paint: workforce.all_paint || false
            }

            await workforceService.updateWorkforce(String(workforce.id!), updateData)
          }))
          
          // Petite pause entre les lots pour éviter la surcharge
          if (i + batchSize < existingWorkforces.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
        
        // Retirer toutes les lignes des lignes modifiées après mise à jour réussie
        setModifiedRows(new Set())
        
        toast.success('Paramètre TVA mis à jour avec succès')
        
        // Rafraîchir les données du dossier avec délai
        delayedRefresh()
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
  const isLoading = workforceTypesLoading || hourlyRatesLoading || paintTypesLoading || 
                   paintTypes.length === 0 || hourlyRates.length === 0

  // Vérifier si on a des lignes avec workforce_type_id = 1 pour afficher la colonne peinture
  const hasPaintWorkforce = localWorkforces.some(workforce => workforce.workforce_type_id === 1 || String(workforce.workforce_type_id) === '1')

  return (
    <div className="space-y-4">
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-800">Chargement des données de référence...</span>
          </div>
        </div>
      )}
      
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Main d'œuvre(s)
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
                  Valider toutes ({modifiedRows.size + newRows.size})
                </>
              )}
            </Button>
          )}
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
            Créer un type 
          </Button>
        </div>
      </div>

      {/* Autres informations - seulement si les props sont fournies et au moins une donnée chargée */}
      {(paintTypeId !== undefined || hourlyRateId !== undefined || withTax !== undefined) && 
       (paintTypes.length > 0 || hourlyRates.length > 0) && (
        <div className="border rounded bg-gray-50 p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {paintTypeId !== undefined && (
              <div className="relative bg-white p-2 rounded-lg border border-grey-200">
                <Label className="text-xs font-medium mb-2">Type de peinture</Label>
                <Select 
                  value={paintTypeId || ''} 
                  onValueChange={(value) => handlePaintTypeChange(value)}
                  disabled={updatingPaintType || paintTypes.length === 0}
                >
                  <SelectTrigger className={`w-full border rounded p-2 ${!paintTypeId ? 'border-red-300 bg-red-50' : ''} ${updatingPaintType ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder={!paintTypeId ? "⚠️ Sélectionner un type" : "Sélectionner..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {paintTypes.length > 0 ? (
                      paintTypes.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.label}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        <span className="text-xs">Chargement des types de peinture...</span>
                      </div>
                    )}
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
                {/* Debug info */}
                {/* <div className="text-[10px] text-gray-500 mt-1">
                  ID actuel: {paintTypeId} | Types disponibles: {paintTypes.length}
                </div> */}
              </div>
            )}
            {hourlyRateId !== undefined && (
              <div className="relative bg-white p-2 rounded-lg border border-grey-200">
                <Label className="text-xs font-medium mb-2">Taux horaire</Label>
                <Select 
                  value={hourlyRateId || ''} 
                  onValueChange={(value) => handleHourlyRateChange(value)}
                  disabled={updatingHourlyRate || hourlyRates.length === 0}
                >
                  <SelectTrigger className={`w-full border rounded p-2 ${!hourlyRateId ? 'border-red-300 bg-red-50' : ''} ${updatingHourlyRate ? 'opacity-50' : ''}`}>
                    <SelectValue placeholder={!hourlyRateId ? "⚠️ Sélectionner un taux" : "Sélectionner..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {hourlyRates.length > 0 ? (
                      hourlyRates.map((rate) => (
                        <SelectItem key={rate.id} value={String(rate.id)}>
                          {rate.label}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        <span className="text-xs">Chargement des taux horaires...</span>
                      </div>
                    )}
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
                {/* <div className="text-[10px] text-gray-500 mt-1">
                  ID actuel: {hourlyRateId} | Taux horaires disponibles: {hourlyRates.length}
                </div> */}
              </div>
            )}
            {withTax !== undefined && (
              <div className="h-full">
                <div className={`h-full flex justify-between items-center space-y-2 p-3  rounded-lg border w-full relative ${localWithTax ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  {updatingWithTax && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                        <span className="text-xs text-green-600">Mise à jour...</span>
                      </div>
                    </div>
                  )}
                  <div>
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

      {tableExpanded ? (
        <>
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
                    <QuotePreparationSortableWorkforceRow
                      key={row.uid || row.id || i}
                      row={row}
                      index={i}
                      workforceTypes={workforceTypes}
                      modifiedRows={modifiedRows}
                      newRows={newRows}
                      updateLocalWorkforce={updateLocalWorkforce}
                      handleCreateWorkforceType={handleCreateWorkforceType}
                      handleValidateRow={handleValidateRow}
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
                {failedValidations.map(({ index, error, workforce }) => (
                  <div key={index} className="text-xs text-red-700">
                    <span className="font-medium">Ligne {index + 1}:</span> {workforce.workforce_type?.label || workforce.workforce_type_id} - {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='flex justify-end'>
            <Button 
              onClick={handleAddNewRow}
              className="text-white text-xs"
              size="xs"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une ligne de main d'œuvre
            </Button>
          </div>
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
        </>
      ) : (
        // Vue réduite avec informations compactes
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-green-700">Lignes</p>
            <p className="text-2xl font-bold text-green-900">{localWorkforces.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-blue-700">Total Heures</p>
            <p className="text-2xl font-bold text-blue-900">{totals.hours}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <p className="text-xs text-purple-700">Total TTC</p>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(totals.ttc)}</p>
          </div>
        </div>
      )}

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