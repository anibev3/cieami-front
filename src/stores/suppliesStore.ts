import { create } from 'zustand'
import { toast } from 'sonner'

interface Supply {
  id: number
  label: string
  description?: string
  price?: number
}

interface SuppliesState {
  supplies: Supply[]
  loading: boolean
  error: string | null
}

interface SuppliesActions {
  fetchSupplies: () => Promise<void>
  clearError: () => void
}

type SuppliesStore = SuppliesState & SuppliesActions

export const useSuppliesStore = create<SuppliesStore>((set) => ({
  supplies: [],
  loading: false,
  error: null,

  fetchSupplies: async () => {
    try {
      set({ loading: true, error: null })
      // Simuler un appel API - à remplacer par le vrai service
      const mockSupplies: Supply[] = [
        { id: 1, label: 'Pare-choc avant', price: 150 },
        { id: 2, label: 'Pare-choc arrière', price: 140 },
        { id: 3, label: 'Aile avant gauche', price: 200 },
        { id: 4, label: 'Aile avant droite', price: 200 },
        { id: 5, label: 'Aile arrière gauche', price: 180 },
        { id: 6, label: 'Aile arrière droite', price: 180 },
        { id: 7, label: 'Capot', price: 300 },
        { id: 8, label: 'Hayon', price: 250 },
        { id: 9, label: 'Portière avant gauche', price: 220 },
        { id: 10, label: 'Portière avant droite', price: 220 },
        { id: 11, label: 'Portière arrière gauche', price: 200 },
        { id: 12, label: 'Portière arrière droite', price: 200 },
        { id: 13, label: 'Rétroviseur gauche', price: 80 },
        { id: 14, label: 'Rétroviseur droit', price: 80 },
        { id: 15, label: 'Phare avant gauche', price: 120 },
        { id: 16, label: 'Phare avant droit', price: 120 },
        { id: 17, label: 'Feu arrière gauche', price: 90 },
        { id: 18, label: 'Feu arrière droit', price: 90 },
        { id: 19, label: 'Calandre', price: 100 },
        { id: 20, label: 'Bas de caisse', price: 160 },
      ]
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set({ supplies: mockSupplies, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des fournitures'
      set({ error: errorMessage, loading: false })
            toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },
})) 