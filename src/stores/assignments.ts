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
  Receipt,
  ReceiptCreate
} from '@/types/assignments'
import { toast } from 'sonner'

interface AssignmentsState {
  assignments: Assignment[]
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
  
  // Actions de filtrage
  setSearchQuery: (query: string) => void
  setActiveTab: (tab: string) => void
  getFilteredAssignments: () => Assignment[]
  getStatusCounts: () => Record<string, number>
  
  // Actions pour les quittances
  fetchReceipts: (assignmentId: number) => Promise<Receipt[]>
  createReceipt: (receiptData: ReceiptCreate) => Promise<void>
  createMultipleReceipts: (assignmentId: number, receipts: Omit<ReceiptCreate, 'assignment_id'>[]) => Promise<void>
  updateReceipt: (assignmentId: number, receiptId: number, receiptData: Partial<ReceiptCreate>) => Promise<void>
  deleteReceipt: (assignmentId: number, receiptId: number) => Promise<void>
  
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
      const response = await assignmentService.getAssignments(page, filters)
      
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

  // Actions de filtrage
  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },

  getFilteredAssignments: () => {
    const { assignments, activeTab, searchQuery } = get()
    let filtered = assignments

    // Filtrer par statut
    if (activeTab !== 'all') {
      filtered = filtered.filter(assignment => assignment.status.code === activeTab)
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(assignment =>
        assignment.reference.toLowerCase().includes(query) ||
        assignment.client.name.toLowerCase().includes(query) ||
        assignment.vehicle.license_plate.toLowerCase().includes(query) ||
        assignment.status.label.toLowerCase().includes(query)
      )
    }

    return filtered
  },

  getStatusCounts: () => {
    const { assignments } = get()
    const counts: Record<string, number> = { all: assignments.length }

    statusGroups.forEach((group) => {
      if (group.items) {
        group.items.forEach((item) => {
          counts[item.value] = assignments.filter(assignment => assignment.status.code === item.value).length
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

  createReceipt: async (receiptData) => {
    try {
      await receiptService.createReceipt(receiptData)
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

  updateReceipt: async (assignmentId, receiptId, receiptData) => {
    try {
      await receiptService.updateReceipt(assignmentId, receiptId, receiptData)
      toast.success('Quittance mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la quittance'
      toast.error(errorMessage)
      throw error
    }
  },

  deleteReceipt: async (assignmentId, receiptId) => {
    try {
      await receiptService.deleteReceipt(assignmentId, receiptId)
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