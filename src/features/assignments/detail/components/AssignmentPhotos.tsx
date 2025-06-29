import { useState, useEffect, useRef } from 'react'
import { usePhotoStore } from '@/stores/photoStore'
import { usePhotoTypeStore } from '@/stores/photoTypeStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs } from '@/components/ui/tabs'
import { Upload, Camera, Star, Edit, Trash2, X, Plus, Grid3X3, Eye, Loader2 } from 'lucide-react'
import { CreatePhotoData, UpdatePhotoData, Photo, PhotoType } from '@/types/gestion'
import { photoService } from '@/services/photoService'

interface AssignmentPhotosProps {
  assignmentId: string
  assignmentReference: string
}

interface TabData {
  id: string
  label: string
  photoType: PhotoType | { id: number; code: string; label: string; description: string }
  photos: Photo[]
  loading: boolean
  count: number
}

export function AssignmentPhotos({ assignmentId, assignmentReference }: AssignmentPhotosProps) {
  const {
    createPhotos,
    updatePhoto,
    deletePhoto,
    setAsCover
  } = usePhotoStore()

  const {
    photoTypes,
    fetchPhotoTypes
  } = usePhotoTypeStore()

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<Photo | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid')
  const [tabsData, setTabsData] = useState<TabData[]>([])
  const [uploadData, setUploadData] = useState<CreatePhotoData>({
    assignment_id: assignmentId,
    photo_type_id: '',
    photos: []
  })
  const [editData, setEditData] = useState<UpdatePhotoData>({
    photo_type_id: '',
    photo: new File([], '')
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger les types de photos au montage
  useEffect(() => {
    fetchPhotoTypes()
  }, [fetchPhotoTypes])

  // Créer les tabs quand les types sont chargés
  useEffect(() => {
    if (photoTypes.length > 0) {
      const initialTabs: TabData[] = [
        {
          id: 'all',
          label: 'Toutes',
          photoType: { 
            id: 0, 
            code: 'all', 
            label: 'Toutes', 
            description: ''
          },
          photos: [],
          loading: false,
          count: 0
        },
        ...photoTypes.map(type => ({
          id: type.id.toString(),
          label: type.label,
          photoType: type,
          photos: [],
          loading: false,
          count: 0
        }))
      ]
      setTabsData(initialTabs)
      
      // Charger toutes les photos initialement
      loadPhotosForTab('all')
    }
  }, [photoTypes])

  // Fonction pour charger les photos d'un tab spécifique
  const loadPhotosForTab = async (tabId: string) => {
    setTabsData(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, loading: true } : tab
    ))

    try {
      let response
      if (tabId === 'all') {
        response = await photoService.getByAssignment(assignmentId)
      } else {
        response = await photoService.getAll({ 
          assignment_id: assignmentId, 
          photo_type_id: tabId 
        })
      }

      setTabsData(prev => prev.map(tab => 
        tab.id === tabId 
          ? { 
              ...tab, 
              photos: response.data, 
              loading: false, 
              count: response.data.length 
            }
          : tab
      ))
    } catch (_error) {
      setTabsData(prev => prev.map(tab => 
        tab.id === tabId ? { ...tab, loading: false, photos: [] } : tab
      ))
    }
  }

  // Gérer le changement de tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const currentTab = tabsData.find(tab => tab.id === tabId)
    
    // Charger les photos si elles ne sont pas encore chargées
    if (currentTab && currentTab.photos.length === 0 && !currentTab.loading) {
      loadPhotosForTab(tabId)
    }
  }

  // Recharger les photos après une action (création, modification, suppression)
  const refreshCurrentTab = () => {
    loadPhotosForTab(activeTab)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setUploadData(prev => ({
        ...prev,
        photos: [...prev.photos, ...fileArray]
      }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    setUploadData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleUpload = async () => {
    try {
      await createPhotos(uploadData)
      setIsUploadDialogOpen(false)
      setUploadData({
        assignment_id: assignmentId,
        photo_type_id: '',
        photos: []
      })
      
      // Recharger le tab actuel et le tab "Toutes"
      await Promise.all([
        loadPhotosForTab(activeTab),
        loadPhotosForTab('all')
      ])
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleEdit = async () => {
    if (!selectedPhoto) return
    try {
      await updatePhoto(selectedPhoto.id, editData)
      setIsEditDialogOpen(false)
      setSelectedPhoto(null)
      setEditData({
        photo_type_id: '',
        photo: new File([], '')
      })
      // Recharger le tab actuel
      refreshCurrentTab()
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePhoto(id)
      // Recharger le tab actuel
      refreshCurrentTab()
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleSetAsCover = async (id: number) => {
    try {
      await setAsCover(id)
      // Recharger le tab actuel
      refreshCurrentTab()
    } catch (_error) {
      // Error handled by store
    }
  }

  const openEditDialog = (photo: Photo) => {
    setSelectedPhoto(photo)
    setEditData({
      photo_type_id: photo.photo_type.id.toString(),
      photo: new File([], '')
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (photo: Photo) => {
    setSelectedPhotoForView(photo)
    setIsViewDialogOpen(true)
  }

  const getCurrentTabData = () => {
    return tabsData.find(tab => tab.id === activeTab) || tabsData[0]
  }

  const currentTabData = getCurrentTabData()
  const currentPhotos = currentTabData?.photos || []

  const stats = {
    total: tabsData.reduce((sum, tab) => sum + tab.count, 0),
    cover: currentPhotos.filter(p => p.is_cover).length,
    types: photoTypes.length
  }

  const PhotoCard = ({ photo }: { photo: Photo }) => (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg h-64">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${photo.photo})` }}
      />
      
      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Contenu superposé */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Header avec badges */}
        <div className="flex items-start justify-between">
          <div className="flex gap-2">
            {photo.is_cover && (
              <Badge className="bg-yellow-500 text-white border-0 shadow-lg backdrop-blur-sm">
                <Star className="mr-1 h-3 w-3" />
                Couverture
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm">
              #{photo.id}
            </Badge>
          </div>
          
          {/* Type de photo */}
          <Badge variant="outline" className="bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm">
            {photo.photo_type.label}
          </Badge>
        </div>
        
        {/* Actions au centre (visible au hover) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openViewDialog(photo)}
              className="h-12 w-12 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openEditDialog(photo)}
              className="h-12 w-12 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSetAsCover(photo.id)}
              disabled={photo.is_cover}
              className="h-12 w-12 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            >
              <Star className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="h-12 w-12 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la photo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(photo.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {/* Footer avec informations */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white truncate drop-shadow-lg text-sm">
            {photo.name}
          </h4>
          <p className="text-white/90 text-xs drop-shadow-lg">
            {new Date(photo.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Galerie Photos
          </h3>
          <p className="text-xs text-muted-foreground">
            {stats.total} photo(s) pour {assignmentReference}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'gallery' : 'grid')}
          >
            {viewMode === 'grid' ? <Grid3X3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {viewMode === 'grid' ? 'Grille' : 'Galerie'}
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter des photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter des photos à {assignmentReference}</DialogTitle>
                <DialogDescription>
                  Sélectionnez un type de photo et ajoutez vos images.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="photo-type" className='text-sm font-medium mb-2'>Type de photo</Label>
                  <Select
                    value={uploadData.photo_type_id}
                    onValueChange={(value) => setUploadData({ ...uploadData, photo_type_id: value })}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {photoTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez-déposez vos photos ici ou cliquez pour sélectionner
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    size="sm"
                  >
                    Sélectionner des fichiers
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {uploadData.photos.length > 0 && (
                  <div className="space-y-2">
                    <Label>Fichiers sélectionnés ({uploadData.photos.length})</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadData.photos.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!uploadData.photo_type_id || uploadData.photos.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Uploader
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card className='shadow-none bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total</CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-600">Photos</p>
          </CardContent>
        </Card>
        <Card className='shadow-none bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Couverture</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.cover}</div>
            <p className="text-xs text-yellow-600">Photo de couverture</p>
          </CardContent>
        </Card>
        <Card className='shadow-none bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Types</CardTitle>
            <ImageIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.types}</div>
            <p className="text-xs text-purple-600">Types disponibles</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Tabs dynamiques */}
      {tabsData.length > 0 ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabsData.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleTabChange(tab.id)}
                className="flex items-center gap-2"
                disabled={tab.loading}
              >
                {tab.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {tab.label}
                    <Badge variant={activeTab === tab.id ? "secondary" : "outline"} className="text-xs">
                      {tab.count}
                    </Badge>
                  </>
                )}
              </Button>
            ))}
          </div>
          
          <div className="mt-6">
            {currentTabData?.loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Chargement des photos...</p>
                </div>
              </div>
            ) : currentPhotos.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  // ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {currentPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            ) : (
              <Card className="shadow-none bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Camera className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Aucune photo dans {currentTabData?.label}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center mb-6 max-w-md">
                    Aucune photo de type "{currentTabData?.label}" n'a encore été ajoutée à cette assignation.
                  </p>
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter des photos
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Chargement des types de photos...</p>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la photo</DialogTitle>
            <DialogDescription>
              Modifiez le type de photo et l'image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-photo-type">Type de photo</Label>
              <Select
                value={editData.photo_type_id}
                onValueChange={(value) => setEditData({ ...editData, photo_type_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {photoTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-photo">Nouvelle photo</Label>
              <input
                id="edit-photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEditData({ ...editData, photo: e.target.files[0] })
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={!editData.photo_type_id}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualiser la photo</DialogTitle>
          </DialogHeader>
          {selectedPhotoForView && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedPhotoForView.photo}
                  alt={selectedPhotoForView.name}
                  className="w-full h-96 object-contain rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Nom</p>
                  <p className="font-semibold">{selectedPhotoForView.name}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Type</p>
                  <p className="font-semibold">{selectedPhotoForView.photo_type.label}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Date de création</p>
                  <p className="font-semibold">
                    {new Date(selectedPhotoForView.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Statut</p>
                  <Badge variant={selectedPhotoForView.is_cover ? 'default' : 'secondary'}>
                    {selectedPhotoForView.is_cover ? 'Photo de couverture' : 'Photo normale'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 