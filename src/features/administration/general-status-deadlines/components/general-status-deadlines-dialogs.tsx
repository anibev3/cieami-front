import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useGeneralStatusDeadlinesStore } from '@/stores/generalStatusDeadlinesStore'
import { CreateGeneralStatusDeadlineData, UpdateGeneralStatusDeadlineData, GeneralStatusDeadline } from '@/types/administration'
import { Clock, Calendar, AlertTriangle, Trash2 } from 'lucide-react'
import { StatusSelectString } from '@/features/widgets/status-select-string'

interface GeneralStatusDeadlinesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedDeadline: GeneralStatusDeadline | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function GeneralStatusDeadlinesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedDeadline,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: GeneralStatusDeadlinesDialogsProps) {
  const { 
    createGeneralStatusDeadline, 
    updateGeneralStatusDeadline, 
    deleteGeneralStatusDeadline,
    loading,
    generalStatusDeadlines,
    fetchGeneralStatusDeadlines
  } = useGeneralStatusDeadlinesStore()
  
  const [formData, setFormData] = useState<CreateGeneralStatusDeadlineData>({
    label: '',
    description: '',
    time_limit: 24,
    target_status_id: '',
  })
  const [errors, setErrors] = useState<{label?: string, description?: string, time_limit?: string, target_status_id?: string}>({})

  // Extraire tous les statuts uniques depuis les délais chargés
  // Note: Dans un cas réel, vous devriez avoir un endpoint pour récupérer tous les statuts disponibles
  const availableStatuses = useMemo(() => {
    const statusSet = new Map<string, GeneralStatusDeadline['target_status']>()
    
    generalStatusDeadlines.forEach(deadline => {
      if (deadline.target_status && !statusSet.has(deadline.target_status.id)) {
        statusSet.set(deadline.target_status.id, deadline.target_status)
      }
      if (deadline.status && !statusSet.has(deadline.status.id)) {
        statusSet.set(deadline.status.id, deadline.status)
      }
    })
    
    return Array.from(statusSet.values())
  }, [generalStatusDeadlines])

  // Charger les délais au montage pour avoir les statuts disponibles
  useEffect(() => {
    if (generalStatusDeadlines.length === 0) {
      fetchGeneralStatusDeadlines()
    }
  }, [generalStatusDeadlines.length, fetchGeneralStatusDeadlines])

  // Préremplir les champs lors de l'ouverture du modal d'édition
  useEffect(() => {
    if (isEditOpen && selectedDeadline) {
      setFormData({
        label: selectedDeadline.label || '',
        description: selectedDeadline.description || '',
        time_limit: selectedDeadline.time_limit || 24,
        target_status_id: selectedDeadline.target_status?.id?.toString() || '',
      })
    }
  }, [isEditOpen, selectedDeadline])

  // Nettoyer les champs lors de l'ouverture du modal de création
  useEffect(() => {
    if (isCreateOpen) {
      setFormData({ label: '', description: '', time_limit: 24, target_status_id: '' })
      setErrors({})
    }
  }, [isCreateOpen])

  // Validation des champs
  const validateForm = () => {
    const newErrors: {label?: string, description?: string, time_limit?: string, target_status_id?: string} = {}
    
    if (!formData.label || formData.label.trim() === '') {
      newErrors.label = 'Le libellé est requis'
    }
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'La description est requise'
    }
    if (!formData.time_limit || formData.time_limit <= 0) {
      newErrors.time_limit = 'Le délai doit être supérieur à 0'
    }
    if (!formData.target_status_id || formData.target_status_id === '') {
      newErrors.target_status_id = 'Le statut cible est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gérer la création
  const handleCreate = async () => {
    if (!validateForm()) return
    
    try {
      await createGeneralStatusDeadline({
        ...formData,
        target_status_id: formData.target_status_id,
      })
      setFormData({ label: '', description: '', time_limit: 24, target_status_id: '' })
      setErrors({})
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la modification
  const handleEdit = async () => {
    if (!selectedDeadline) return
    
    if (!validateForm()) return
    
    try {
      const updateData: UpdateGeneralStatusDeadlineData = {
        label: formData.label,
        description: formData.description,
        time_limit: formData.time_limit,
        target_status_id: formData.target_status_id,
      }
      await updateGeneralStatusDeadline(selectedDeadline.id, updateData)
      setFormData({ label: '', description: '', time_limit: 24, target_status_id: '' })
      setErrors({})
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la suppression
  const handleDelete = async () => {
    if (!selectedDeadline) return
    
    try {
      await deleteGeneralStatusDeadline(selectedDeadline.id)
      onCloseDelete()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      {/* Dialog de création */}
      <Dialog open={isCreateOpen} onOpenChange={onCloseCreate}>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau délai de statut général</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau délai de statut général au système.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label" className="mb-2">Libellé<span className="text-red-500">*</span></Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Réalisation"
                className={errors.label ? 'border-red-500' : ''}
              />
              {errors.label && <p className="text-sm text-red-500 mt-1">{errors.label}</p>}
            </div>
            <div>
              <Label htmlFor="description" className="mb-2">Description<span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du délai..."
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div>
              <Label htmlFor="time_limit" className="mb-2">Délai (en heures)<span className="text-red-500">*</span></Label>
              <Input
                id="time_limit"
                type="number"
                min="1"
                value={formData.time_limit}
                onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) || 0 })}
                placeholder="ex: 24"
                className={errors.time_limit ? 'border-red-500' : ''}
              />
              {errors.time_limit && <p className="text-sm text-red-500 mt-1">{errors.time_limit}</p>}
            </div>
            <div>
              <Label htmlFor="target_status" className="mb-2">Statut cible<span className="text-red-500">*</span></Label>
              <StatusSelectString
                value={formData.target_status_id}
                onValueChange={(id) => setFormData({ ...formData, target_status_id: id || '' })}
                placeholder="Sélectionner un statut cible..."
                statuses={availableStatuses}
                loading={loading}
                className={errors.target_status_id ? 'border-red-500' : ''}
              />
              {errors.target_status_id && <p className="text-sm text-red-500 mt-1">{errors.target_status_id}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseCreate}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={isEditOpen} onOpenChange={onCloseEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le délai de statut général</DialogTitle>
            <DialogDescription>
              Modifiez les informations du délai de statut général.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-label" className="mb-2">Libellé<span className="text-red-500">*</span></Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Réalisation"
                className={errors.label ? 'border-red-500' : ''}
              />
              {errors.label && <p className="text-sm text-red-500 mt-1">{errors.label}</p>}
            </div>
            <div>
              <Label htmlFor="edit-description" className="mb-2">Description<span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du délai..."
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div>
              <Label htmlFor="edit-time_limit" className="mb-2">Délai (en heures)<span className="text-red-500">*</span></Label>
              <Input
                id="edit-time_limit"
                type="number"
                min="1"
                value={formData.time_limit}
                onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) || 0 })}
                placeholder="ex: 24"
                className={errors.time_limit ? 'border-red-500' : ''}
              />
              {errors.time_limit && <p className="text-sm text-red-500 mt-1">{errors.time_limit}</p>}
            </div>
            <div>
              <Label htmlFor="edit-target_status" className="mb-2">Statut cible<span className="text-red-500">*</span></Label>
              <StatusSelectString
                value={formData.target_status_id}
                onValueChange={(id) => setFormData({ ...formData, target_status_id: id || '' })}
                placeholder="Sélectionner un statut cible..."
                statuses={availableStatuses}
                loading={loading}
                className={errors.target_status_id ? 'border-red-500' : ''}
              />
              {errors.target_status_id && <p className="text-sm text-red-500 mt-1">{errors.target_status_id}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseEdit}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={isViewOpen} onOpenChange={onCloseView}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Détails du délai de statut général
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le délai de statut général.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeadline && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Libellé
                </div>
                <div className="text-lg font-semibold">
                  {selectedDeadline.label}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Description
                </div>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  {selectedDeadline.description}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Délai
                </div>
                <div className="text-lg font-semibold">
                  {selectedDeadline.time_limit} heures
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Statut cible
                </div>
                <Badge variant="outline" className="text-sm">
                  {selectedDeadline.target_status?.label || selectedDeadline.target_status?.code}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  État
                </div>
                <Badge variant={selectedDeadline.status?.code === 'active' ? 'default' : 'secondary'}>
                  {selectedDeadline.status?.label || 'Inconnu'}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Statut
                </div>
                <Badge variant={selectedDeadline.deleted_at ? 'destructive' : 'default'}>
                  {selectedDeadline.deleted_at ? 'Supprimé' : 'Actif'}
                </Badge>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Créé le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedDeadline.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Modifié le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedDeadline.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseView}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={onCloseDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Supprimer le délai de statut général
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce délai de statut général ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeadline && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="font-semibold mb-2">{selectedDeadline.label}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedDeadline.description}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDelete}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Suppression...' : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
