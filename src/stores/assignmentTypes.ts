import { create } from 'zustand'
import { assignmentTypeService } from '@/services/assignmentTypeService'
import { AssignmentType, AssignmentTypeCreate, AssignmentTypeUpdate, AssignmentTypeFilters } from '@/types/assignment-types'

interface AssignmentTypesState {
  assignmentTypes: AssignmentType[]
  currentAssignmentType: AssignmentType | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
}

interface AssignmentTypesActions {
  // Actions
  fetchAssignmentTypes: (page?: number, filters?: AssignmentTypeFilters) => Promise<void>
  fetchAssignmentType: (id: number) => Promise<void>
  createAssignmentType: (assignmentTypeData: AssignmentTypeCreate) => Promise<void>
  updateAssignmentType: (id: number, assignmentTypeData: AssignmentTypeUpdate) => Promise<void>
  deleteAssignmentType: (id: number) => Promise<void>
  setCurrentAssignmentType: (assignmentType: AssignmentType | null) => void
  clearError: () => void
}

type AssignmentTypesStore = AssignmentTypesState & AssignmentTypesActions

export const useAssignmentTypesStore = create<AssignmentTypesStore>((set, get) => ({
  // État initial
  assignmentTypes: [],
  currentAssignmentType: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  // Actions
  fetchAssignmentTypes: async (page = 1, filters) => {
    set({ loading: true, error: null })
    
    try {
      const response = await assignmentTypeService.getAssignmentTypes(page, filters)
      
      set({
        assignmentTypes: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des types d\'affectation',
      })
    }
  },

  fetchAssignmentType: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const assignmentType = await assignmentTypeService.getAssignmentType(id)
      set({ currentAssignmentType: assignmentType, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement du type d\'affectation',
      })
    }
  },

  createAssignmentType: async (assignmentTypeData) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentTypeService.createAssignmentType(assignmentTypeData)
      // Recharger la liste après création
      await get().fetchAssignmentTypes(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création du type d\'affectation',
      })
      throw error
    }
  },

  updateAssignmentType: async (id, assignmentTypeData) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentTypeService.updateAssignmentType(id, assignmentTypeData)
      // Recharger la liste après mise à jour
      await get().fetchAssignmentTypes(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du type d\'affectation',
      })
      throw error
    }
  },

  deleteAssignmentType: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentTypeService.deleteAssignmentType(id)
      // Recharger la liste après suppression
      await get().fetchAssignmentTypes(get().pagination.currentPage)
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression du type d\'affectation',
      })
      throw error
    }
  },

  setCurrentAssignmentType: (assignmentType) => {
    set({ currentAssignmentType: assignmentType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 