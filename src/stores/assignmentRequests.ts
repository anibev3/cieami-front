import { create } from 'zustand'
import { AssignmentRequest, AssignmentRequestFilters } from '@/types/assignment-requests'
import { assignmentRequestService } from '@/services/assignmentRequestService'
import { toast } from 'sonner'

interface AssignmentRequestsStore {
  // État
  assignmentRequests: AssignmentRequest[]
  loading: boolean
  error: string | null
  searchQuery: string
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
  filters: AssignmentRequestFilters

  // Actions
  fetchAssignmentRequests: (page?: number, filters?: AssignmentRequestFilters) => Promise<void>
  setSearchQuery: (query: string) => void
  setFilters: (filters: AssignmentRequestFilters) => void
  clearFilters: () => void
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  clearError: () => void
  deleteAssignmentRequest: (id: string) => Promise<void>
  rejectAssignmentRequest: (id: string) => Promise<void>
}

export const useAssignmentRequestsStore = create<AssignmentRequestsStore>((set, get) => ({
  // État initial
  assignmentRequests: [],
  loading: false,
  error: null,
  searchQuery: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },
  filters: {},

  // Actions
  fetchAssignmentRequests: async (page = 1, filters = {}) => {
    try {
      set({ loading: true, error: null })
      
      const currentState = get()
      const mergedFilters = {
        ...currentState.filters,
        ...filters,
        search: currentState.searchQuery || filters.search,
      }

      const response = await assignmentRequestService.getAssignmentRequests(page, mergedFilters)
      
      set({
        assignmentRequests: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des demandes d\'expertise'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },

  setFilters: (filters: AssignmentRequestFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  clearFilters: () => {
    set({ filters: {}, searchQuery: '' })
  },

  goToPage: (page: number) => {
    const { fetchAssignmentRequests, filters, searchQuery } = get()
    fetchAssignmentRequests(page, { ...filters, search: searchQuery })
  },

  goToNextPage: () => {
    const { pagination, goToPage } = get()
    if (pagination.currentPage < pagination.totalPages) {
      goToPage(pagination.currentPage + 1)
    }
  },

  goToPreviousPage: () => {
    const { pagination, goToPage } = get()
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1)
    }
  },

  clearError: () => {
    set({ error: null })
  },

  deleteAssignmentRequest: async (id: string) => {
    try {
      set({ loading: true, error: null })
      await assignmentRequestService.deleteAssignmentRequest(id)
      toast.success('Demande d\'expertise supprimée avec succès')
      
      // Recharger la liste
      const { pagination, filters, searchQuery } = get()
      await get().fetchAssignmentRequests(pagination.currentPage, { ...filters, search: searchQuery })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  rejectAssignmentRequest: async (id: string) => {
    try {
      set({ loading: true, error: null })
      await assignmentRequestService.rejectAssignmentRequest(id)
      toast.success('Demande d\'expertise rejetée avec succès')
      
      // Recharger la liste
      const { pagination, filters, searchQuery } = get()
      await get().fetchAssignmentRequests(pagination.currentPage, { ...filters, search: searchQuery })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du rejet de la demande'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },
}))

