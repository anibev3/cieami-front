/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { assignmentService } from '@/services/assignmentService'
import { receiptService } from '@/services/receiptService'
import { 
  Assignment, 
  AssignmentCreate, 
  AssignmentUpdate, 
  AssignmentFilters,
  StatusGroup,
  StatusTab,
  Receipt
} from '@/types/assignments'
import { toast } from 'sonner'

interface AssignmentsState {
  assignments: Assignment[]
  assignmentsRecoveryExpired: Assignment[]
  assignmentsEditionExpired: Assignment[]
  currentAssignment: Assignment | null
  loading: boolean
  error: string | null
  searchQuery: string
  activeTab: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
}

interface AssignmentsActions {
  // Actions principales
  fetchAssignments: (page?: number, filters?: AssignmentFilters) => Promise<void>
  fetchAssignment: (id: number) => Promise<void>
  createAssignment: (assignmentData: AssignmentCreate) => Promise<void>
  updateAssignment: (id: number, assignmentData: AssignmentUpdate) => Promise<void>
  deleteAssignment: (id: number) => Promise<void>
  changeAssignmentStatus: (id: number, statusId: number) => Promise<void>
  generateReport: (id: number) => Promise<string>

  
  // Actions de pagination
  setCurrentPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToPage: (page: number) => void
  
  // Actions de filtrage
  setSearchQuery: (query: string) => void
  setActiveTab: (tab: string) => void
  setDateRange: (range: { from: Date | null; to: Date | null }) => void
  clearDateRange: () => void
  getFilteredAssignments: () => Assignment[]
  getStatusCounts: () => Record<string, number>
  
  // Actions pour les quittances
  fetchReceipts: (assignmentId: number) => Promise<Receipt[]>
  createReceipt: (assignmentId: number, receiptData: { receipt_type_id: number; amount: number }) => Promise<void>
  createMultipleReceipts: (assignmentId: number, receipts: { receipt_type_id: number; amount: number }[]) => Promise<void>
  updateReceipt: (receiptId: number, receiptData: { assignment_id: number; receipt_type_id: number; amount: number }) => Promise<void>
  deleteReceipt: (receiptId: number) => Promise<void>
  
  // Actions utilitaires
  setCurrentAssignment: (assignment: Assignment | null) => void
  clearError: () => void
}

type AssignmentsStore = AssignmentsState & AssignmentsActions

// Configuration des groupes de statuts (identique au Vue.js)
const statusGroups: StatusGroup[] = [
  {
    label: 'Toutes',
    value: 'all',
  },
  {
    label: 'En cours',
    items: [
      {id: 3, value: 'opened', label: 'Ouvertes' },    
      {id: 4, value: 'realized', label: 'Réalisées' }, 
      { id: 5, value: 'edited', label: 'Éditées' },    
      { id: 6, value: 'validated', label: 'Validées' },
    ],
  },
  // case 3 = 'opened';
  //   case 4 = 'realized';
  //   case 5 = 'edited';
  //   case 6 = 'validated';
  //   case 7 = 'closed';
  //   case 8 = 'cancelled';
  //   case 9 = 'archived';
  //   case 12 = 'paid';
  {
    label: 'Finalisées',
    items: [
      { id: 7, value: 'closed', label: 'Fermées' },
      { id: 12, value: 'paid', label: 'Payées' },
      { id: 8, value: 'cancelled', label: 'Annulées' },
      { id: 9, value: 'archived', label: 'Archivées' },
    ],
  }
]

// Créer une liste plate de tous les statuts pour les onglets
const getAllStatusTabs = (): StatusTab[] => {
  const tabs: StatusTab[] = [{ id: 0, value: 'all', label: 'Toutes' }]
  
  statusGroups.forEach((group) => {
    if (group.items) {
      group.items.forEach((item) => {
        tabs.push({ id: item.id, value: item.value, label: item.label })
      })
    }
  })
  
  return tabs
}

export const useAssignmentsStore = create<AssignmentsStore>((set, get) => ({
  // État initial
  assignments: [],
  assignmentsRecoveryExpired: [],
  assignmentsEditionExpired: [],
  currentAssignment: null,
  loading: false,
  error: null,
  searchQuery: '',
  activeTab: 'all',
  dateRange: {
    from: null,
    to: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  // Actions principales
  fetchAssignments: async (page = 1, filters) => {

    console.log('fetchAssignments =====>', page, filters)
    set({ loading: true, error: null })
    
    try {
      // Construire les filtres à partir de l'état actuel et des filtres passés
      const currentState = get()
      const startDate = currentState.dateRange.from ? currentState.dateRange.from.toISOString().split('T')[0] : undefined
      const endDate = currentState.dateRange.to ? currentState.dateRange.to.toISOString().split('T')[0] : undefined
      
      const currentFilters: AssignmentFilters = {
        ...filters,
        // Utiliser les filtres passés en priorité, sinon utiliser l'état actuel
        search: filters?.search !== undefined ? filters.search : currentState.searchQuery,
        per_page: filters?.per_page || currentState.pagination.perPage,
        status_code: filters?.status_code !== undefined ? filters.status_code : (currentState.activeTab !== 'all' ? currentState.activeTab : undefined),
        start_date: filters?.start_date !== undefined ? filters.start_date : startDate,
        end_date: filters?.end_date !== undefined ? filters.end_date : endDate,
      }
      
      console.log('Final filters:', currentFilters)
      
      const response = await assignmentService.getAssignments(page, currentFilters)
      
      console.log('API Response:', response)
      console.log('Pagination data:', {
        currentPage: response.meta.current_page,
        totalPages: response.meta.last_page,
        totalItems: response.meta.total,
        perPage: response.meta.per_page,
      })
      
      set({
        assignments: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des assignations'
      set({ loading: false, error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  fetchAssignment: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const assignment = await assignmentService.getAssignment(id)
      set({ currentAssignment: assignment, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement de l\'assignation'
      set({ loading: false, error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createAssignment: async (assignmentData) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentService.createAssignment(assignmentData)
      await get().fetchAssignments(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Assignation créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false, error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateAssignment: async (id, assignmentData) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentService.updateAssignment(id, assignmentData)
      await get().fetchAssignments(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Assignation mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false, error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteAssignment: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentService.deleteAssignment(id)
      await get().fetchAssignments(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Assignation supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false, error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  changeAssignmentStatus: async (id, statusId) => {
    set({ loading: true, error: null })
    
    try {
      await assignmentService.changeAssignmentStatus(id, statusId)
      await get().fetchAssignments(get().pagination.currentPage)
      set({ loading: false })
      toast.success('Statut modifié avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du changement de statut'
      set({ loading: false, error: errorMessage })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  generateReport: async (id: number): Promise<string> => {
    set({ loading: true })
    try {
      const response = await assignmentService.generateReport(id)
      set({ loading: false })
      toast.success(response.message || 'Rapport généré avec succès')
      await get().fetchAssignment(id)
      return response.message || 'Rapport généré avec succès'
    } catch (error: any) {
      set({ loading: false })
      const errMsg = error?.response?.data?.errors?.[0]?.detail || (error instanceof Error ? error.message : 'Erreur lors de la génération du rapport')
      toast.error(errMsg)
      return errMsg
    }
  },

  // Actions de pagination
  setCurrentPage: (page) => {
    set({ pagination: { ...get().pagination, currentPage: page } })
    const currentFilters = {
      search: get().searchQuery,
      status_code: get().activeTab !== 'all' ? get().activeTab : undefined,
    }
    get().fetchAssignments(page, currentFilters)
  },

  goToNextPage: () => {
    const nextPage = get().pagination.currentPage + 1
    if (nextPage <= get().pagination.totalPages) {
      set({ pagination: { ...get().pagination, currentPage: nextPage } })
      const currentFilters = {
        search: get().searchQuery,
        status_code: get().activeTab !== 'all' ? get().activeTab : undefined,
      }
      get().fetchAssignments(nextPage, currentFilters)
    }
  },

  goToPreviousPage: () => {
    const prevPage = get().pagination.currentPage - 1
    if (prevPage >= 1) {
      set({ pagination: { ...get().pagination, currentPage: prevPage } })
      const currentFilters = {
        search: get().searchQuery,
        status_code: get().activeTab !== 'all' ? get().activeTab : undefined,
      }
      get().fetchAssignments(prevPage, currentFilters)
    }
  },

  goToPage: (page) => {
    if (page >= 1 && page <= get().pagination.totalPages) {
      set({ pagination: { ...get().pagination, currentPage: page } })
      const currentFilters = {
        search: get().searchQuery,
        status_code: get().activeTab !== 'all' ? get().activeTab : undefined,
      }
      get().fetchAssignments(page, currentFilters)
    }
  },

  // Actions de filtrage
  setSearchQuery: (query) => {
    set({ searchQuery: query, pagination: { ...get().pagination, currentPage: 1 } })
    const currentState = get()
    const startDate = currentState.dateRange.from ? currentState.dateRange.from.toISOString().split('T')[0] : undefined
    const endDate = currentState.dateRange.to ? currentState.dateRange.to.toISOString().split('T')[0] : undefined
    
    const filters: AssignmentFilters = { search: query }
    if (startDate) filters.start_date = startDate
    if (endDate) filters.end_date = endDate
    
    get().fetchAssignments(1, filters)
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab, pagination: { ...get().pagination, currentPage: 1 } })
    const currentState = get()
    const startDate = currentState.dateRange.from ? currentState.dateRange.from.toISOString().split('T')[0] : undefined
    const endDate = currentState.dateRange.to ? currentState.dateRange.to.toISOString().split('T')[0] : undefined
    
    const filters: AssignmentFilters = tab !== 'all' ? { status_code: tab } : {}
    if (startDate) filters.start_date = startDate
    if (endDate) filters.end_date = endDate
    
    get().fetchAssignments(1, filters)
  },

  setDateRange: (range) => {
    set({ dateRange: range })
  },

  clearDateRange: () => {
    set({ dateRange: { from: null, to: null } })
  },

  getFilteredAssignments: () => {
    const { assignments } = get()
    return assignments
  },

  getStatusCounts: () => {
    const { assignments } = get()
    const counts: Record<string, number> = { all: assignments.length }

    // Pour l'instant, on compte localement
    // TODO: Implémenter un endpoint API pour récupérer les compteurs par statut
    statusGroups.forEach((group) => {
      if (group.items) {
        group.items.forEach((item) => {
          counts[item.value] = assignments.filter(assignment => assignment.status?.code === item.value).length
        })
      }
    })

    return counts
  },

  // Actions pour les quittances
  fetchReceipts: async (assignmentId) => {
    try {
      const receipts = await receiptService.getReceiptsByAssignment(assignmentId)
      return receipts
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des quittances'
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  createReceipt: async (assignmentId, receiptData) => {
    try {
      await receiptService.createReceipt(assignmentId, receiptData)
      toast.success('Quittance créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la quittance'
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  createMultipleReceipts: async (assignmentId, receipts) => {
    try {
      await receiptService.createMultipleReceipts(assignmentId, receipts)
      toast.success(`${receipts.length} quittance(s) créée(s) avec succès`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création des quittances'
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateReceipt: async (receiptId, receiptData) => {
    try {
      await receiptService.updateReceipt(receiptId, receiptData)
      toast.success('Quittance mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la quittance'
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteReceipt: async (receiptId) => {
    try {
      await receiptService.deleteReceipt(receiptId)
      toast.success('Quittance supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la quittance'
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  // Actions utilitaires
  setCurrentAssignment: (assignment) => {
    set({ currentAssignment: assignment })
  },

  clearError: () => {
    set({ error: null })
  },
}))

// Export des utilitaires
export { statusGroups, getAllStatusTabs } 