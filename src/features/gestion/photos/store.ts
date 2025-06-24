import { create } from 'zustand'
import { Photo, PhotoFilters } from './types'
import * as api from './api'

interface PhotosState {
  photos: Photo[]
  total: number
  loading: boolean
  error: string | null
  selectedPhoto: Photo | null
  fetchPhotos: (filters?: PhotoFilters, token?: string) => Promise<void>
  fetchPhoto: (id: number, token?: string) => Promise<void>
  createPhoto: (photo: Partial<Photo>, token?: string) => Promise<void>
  updatePhoto: (id: number, photo: Partial<Photo>, token?: string) => Promise<void>
  deletePhoto: (id: number, token?: string) => Promise<void>
  setSelectedPhoto: (photo: Photo | null) => void
}

export const usePhotosStore = create<PhotosState>((set, get) => ({
  photos: [],
  total: 0,
  loading: false,
  error: null,
  selectedPhoto: null,

  fetchPhotos: async (filters, token) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getPhotos(filters, token)
      set({ photos: res.data, total: res.meta.total, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  fetchPhoto: async (id, token) => {
    set({ loading: true, error: null })
    try {
      const photo = await api.getPhotoById(id, token)
      set({ selectedPhoto: photo, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  createPhoto: async (photo, token) => {
    set({ loading: true, error: null })
    try {
      await api.createPhoto(photo, token)
      await get().fetchPhotos(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la création', loading: false })
    }
  },

  updatePhoto: async (id, photo, token) => {
    set({ loading: true, error: null })
    try {
      await api.updatePhoto(id, photo, token)
      await get().fetchPhotos(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la modification', loading: false })
    }
  },

  deletePhoto: async (id, token) => {
    set({ loading: true, error: null })
    try {
      await api.deletePhoto(id, token)
      await get().fetchPhotos(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la suppression', loading: false })
    }
  },

  setSelectedPhoto: (photo) => set({ selectedPhoto: photo }),
})) 