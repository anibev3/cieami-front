/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { AscertainmentTypeSelect } from '@/features/widgets/ascertainment-type-select'
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import { toast } from 'sonner'

interface AscertainmentType {
  id: number
  code: string
  label: string
  description: string
  created_at: string
  updated_at: string
}

interface Ascertainment {
  id: number
  ascertainment_type: AscertainmentType
  very_good: boolean
  good: boolean
  acceptable: boolean
  less_good: boolean
  bad: boolean
  very_bad: boolean
  comment: string | null
  created_at: string
  updated_at: string
}

interface AscertainmentEditProps {
  ascertainments: Ascertainment[]
  onUpdate: (ascertainments: Ascertainment[]) => void
}

const AscertainmentEdit: React.FC<AscertainmentEditProps> = ({
  ascertainments,
  onUpdate
}) => {
  const [localAscertainments, setLocalAscertainments] = useState<Ascertainment[]>([])
  const [updatingAscertainment, setUpdatingAscertainment] = useState<number | null>(null)

  useEffect(() => {
      setLocalAscertainments(ascertainments)
      console.log('ascertainments from props', ascertainments)
  }, [ascertainments])

  const updateLocalAscertainment = (id: number, field: string, value: boolean | string | AscertainmentType) => {
    setLocalAscertainments(prev => 
      prev.map(ascertainment => {
        if (ascertainment.id === id) {
          const updated = { ...ascertainment, [field]: value }
          
          // Si on change une qualité, décocher les autres
          if (['very_good', 'good', 'acceptable', 'less_good', 'bad', 'very_bad'].includes(field)) {
            const boolValue = typeof value === 'boolean' ? value : false
            updated.very_good = field === 'very_good' ? boolValue : false
            updated.good = field === 'good' ? boolValue : false
            updated.acceptable = field === 'acceptable' ? boolValue : false
            updated.less_good = field === 'less_good' ? boolValue : false
            updated.bad = field === 'bad' ? boolValue : false
            updated.very_bad = field === 'very_bad' ? boolValue : false
          }
          
          return updated
        }
        return ascertainment
      })
    )
  }

  const saveAscertainment = async (ascertainment: Ascertainment) => {
    setUpdatingAscertainment(ascertainment.id)
    
    try {
      const response = await axiosInstance.put(
        `${API_CONFIG.ENDPOINTS.ASCERTAINMENTS}/${ascertainment.id}`,
        {
          ascertainment_type_id: ascertainment.ascertainment_type.id,
          very_good: ascertainment.very_good,
          good: ascertainment.good,
          acceptable: ascertainment.acceptable,
          less_good: ascertainment.less_good,
          bad: ascertainment.bad,
          very_bad: ascertainment.very_bad,
          comment: ascertainment.comment || ''
        }
      )

      if (response.data.status === 200) {
        toast.success('Constatation mise à jour avec succès')
        onUpdate(localAscertainments)
      }
    } catch (error: unknown) {
      // Gérer les erreurs de validation de l'API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any
      if (axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors
        const errorMessages = Object.values(errors).flat().join(', ')
        toast.error(`Erreur de validation: ${errorMessages}`)
      } else if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message)
      } else {
        toast.error('Erreur lors de la mise à jour de la constatation')
      }
    } finally {
      setUpdatingAscertainment(null)
    }
  }

  const getQualityScore = (ascertainment: Ascertainment): number => {
    if (ascertainment.very_good) return 6
    if (ascertainment.good) return 5
    if (ascertainment.acceptable) return 4
    if (ascertainment.less_good) return 3
    if (ascertainment.bad) return 2
    if (ascertainment.very_bad) return 1
    return 0
  }

  const getQualityColor = (score: number): string => {
    if (score >= 5) return 'text-green-600'
    if (score >= 4) return 'text-blue-600'
    if (score >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getQualityLabel = (score: number): string => {
    if (score === 6) return 'Très bon'
    if (score === 5) return 'Bon'
    if (score === 4) return 'Acceptable'
    if (score === 3) return 'Peu bon'
    if (score === 2) return 'Mauvais'
    if (score === 1) return 'Très mauvais'
    return 'Non défini'
  }

  const AscertainmentItem: React.FC<{
    ascertainment: Ascertainment
    onUpdate: (id: number, field: string, value: boolean | string | AscertainmentType) => void
    onSave: (ascertainment: Ascertainment) => void
    getQualityScore: (ascertainment: Ascertainment) => number
    getQualityColor: (score: number) => string
    getQualityLabel: (score: number) => string
    index: number
    isUpdating: boolean
  }> = ({ ascertainment, onUpdate, onSave, getQualityScore, getQualityColor, getQualityLabel, index, isUpdating }) => {
    const qualityScore = getQualityScore(ascertainment)
    
    return (
      <div className="relative bg-white border rounded-lg p-4 space-y-4">
        {isUpdating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mise à jour...
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">Constat {index + 1}</span>
            <Badge variant="secondary" className={getQualityColor(qualityScore)}>
              {getQualityLabel(qualityScore)}
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={() => onSave(ascertainment)}
            disabled={isUpdating}
          >
            Sauvegarder
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Type de constat
            </label>
            <AscertainmentTypeSelect
               value={ascertainment.ascertainment_type.id}
               onValueChange={(value) => 
                 onUpdate(ascertainment.id, 'ascertainment_type', {
                   ...ascertainment.ascertainment_type,
                   id: value || 0
                 })
               }
             />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Qualité
            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'very_good', label: 'Très bon', checked: ascertainment.very_good },
                { id: 'good', label: 'Bon', checked: ascertainment.good },
                { id: 'acceptable', label: 'Acceptable', checked: ascertainment.acceptable },
                { id: 'less_good', label: 'Peu bon', checked: ascertainment.less_good },
                { id: 'bad', label: 'Mauvais', checked: ascertainment.bad },
                { id: 'very_bad', label: 'Très mauvais', checked: ascertainment.very_bad }
              ].map(option => (
                <div key={option.id} className="flex items-center">
                  <Checkbox
                    id={`${option.id}_${ascertainment.id}`}
                    checked={option.checked}
                    onCheckedChange={(checked) => 
                      onUpdate(ascertainment.id, option.id, checked)
                    }
                  />
                  <label htmlFor={`${option.id}_${ascertainment.id}`} className="ml-2 text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Commentaire
            </label>
            <Textarea
              value={ascertainment.comment || ''}
              onChange={(e) => onUpdate(ascertainment.id, 'comment', e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={3}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-10">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Constatations</h3>
        <Badge variant="secondary">{localAscertainments.length}</Badge>
      </div>

      {localAscertainments.length > 0 ? (
        <div className="space-y-4">
          {localAscertainments.map((ascertainment, index) => (
            <AscertainmentItem
              key={ascertainment.id}
              ascertainment={ascertainment}
              onUpdate={updateLocalAscertainment}
              onSave={saveAscertainment}
              getQualityScore={getQualityScore}
              getQualityColor={getQualityColor}
              getQualityLabel={getQualityLabel}
              index={index}
              isUpdating={updatingAscertainment === ascertainment.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Aucune constatation
        </div>
      )}
    </div>
  )
}

export default AscertainmentEdit 