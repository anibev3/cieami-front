import axiosInstance from '@/lib/axios'
import {
  WorkforceTypeCreate,
  WorkforceTypeUpdate,
  WorkforceTypesResponse,
  WorkforceTypeResponse,
} from '@/types/workforce-types'

const BASE_URL = '/workforce-types'

export const workforceTypesService = {
  // Récupérer tous les types avec pagination
  getAll: async (page: number = 1): Promise<WorkforceTypesResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return response.data
  },

  // Récupérer un type par ID
  getById: async (id: number): Promise<WorkforceTypeResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer un nouveau type
  create: async (data: WorkforceTypeCreate): Promise<WorkforceTypeResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour un type
  update: async (id: number, data: WorkforceTypeUpdate): Promise<WorkforceTypeResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer un type
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 