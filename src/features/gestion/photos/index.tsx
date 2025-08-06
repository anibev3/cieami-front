import { useState, useEffect, useRef } from 'react'
import { usePhotoStore } from '@/stores/photoStore'
import { usePhotoTypeStore } from '@/stores/photoTypeStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Edit, Trash2, Camera, Star, Upload, Image as ImageIcon, X, Grid3X3, List, ChevronLeft, ChevronRight, Download, Info, Calendar, Hash, Tag, Loader2 } from 'lucide-react'
import { CreatePhotoData, UpdatePhotoData, Photo } from '@/types/gestion'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'

export default function PhotosPage() {
  const {
    photos,
    loading,
    fetchPhotos,
    createPhotos,
    updatePhoto,
    deletePhoto,
    setAsCover
  } = usePhotoStore()

  const {
    photoTypes,
    fetchPhotoTypes
  } = usePhotoTypeStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhotoTypeId, setSelectedPhotoTypeId] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [uploadData, setUploadData] = useState<CreatePhotoData>({
    assignment_id: '',
    photo_type_id: '',
    photos: []
  })
  const [editData, setEditData] = useState<UpdatePhotoData>({
    photo_type_id: '',
    photo: new File([], '')
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Photo viewer states
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchPhotos()
    fetchPhotoTypes()
  }, [fetchPhotos, fetchPhotoTypes])

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.photo_type?.label?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedPhotoTypeId || photo.photo_type.id.toString() === selectedPhotoTypeId
    
    return matchesSearch && matchesType
  })

  // Fonction pour extraire la référence de l'assignation depuis l'URL de la photo
  const getAssignmentReference = (photoUrl: string) => {
    try {
      const urlParts = photoUrl.split('/')
      const photosIndex = urlParts.findIndex(part => part === 'photos')
      if (photosIndex !== -1 && urlParts[photosIndex + 1]) {
        return urlParts[photosIndex + 1]
      }
    } catch (_error) {
      // Erreur silencieuse - retourne 'N/A' par défaut
    }
    return 'N/A'
  }

  // Photo viewer functions
  const openPhotoViewer = (photo: Photo) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    setCurrentPhotoIndex(index)
    setIsViewerOpen(true)
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : filteredPhotos.length - 1)
    } else {
      setCurrentPhotoIndex(prev => prev < filteredPhotos.length - 1 ? prev + 1 : 0)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isViewerOpen) return
    
    switch (e.key) {
      case 'ArrowLeft':
        navigatePhoto('prev')
        break
      case 'ArrowRight':
        navigatePhoto('next')
        break
      case 'Escape':
        setIsViewerOpen(false)
        break
      case 'd':
      case 'D':
        setShowDetails(prev => !prev)
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isViewerOpen])

  const currentPhoto = filteredPhotos[currentPhotoIndex]

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
      setUploading(true)
      await createPhotos(uploadData)
      setIsUploadDialogOpen(false)
      setUploadData({
        assignment_id: '',
        photo_type_id: '',
        photos: []
      })
    } catch (_error) {
      // Error handled by store
    }
    finally {
      setUploading(false)
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
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePhoto(id)
    } catch (_error) {
      // Error handled by store
    }
  }

  const handleSetAsCover = async (id: number) => {
    try {
      await setAsCover(id)
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

  const downloadPhoto = (photoUrl: string, photoName: string) => {
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = photoName || `photo-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = {
    total: photos.length,
    cover: photos.filter(p => p.is_cover).length,
    byType: photoTypes.length
  }

  const [uploading, setUploading] = useState(false)

    return (
        <>
            <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Galerie Photos</h3>
          <p className='text-muted-foreground text-sm'>Gérez et organisez les photos des assignations</p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Upload className="mr-2 h-4 w-4" />
              Ajouter des photos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter des photos</DialogTitle>
              <DialogDescription>
                Sélectionnez un dossier, un type de photo et ajoutez vos images.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assignment" className='mb-2'>Assignation</Label>
                <AssignmentSelect
                  value={uploadData.assignment_id}
                  onValueChange={(value) => setUploadData({ ...uploadData, assignment_id: value })}
                  placeholder="Sélectionner un dossier"
                />
              </div>
              <div>
                <Label htmlFor="photo-type" className='mb-2'>Type de photo</Label>
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
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
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
                      <div key={index} className="flex items-center justify-between p-2 border rounded bg-muted/50">
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
                disabled={!uploadData.assignment_id || !uploadData.photo_type_id || uploadData.photos.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Uploader'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className='shadow-none border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Photos</p>
          </CardContent>
        </Card>
        <Card className='shadow-none border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couvertures</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.cover}</div>
            <p className="text-xs text-muted-foreground">Photos de couverture</p>
          </CardContent>
        </Card>
        <Card className='shadow-none border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types</CardTitle>
            <ImageIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.byType}</div>
            <p className="text-xs text-muted-foreground">Types de photos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPhotoTypeId} onValueChange={setSelectedPhotoTypeId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              {photoTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(selectedPhotoTypeId || searchTerm) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPhotoTypeId('')
                setSearchTerm('')
              }}
              className="h-9 px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Photos Grid/List */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} className="hover:shadow-lg transition-all duration-200 shadow-none border-0 overflow-hidden group cursor-pointer" onClick={() => openPhotoViewer(photo)}>
            <div 
              className={`relative bg-cover bg-center bg-no-repeat ${
                viewMode === 'grid' ? 'h-64' : 'h-48'
              }`}
              style={{ backgroundImage: `url(${photo.photo})` }}
            >
              {/* Overlay gradient pour améliorer la lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Badge de couverture */}
              {photo.is_cover && (
                <Badge className="absolute top-3 right-3 bg-yellow-500 hover:bg-yellow-600 z-10">
                  <Star className="mr-1 h-3 w-3" />
                  Couverture
                </Badge>
              )}
              
              {/* Boutons d'action */}
              <div className="absolute top-3 left-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSetAsCover(photo.id)
                  }}
                  disabled={photo.is_cover}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>

              {/* Contenu superposé */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      #{photo.id}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditDialog(photo)
                        }}
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost"
                            size="sm" 
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement la photo #{photo.id}.
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
                  
                  {/* Informations avec fond semi-transparent */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      <span className="text-xs font-medium">Assignation:</span>
                      <span className="text-xs">{getAssignmentReference(photo.photo) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      <span className="text-xs font-medium">Type:</span>
                      <span className="text-xs">{photo.photo_type?.label || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      <span className="text-xs font-medium">Créé le:</span>
                      <span className="text-xs">{new Date(photo.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Photo Viewer Modal */}
      {isViewerOpen && currentPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsViewerOpen(false)}
            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigatePhoto('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigatePhoto('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Action buttons */}
          <div className="absolute top-4 left-4 z-10 flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Info className="h-4 w-4 mr-2" />
              Détails
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadPhoto(currentPhoto.photo, currentPhoto.name || `photo-${currentPhoto.id}.jpg`)}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSetAsCover(currentPhoto.id)}
              disabled={currentPhoto.is_cover}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              {currentPhoto.is_cover ? 'Couverture' : 'Définir couverture'}
            </Button>
          </div>

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full">
            {currentPhotoIndex + 1} / {filteredPhotos.length}
          </div>

          {/* Main photo */}
          <div className="relative max-w-4xl max-h-[80vh] mx-auto">
            <img
              src={currentPhoto.photo}
              alt={currentPhoto.name || `Photo ${currentPhoto.id}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Details panel */}
          {showDetails && (
            <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Détails de la photo</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">ID:</span>
                    <span className="text-sm">#{currentPhoto.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Type:</span>
                    <Badge variant="secondary">{currentPhoto.photo_type?.label || 'N/A'}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Assignation:</span>
                    <span className="text-sm">{getAssignmentReference(currentPhoto.photo) || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Créé le:</span>
                    <span className="text-sm">{new Date(currentPhoto.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>

                  {currentPhoto.updated_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Modifié le:</span>
                      <span className="text-sm">{new Date(currentPhoto.updated_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  )}

                  {currentPhoto.is_cover && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">Photo de couverture</span>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(currentPhoto)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement la photo #{currentPhoto.id}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(currentPhoto.id)}
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
              </div>
            </div>
          )}
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
            <div>
              <Label htmlFor="edit-photo">Nouvelle photo</Label>
              <Input
                id="edit-photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEditData({ ...editData, photo: e.target.files[0] })
                  }
                }}
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPhotos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Camera className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune photo trouvée</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedPhotoTypeId 
              ? 'Aucune photo ne correspond à vos critères de recherche.'
              : 'Commencez par ajouter votre première photo.'
            }
          </p>
          {!searchTerm && !selectedPhotoTypeId && (
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Ajouter des photos
            </Button>
          )}
        </div>
      )}
                </div>
            </Main></>
            
  )
}
