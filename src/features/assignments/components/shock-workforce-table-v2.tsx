/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Calculator, Loader2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { workforceService } from '@/services/workforce-service'
import { useWorkforceTypesStore } from '@/stores/workforce-types'
import { useHourlyRatesStore } from '@/stores/hourly-rates'
import { usePaintTypesStore } from '@/stores/paint-types'

interface Workforce {
  uid?: string
  id?: number
  workforce_type_id?: number // Pour les nouvelles lignes
  workforce_type_label?: string
  nb_hours: number | string
  work_fee?: string | number
  discount: number | string
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
  // Additional fields for display
  workforce_type?: {
    id: number
    code: string
    label: string
  }
}

interface ShockWorkforceTableV2Props {
  shockId: number
  workforces: Workforce[]
  onUpdate: (updatedWorkforces: Workforce[]) => void
  onAssignmentRefresh?: () => void // Callback pour rafraîchir les données du dossier
}

export function ShockWorkforceTableV2({
  shockId,
  workforces,
  onUpdate,
  onAssignmentRefresh
}: ShockWorkforceTableV2Props) {
  const [localWorkforces, setLocalWorkforces] = useState<Workforce[]>(workforces)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [originalValues, setOriginalValues] = useState<Record<number, Partial<Workforce>>>({})

  // Utiliser les stores
  const { workforceTypes, loading: workforceTypesLoading, fetchWorkforceTypes } = useWorkforceTypesStore()
  const { hourlyRates: _hourlyRates, loading: hourlyRatesLoading, fetchHourlyRates } = useHourlyRatesStore()
  const { paintTypes: _paintTypes, loading: paintTypesLoading, fetchPaintTypes } = usePaintTypesStore()

  // Mettre à jour les données locales quand les props changent
  useEffect(() => {
    setLocalWorkforces(workforces)
  }, [workforces])

  // Charger les données nécessaires
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchWorkforceTypes(),
          fetchHourlyRates(),
          fetchPaintTypes()
        ])
      } catch (_error) {
        toast.error('Erreur lors du chargement des données')
      }
    }

    loadData()
  }, [fetchWorkforceTypes, fetchHourlyRates, fetchPaintTypes])

  // Fonction pour obtenir l'ID du type de main d'œuvre
  const getWorkforceTypeId = (workforce: Workforce): number => {
    if (workforce.workforce_type_id) {
      return workforce.workforce_type_id
    }
    if (workforce.workforce_type?.id) {
      return workforce.workforce_type.id
    }
    return 0
  }

  // Fonction de formatage des montants
  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0)
  }

  // Fonction pour calculer les totaux
  const calculateTotals = (workforces: Workforce[]) => {
    return workforces.reduce((acc, workforce) => {
      return {
        hours: acc.hours + Number(workforce.nb_hours || 0),
        ht: acc.ht + Number(workforce.amount_excluding_tax || 0),
        tva: acc.tva + Number(workforce.amount_tax || 0),
        ttc: acc.ttc + Number(workforce.amount || 0),
      }
    }, { hours: 0, ht: 0, tva: 0, ttc: 0 })
  }

  // Fonction pour mettre à jour une ligne localement
  const updateLocalWorkforce = (index: number, field: keyof Workforce, value: any) => {
    const updated = [...localWorkforces]
    updated[index] = { ...updated[index], [field]: value }
    setLocalWorkforces(updated)
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
        hourly_rate_id: workforce.hourly_rate_id?.toString() || (_hourlyRates.length > 0 ? _hourlyRates[0].id.toString() : "1"),
        paint_type_id: workforce.paint_type_id?.toString() || (_paintTypes.length > 0 ? _paintTypes[0].id.toString() : "1"),
      }

      // Appel API pour mettre à jour
      await workforceService.updateWorkforce(workforce.id, updateData)
      
      // Mettre à jour les données parent
      onUpdate(localWorkforces)
      
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
      }
    } finally {
      setUpdatingId(null)
    }
  }

  // Fonction pour sauvegarder une nouvelle ligne
  const saveNewWorkforce = async (index: number) => {
    const workforce = localWorkforces[index]
    if (!workforce.uid) return

    try {
      setCreatingId(workforce.uid)
      
      // Préparer les données pour l'API
      const createData = {
        shock_id: shockId,
        workforce_type_id: getWorkforceTypeId(workforce).toString(),
        nb_hours: Number(workforce.nb_hours),
        discount: Number(workforce.discount),
        hourly_rate_id: workforce.hourly_rate_id?.toString() || (_hourlyRates.length > 0 ? _hourlyRates[0].id.toString() : "1"),
        paint_type_id: workforce.paint_type_id?.toString() || (_paintTypes.length > 0 ? _paintTypes[0].id.toString() : "1"),
      }

      // Appel API pour créer
      const response = await workforceService.createWorkforce(createData)
      
      // Remplacer la ligne temporaire par la ligne créée
      const updated = [...localWorkforces]
      updated[index] = {
        ...response.data,
        workforce_type_id: response.data.workforce_type_id,
        nb_hours: response.data.nb_hours,
        discount: response.data.discount,
        work_fee: response.data.work_fee || 0,
        amount_excluding_tax: response.data.amount_excluding_tax || 0,
        amount_tax: response.data.amount_tax || 0,
        amount: response.data.amount || 0
      }
      
      setLocalWorkforces(updated)
      onUpdate(updated)
      
      // Sauvegarder les valeurs originales
      setOriginalValues(prev => ({
        ...prev,
        [response.data.id]: { ...updated[index] }
      }))
      
      toast.success('Main d\'œuvre créée avec succès')
      
      // Rafraîchir les données du dossier
      if (onAssignmentRefresh) {
        onAssignmentRefresh()
      }
    } catch (_error) {
      toast.error('Erreur lors de la création de la main d\'œuvre')
      
      // Supprimer la ligne temporaire en cas d'erreur
      const updated = localWorkforces.filter((_, i) => i !== index)
      setLocalWorkforces(updated)
      onUpdate(updated)
    } finally {
      setCreatingId(null)
    }
  }

  // Fonction pour annuler les modifications
  const cancelChanges = (index: number) => {
    const workforce = localWorkforces[index]
    
    if (workforce.uid) {
      // C'est une nouvelle ligne, la supprimer
      const updated = localWorkforces.filter((_, i) => i !== index)
      setLocalWorkforces(updated)
      onUpdate(updated)
    } else if (workforce.id) {
      // C'est une ligne existante, restaurer les valeurs originales
      const original = originalValues[workforce.id]
      if (original) {
        updateLocalWorkforce(index, 'nb_hours', original.nb_hours)
        updateLocalWorkforce(index, 'discount', original.discount)
        updateLocalWorkforce(index, 'workforce_type_id', original.workforce_type_id)
        updateLocalWorkforce(index, 'hourly_rate_id', original.hourly_rate_id)
        updateLocalWorkforce(index, 'paint_type_id', original.paint_type_id)
      }
    }
  }

  // Fonction pour vérifier si une ligne a été modifiée
  const hasChanges = (index: number) => {
    const workforce = localWorkforces[index]
    
    if (workforce.uid) {
      // Nouvelle ligne, toujours considérée comme modifiée
      return getWorkforceTypeId(workforce) !== 0 || Number(workforce.nb_hours) !== 0 || Number(workforce.discount) !== 0
    }
    
    if (!workforce.id) return false

    const original = originalValues[workforce.id]
    if (!original) return true

    return (
      Number(workforce.nb_hours) !== Number(original.nb_hours) ||
      Number(workforce.discount) !== Number(original.discount) ||
      getWorkforceTypeId(workforce) !== getWorkforceTypeId(original as Workforce) ||
      workforce.hourly_rate_id !== original.hourly_rate_id ||
      workforce.paint_type_id !== original.paint_type_id
    )
  }

  // Fonction pour ajouter une nouvelle ligne
  const addWorkforce = () => {
    const newWorkforce: Workforce = {
      uid: `temp_${Date.now()}`,
      workforce_type_id: 0,
      nb_hours: 0,
      discount: 0,
      work_fee: 0,
      amount_excluding_tax: 0,
      amount_tax: 0,
      amount: 0,
      hourly_rate_id: _hourlyRates.length > 0 ? _hourlyRates[0].id : 0,
      paint_type_id: _paintTypes.length > 0 ? _paintTypes[0].id : 0
    }
    const updated = [...localWorkforces, newWorkforce]
    setLocalWorkforces(updated)
    onUpdate(updated)
  }

  // Fonction pour supprimer une ligne
  const removeWorkforce = async (index: number) => {
    const workforce = localWorkforces[index]
    
    if (workforce.uid) {
      // Ligne temporaire, la supprimer directement
      const updated = localWorkforces.filter((_, i) => i !== index)
      setLocalWorkforces(updated)
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

  const totals = calculateTotals(localWorkforces)
  const isLoading = workforceTypesLoading || hourlyRatesLoading || paintTypesLoading

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Main d'œuvre - Choc #{shockId}
        </h4>
        <div className="flex gap-2">
          <Button 
            onClick={addWorkforce}
            className="text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="border px-3 py-2 text-left font-medium">
                Désignation
              </th>
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
          <tbody>
            {localWorkforces.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-muted-foreground py-8">
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
              <tr key={row.uid || row.id || i} className="hover:bg-gray-50 transition-colors">
                <td className="border px-3 py-2">
                  <Select 
                    value={getWorkforceTypeId(row) ? getWorkforceTypeId(row).toString() : ''} 
                    onValueChange={v => updateLocalWorkforce(i, 'workforce_type_id', Number(v))}
                  >
                    <SelectTrigger className={`w-full border rounded p-1 ${!getWorkforceTypeId(row) ? 'border-red-300 bg-red-50' : ''}`}>
                      <SelectValue placeholder={!getWorkforceTypeId(row) ? "⚠️ Sélectionner un type" : "Sélectionner..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {workforceTypes.map(w => (
                        <SelectItem key={w.id} value={w.id.toString()}>{w.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-16 border rounded p-1 text-center"
                    value={Number(row.nb_hours) || 0}
                    onChange={e => updateLocalWorkforce(i, 'nb_hours', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-16 border rounded p-1 text-center"
                    value={Number(row.discount) || 0}
                    onChange={e => updateLocalWorkforce(i, 'discount', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-gray-600 font-medium">
                    {formatCurrency(Number(row.work_fee || 0))}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-green-600 font-medium">
                    {formatCurrency(row.amount_excluding_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-blue-600 font-medium">
                    {formatCurrency(row.amount_tax || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="text-purple-600 font-bold">
                    {formatCurrency(row.amount || 0)}
                  </div>
                </td>
                <td className="border px-2 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {hasChanges(i) && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => row.uid ? saveNewWorkforce(i) : saveWorkforce(i)}
                          disabled={updatingId === row.id || creatingId === row.uid}
                          className="h-6 w-6 hover:bg-green-50 hover:text-green-600"
                        >
                          {updatingId === row.id || creatingId === row.uid ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => cancelChanges(i)}
                          disabled={updatingId === row.id || creatingId === row.uid}
                          className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeWorkforce(i)}
                      disabled={updatingId === row.id || creatingId === row.uid}
                      className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
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
      <div className="bg-gradient-to-r from-gray-50 to-green-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600 font-medium">Total Heures</div>
            <div className="text-xl font-bold text-gray-800">{totals.hours}</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">Total HT</div>
            <div className="text-lg font-bold text-green-700">{formatCurrency(totals.ht)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">Total TVA</div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(totals.tva)}</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-medium">Total TTC</div>
            <div className="text-lg font-bold text-purple-700">{formatCurrency(totals.ttc)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 font-medium">Récap</div>
            <div className="text-lg font-bold text-gray-800">{localWorkforces.length} ligne(s)</div>
          </div>
        </div>
      </div>
    </div>
  )
} 