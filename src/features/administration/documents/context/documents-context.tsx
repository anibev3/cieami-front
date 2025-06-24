import { createContext, useContext, useReducer, ReactNode } from 'react'
import { DocumentTransmitted, CreateDocumentTransmittedData, UpdateDocumentTransmittedData } from '@/types/administration'
import { documentTransmittedService } from '@/services/documentTransmittedService'
import { toast } from 'sonner'

// Types pour l'état
interface DocumentsState {
  documents: DocumentTransmitted[]
  loading: boolean
  error: string | null
  selectedDocument: DocumentTransmitted | null
  isCreateDialogOpen: boolean
  isEditDialogOpen: boolean
  isDeleteDialogOpen: boolean
  isViewDialogOpen: boolean
}

// Types pour les actions
type DocumentsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENTS'; payload: DocumentTransmitted[] }
  | { type: 'ADD_DOCUMENT'; payload: DocumentTransmitted }
  | { type: 'UPDATE_DOCUMENT'; payload: DocumentTransmitted }
  | { type: 'DELETE_DOCUMENT'; payload: number }
  | { type: 'SET_SELECTED_DOCUMENT'; payload: DocumentTransmitted | null }
  | { type: 'SET_CREATE_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_EDIT_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_DELETE_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_VIEW_DIALOG_OPEN'; payload: boolean }

// État initial
const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
  selectedDocument: null,
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  isViewDialogOpen: false,
}

// Reducer
function documentsReducer(state: DocumentsState, action: DocumentsAction): DocumentsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload }
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] }
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        ),
      }
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
      }
    case 'SET_SELECTED_DOCUMENT':
      return { ...state, selectedDocument: action.payload }
    case 'SET_CREATE_DIALOG_OPEN':
      return { ...state, isCreateDialogOpen: action.payload }
    case 'SET_EDIT_DIALOG_OPEN':
      return { ...state, isEditDialogOpen: action.payload }
    case 'SET_DELETE_DIALOG_OPEN':
      return { ...state, isDeleteDialogOpen: action.payload }
    case 'SET_VIEW_DIALOG_OPEN':
      return { ...state, isViewDialogOpen: action.payload }
    default:
      return state
  }
}

// Contexte
interface DocumentsContextType extends DocumentsState {
  // Actions
  fetchDocuments: () => Promise<void>
  createDocument: (data: CreateDocumentTransmittedData) => Promise<void>
  updateDocument: (id: number, data: UpdateDocumentTransmittedData) => Promise<void>
  deleteDocument: (id: number) => Promise<void>
  selectDocument: (document: DocumentTransmitted | null) => void
  
  // Dialog actions
  openCreateDialog: () => void
  closeCreateDialog: () => void
  openEditDialog: (document: DocumentTransmitted) => void
  closeEditDialog: () => void
  openDeleteDialog: (document: DocumentTransmitted) => void
  closeDeleteDialog: () => void
  openViewDialog: (document: DocumentTransmitted) => void
  closeViewDialog: () => void
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined)

// Provider
interface DocumentsProviderProps {
  children: ReactNode
}

export function DocumentsProvider({ children }: DocumentsProviderProps) {
  const [state, dispatch] = useReducer(documentsReducer, initialState)

  // Actions
  const fetchDocuments = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      const response = await documentTransmittedService.getAll()
      dispatch({ type: 'SET_DOCUMENTS', payload: response.data })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des documents'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast.error(errorMessage)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createDocument = async (data: CreateDocumentTransmittedData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const newDocument = await documentTransmittedService.create(data)
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument })
      
      toast.success('Document créé avec succès')
      closeCreateDialog()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateDocument = async (id: number, data: UpdateDocumentTransmittedData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const updatedDocument = await documentTransmittedService.update(id, data)
      dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument })
      
      toast.success('Document mis à jour avec succès')
      closeEditDialog()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteDocument = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      await documentTransmittedService.delete(id)
      dispatch({ type: 'DELETE_DOCUMENT', payload: id })
      
      toast.success('Document supprimé avec succès')
      closeDeleteDialog()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      toast.error(errorMessage)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const selectDocument = (document: DocumentTransmitted | null) => {
    dispatch({ type: 'SET_SELECTED_DOCUMENT', payload: document })
  }

  // Dialog actions
  const openCreateDialog = () => {
    dispatch({ type: 'SET_CREATE_DIALOG_OPEN', payload: true })
  }

  const closeCreateDialog = () => {
    dispatch({ type: 'SET_CREATE_DIALOG_OPEN', payload: false })
  }

  const openEditDialog = (document: DocumentTransmitted) => {
    selectDocument(document)
    dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: true })
  }

  const closeEditDialog = () => {
    dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: false })
    selectDocument(null)
  }

  const openDeleteDialog = (document: DocumentTransmitted) => {
    selectDocument(document)
    dispatch({ type: 'SET_DELETE_DIALOG_OPEN', payload: true })
  }

  const closeDeleteDialog = () => {
    dispatch({ type: 'SET_DELETE_DIALOG_OPEN', payload: false })
    selectDocument(null)
  }

  const openViewDialog = (document: DocumentTransmitted) => {
    selectDocument(document)
    dispatch({ type: 'SET_VIEW_DIALOG_OPEN', payload: true })
  }

  const closeViewDialog = () => {
    dispatch({ type: 'SET_VIEW_DIALOG_OPEN', payload: false })
    selectDocument(null)
  }

  const value: DocumentsContextType = {
    ...state,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    selectDocument,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    openViewDialog,
    closeViewDialog,
  }

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  )
}

// Hook personnalisé
export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider')
  }
  return context
}

export default DocumentsProvider 