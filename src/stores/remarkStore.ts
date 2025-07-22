import { create } from 'zustand'
import { Remark, CreateRemarkData, UpdateRemarkData } from '@/types/administration'
import { remarkService } from '@/services/remarkService'
import { toast } from 'sonner'

interface RemarkState {
  // État
  remarks: Remark[]
  loading: boolean
  error: string | null
  selectedRemark: Remark | null
  
  // Actions
  fetchRemarks: () => Promise<void>
  createRemark: (data: CreateRemarkData) => Promise<void>
  updateRemark: (id: number, data: UpdateRemarkData) => Promise<void>
  deleteRemark: (id: number) => Promise<void>
  setSelectedRemark: (remark: Remark | null) => void
  clearError: () => void
}

export const useRemarkStore = create<RemarkState>((set) => ({
  // État initial
  remarks: [],
  loading: false,
  error: null,
  selectedRemark: null,

  // Actions
  fetchRemarks: async () => {
    try {
      set({ loading: true, error: null })
      const response = await remarkService.getAll()
      set({ remarks: response.data, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des remarques'
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
    }
  },

  createRemark: async (data: CreateRemarkData) => {
    try {
      set({ loading: true })
      const newRemark = await remarkService.create(data)
      set(state => ({ 
        remarks: [...state.remarks, newRemark], 
        loading: false 
      }))
      toast.success('Remarque créée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  updateRemark: async (id: number, data: UpdateRemarkData) => {
    try {
      set({ loading: true })
      const updatedRemark = await remarkService.update(id, data)
      set(state => ({
        remarks: state.remarks.map(remark =>
          remark.id === id ? updatedRemark : remark
        ),
        loading: false
      }))
      toast.success('Remarque mise à jour avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  deleteRemark: async (id: number) => {
    try {
      set({ loading: true })
      await remarkService.delete(id)
      set(state => ({
        remarks: state.remarks.filter(remark => remark.id !== id),
        loading: false
      }))
      toast.success('Remarque supprimée avec succès')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ loading: false })
      toast.error(errorMessage, {
        duration: 1000,
      })
      throw error
    }
  },

  setSelectedRemark: (remark: Remark | null) => {
    set({ selectedRemark: remark })
  },

  clearError: () => {
    set({ error: null })
  },
})) 