import axiosInstance from '@/lib/axios'
import {
  PaintTypeCreate,
  PaintTypeUpdate,
  PaintTypesResponse,
  PaintTypeResponse,
} from '@/types/paint-types'

const BASE_URL = '/paint-types'

export const paintTypesService = {
  // Récupérer tous les types avec pagination et recherche
  getAll: async (page: number = 1, search: string = ''): Promise<PaintTypesResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}&search=${search}`)
    return response.data
  },

  // Récupérer un type par ID
  getById: async (id: number): Promise<PaintTypeResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer un nouveau type
  create: async (data: PaintTypeCreate): Promise<PaintTypeResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour un type
  update: async (id: number, data: PaintTypeUpdate): Promise<PaintTypeResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer un type
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 