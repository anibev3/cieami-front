import { create } from 'zustand'
import { DocumentTransmis, DocumentTransmisFilters } from './types'
import * as api from './api'

interface DocumentsTransmisState {
  documents: DocumentTransmis[]
  total: number
  loading: boolean
  error: string | null
  selectedDocument: DocumentTransmis | null
  fetchDocuments: (filters?: DocumentTransmisFilters, token?: string) => Promise<void>
  fetchDocument: (id: number, token?: string) => Promise<void>
  createDocument: (doc: Partial<DocumentTransmis>, token?: string) => Promise<void>
  updateDocument: (id: number, doc: Partial<DocumentTransmis>, token?: string) => Promise<void>
  deleteDocument: (id: number, token?: string) => Promise<void>
  setSelectedDocument: (doc: DocumentTransmis | null) => void
}

export const useDocumentsTransmisStore = create<DocumentsTransmisState>((set, get) => ({
  documents: [],
  total: 0,
  loading: false,
  error: null,
  selectedDocument: null,

  fetchDocuments: async (filters, token) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getDocumentsTransmis(filters, token)
      set({ documents: res.data, total: res.meta.total, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  fetchDocument: async (id, token) => {
    set({ loading: true, error: null })
    try {
      const doc = await api.getDocumentTransmisById(id, token)
      set({ selectedDocument: doc, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  createDocument: async (doc, token) => {
    set({ loading: true, error: null })
    try {
      await api.createDocumentTransmis(doc, token)
      await get().fetchDocuments(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la création', loading: false })
    }
  },

  updateDocument: async (id, doc, token) => {
    set({ loading: true, error: null })
    try {
      await api.updateDocumentTransmis(id, doc, token)
      await get().fetchDocuments(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la modification', loading: false })
    }
  },

  deleteDocument: async (id, token) => {
    set({ loading: true, error: null })
    try {
      await api.deleteDocumentTransmis(id, token)
      await get().fetchDocuments(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la suppression', loading: false })
    }
  },

  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
})) 