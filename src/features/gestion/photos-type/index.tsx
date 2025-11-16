import { useState, useEffect } from 'react'
import { usePhotoTypeStore } from '@/stores/photoTypeStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, Edit, Trash2, Camera, Eye, EyeOff } from 'lucide-react'
import { CreatePhotoTypeData, PhotoType } from '@/types/gestion'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function PhotoTypesPageContent() {
  const {
    photoTypes,
    loading,
    fetchPhotoTypes,
    createPhotoType,
    updatePhotoType,
    deletePhotoType
  } = usePhotoTypeStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPhotoType, setSelectedPhotoType] = useState<PhotoType | null>(null)
  const [formData, setFormData] = useState<CreatePhotoTypeData>({
    label: '',
    description: ''
  })

  useEffect(() => {
    fetchPhotoTypes()
  }, [fetchPhotoTypes])

  const filteredPhotoTypes = photoTypes.filter(photoType =>
    photoType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photoType.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photoType.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async () => {
    try {
      await createPhotoType(formData)
      setIsCreateDialogOpen(false)
      setFormData({ label: '', description: '' })
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleEdit = async () => {
    if (!selectedPhotoType) return
    try {
      await updatePhotoType(selectedPhotoType.id, formData)
      setIsEditDialogOpen(false)
      setSelectedPhotoType(null)
      setFormData({ label: '', description: '' })
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePhotoType(id)
    } catch (_error) {
      // Error handled by store
    }
  }

  const openEditDialog = (photoType: PhotoType) => {
    setSelectedPhotoType(photoType)
    setFormData({
      label: photoType.label,
      description: photoType.description
    })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total: photoTypes.length,
    active: photoTypes.filter(pt => pt.status?.code === 'active').length,
    inactive: photoTypes.filter(pt => pt.status?.code === 'inactive').length
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Types de Photos</h3>
          <p className='text-muted-foreground text-sm'>Gérez les différents types de photos pour les assignations</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau type de photo</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau type de photo pour catégoriser les photos des assignations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="label">Libellé</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Ex: Avant travaux"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée du type de photo"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={!formData.label || !formData.description}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Types de photos</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Types disponibles</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Types désactivés</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un type de photo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Photo Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPhotoTypes.map((photoType) => (
          <Card key={photoType.id} className="hover:shadow-lg transition-shadow shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{photoType.label}</CardTitle>
                <div className="flex items-center space-x-2">
                  {photoType.status?.code === 'active' ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Eye className="mr-1 h-3 w-3" />
                      Actif
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <EyeOff className="mr-1 h-3 w-3" />
                      Inactif
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                Code: <Badge variant="outline" className="font-mono text-xs">{photoType.code}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Description:</span> {photoType.description}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Créé le {new Date(photoType.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(photoType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement le type de photo "{photoType.label}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(photoType.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le type de photo</DialogTitle>
            <DialogDescription>
              Modifiez les informations du type de photo sélectionné.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-label">Libellé</Label>
              <Input
                id="edit-label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Avant travaux"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée du type de photo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={!formData.label || !formData.description}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      )}
    </div>
  )
}

export default function PhotoTypesPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_PHOTO_TYPE}>
      <PhotoTypesPageContent />
    </ProtectedRoute>
  )
}
