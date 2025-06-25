import { create } from 'zustand'
import { assignmentTypeService } from '@/services/assignmentTypeService'
import { toast } from 'sonner'

// Types basés sur l'API existante
interface AssignmentType {
  id: number
  code: string
  label: string
  description: string
  created_at: string
  updated_at: string
}

interface CreateAssignmentTypeData {
  code: string
  label: string
  description?: string
}

interface UpdateAssignmentTypeData {
  code?: string
  label?: string
  description?: string
}

interface AssignmentTypesState {
  // État
  assignmentTypes: AssignmentType[]
  loading: boolean
  error: string | null
  selectedAssignmentType: AssignmentType | null
  
  // Actions
  fetchAssignmentTypes: () => Promise<void>
  createAssignmentType: (data: CreateAssignmentTypeData) => Promise<void>
  updateAssignmentType: (id: number, data: UpdateAssignmentTypeData) => Promise<void>
  deleteAssignmentType: (id: number) => Promise<void>
  setSelectedAssignmentType: (assignmentType: AssignmentType | null) => void
  clearError: () => void
}

export const useAssignmentTypesStore = create<AssignmentTypesState>((set) => ({
  // État initial
  assignmentTypes: [],
  loading: false,
  error: null,
  selectedAssignmentType: null,

  // Actions
  fetchAssignmentTypes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await assignmentTypeService.getAssignmentTypes()
      set({ assignmentTypes: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des types d\'assignation'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createAssignmentType: async (data: CreateAssignmentTypeData) => {
    try {
      set({ loading: true })
      const newAssignmentType = await assignmentTypeService.createAssignmentType(data)
      set(state => ({ 
        assignmentTypes: [...state.assignmentTypes, newAssignmentType], 
        loading: false 
      }))
      toast.success('Type d\'assignation créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updateAssignmentType: async (id: number, data: UpdateAssignmentTypeData) => {
    try {
      set({ loading: true })
      const updatedAssignmentType = await assignmentTypeService.updateAssignmentType(id, data)
      set(state => ({
        assignmentTypes: state.assignmentTypes.map(assignmentType =>
          assignmentType.id === id ? updatedAssignmentType : assignmentType
        ),
        loading: false
      }))
      toast.success('Type d\'assignation mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deleteAssignmentType: async (id: number) => {
    try {
      set({ loading: true })
      await assignmentTypeService.deleteAssignmentType(id)
      set(state => ({
        assignmentTypes: state.assignmentTypes.filter(assignmentType => assignmentType.id !== id),
        loading: false
      }))
      toast.success('Type d\'assignation supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedAssignmentType: (assignmentType: AssignmentType | null) => {
    set({ selectedAssignmentType: assignmentType })
  },

  clearError: () => {
    set({ error: null })
  },
})) 