import { create } from 'zustand'
import { Photo, CreatePhotoData, UpdatePhotoData } from '@/types/gestion'
import { photoService } from '@/services/photoService'
import { toast } from 'sonner'

interface PhotoState {
  // État
  photos: Photo[]
  loading: boolean
  error: string | null
  selectedPhoto: Photo | null
  
  // Actions
  fetchPhotos: (filters?: Record<string, unknown>) => Promise<void>
  createPhotos: (data: CreatePhotoData) => Promise<void>
  updatePhoto: (id: number, data: UpdatePhotoData) => Promise<void>
  deletePhoto: (id: number) => Promise<void>
  setAsCover: (id: number) => Promise<void>
  setSelectedPhoto: (photo: Photo | null) => void
  clearError: () => void
}

export const usePhotoStore = create<PhotoState>((set) => ({
  // État initial
  photos: [],
  loading: false,
  error: null,
  selectedPhoto: null,

  // Actions
  fetchPhotos: async (filters?: Record<string, unknown>) => {
    try {
      set({ loading: true, error: null })
      const response = await photoService.getAll(filters)
      set({ photos: response.data, loading: false })
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

  setSelectedPhoto: (photo: Photo | null) => {
    set({ selectedPhoto: photo })
  },

  clearError: () => {
    set({ error: null })
  },
})) 