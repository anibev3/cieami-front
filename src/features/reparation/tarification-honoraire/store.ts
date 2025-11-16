/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { WorkFee, WorkFeeApiResponse } from './types'
import * as api from './api'

interface WorkFeesState {
  workFees: WorkFee[]
  loading: boolean
  error: string | null
  token: string | null
  setToken: (token: string) => void
  fetchWorkFees: () => Promise<void>
  createWorkFee: (data: Partial<WorkFee>) => Promise<void>
  updateWorkFee: (id: number | string, data: Partial<WorkFee>) => Promise<void>
  deleteWorkFee: (id: number | string) => Promise<void>
}

export const useWorkFeesStore = create<WorkFeesState>((set, get) => ({
  workFees: [],
  loading: false,
  error: null,
  token: null,
  setToken: (token) => set({ token }),
  fetchWorkFees: async () => {
    set({ loading: true, error: null })
    try {
      // const token = get().token
      // if (!token) throw new Error('Token requis')
      const res: WorkFeeApiResponse = await api.getWorkFees()
      set({ workFees: res.data, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur inconnue', loading: false })
    }
  },
  createWorkFee: async (data) => {
    set({ loading: true, error: null })
    try {
        // const token = get().token
        // if (!token) throw new Error('Token requis')
      await api.createWorkFee(data)
      await get().fetchWorkFees()
    } catch (error: any) {
      set({ error: error.message || 'Erreur inconnue', loading: false })
    }
  },
  updateWorkFee: async (id, data) => {
    set({ loading: true, error: null })
    try {
      // const token = get().token
      // if (!token) throw new Error('Token requis')
      await api.updateWorkFee(id, data)
      await get().fetchWorkFees()
    } catch (error: any) {
      set({ error: error.message || 'Erreur inconnue', loading: false })
    }
  },
  deleteWorkFee: async (id) => {
    set({ loading: true, error: null })
    try {
      // const token = get().token
      // if (!token) throw new Error('Token requis')
      await api.deleteWorkFee(id)
      await get().fetchWorkFees()
    } catch (error: any) {
      set({ error: error.message || 'Erreur inconnue', loading: false })
    }
  },
})) 