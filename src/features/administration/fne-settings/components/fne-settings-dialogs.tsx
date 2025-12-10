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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useFNESettingsStore } from '@/stores/fneSettingsStore'
import { useEntitiesStore } from '@/stores/entitiesStore'
import { CreateFNESettingData, UpdateFNESettingData, FNESetting } from '@/types/administration'
import { Calendar, AlertTriangle, Trash2, Building, Key } from 'lucide-react'
import { EntitySelect } from '@/features/widgets/entity-select'

interface FNESettingsDialogsProps {
  isCreateOpen: boolean
  isEditOpen: boolean
  isViewOpen: boolean
  isDeleteOpen: boolean
  selectedSetting: FNESetting | null
  onCloseCreate: () => void
  onCloseEdit: () => void
  onCloseView: () => void
  onCloseDelete: () => void
}

export function FNESettingsDialogs({
  isCreateOpen,
  isEditOpen,
  isViewOpen,
  isDeleteOpen,
  selectedSetting,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  onCloseDelete,
}: FNESettingsDialogsProps) {
  const { 
    createFNESetting, 
    updateFNESetting, 
    deleteFNESetting,
    loading
  } = useFNESettingsStore()
  
  const { entities, fetchEntities } = useEntitiesStore()
  
  const [formData, setFormData] = useState<CreateFNESettingData>({
    point_sale: '',
    establishment: '',
    commercial_message: null,
    footer: null,
    token: '',
    entity_id: '',
  })
  const [errors, setErrors] = useState<{
    point_sale?: string
    establishment?: string
    token?: string
    entity_id?: string
  }>({})

  // Charger les entités au montage
  useEffect(() => {
    if (entities.length === 0) {
      fetchEntities()
    }
  }, [entities.length, fetchEntities])

  // Préremplir les champs lors de l'ouverture du modal d'édition
  useEffect(() => {
    if (isEditOpen && selectedSetting) {
      setFormData({
        point_sale: selectedSetting.point_sale || '',
        establishment: selectedSetting.establishment || '',
        commercial_message: selectedSetting.commercial_message || null,
        footer: selectedSetting.footer || null,
        token: selectedSetting.token || '',
        entity_id: selectedSetting.entity?.id?.toString() || '',
      })
    }
  }, [isEditOpen, selectedSetting])

  // Nettoyer les champs lors de l'ouverture du modal de création
  useEffect(() => {
    if (isCreateOpen) {
      setFormData({ 
        point_sale: '', 
        establishment: '', 
        commercial_message: null, 
        footer: null, 
        token: '',
        entity_id: ''
      })
      setErrors({})
    }
  }, [isCreateOpen])

  // Validation des champs
  const validateForm = () => {
    const newErrors: {
      point_sale?: string
      establishment?: string
      token?: string
      entity_id?: string
    } = {}
    
    if (!formData.point_sale || formData.point_sale.trim() === '') {
      newErrors.point_sale = 'Le point de vente est requis'
    }
    if (!formData.establishment || formData.establishment.trim() === '') {
      newErrors.establishment = 'L\'établissement est requis'
    }
    if (!formData.token || formData.token.trim() === '') {
      newErrors.token = 'Le token est requis'
    }
    if (!formData.entity_id || formData.entity_id === '') {
      newErrors.entity_id = 'L\'entité est requise'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gérer la création
  const handleCreate = async () => {
    if (!validateForm()) return
    
    try {
      await createFNESetting(formData)
      setFormData({ 
        point_sale: '', 
        establishment: '', 
        commercial_message: null, 
        footer: null, 
        token: '',
        entity_id: ''
      })
      setErrors({})
      onCloseCreate()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la modification
  const handleEdit = async () => {
    if (!selectedSetting) return
    
    if (!validateForm()) return
    
    try {
      const updateData: UpdateFNESettingData = {
        point_sale: formData.point_sale,
        establishment: formData.establishment,
        commercial_message: formData.commercial_message || null,
        footer: formData.footer || null,
        token: formData.token,
        entity_id: formData.entity_id,
      }
      await updateFNESetting(selectedSetting.id, updateData)
      setFormData({ 
        point_sale: '', 
        establishment: '', 
        commercial_message: null, 
        footer: null, 
        token: '',
        entity_id: ''
      })
      setErrors({})
      onCloseEdit()
    } catch (_error) {
      // Erreur gérée par le store
    }
  }

  // Gérer la suppression
  const handleDelete = async () => {
    if (!selectedSetting) return
    
    try {
      await deleteFNESetting(selectedSetting.id)
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
        <DialogContent className="w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau paramètre FNE</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau paramètre FNE au système.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="point_sale" className="mb-2">Point de vente<span className="text-red-500">*</span></Label>
              <Input
                id="point_sale"
                value={formData.point_sale}
                onChange={(e) => setFormData({ ...formData, point_sale: e.target.value })}
                placeholder="ex: Point de vente principal"
                className={errors.point_sale ? 'border-red-500' : ''}
              />
              {errors.point_sale && <p className="text-sm text-red-500 mt-1">{errors.point_sale}</p>}
            </div>
            <div>
              <Label htmlFor="establishment" className="mb-2">Établissement<span className="text-red-500">*</span></Label>
              <Input
                id="establishment"
                value={formData.establishment}
                onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                placeholder="ex: Établissement principal"
                className={errors.establishment ? 'border-red-500' : ''}
              />
              {errors.establishment && <p className="text-sm text-red-500 mt-1">{errors.establishment}</p>}
            </div>
            <div>
              <Label htmlFor="entity_id" className="mb-2">Entité<span className="text-red-500">*</span></Label>
              <EntitySelect
                value={formData.entity_id}
                onValueChange={(id) => setFormData({ ...formData, entity_id: id?.toString() || '' })}
                placeholder="Sélectionner une entité..."
                className={errors.entity_id ? 'border-red-500' : ''}
              />
              {errors.entity_id && <p className="text-sm text-red-500 mt-1">{errors.entity_id}</p>}
            </div>
            <div>
              <Label htmlFor="token" className="mb-2">Token<span className="text-red-500">*</span></Label>
              <Input
                id="token"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                placeholder="ex: token123"
                className={errors.token ? 'border-red-500' : ''}
              />
              {errors.token && <p className="text-sm text-red-500 mt-1">{errors.token}</p>}
            </div>
            <div>
              <Label htmlFor="commercial_message">Message commercial</Label>
              <Textarea
                id="commercial_message"
                value={formData.commercial_message || ''}
                onChange={(e) => setFormData({ ...formData, commercial_message: e.target.value || null })}
                placeholder="Message commercial optionnel"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="footer">Pied de page</Label>
              <Textarea
                id="footer"
                value={formData.footer || ''}
                onChange={(e) => setFormData({ ...formData, footer: e.target.value || null })}
                placeholder="Pied de page optionnel"
                rows={3}
              />
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le paramètre FNE</DialogTitle>
            <DialogDescription>
              Modifiez les informations du paramètre FNE.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-point_sale" className="mb-2">Point de vente<span className="text-red-500">*</span></Label>
              <Input
                id="edit-point_sale"
                value={formData.point_sale}
                onChange={(e) => setFormData({ ...formData, point_sale: e.target.value })}
                placeholder="ex: Point de vente principal"
                className={errors.point_sale ? 'border-red-500' : ''}
              />
              {errors.point_sale && <p className="text-sm text-red-500 mt-1">{errors.point_sale}</p>}
            </div>
            <div>
              <Label htmlFor="edit-establishment" className="mb-2">Établissement<span className="text-red-500">*</span></Label>
              <Input
                id="edit-establishment"
                value={formData.establishment}
                onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                placeholder="ex: Établissement principal"
                className={errors.establishment ? 'border-red-500' : ''}
              />
              {errors.establishment && <p className="text-sm text-red-500 mt-1">{errors.establishment}</p>}
            </div>
            <div>
              <Label htmlFor="edit-entity_id" className="mb-2">Entité<span className="text-red-500">*</span></Label>
              <EntitySelect
                value={formData.entity_id}
                onValueChange={(id) => setFormData({ ...formData, entity_id: id?.toString() || '' })}
                placeholder="Sélectionner une entité..."
                className={errors.entity_id ? 'border-red-500' : ''}
              />
              {errors.entity_id && <p className="text-sm text-red-500 mt-1">{errors.entity_id}</p>}
            </div>
            <div>
              <Label htmlFor="edit-token" className="mb-2">Token<span className="text-red-500">*</span></Label>
              <Input
                id="edit-token"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                placeholder="ex: token123"
                className={errors.token ? 'border-red-500' : ''}
              />
              {errors.token && <p className="text-sm text-red-500 mt-1">{errors.token}</p>}
            </div>
            <div>
              <Label htmlFor="edit-commercial_message">Message commercial</Label>
              <Textarea
                id="edit-commercial_message"
                value={formData.commercial_message || ''}
                onChange={(e) => setFormData({ ...formData, commercial_message: e.target.value || null })}
                placeholder="Message commercial optionnel"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-footer">Pied de page</Label>
              <Textarea
                id="edit-footer"
                value={formData.footer || ''}
                onChange={(e) => setFormData({ ...formData, footer: e.target.value || null })}
                placeholder="Pied de page optionnel"
                rows={3}
              />
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Détails du paramètre FNE
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le paramètre FNE.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSetting && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Point de vente
                </div>
                <div className="text-lg font-semibold">
                  {selectedSetting.point_sale}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Établissement
                </div>
                <div className="text-lg font-semibold">
                  {selectedSetting.establishment}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Entité
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">{selectedSetting.entity?.name}</div>
                  {selectedSetting.entity?.code && (
                    <div className="text-sm text-muted-foreground">
                      Code : {selectedSetting.entity.code}
                    </div>
                  )}
                  {selectedSetting.entity?.email && (
                    <div className="text-sm text-muted-foreground">
                      Email : {selectedSetting.entity.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Key className="h-4 w-4" />
                  Token
                </div>
                <div className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
                  {selectedSetting.token}
                </div>
              </div>

              {selectedSetting.commercial_message && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Message commercial
                  </div>
                  <div className="text-sm bg-muted px-3 py-2 rounded-md">
                    {selectedSetting.commercial_message}
                  </div>
                </div>
              )}

              {selectedSetting.footer && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Pied de page
                  </div>
                  <div className="text-sm bg-muted px-3 py-2 rounded-md">
                    {selectedSetting.footer}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  État
                </div>
                <Badge variant={selectedSetting.status?.code === 'active' ? 'default' : 'secondary'}>
                  {selectedSetting.status?.label || 'Inconnu'}
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
                    {formatDate(selectedSetting.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Modifié le
                  </div>
                  <div className="text-sm">
                    {formatDate(selectedSetting.updated_at)}
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
              Supprimer le paramètre FNE
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce paramètre FNE ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSetting && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="font-semibold mb-2">Point de vente : {selectedSetting.point_sale}</div>
                <div className="text-sm text-muted-foreground">
                  Établissement : {selectedSetting.establishment}
                </div>
                <div className="text-sm text-muted-foreground">
                  Entité : {selectedSetting.entity?.name}
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
