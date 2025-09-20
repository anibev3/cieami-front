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
import { Upload, Camera, Star, Edit, Trash2, X, Plus, Grid3X3, Eye, Loader2, ChevronLeft, ChevronRight, Download, Info, Calendar, Hash, Tag, CheckCircle } from 'lucide-react'
import { CreatePhotoData, UpdatePhotoData, Photo, PhotoType } from '@/types/gestion'
import { photoService } from '@/services/photoService'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { PhotoTypeSelect } from '@/features/widgets/photo-type-select'

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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('grid')
  const [tabsData, setTabsData] = useState<TabData[]>([])
  const [loadingEditPhoto, setLoadingEditPhoto] = useState(false)
  const [loadingDeletePhoto, setLoadingDeletePhoto] = useState(false)
  const [loadingSetAsCoverPhoto, setLoadingSetAsCoverPhoto] = useState(false)
  const [uploadData, setUploadData] = useState<CreatePhotoData>({
    assignment_id: assignmentId,
    photo_type_id: '',
    photos: []
  })
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set())
  const [editData, setEditData] = useState<UpdatePhotoData>({
    photo_type_id: '',
    photo: new File([], '')
  })
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  // Photo viewer states
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

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

  // Photo viewer functions
  const openPhotoViewer = (photo: Photo) => {
    const currentPhotos = getCurrentTabData()?.photos || []
    const index = currentPhotos.findIndex(p => p.id === photo.id)
    setCurrentPhotoIndex(index)
    setIsViewerOpen(true)
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const currentPhotos = getCurrentTabData()?.photos || []
    if (direction === 'prev') {
      setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : currentPhotos.length - 1)
    } else {
      setCurrentPhotoIndex(prev => prev < currentPhotos.length - 1 ? prev + 1 : 0)
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

  // Raccourcis clavier pour la sélection multiple
  useEffect(() => {
    const handleUploadDialogKeyDown = (e: KeyboardEvent) => {
      if (!isUploadDialogOpen) return
      
      switch (e.key) {
        case 'Escape':
          setIsUploadDialogOpen(false)
          break
        case 'a':
        case 'A':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (selectedFiles.size === uploadData.photos.length) {
              setSelectedFiles(new Set())
            } else {
              setSelectedFiles(new Set(uploadData.photos.map((_, index) => index)))
            }
          }
          break
        case 'Delete':
        case 'Backspace':
          if (selectedFiles.size > 0) {
            e.preventDefault()
            const remainingPhotos = uploadData.photos.filter((_, index) => !selectedFiles.has(index))
            setUploadData(prev => ({ ...prev, photos: remainingPhotos }))
            setSelectedFiles(new Set())
            toast.success(`${selectedFiles.size} photo(s) supprimée(s)`)
          }
          break
      }
    }

    document.addEventListener('keydown', handleUploadDialogKeyDown)
    return () => document.removeEventListener('keydown', handleUploadDialogKeyDown)
  }, [isUploadDialogOpen, selectedFiles, uploadData.photos])

  const getCurrentTabData = () => {
    return tabsData.find(tab => tab.id === activeTab) || tabsData[0]
  }

  const currentTabData = getCurrentTabData()
  const currentPhotos = currentTabData?.photos || []
  const currentPhoto = currentPhotos[currentPhotoIndex]

  const downloadPhoto = (photoUrl: string, photoName: string) => {
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = photoName || `photo-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      
      // Validation des fichiers
      const validFiles = fileArray.filter(file => {
        // Vérifier seulement le type MIME
        if (!file.type.startsWith('image/')) {
          toast.error(`Fichier ignoré: ${file.name} - Type non supporté`)
          return false
        }
        
        // Accepter n'importe quelle taille
        return true
      })
      
      if (validFiles.length !== fileArray.length) {
        // Afficher un message d'alerte si certains fichiers ont été ignorés
        const ignoredCount = fileArray.length - validFiles.length
        toast.warning(`${ignoredCount} fichier(s) ignoré(s) - Vérifiez le type de fichier`)
      }
      
      setUploadData(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles]
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
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedPhoto) return
    setLoadingEditPhoto(true)
    try {
      await updatePhoto(selectedPhoto.id, editData)
      setIsEditDialogOpen(false)
      setSelectedPhoto(null)
      setEditData({
        photo_type_id: '',
        photo: new File([], '')
      })
      
      // Recharger les photos
      refreshCurrentTab()
    } catch (_error) {
      // Error handled by store
    } finally {
      setLoadingEditPhoto(false)
    }
  }

  const handleDelete = async (id: number) => {
    setLoadingDeletePhoto(true)
    try {
      await deletePhoto(id)
      refreshCurrentTab()
    } catch (_error) {
      // Error handled by store
    } finally {
      setLoadingDeletePhoto(false)
    }
  }

  const handleSetAsCover = async (id: number) => {
    setLoadingSetAsCoverPhoto(true)
    try {
      await setAsCover(id)
      refreshCurrentTab()
    } catch (_error) {
      // Error handled by store
    } finally {
      setLoadingSetAsCoverPhoto(false)
    }
  }

  const openEditDialog = (photo: Photo) => {
    setSelectedPhoto(photo)
    setEditData({
      photo_type_id: photo.photo_type?.id ? photo.photo_type.id.toString() : '',
      photo: new File([], '')
    })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total: tabsData.reduce((sum, tab) => sum + tab.count, 0),
    cover: currentPhotos.filter(p => p.is_cover).length,
    types: photoTypes.length
  }

  const PhotoCard = ({ photo }: { photo: Photo }) => (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg h-64 cursor-pointer" onClick={() => openPhotoViewer(photo)}>
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
            {photo?.photo_type?.label}
          </Badge>
        </div>
        
        {/* Actions au centre (visible au hover) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openPhotoViewer(photo)
                  }}
                  className="h-12 w-12 p-0 rounded-full bg-primary/95 hover:bg-secondary shadow-lg backdrop-blur-sm"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voir la photo</p>
              </TooltipContent>
            </Tooltip>

            
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditDialog(photo)
                  }}
                  className="h-12 w-12 p-0 rounded-full bg-primary/95 hover:bg-secondary shadow-lg backdrop-blur-sm"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifier la photo</p>
              </TooltipContent>
            </Tooltip>


            <Tooltip>
              <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleSetAsCover(photo.id)
              }}
              disabled={photo.is_cover}
              className="h-12 w-12 p-0 rounded-full bg-primary/95 hover:bg-secondary shadow-lg backdrop-blur-sm"
            >
              <Star className="h-5 w-5" />
            </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mettre en couverture</p>
              </TooltipContent>
            </Tooltip>
            


            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-12 w-12 p-0 rounded-full bg-primary/95 hover:bg-secondary shadow-lg backdrop-blur-sm"
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
      <div className="flex items-center justify-between sticky top-0 bg-white z-10">
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
          <Dialog open={isUploadDialogOpen} onOpenChange={(open) => {
            setIsUploadDialogOpen(open)
            if (!open) {
              setSelectedFiles(new Set())
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter des photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] min-h-[90vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Ajouter des photos à {assignmentReference}</DialogTitle>
                <DialogDescription>
                  Sélectionnez un type de photo et ajoutez vos images.
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Raccourcis: Ctrl+A (Tout sélectionner), Delete (Supprimer sélection), Escape (Fermer)</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 flex-1 overflow-y-auto">
                <div className="flex gap-4">
                  <div className="w-1/3">
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
                  {/* Upload Zone - Optimisée pour économiser l'espace */}
                  <div className="w-2/3">
                    <div
                      className={` border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <p className="text-sm text-muted-foreground">
                            Glissez-déposez vos photos ici ou
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          Sélectionner des fichiers
                        </Button>
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
                <hr />

                


                {/* Selected Files with Preview */}
                {uploadData.photos.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Fichiers sélectionnés ({uploadData.photos.length})</Label>
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadData(prev => ({ ...prev, photos: [] }))
                          }}
                          className="text-destructive hover:text-destructive text-xs px-2 py-1 h-7"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Tout supprimer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const sortedPhotos = [...uploadData.photos].sort((a, b) => 
                              a.name.localeCompare(b.name)
                            )
                            setUploadData(prev => ({ ...prev, photos: sortedPhotos }))
                          }}
                          className="text-xs px-2 py-1 h-7"
                        >
                          <Hash className="mr-1 h-3 w-3" />
                          Par nom
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const sortedPhotos = [...uploadData.photos].sort((a, b) => 
                              a.size - b.size
                            )
                            setUploadData(prev => ({ ...prev, photos: sortedPhotos }))
                          }}
                          className="text-xs px-2 py-1 h-7"
                        >
                          <Hash className="mr-1 h-3 w-3" />
                          Par taille
                        </Button>
                        {selectedFiles.size > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const remainingPhotos = uploadData.photos.filter((_, index) => !selectedFiles.has(index))
                              setUploadData(prev => ({ ...prev, photos: remainingPhotos }))
                              setSelectedFiles(new Set())
                            }}
                            className="text-destructive hover:text-destructive text-xs px-2 py-1 h-7"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Supprimer ({selectedFiles.size})
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-y-auto">
                      {uploadData.photos.map((file, index) => (
                        <div 
                          key={index} 
                          className={`group relative border rounded-lg overflow-hidden bg-gray-50 cursor-pointer transition-all duration-200 ${
                            selectedFiles.has(index) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            const newSelected = new Set(selectedFiles)
                            if (newSelected.has(index)) {
                              newSelected.delete(index)
                            } else {
                              newSelected.add(index)
                            }
                            setSelectedFiles(newSelected)
                          }}
                        >
                          {/* Selection indicator */}
                          {selectedFiles.has(index) && (
                            <div className="absolute top-1 left-1 z-10">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Preview Image - Plus compacte */}
                          <div className="aspect-square relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onLoad={(e) => {
                                // Cleanup object URL after load
                                setTimeout(() => URL.revokeObjectURL(e.currentTarget.src), 1000)
                              }}
                            />
                            
                            {/* Overlay with actions - Plus compact */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // Open preview modal
                                        const modal = document.createElement('div')
                                        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
                                        modal.innerHTML = `
                                          <div class="relative max-w-4xl max-h-[80vh] mx-auto">
                                            <button class="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded" onclick="this.parentElement.parentElement.remove()">
                                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                            <img src="${URL.createObjectURL(file)}" alt="${file.name}" class="max-w-full max-h-full object-contain" />
                                            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                              ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </div>
                                          </div>
                                        `
                                        document.body.appendChild(modal)
                                        modal.addEventListener('click', (e) => {
                                          if (e.target === modal) modal.remove()
                                        })
                                      }}
                                      className="h-6 w-6 p-0 rounded-full bg-white/90 hover:bg-white shadow-lg"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Voir en plein écran</p>
                                  </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(index)
                                      }}
                                      className="h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600 text-white shadow-lg"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Supprimer</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          
                          {/* File info - Plus compacte */}
                          <div className="p-1">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary - Plus compact */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                      <span className="font-medium">
                        {uploadData.photos.length} photo(s)
                      </span>
                      <span>
                        {(uploadData.photos.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex-shrink-0 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploadData.photos.length === 0 || uploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {uploading ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className="h-4 w-4 animate-spin" /> 
                      Envoi en cours...
                    </span>
                  ) : (
                    'Uploader'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                  <Dialog open={isUploadDialogOpen} onOpenChange={(open) => {
                    setIsUploadDialogOpen(open)
                    if (!open) {
                      setSelectedFiles(new Set())
                    }
                  }}>
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
            {currentPhotoIndex + 1} / {currentPhotos.length}
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
                    <span className="text-sm">{assignmentReference}</span>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Modifier la photo #{selectedPhoto?.id}
            </DialogTitle>
            <DialogDescription>
              Modifiez le type de photo et remplacez l'image si nécessaire.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche - Prévisualisation et informations */}
            <div className="space-y-4">
              {/* Prévisualisation de l'image actuelle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Image actuelle</Label>
                <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                  {selectedPhoto && (
                    <img
                      src={selectedPhoto.photo}
                      alt={selectedPhoto.name || `Photo ${selectedPhoto.id}`}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  {selectedPhoto?.is_cover && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 text-white border-0">
                        <Star className="mr-1 h-3 w-3" />
                        Couverture
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations de la photo */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Informations</Label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">#{selectedPhoto?.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nom:</span>
                    <span className="font-medium truncate max-w-[200px]" title={selectedPhoto?.name}>
                      {selectedPhoto?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type actuel:</span>
                    <Badge variant="secondary">
                      {selectedPhoto?.photo_type?.label || 'Non défini'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Créé le:</span>
                    <span className="font-medium">
                      {selectedPhoto ? new Date(selectedPhoto.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire de modification */}
            <div className="space-y-4">
              {/* Type de photo */}
              <PhotoTypeSelect value={editData.photo_type_id} onValueChange={(value) => setEditData({ ...editData, photo_type_id: value })} />

              {/* Nouvelle photo */}
              <div className="space-y-2">
                <Label htmlFor="edit-photo" className="text-sm font-medium">
                  Nouvelle photo (optionnel)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    id="edit-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditData({ ...editData, photo: e.target.files[0] })
                      }
                    }}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour sélectionner une nouvelle image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats supportés: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('edit-photo')?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Choisir un fichier
                    </Button>
                  </div>
                </div>
                
                {/* Prévisualisation de la nouvelle image */}
                {editData.photo && editData.photo.size > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nouvelle image</Label>
                    <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={URL.createObjectURL(editData.photo)}
                        alt="Nouvelle image"
                        className="w-full h-32 object-cover"
                        onLoad={(e) => {
                          setTimeout(() => URL.revokeObjectURL(e.currentTarget.src), 1000)
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setEditData({ ...editData, photo: new File([], '') })}
                          className="h-6 w-6 p-0 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Nom: {editData.photo.name}</p>
                      <p>Taille: {(editData.photo.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Actions rapides</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedPhoto) {
                        handleSetAsCover(selectedPhoto.id)
                        setIsEditDialogOpen(false)
                      }
                    }}
                    disabled={selectedPhoto?.is_cover}
                    className="flex-1"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {selectedPhoto?.is_cover ? 'Déjà couverture' : 'Définir couverture'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedPhoto) {
                        downloadPhoto(selectedPhoto.photo, selectedPhoto.name || `photo-${selectedPhoto.id}.jpg`)
                      }
                    }}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
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
                      onClick={() => {
                        if (selectedPhoto) {
                          handleDelete(selectedPhoto.id)
                          setIsEditDialogOpen(false)
                        }
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleEdit}
                disabled={loadingEditPhoto}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loadingEditPhoto ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="mr-2 h-4 w-4" />
                )}
                {loadingEditPhoto ? 'Modification en cours...' : 'Modifier'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 