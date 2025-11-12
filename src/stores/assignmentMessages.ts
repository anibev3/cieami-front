import { create } from 'zustand'
import { assignmentMessageService } from '@/services/assignmentMessageService'
import { AssignmentMessage, CreateAssignmentMessagePayload, UpdateAssignmentMessagePayload } from '@/types/assignment-messages'
import { toast } from 'sonner'

interface AssignmentMessagesState {
  messages: AssignmentMessage[]
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    perPage: number
  }
}

interface AssignmentMessagesActions {
  fetchMessages: (assignmentId?: string, page?: number) => Promise<void>
  createMessage: (data: CreateAssignmentMessagePayload) => Promise<void>
  updateMessage: (id: string, data: UpdateAssignmentMessagePayload) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  clearError: () => void
}

type AssignmentMessagesStore = AssignmentMessagesState & AssignmentMessagesActions

export const useAssignmentMessagesStore = create<AssignmentMessagesStore>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  fetchMessages: async (assignmentId, page = 1) => {
    set({ loading: true, error: null })
    try {
      const response = await assignmentMessageService.getMessages(assignmentId, page)
      set({
        messages: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
        },
        loading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des messages'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  createMessage: async (data) => {
    set({ loading: true, error: null })
    try {
      const newMessage = await assignmentMessageService.createMessage(data)
      set((state) => ({
        messages: [newMessage, ...state.messages],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1,
        },
        loading: false,
      }))
      toast.success('Message envoyé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  updateMessage: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updatedMessage = await assignmentMessageService.updateMessage(id, data)
      set((state) => ({
        messages: state.messages.map((msg) => (msg.id === id ? updatedMessage : msg)),
        loading: false,
      }))
      toast.success('Message modifié avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification du message'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  deleteMessage: async (id) => {
    set({ loading: true, error: null })
    try {
      await assignmentMessageService.deleteMessage(id)
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== id),
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems - 1,
        },
        loading: false,
      }))
      toast.success('Message supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du message'
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  clearError: () => set({ error: null }),
}))

