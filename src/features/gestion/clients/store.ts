import { create } from 'zustand'
import { Client, ClientFilters } from './types'
import * as api from './api'

interface ClientsState {
  clients: Client[]
  total: number
  loading: boolean
  error: string | null
  selectedClient: Client | null
  fetchClients: (filters?: ClientFilters, token?: string) => Promise<void>
  fetchClient: (id: number, token?: string) => Promise<void>
  createClient: (client: Partial<Client>, token?: string) => Promise<void>
  updateClient: (id: number, client: Partial<Client>, token?: string) => Promise<void>
  deleteClient: (id: number, token?: string) => Promise<void>
  setSelectedClient: (client: Client | null) => void
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  total: 0,
  loading: false,
  error: null,
  selectedClient: null,

  fetchClients: async (filters, token) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getClients(filters, token)
      set({ clients: res.data, total: res.meta.total, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  fetchClient: async (id, token) => {
    set({ loading: true, error: null })
    try {
      const client = await api.getClientById(id, token)
      set({ selectedClient: client, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement', loading: false })
    }
  },

  createClient: async (client, token) => {
    set({ loading: true, error: null })
    try {
      await api.createClient(client, token)
      await get().fetchClients(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la création', loading: false })
    }
  },

  updateClient: async (id, client, token) => {
    set({ loading: true, error: null })
    try {
      await api.updateClient(id, client, token)
      await get().fetchClients(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la modification', loading: false })
    }
  },

  deleteClient: async (id, token) => {
    set({ loading: true, error: null })
    try {
      await api.deleteClient(id, token)
      await get().fetchClients(undefined, token)
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors de la suppression', loading: false })
    }
  },

  setSelectedClient: (client) => set({ selectedClient: client }),
})) 