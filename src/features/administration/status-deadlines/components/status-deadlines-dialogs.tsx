import { useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useStatusDeadlinesStore } from '@/stores/statusDeadlinesStore'
import { useGeneralStatusDeadlinesStore } from '@/stores/generalStatusDeadlinesStore'
import { CreateStatusDeadlineData, UpdateStatusDeadlineData, StatusDeadline } from '@/types/administration'
import { Clock, Calendar, AlertTriangle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusDeadlinesDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedDeadline: StatusDeadline | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function StatusDeadlinesDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedDeadline,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: StatusDeadlinesDialogsProps) {
  const { 
    createStatusDeadline, 
    updateStatusDeadline, 
    deleteStatusDeadline,
    loading
  } = useStatusDeadlinesStore()
  
  const { generalStatusDeadlines, fetchGeneralStatusDeadlines } = useGeneralStatusDeadlinesStore()
  
  const [formData, setFormData] = useState<CreateStatusDeadlineData>({
    time_limit: 24,
    general_status_deadline_id: '',
  })
  const [errors, setErrors] = useState<{time_limit?: string, general_status_deadline_id?: string}>({})

  // Charger les délais de statuts généraux au montage
  useEffect(() => {
    if (generalStatusDeadlines.length === 0) {
      fetchGeneralStatusDeadlines()
    }
  }, [generalStatusDeadlines.length, fetchGeneralStatusDeadlines])

  // Préremplir les champs lors de l'ouverture du modal d'édition
  useEffect(() => {
    if (isEditOpen && selectedDeadline) {
      setFormData({
        time_limit: selectedDeadline.time_limit || 24,
        general_status_deadline_id: selectedDeadline.general_status_deadline?.id || '',
      })
    }
  }, [isEditOpen, selectedDeadline])

  // Nettoyer les champs lors de l'ouverture du modal de création
  useEffect(() => {
    if (isCreateOpen) {
      setFormData({ time_limit: 24, general_status_deadline_id: '' })
      setErrors({})
    }
  }, [isCreateOpen])

  // Validation des champs
  const validateForm = () => {
    const newErrors: {time_limit?: string, general_status_deadline_id?: string} = {}
    
    if (!formData.time_limit || formData.time_limit <= 0) {
      newErrors.time_limit = 'Le délai doit être supérieur à 0'
    }
    if (!formData.general_status_deadline_id || formData.general_status_deadline_id === '') {
      newErrors.general_status_deadline_id = 'Le délai de statut général est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gérer la création
  const handleCreate = async () => {
    if (!validateForm()) return
    
    try {
      await createStatusDeadline(formData)
      setFormData({ time_limit: 24, general_status_deadline_id: '' })
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
      const updateData: UpdateStatusDeadlineData = {
        time_limit: formData.time_limit,
        general_status_deadline_id: formData.general_status_deadline_id,
      }
      await updateStatusDeadline(selectedDeadline.id, updateData)
      setFormData({ time_limit: 24, general_status_deadline_id: '' })
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
      await deleteStatusDeadline(selectedDeadline.id)
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
            <DialogTitle>Créer un nouveau délai de statut</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau délai de statut au système.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="general_status_deadline_id" className="mb-2">Délai de statut général<span className="text-red-500">*</span></Label>
              <select
                id="general_status_deadline_id"
                value={formData.general_status_deadline_id}
                onChange={(e) => setFormData({ ...formData, general_status_deadline_id: e.target.value })}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.general_status_deadline_id ? 'border-red-500' : ''
                )}
              >
                <option value="">Sélectionner un délai de statut général...</option>
                {generalStatusDeadlines.map((deadline) => (
                  <option key={deadline.id} value={deadline.id}>
                    {deadline.label} ({deadline.time_limit}h)
                  </option>
                ))}
              </select>
              {errors.general_status_deadline_id && <p className="text-sm text-red-500 mt-1">{errors.general_status_deadline_id}</p>}
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
            <DialogTitle>Modifier le délai de statut</DialogTitle>
            <DialogDescription>
              Modifiez les informations du délai de statut.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-general_status_deadline_id" className="mb-2">Délai de statut général<span className="text-red-500">*</span></Label>
              <select
                id="edit-general_status_deadline_id"
                value={formData.general_status_deadline_id}
                onChange={(e) => setFormData({ ...formData, general_status_deadline_id: e.target.value })}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.general_status_deadline_id ? 'border-red-500' : ''
                )}
              >
                <option value="">Sélectionner un délai de statut général...</option>
                {generalStatusDeadlines.map((deadline) => (
                  <option key={deadline.id} value={deadline.id}>
                    {deadline.label} ({deadline.time_limit}h)
                  </option>
                ))}
              </select>
              {errors.general_status_deadline_id && <p className="text-sm text-red-500 mt-1">{errors.general_status_deadline_id}</p>}
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
              Détails du délai de statut
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le délai de statut.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeadline && (
            <div className="space-y-6">
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
                  Délai de statut général
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{selectedDeadline.general_status_deadline?.label}</div>
                  {selectedDeadline.general_status_deadline?.description && (
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                      {selectedDeadline.general_status_deadline.description}
                    </div>
                  )}
                  {selectedDeadline.general_status_deadline?.time_limit && (
                    <div className="text-sm text-muted-foreground">
                      Délai de base : {selectedDeadline.general_status_deadline.time_limit}h
                    </div>
                  )}
                </div>
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
              Supprimer le délai de statut
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce délai de statut ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeadline && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="font-semibold mb-2">Délai : {selectedDeadline.time_limit}h</div>
                <div className="text-sm text-muted-foreground">
                  Délai de statut général : {selectedDeadline.general_status_deadline?.label}
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
