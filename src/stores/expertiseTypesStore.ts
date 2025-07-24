import { create } from 'zustand'
import { toast } from 'sonner'

interface ExpertiseType {
  id: number
  code: string
  label: string
  description: string
  status: {
    id: number
    code: string
    label: string
    description: string
  }
}

interface ExpertiseTypesState {
  expertiseTypes: ExpertiseType[]
  loading: boolean
  error: string | null
  
  fetchExpertiseTypes: () => Promise<void>
  clearError: () => void
}

export const useExpertiseTypesStore = create<ExpertiseTypesState>((set) => ({
  expertiseTypes: [],
  loading: false,
  error: null,

  fetchExpertiseTypes: async () => {
    try {
      set({ loading: true, error: null })
      
      // Simuler un appel API - à remplacer par l'appel réel
      const mockData: ExpertiseType[] = [
        {
          id: 1,
          code: 'evaluation',
          label: 'Évaluation',
          description: 'Expertise de type évaluation',
          status: {
            id: 1,
            code: 'active',
            label: 'Actif',
            description: 'Statut actif'
          }
        },
        {
          id: 2,
          code: 'non-evaluation',
          label: 'Non-évaluation',
          description: 'Expertise de type non-évaluation',
          status: {
            id: 1,
            code: 'active',
            label: 'Actif',
            description: 'Statut actif'
          }
        }
      ]
      
      set({ 
        expertiseTypes: mockData, 
        loading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des types d\'expertise'
      set({ 
        error: errorMessage, 
        loading: false 
      })
      toast.error(errorMessage)
    }
  },

  clearError: () => {
    set({ error: null })
  }
})) 