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
  
  // Actions de pagination
  setCurrentPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToPage: (page: number) => void
  
  // Actions de filtrage
  setSearchQuery: (query: string) => void
  setActiveTab: (tab: string) => void
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
      { value: 'active', label: 'Actives' },
      { value: 'opened', label: 'Ouvertes' },
      { value: 'realized', label: 'Réalisées' },
      { value: 'edited', label: 'Éditées' },
      { value: 'corrected', label: 'Corrigées' },
    ],
  },
  {
    label: 'Finalisées',
    items: [
      { value: 'closed', label: 'Fermées' },
      { value: 'in_payment', label: 'En paiement' },
      { value: 'paid', label: 'Payées' },
    ],
  },
  {
    label: 'Autres',
    items: [
      { value: 'inactive', label: 'Inactives' },
      { value: 'cancelled', label: 'Annulées' },
      { value: 'deleted', label: 'Supprimées' },
    ],
  },
]

// Créer une liste plate de tous les statuts pour les onglets
const getAllStatusTabs = (): StatusTab[] => {
  const tabs: StatusTab[] = [{ value: 'all', label: 'Toutes' }]
  
  statusGroups.forEach((group) => {
    if (group.items) {
      group.items.forEach((item) => {
        tabs.push({ value: item.value, label: item.label })
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
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  // Actions principales
  fetchAssignments: async (page = 1, filters) => {
    set({ loading: true, error: null })
    
    try {
      // Construire les filtres à partir de l'état actuel
      const currentFilters: AssignmentFilters = {
        ...filters,
        search: get().searchQuery,
        status_code: get().activeTab !== 'all' ? get().activeTab : undefined,
      }
      
      const response = await assignmentService.getAssignments(page, currentFilters)
      
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
      toast.error(errorMessage)
    }
  },

  fetchAssignmentsRecoveryExpired: async (date_from: string, date_to: string, assignment_type_id: number) => {

    try {
      const response = await assignmentService.getAssignmentsRecoveryExpired(date_from, date_to, assignment_type_id)
      set({ assignmentsRecoveryExpired: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des assignations'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  fetchAssignmentsEditionExpired: async (date_from: string, date_to: string, assignment_type_id: number) => {

    try {
      const response = await assignmentService.getAssignmentsEditionExpired(date_from, date_to, assignment_type_id)
      set({ assignmentsEditionExpired: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des assignations'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
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
      toast.error(errorMessage)
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
      toast.error(errorMessage)
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
      toast.error(errorMessage)
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
      toast.error(errorMessage)
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
      toast.error(errorMessage)
      throw error
    }
  },

  // Actions de pagination
  setCurrentPage: (page) => {
    set({ pagination: { ...get().pagination, currentPage: page } })
    get().fetchAssignments(page)
  },

  goToNextPage: () => {
    const nextPage = get().pagination.currentPage + 1
    if (nextPage <= get().pagination.totalPages) {
      set({ pagination: { ...get().pagination, currentPage: nextPage } })
      get().fetchAssignments(nextPage)
    }
  },

  goToPreviousPage: () => {
    const prevPage = get().pagination.currentPage - 1
    if (prevPage >= 1) {
      set({ pagination: { ...get().pagination, currentPage: prevPage } })
      get().fetchAssignments(prevPage)
    }
  },

  goToPage: (page) => {
    if (page >= 1 && page <= get().pagination.totalPages) {
      set({ pagination: { ...get().pagination, currentPage: page } })
      get().fetchAssignments(page)
    }
  },

  // Actions de filtrage
  setSearchQuery: (query) => {
    set({ searchQuery: query, pagination: { ...get().pagination, currentPage: 1 } })
    get().fetchAssignments(1)
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab, pagination: { ...get().pagination, currentPage: 1 } })
    get().fetchAssignments(1)
  },

  getFilteredAssignments: () => {
    const { assignments } = get()
    return assignments
  },

  getStatusCounts: () => {
    const { assignments } = get()
    const counts: Record<string, number> = { all: assignments.length }

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
      toast.error(errorMessage)
      throw error
    }
  },

  createReceipt: async (assignmentId, receiptData) => {
    try {
      await receiptService.createReceipt(assignmentId, receiptData)
      toast.success('Quittance créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la quittance'
      toast.error(errorMessage)
      throw error
    }
  },

  createMultipleReceipts: async (assignmentId, receipts) => {
    try {
      await receiptService.createMultipleReceipts(assignmentId, receipts)
      toast.success(`${receipts.length} quittance(s) créée(s) avec succès`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création des quittances'
      toast.error(errorMessage)
      throw error
    }
  },

  updateReceipt: async (receiptId, receiptData) => {
    try {
      await receiptService.updateReceipt(receiptId, receiptData)
      toast.success('Quittance mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la quittance'
      toast.error(errorMessage)
      throw error
    }
  },

  deleteReceipt: async (receiptId) => {
    try {
      await receiptService.deleteReceipt(receiptId)
      toast.success('Quittance supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la quittance'
      toast.error(errorMessage)
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