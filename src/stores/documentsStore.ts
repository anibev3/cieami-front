import { create } from 'zustand'
import { DocumentTransmitted, CreateDocumentTransmittedData, UpdateDocumentTransmittedData } from '@/types/administration'
import { documentTransmittedService } from '@/services/documentTransmittedService'
import { toast } from 'sonner'

interface DocumentsState {
  // État
  documents: DocumentTransmitted[]
  loading: boolean
  error: string | null
  selectedDocument: DocumentTransmitted | null
  
  // Actions
  fetchDocuments: () => Promise<void>
  createDocument: (data: CreateDocumentTransmittedData) => Promise<void>
  updateDocument: (id: number, data: UpdateDocumentTransmittedData) => Promise<void>
  deleteDocument: (id: number) => Promise<void>
  setSelectedDocument: (document: DocumentTransmitted | null) => void
  clearError: () => void
}

export const useDocumentsStore = create<DocumentsState>((set) => ({
  // État initial
  documents: [],
  loading: false,
  error: null,
  selectedDocument: null,

  // Actions
  fetchDocuments: async () => {
    try {
      set({ loading: true, error: null })
      const response = await documentTransmittedService.getAll()
      set({ documents: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des documents'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createDocument: async (data: CreateDocumentTransmittedData) => {
    try {
      set({ loading: true })
      const newDocument = await documentTransmittedService.create(data)
      set(state => ({ 
        documents: [...state.documents, newDocument], 
        loading: false 
      }))
      toast.success('Document créé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateDocument: async (id: number, data: UpdateDocumentTransmittedData) => {
    try {
      set({ loading: true })
      const updatedDocument = await documentTransmittedService.update(id, data)
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === id ? updatedDocument : doc
        ),
        loading: false
      }))
      toast.success('Document mis à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteDocument: async (id: number) => {
    try {
      set({ loading: true })
      await documentTransmittedService.delete(id)
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        loading: false
      }))
      toast.success('Document supprimé avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedDocument: (document: DocumentTransmitted | null) => {
    set({ selectedDocument: document })
  },

  clearError: () => {
    set({ error: null })
  },
})) 