import { useState, useEffect, useRef, useCallback } from 'react'
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
import { Search, Edit, Trash2, Camera, Star, Upload, Image as ImageIcon, X, Grid3X3, List, ChevronLeft, ChevronRight, Download, Info, Calendar, Hash, Tag, Loader2, Eye, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { CreatePhotoData, UpdatePhotoData, Photo } from '@/types/gestion'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssignmentSelect } from '@/features/widgets/AssignmentSelect'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Permission } from '@/types/auth'

function PhotosPageContent() {
  const {
    photos,
    loading,
    pagination,
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(20)

  // Photo viewer states
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchPhotos({
      page: currentPage,
      per_page: perPage,
      search: searchTerm || undefined,
      photo_type_id: selectedPhotoTypeId || undefined
    })
    fetchPhotoTypes()
  }, [fetchPhotos, fetchPhotoTypes, currentPage, perPage, searchTerm, selectedPhotoTypeId])

  // Les photos sont déjà filtrées côté serveur
  const filteredPhotos = photos

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

  const navigatePhoto = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : filteredPhotos.length - 1)
    } else {
      setCurrentPhotoIndex(prev => prev < filteredPhotos.length - 1 ? prev + 1 : 0)
    }
  }, [filteredPhotos.length])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
  }, [isViewerOpen, navigatePhoto])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
    total: pagination?.total || 0,
    cover: photos.filter(p => p.is_cover).length,
    byType: photoTypes.length
  }

  const [uploading, setUploading] = useState(false)

  // Fonctions de pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage)
    setCurrentPage(1) // Reset to first page when changing per page
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePhotoTypeChange = (value: string) => {
    setSelectedPhotoTypeId(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

    return (
        <>
            <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
    <div className="space-y-6 w-full pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className='flex flex-col gap-2'>
          <h3 className='text-lg font-bold'>Galerie Photos</h3>
          <p className='text-muted-foreground text-sm'>Liste des photos des dossiers</p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Upload className="mr-2 h-4 w-4" />
              Ajouter des photos
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="text-center pb-4">
              
              <DialogTitle className="text-2xl font-bold text-gray-900">Ajouter des photos</DialogTitle>
              <DialogDescription className="text-gray-600">
                Sélectionnez un dossier, un type de photo et ajoutez vos images
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[60vh] pr-2">
              <div className="space-y-6">
                {/* Section Configuration */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Hash className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">Configuration</h3>
                  </div>
                  
                  <div className="flex justify-around">
                    <div className="space-y-3">
                      <Label htmlFor="assignment" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        Dossier
                      </Label>
                      <AssignmentSelect
                        value={uploadData.assignment_id}
                        onValueChange={(value) => setUploadData({ ...uploadData, assignment_id: value })}
                        placeholder="Sélectionner un dossier"
                      />
                      <p className="text-xs text-gray-500">Choisissez le dossier auquel associer ces photos</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="photo-type" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                        Type de photo
                      </Label>
                      <Select
                        value={uploadData.photo_type_id}
                        onValueChange={(value) => setUploadData({ ...uploadData, photo_type_id: value })}
                      >
                        <SelectTrigger className='w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
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
                      <p className="text-xs text-gray-500">Catégorisez vos photos selon leur type</p>
                    </div>
                          
                    <div className="">
                      
                      {/* Upload Zone améliorée */}
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                          dragActive 
                            ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg' 
                            : 'border-purple-300 hover:border-purple-400 hover:bg-purple-25'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              Glissez-déposez vos photos ici
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              ou cliquez pour sélectionner des fichiers
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              type="button"
                              className="bg-white hover:bg-gray-50 border-purple-300 text-purple-700 hover:text-purple-800"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Parcourir les fichiers
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400">
                            Formats supportés: JPG, PNG, GIF, WebP • Taille max: 10MB par fichier
                          </p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e.target.files)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Upload */}
                

                {/* Section Aperçu des fichiers */}
                {uploadData.photos.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-900">
                        Photos sélectionnées ({uploadData.photos.length})
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploadData.photos.map((file, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Aperçu de l'image */}
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded flex items-center justify-center">
                              <div className="opacity-0 hover:opacity-100 transition-opacity">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="bg-white/90 hover:bg-white"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Aperçu
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Résumé */}
                {uploadData.assignment_id && uploadData.photo_type_id && uploadData.photos.length > 0 && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Résumé de l'upload</h3>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-gray-700">Dossier:</span>
                          <span className="text-gray-900">#{uploadData.assignment_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-gray-700">Type:</span>
                          <span className="text-gray-900">
                            {photoTypes.find(t => t.id.toString() === uploadData.photo_type_id)?.label || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-gray-700">Photos:</span>
                          <span className="text-gray-900">{uploadData.photos.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsUploadDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!uploadData.assignment_id || uploadData.photos.length === 0 || uploading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Uploader {uploadData.photos.length} photo{uploadData.photos.length > 1 ? 's' : ''}
                  </>
                )}
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
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Photos</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couvertures</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.cover}</div>
            <p className="text-xs text-muted-foreground">Photos de couverture</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPhotoTypeId} onValueChange={handlePhotoTypeChange}>
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
                handlePhotoTypeChange('')
                handleSearchChange('')
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
                  className="h-8 w-8 p-0 "
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

        {/* Pagination Sticky Bottom */}
        {pagination && pagination.total > 0 && (
          <div className="pl-80 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Informations de pagination */}
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Affichage de <span className="font-medium">{pagination.from}</span> à{' '}
                    <span className="font-medium">{pagination.to}</span> sur{' '}
                    <span className="font-medium">{pagination.total}</span> photos
                  </div>
                  
                  {/* Sélecteur de nombre d'éléments par page */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Par page:</span>
                    <Select value={perPage.toString()} onValueChange={(value) => handlePerPageChange(Number(value))}>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Navigation de pagination */}
                <div className="flex items-center space-x-2">
                  {/* Première page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || loading}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  {/* Page précédente */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Numéros de pages */}
                  <div className="flex items-center space-x-1">
                    {(() => {
                      const pages = []
                      const totalPages = pagination.last_page
                      const current = currentPage
                      
                      // Logique pour afficher les pages intelligemment
                      let startPage = Math.max(1, current - 2)
                      let endPage = Math.min(totalPages, current + 2)
                      
                      // Ajuster si on est près du début ou de la fin
                      if (current <= 3) {
                        endPage = Math.min(5, totalPages)
                      }
                      if (current >= totalPages - 2) {
                        startPage = Math.max(1, totalPages - 4)
                      }
                      
                      // Page 1 si pas visible
                      if (startPage > 1) {
                        pages.push(
                          <Button
                            key={1}
                            variant={1 === current ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            1
                          </Button>
                        )
                        if (startPage > 2) {
                          pages.push(
                            <span key="ellipsis1" className="px-2 text-gray-500">
                              ...
                            </span>
                          )
                        }
                      }
                      
                      // Pages principales
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === current ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(i)}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            {i}
                          </Button>
                        )
                      }
                      
                      // Dernière page si pas visible
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span key="ellipsis2" className="px-2 text-gray-500">
                              ...
                            </span>
                          )
                        }
                        pages.push(
                          <Button
                            key={totalPages}
                            variant={totalPages === current ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        )
                      }
                      
                      return pages
                    })()}
                  </div>

                  {/* Page suivante */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page || loading}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Dernière page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.last_page)}
                    disabled={currentPage === pagination.last_page || loading}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
            </Main></>
            
  )
}

export default function PhotosPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_PHOTO}>
      <PhotosPageContent />
    </ProtectedRoute>
  )
}
