import axiosInstance from '@/lib/axios'
import {
  NumberPaintElementCreate,
  NumberPaintElementUpdate,
  NumberPaintElementsResponse,
  NumberPaintElementResponse,
} from '@/types/number-paint-elements'

const BASE_URL = '/number-paint-elements'

export const numberPaintElementsService = {
  // Récupérer tous les éléments avec pagination
  getAll: async (page: number = 1): Promise<NumberPaintElementsResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return response.data
  },

  // Récupérer un élément par ID
  getById: async (id: number): Promise<NumberPaintElementResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer un nouvel élément
  create: async (data: NumberPaintElementCreate): Promise<NumberPaintElementResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour un élément
  update: async (id: number, data: NumberPaintElementUpdate): Promise<NumberPaintElementResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer un élément
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 