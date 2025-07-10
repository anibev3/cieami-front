/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useAscertainmentStore } from '@/stores/ascertainments'
import { useAscertainmentTypeStore } from '@/stores/ascertainmentTypes'
import { Ascertainment, CreateAscertainmentData, UpdateAscertainmentData } from '@/services/ascertainmentService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/utils/format-date'

// Types pour les props des dialogues
interface CreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ascertainment: Ascertainment | null
}

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ascertainment: Ascertainment | null
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ascertainment: Ascertainment | null
}

// Dialogue de création
export function CreateAscertainmentDialog({ open, onOpenChange }: CreateDialogProps) {
  const { createAscertainment, loading } = useAscertainmentStore()
  const { ascertainmentTypes, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  const [formData, setFormData] = useState<CreateAscertainmentData>({
    assignment_id: '',
    ascertainments: [{
      ascertainment_type_id: '',
      very_good: false,
      good: false,
      acceptable: false,
      less_good: false,
      bad: false,
      very_bad: false,
      comment: ''
    }]
  })

  useEffect(() => {
    if (open && ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [open, ascertainmentTypes.length, fetchAscertainmentTypes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await createAscertainment(formData)
    if (success) {
      onOpenChange(false)
      setFormData({
        assignment_id: '',
        ascertainments: [{
          ascertainment_type_id: '',
          very_good: false,
          good: false,
          acceptable: false,
          less_good: false,
          bad: false,
          very_bad: false,
          comment: ''
        }]
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      assignment_id: '',
      ascertainments: [{
        ascertainment_type_id: '',
        very_good: false,
        good: false,
        acceptable: false,
        less_good: false,
        bad: false,
        very_bad: false,
        comment: ''
      }]
    })
  }

  const updateAscertainment = (index: number, field: string, value: any) => {
    const newAscertainments = [...formData.ascertainments]
    newAscertainments[index] = { ...newAscertainments[index], [field]: value }
    setFormData({ ...formData, ascertainments: newAscertainments })
  }

  const addAscertainment = () => {
    setFormData({
      ...formData,
      ascertainments: [...formData.ascertainments, {
        ascertainment_type_id: '',
        very_good: false,
        good: false,
        acceptable: false,
        less_good: false,
        bad: false,
        very_bad: false,
        comment: ''
      }]
    })
  }

  const removeAscertainment = (index: number) => {
    if (formData.ascertainments.length > 1) {
      const newAscertainments = formData.ascertainments.filter((_, i) => i !== index)
      setFormData({ ...formData, ascertainments: newAscertainments })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau constat</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau constat au système.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assignment_id">ID de l'affectation *</Label>
              <Input
                id="assignment_id"
                value={formData.assignment_id}
                onChange={(e) => setFormData({ ...formData, assignment_id: e.target.value })}
                placeholder="Ex: aperiam"
                required
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Constats</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAscertainment}>
                  Ajouter un constat
                </Button>
              </div>

              {formData.ascertainments.map((ascertainment, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Constat {index + 1}</CardTitle>
                      {formData.ascertainments.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAscertainment(index)}
                          className="text-destructive"
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Type de constat *</Label>
                      <Select
                        value={ascertainment.ascertainment_type_id}
                        onValueChange={(value) => updateAscertainment(index, 'ascertainment_type_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ascertainmentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Qualité</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`very_good_${index}`}
                            checked={ascertainment.very_good}
                            onCheckedChange={(checked) => updateAscertainment(index, 'very_good', checked)}
                          />
                          <Label htmlFor={`very_good_${index}`}>Très bon</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`good_${index}`}
                            checked={ascertainment.good}
                            onCheckedChange={(checked) => updateAscertainment(index, 'good', checked)}
                          />
                          <Label htmlFor={`good_${index}`}>Bon</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`acceptable_${index}`}
                            checked={ascertainment.acceptable}
                            onCheckedChange={(checked) => updateAscertainment(index, 'acceptable', checked)}
                          />
                          <Label htmlFor={`acceptable_${index}`}>Acceptable</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`less_good_${index}`}
                            checked={ascertainment.less_good}
                            onCheckedChange={(checked) => updateAscertainment(index, 'less_good', checked)}
                          />
                          <Label htmlFor={`less_good_${index}`}>Moins bon</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`bad_${index}`}
                            checked={ascertainment.bad}
                            onCheckedChange={(checked) => updateAscertainment(index, 'bad', checked)}
                          />
                          <Label htmlFor={`bad_${index}`}>Mauvais</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`very_bad_${index}`}
                            checked={ascertainment.very_bad}
                            onCheckedChange={(checked) => updateAscertainment(index, 'very_bad', checked)}
                          />
                          <Label htmlFor={`very_bad_${index}`}>Très mauvais</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`comment_${index}`}>Commentaire</Label>
                      <Textarea
                        id={`comment_${index}`}
                        value={ascertainment.comment}
                        onChange={(e) => updateAscertainment(index, 'comment', e.target.value)}
                        placeholder="Commentaire sur le constat"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !formData.assignment_id.trim()}>
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialogue de modification
export function EditAscertainmentDialog({ open, onOpenChange, ascertainment }: EditDialogProps) {
  const { updateAscertainment, loading } = useAscertainmentStore()
  const { ascertainmentTypes, fetchAscertainmentTypes } = useAscertainmentTypeStore()
  const [formData, setFormData] = useState<UpdateAscertainmentData>({
    ascertainment_type_id: '',
    very_good: false,
    good: false,
    acceptable: false,
    less_good: false,
    bad: false,
    very_bad: false,
    comment: ''
  })

  useEffect(() => {
    if (open && ascertainmentTypes.length === 0) {
      fetchAscertainmentTypes()
    }
  }, [open, ascertainmentTypes.length, fetchAscertainmentTypes])

  useEffect(() => {
    if (ascertainment) {
      setFormData({
        ascertainment_type_id: ascertainment.ascertainment_type.id.toString(),
        very_good: ascertainment.very_good,
        good: ascertainment.good,
        acceptable: ascertainment.acceptable,
        less_good: ascertainment.less_good,
        bad: ascertainment.bad,
        very_bad: ascertainment.very_bad,
        comment: ascertainment.comment
      })
    }
  }, [ascertainment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ascertainment) return
    
    const success = await updateAscertainment(ascertainment.id, formData)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!ascertainment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le constat</DialogTitle>
          <DialogDescription>
            Modifiez les informations du constat pour l'affectation {ascertainment.assignment.reference}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Type de constat</Label>
              <Select
                value={formData.ascertainment_type_id}
                onValueChange={(value) => setFormData({ ...formData, ascertainment_type_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {ascertainmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Qualité</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_very_good"
                    checked={formData.very_good}
                    onCheckedChange={(checked) => setFormData({ ...formData, very_good: checked as boolean })}
                  />
                  <Label htmlFor="edit_very_good">Très bon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_good"
                    checked={formData.good}
                    onCheckedChange={(checked) => setFormData({ ...formData, good: checked as boolean })}
                  />
                  <Label htmlFor="edit_good">Bon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_acceptable"
                    checked={formData.acceptable}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptable: checked as boolean })}
                  />
                  <Label htmlFor="edit_acceptable">Acceptable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_less_good"
                    checked={formData.less_good}
                    onCheckedChange={(checked) => setFormData({ ...formData, less_good: checked as boolean })}
                  />
                  <Label htmlFor="edit_less_good">Moins bon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_bad"
                    checked={formData.bad}
                    onCheckedChange={(checked) => setFormData({ ...formData, bad: checked as boolean })}
                  />
                  <Label htmlFor="edit_bad">Mauvais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit_very_bad"
                    checked={formData.very_bad}
                    onCheckedChange={(checked) => setFormData({ ...formData, very_bad: checked as boolean })}
                  />
                  <Label htmlFor="edit_very_bad">Très mauvais</Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_comment">Commentaire</Label>
              <Textarea
                id="edit_comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Commentaire sur le constat"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialogue de visualisation
export function ViewAscertainmentDialog({ open, onOpenChange, ascertainment }: ViewDialogProps) {
  if (!ascertainment) return null

  const getQualityText = () => {
    if (ascertainment.very_good) return 'Très bon'
    if (ascertainment.good) return 'Bon'
    if (ascertainment.acceptable) return 'Acceptable'
    if (ascertainment.less_good) return 'Moins bon'
    if (ascertainment.bad) return 'Mauvais'
    if (ascertainment.very_bad) return 'Très mauvais'
    return 'Non défini'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du constat</DialogTitle>
          <DialogDescription>
            Informations complètes sur le constat.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID</Label>
              <p className="text-sm">{ascertainment.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
              <Badge variant="default" className="mt-1">
                {ascertainment.status.label}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          {/* Affectation */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Affectation</Label>
            <Card className="mt-2">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Référence:</span> {ascertainment.assignment.reference}
                  </div>
                  <div>
                    <span className="font-medium">Police:</span> {ascertainment.assignment.policy_number}
                  </div>
                  <div>
                    <span className="font-medium">Sinistre:</span> {ascertainment.assignment.claim_number}
                  </div>
                  <div>
                    <span className="font-medium">Date expertise:</span> {formatDate(ascertainment.assignment.expertise_date)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
          
          {/* Type de constat */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Type de constat</Label>
            <p className="text-sm mt-1">{ascertainment.ascertainment_type.label}</p>
          </div>
          
          {/* Qualité */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Qualité</Label>
            <Badge variant="default" className="mt-1">
              {getQualityText()}
            </Badge>
          </div>
          
          {/* Détails qualité */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Détails qualité</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox checked={ascertainment.very_good} disabled />
                <Label className="text-sm">Très bon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={ascertainment.good} disabled />
                <Label className="text-sm">Bon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={ascertainment.acceptable} disabled />
                <Label className="text-sm">Acceptable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={ascertainment.less_good} disabled />
                <Label className="text-sm">Moins bon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={ascertainment.bad} disabled />
                <Label className="text-sm">Mauvais</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox checked={ascertainment.very_bad} disabled />
                <Label className="text-sm">Très mauvais</Label>
              </div>
            </div>
          </div>
          
          {/* Commentaire */}
          {ascertainment.comment && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Commentaire</Label>
                <p className="text-sm mt-1">{ascertainment.comment}</p>
              </div>
            </>
          )}
          
          <Separator />
          
          {/* Métadonnées */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
              <p className="text-sm">{formatDate(ascertainment.created_at)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Modifié le</Label>
              <p className="text-sm">{formatDate(ascertainment.updated_at)}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Utilisateurs */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Créé par</Label>
            <div className="flex items-center space-x-2 mt-1">
              <img
                src={ascertainment.created_by.photo_url}
                alt={ascertainment.created_by.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{ascertainment.created_by.name}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Modifié par</Label>
            <div className="flex items-center space-x-2 mt-1">
              <img
                src={ascertainment.updated_by.photo_url}
                alt={ascertainment.updated_by.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{ascertainment.updated_by.name}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Dialogue de suppression
export function DeleteAscertainmentDialog({ open, onOpenChange, ascertainment }: DeleteDialogProps) {
  const { deleteAscertainment, loading } = useAscertainmentStore()

  const handleDelete = async () => {
    if (!ascertainment) return
    
    const success = await deleteAscertainment(ascertainment.id)
    if (success) {
      onOpenChange(false)
    }
  }

  if (!ascertainment) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement le constat pour l'affectation {ascertainment.assignment.reference} du système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 