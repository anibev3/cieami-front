import { create } from 'zustand'
import { Bank, CreateBankData, UpdateBankData } from '@/types/comptabilite'
import { bankService } from '@/services/bankService'
import { toast } from 'sonner'

interface BankState {
  // État
  banks: Bank[]
  loading: boolean
  error: string | null
  selectedBank: Bank | null
  
  // Actions
  fetchBanks: () => Promise<void>
  createBank: (data: CreateBankData) => Promise<void>
  updateBank: (id: number, data: UpdateBankData) => Promise<void>
  deleteBank: (id: number) => Promise<void>
  setSelectedBank: (bank: Bank | null) => void
  clearError: () => void
}

export const useBankStore = create<BankState>((set) => ({
  // État initial
  banks: [],
  loading: false,
  error: null,
  selectedBank: null,

  // Actions
  fetchBanks: async () => {
    try {
      set({ loading: true, error: null })
      const response = await bankService.getAll()
      set({ banks: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des banques'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },

  createBank: async (data: CreateBankData) => {
    try {
      set({ loading: true })
      const newBank = await bankService.create(data)
      set(state => ({ 
        banks: [...state.banks, newBank], 
        loading: false 
      }))
      toast.success('Banque créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  updateBank: async (id: number, data: UpdateBankData) => {
    try {
      set({ loading: true })
      const updatedBank = await bankService.update(id, data)
      set(state => ({
        banks: state.banks.map(bank =>
          bank.id === id ? updatedBank : bank
        ),
        loading: false
      }))
      toast.success('Banque mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  deleteBank: async (id: number) => {
    try {
      set({ loading: true })
      await bankService.delete(id)
      set(state => ({
        banks: state.banks.filter(bank => bank.id !== id),
        loading: false
      }))
      toast.success('Banque supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage)
      throw error
    }
  },

  setSelectedBank: (bank: Bank | null) => {
    set({ selectedBank: bank })
  },

  clearError: () => {
    set({ error: null })
  },
})) 