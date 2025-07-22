import { create } from 'zustand'
import { toast } from 'sonner'
import { workforceTypesService } from '@/services/workforce-types'
import {
  WorkforceType,
  WorkforceTypeCreate,
  WorkforceTypeUpdate,
  WorkforceTypesResponse,
} from '@/types/workforce-types'

interface WorkforceTypesState {
  workforceTypes: WorkforceType[]
  currentWorkforceType: WorkforceType | null
  loading: boolean
  pagination: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  error: string | null
}

interface WorkforceTypesActions {
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentWorkforceType: (workforceType: WorkforceType | null) => void
  clearError: () => void

  fetchWorkforceTypes: (page?: number) => Promise<void>
  fetchWorkforceTypeById: (id: number) => Promise<void>
  createWorkforceType: (data: WorkforceTypeCreate) => Promise<WorkforceType>
  updateWorkforceType: (id: number, data: WorkforceTypeUpdate) => Promise<boolean>
  deleteWorkforceType: (id: number) => Promise<boolean>

  reset: () => void
}

const initialState: WorkforceTypesState = {
  workforceTypes: [],
  currentWorkforceType: null,
  loading: false,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  },
  error: null,
}

export const useWorkforceTypesStore = create<WorkforceTypesState & WorkforceTypesActions>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentWorkforceType: (workforceType) => set({ currentWorkforceType: workforceType }),
  clearError: () => set({ error: null }),

  fetchWorkforceTypes: async (page = 1) => {
    try {
      set({ loading: true, error: null })
      const response: WorkforceTypesResponse = await workforceTypesService.getAll(page)
      set({
        workforceTypes: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement des types main d\'oeuvre' })
    }
  },

  fetchWorkforceTypeById: async (id: number) => {
    try {
      set({ loading: true, error: null })
      const response = await workforceTypesService.getById(id)
      set({ currentWorkforceType: response.data, loading: false })
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors du chargement du type main d\'oeuvre' })
    }
  },

  createWorkforceType: async (data: WorkforceTypeCreate) => {
    try {
      set({ loading: true, error: null })
      const response = await workforceTypesService.create(data)
      await get().fetchWorkforceTypes(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Type main d\'oeuvre créé avec succès')
      return response.data
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la création du type main d\'oeuvre' })
      throw _error
    }
  },

  updateWorkforceType: async (id: number, data: WorkforceTypeUpdate) => {
    try {
      set({ loading: true, error: null })
      await workforceTypesService.update(id, data)
      await get().fetchWorkforceTypes(get().pagination.currentPage)
      await get().fetchWorkforceTypeById(id)
      set({ loading: false })
      toast.success('Type main d\'oeuvre mis à jour avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la mise à jour du type main d\'oeuvre' })
      return false
    }
  },

  deleteWorkforceType: async (id: number) => {
    try {
      set({ loading: true, error: null })
      await workforceTypesService.delete(id)
      await get().fetchWorkforceTypes(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Type main d\'oeuvre supprimé avec succès')
      return true
    } catch (_error) {
      set({ loading: false, error: 'Erreur lors de la suppression du type main d\'oeuvre' })
      return false
    }
  },

  reset: () => set(initialState),
})) 