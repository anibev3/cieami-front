import { create } from 'zustand'
import { PhotoType, CreatePhotoTypeData, UpdatePhotoTypeData } from '@/types/gestion'
import { photoTypeService } from '@/services/photoTypeService'
import { toast } from 'sonner'

interface PhotoTypeState {
  // État
  photoTypes: PhotoType[]
  loading: boolean
  error: string | null
  selectedPhotoType: PhotoType | null
  
  // Actions
  fetchPhotoTypes: () => Promise<void>
  createPhotoType: (data: CreatePhotoTypeData) => Promise<void>
  updatePhotoType: (id: number, data: UpdatePhotoTypeData) => Promise<void>
  deletePhotoType: (id: number) => Promise<void>
  setSelectedPhotoType: (photoType: PhotoType | null) => void
  clearError: () => void
}

export const usePhotoTypeStore = create<PhotoTypeState>((set) => ({
  // État initial
  photoTypes: [],
  loading: false,
  error: null,
  selectedPhotoType: null,

  // Actions
  fetchPhotoTypes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await photoTypeService.getAll()
      set({ photoTypes: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des types de photos'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createPhotoType: async (data: CreatePhotoTypeData) => {
    try {
      set({ loading: true })
      const newPhotoType = await photoTypeService.create(data)
      set(state => ({ 
        photoTypes: [...state.photoTypes, newPhotoType], 
        loading: false 
      }))
      toast.success('Type de photo créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updatePhotoType: async (id: number, data: UpdatePhotoTypeData) => {
    try {
      set({ loading: true })
      const updatedPhotoType = await photoTypeService.update(id, data)
      set(state => ({
        photoTypes: state.photoTypes.map(photoType =>
          photoType.id === id ? updatedPhotoType : photoType
        ),
        loading: false
      }))
      toast.success('Type de photo mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deletePhotoType: async (id: number) => {
    try {
      set({ loading: true })
      await photoTypeService.delete(id)
      set(state => ({
        photoTypes: state.photoTypes.filter(photoType => photoType.id !== id),
        loading: false
      }))
      toast.success('Type de photo supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedPhotoType: (photoType: PhotoType | null) => {
    set({ selectedPhotoType: photoType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 