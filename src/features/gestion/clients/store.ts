import { create } from 'zustand'
import { Client, ClientFilters } from './types'
import * as api from './api'

interface ClientsState {
  clients: Client[]
  total: number
  loading: boolean
  error: string | null
  selectedClient: Client | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  filters: ClientFilters
  fetchClients: (filters?: ClientFilters, token?: string) => Promise<void>
  fetchClient: (id: string, token?: string) => Promise<void>
  createClient: (client: Partial<Client>, token?: string) => Promise<void>
  updateClient: (id: string, client: Partial<Client>, token?: string) => Promise<void>
  deleteClient: (id: string, token?: string) => Promise<void>
  setSelectedClient: (client: Client | null) => void
  setFilters: (filters: ClientFilters) => void
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  total: 0,
  loading: false,
  error: null,
  selectedClient: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
    from: 1,
    to: 1,
    total: 0
  },
  filters: {
    search: '',
    page: 1
  },

  fetchClients: async (filters, token) => {
    set({ loading: true, error: null })
    try {
      const res = await api.getClients(filters, token)
      set({ 
        clients: res.data, 
        total: res.meta.total, 
        pagination: {
          currentPage: res.meta.current_page,
          lastPage: res.meta.last_page,
          perPage: res.meta.per_page,
          from: res.meta.from,
          to: res.meta.to,
          total: res.meta.total
        },
        loading: false 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
    }
  },

  fetchClient: async (id, token) => {
    set({ loading: true, error: null })
    try {
      const client = await api.getClientById(id, token)
      set({ selectedClient: client, loading: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement'
      set({ error: errorMessage, loading: false })
    }
  },

  createClient: async (client, token) => {
    set({ loading: true, error: null })
    try {
      await api.createClient(client, token)
      await get().fetchClients(undefined, token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création'
      set({ error: errorMessage, loading: false })
    }
  },

  updateClient: async (id, client, token) => {
    set({ loading: true, error: null })
    try {
      await api.updateClient(id, client, token)
      await get().fetchClients(undefined, token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification'
      set({ error: errorMessage, loading: false })
    }
  },

  deleteClient: async (id, token) => {
    set({ loading: true, error: null })
    try {
      await api.deleteClient(id, token)
      await get().fetchClients(undefined, token)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression'
      set({ error: errorMessage, loading: false })
    }
  },

  setSelectedClient: (client) => set({ selectedClient: client }),
  setFilters: (filters) => set({ filters }),
})) 