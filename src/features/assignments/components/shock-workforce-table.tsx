/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Calculator, Check, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import React from 'react'

interface WorkforceType {
  id: number
  label: string
  code: string
  hourly_rate: number
}

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
  nb_hours: number
  work_fee?: string | number
  discount: number
  // Calculated amounts from API
  amount_excluding_tax?: number
  amount_tax?: number
  amount?: number
  rate?: number
  amount_ht?: number
  amount_tva?: number
  amount_ttc?: number
  hourly_rate_id?: string | number
  paint_type_id?: string | number
}

interface ShockWorkforceTableProps {
  workforceTypes: WorkforceType[]
  workforces: Workforce[]
  paintTypes: PaintType[]
  hourlyRates: HourlyRate[]
  paintTypeId?: number
  hourlyRateId?: number
  withTax?: boolean
  onUpdate: (index: number, field: keyof Workforce, value: any) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onPaintTypeChange: (value: number) => void
  onHourlyRateChange: (value: number) => void
  onWithTaxChange: (value: boolean) => void
  onValidateRow: (index: number) => Promise<void>
}

export function ShockWorkforceTable({
  workforceTypes,
  workforces,
  paintTypes,
  hourlyRates,
  paintTypeId,
  hourlyRateId,
  withTax = true,
  onUpdate,
  onAdd,
  onRemove,
  onPaintTypeChange,
  onHourlyRateChange,
  onWithTaxChange,
  onValidateRow
}: ShockWorkforceTableProps) {
  // État local pour gérer les modifications et la validation
  const [localWorkforces, setLocalWorkforces] = useState<Workforce[]>(workforces)
  const [modifiedRows, setModifiedRows] = useState<Set<number>>(new Set())
  const [validatingRows, setValidatingRows] = useState<Set<number>>(new Set())

  // Mettre à jour les données locales quand les props changent
  useEffect(() => {
    setLocalWorkforces(workforces)
  }, [workforces])

  // Fonction de mise à jour locale
  const updateLocalWorkforce = (index: number, field: keyof Workforce, value: any) => {
    const updated = [...localWorkforces]
    updated[index] = { ...updated[index], [field]: value }
    setLocalWorkforces(updated)
    setModifiedRows(prev => new Set([...prev, index]))
  }

  // Fonction de validation d'une ligne
  const handleValidateRow = async (index: number) => {
    setValidatingRows(prev => new Set([...prev, index]))
    try {
      // Appliquer les modifications locales
      const workforce = localWorkforces[index]
      Object.entries(workforce).forEach(([field, value]) => {
        if (field !== 'uid' && field !== 'id') {
          onUpdate(index, field as keyof Workforce, value)
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
  const totals = localWorkforces.reduce((acc, workforce) => {
    return {
      hours: acc.hours + (workforce.nb_hours || 0),
      ht: acc.ht + (workforce.amount_excluding_tax || 0),
      tva: acc.tva + (workforce.amount_tax || 0),
      ttc: acc.ttc + (workforce.amount || 0),
    }
  }, { hours: 0, ht: 0, tva: 0, ttc: 0 })

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Main d'œuvre
        </h4>
        <div className="flex gap-2">
          <Button onClick={onAdd} className="text-white">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>
      </div>

      {/* Autres informations */}
      <div className="border rounded bg-gray-50 p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="text-sm font-medium mb-2">Type de peinture</Label>
            <Select 
              value={paintTypeId ? paintTypeId.toString() : ''} 
              onValueChange={(value) => onPaintTypeChange(Number(value))}
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
          <div>
            <Label className="text-sm font-medium mb-2">Taux horaire</Label>
            <Select 
              value={hourlyRateId ? hourlyRateId.toString() : ''} 
              onValueChange={(value) => onHourlyRateChange(Number(value))}
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
          <div className="h-full">
            <div className="h-full flex justify-between items-center space-y-2 p-3 bg-white rounded-lg border border-gray-200 w-full">
              <div className="flex items-center gap-2 py-1 mt-2">
                <Checkbox
                  checked={withTax}
                  onCheckedChange={(checked) => onWithTaxChange(checked as boolean)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <span className="text-xs text-gray-600">
                  {withTax ? 'Avec TVA (18%)' : 'Sans TVA'}
                </span>
              </div>
              <div className="flex items-center gap-2 py-1 mt-2">
                <div className={`w-3 h-3 rounded-full ${withTax ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <Label className="text-sm font-medium text-gray-700">Calcul TVA</Label>
              </div>

              {withTax && (
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✓ TVA incluse
                </div>
              )}
            </div>
          </div>
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
                <td colSpan={9} className="text-center text-muted-foreground py-8">
                  Aucune ligne de main d'œuvre
                </td>
              </tr>
            )}
            {localWorkforces.map((row, i) => (
              <tr key={row.uid || row.id || i} className={`hover:bg-gray-50 transition-colors ${modifiedRows.has(i) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}`}>
                <td className="border px-3 py-2">
                  <Select 
                    value={row.workforce_type_id ? row.workforce_type_id.toString() : ''} 
                    onValueChange={v => updateLocalWorkforce(i, 'workforce_type_id', Number(v))}
                  >
                    <SelectTrigger className={`w-full border rounded p-1 ${!row.workforce_type_id ? 'border-red-300 bg-red-50' : ''}`}>
                      <SelectValue placeholder={!row.workforce_type_id ? "⚠️ Sélectionner un type" : "Sélectionner..."} />
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
                    className="w-full border rounded p-1 text-center"
                    value={row.nb_hours}
                    onChange={e => updateLocalWorkforce(i, 'nb_hours', Number(e.target.value))}
                  />
                </td>
                <td className="border px-2 py-2 text-center">
                  <Input
                    type="number"
                    className="w-full border rounded p-1 text-center"
                    value={row.discount}
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
