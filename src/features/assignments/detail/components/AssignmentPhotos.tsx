import { useState, useEffect, useRef } from 'react'
import { usePhotoStore } from '@/stores/photoStore'
import { usePhotoTypeStore } from '@/stores/photoTypeStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Camera, Star, Edit, Trash2, X, Image as ImageIcon, Plus } from 'lucide-react'
import { CreatePhotoData, UpdatePhotoData, Photo } from '@/types/gestion'

interface AssignmentPhotosProps {
  assignmentId: string
  assignmentReference: string
}

export function AssignmentPhotos({ assignmentId, assignmentReference }: AssignmentPhotosProps) {
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

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
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

  useEffect(() => {
    fetchPhotos({ assignment_id: assignmentId })
    fetchPhotoTypes()
  }, [fetchPhotos, fetchPhotoTypes, assignmentId])

  const assignmentPhotos = photos.filter(photo => photo.assignment_id === assignmentId)

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
      photo_type_id: photo.photo_type_id,
      photo: new File([], '')
    })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total: assignmentPhotos.length,
    cover: assignmentPhotos.filter(p => p.is_cover).length,
    byType: photoTypes.length
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Photos de l'assignation</h3>
          <p className="text-sm text-muted-foreground">
            {assignmentPhotos.length} photo(s) pour {assignmentReference}
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
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
              >
                Uploader
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
            <p className="text-xs text-muted-foreground">Photos</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Couverture</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cover}</div>
            <p className="text-xs text-muted-foreground">Photo de couverture</p>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byType}</div>
            <p className="text-xs text-muted-foreground">Types disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Photos Grid */}
      {assignmentPhotos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assignmentPhotos.map((photo) => (
            <Card key={photo.id} className="hover:shadow-lg transition-shadow shadow-none">
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={photo.photo_url}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {photo.is_cover && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      <Star className="mr-1 h-3 w-3" />
                      Couverture
                    </Badge>
                  )}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetAsCover(photo.id)}
                      disabled={photo.is_cover}
                      className="h-8 w-8 p-0"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">#{photo.id}</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(photo)}
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
                  <div className="text-xs text-muted-foreground">
                    <div>Type: {photo.photo_type?.label || 'N/A'}</div>
                    <div>Créé le {new Date(photo.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune photo</h3>
            <p className="text-muted-foreground text-center mb-4">
              Aucune photo n'a encore été ajoutée à cette assignation.
            </p>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter la première photo
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      )}
    </div>
  )
} 