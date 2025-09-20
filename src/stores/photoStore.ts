import { create } from 'zustand'
import { Photo, CreatePhotoData, UpdatePhotoData, PhotoFilters } from '@/types/gestion'
import { photoService } from '@/services/photoService'
import { toast } from 'sonner'

interface PhotoState {
  // État
  photos: Photo[]
  loading: boolean
  error: string | null
  selectedPhoto: Photo | null
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  } | null
  
  // Actions
  fetchPhotos: (filters?: PhotoFilters) => Promise<void>
  createPhotos: (data: CreatePhotoData) => Promise<void>
  updatePhoto: (id: number, data: UpdatePhotoData) => Promise<void>
  deletePhoto: (id: number) => Promise<void>
  setAsCover: (id: number) => Promise<void>
  reorderPhotos: (assignmentId: string, photoIds: number[]) => Promise<void>
  setSelectedPhoto: (photo: Photo | null) => void
  clearError: () => void
}

export const usePhotoStore = create<PhotoState>((set) => ({
  // État initial
  photos: [],
  loading: false,
  error: null,
  selectedPhoto: null,
  pagination: null,

  // Actions
  fetchPhotos: async (filters?: PhotoFilters) => {
    try {
      set({ loading: true, error: null })
      const response = await photoService.getAll(filters)
      set({ 
        photos: response.data, 
        pagination: {
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
          from: response.meta.from,
          to: response.meta.to
        },
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des photos'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createPhotos: async (data: CreatePhotoData) => {
    try {
      set({ loading: true })
      await photoService.create(data)
      set({ loading: false })
      toast.success(`${data.photos.length} photo(s) créée(s) avec succès`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updatePhoto: async (id: number, data: UpdatePhotoData) => {
    try {
      set({ loading: true })
      const updatedPhoto = await photoService.update(id, data)
      set(state => ({
        photos: state.photos.map(photo =>
          photo.id === id ? updatedPhoto : photo
        ),
        loading: false
      }))
      toast.success('Photo mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deletePhoto: async (id: number) => {
    try {
      set({ loading: true })
      await photoService.delete(id)
      set(state => ({
        photos: state.photos.filter(photo => photo.id !== id),
        loading: false
      }))
      toast.success('Photo supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setAsCover: async (id: number) => {
    try {
      set({ loading: true })
      await photoService.setAsCover(id)
      
      // Mettre à jour toutes les photos pour s'assurer qu'une seule est en couverture
      set(state => ({
        photos: state.photos.map(photo => ({
          ...photo,
          is_cover: photo.id === id
        })),
        loading: false
      }))
      
      toast.success('Photo définie comme couverture avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la définition de la couverture'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  reorderPhotos: async (assignmentId: string, photoIds: number[]) => {
    try {
      set({ loading: true })
      await photoService.reorderPhotos(assignmentId, photoIds)
      
      // Mettre à jour l'ordre des photos localement
      set(state => {
        const reorderedPhotos = photoIds.map(id => 
          state.photos.find(photo => photo.id === id)
        ).filter(Boolean) as Photo[]
        
        const remainingPhotos = state.photos.filter(photo => 
          !photoIds.includes(photo.id)
        )
        
        return {
          photos: [...reorderedPhotos, ...remainingPhotos],
          loading: false
        }
      })
      
      toast.success('Ordre des photos mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la réorganisation'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedPhoto: (photo: Photo | null) => {
    set({ selectedPhoto: photo })
  },

  clearError: () => {
    set({ error: null })
  },
})) 