import axiosInstance from '@/lib/axios'
import {
  HourlyRateCreate,
  HourlyRateUpdate,
  HourlyRatesResponse,
  HourlyRateResponse,
} from '@/types/hourly-rates'

const BASE_URL = '/hourly-rates'

export const hourlyRatesService = {
  // Récupérer tous les taux avec pagination
  getAll: async (page: number = 1): Promise<HourlyRatesResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}?page=${page}`)
    return response.data
  },

  // Récupérer un taux par ID
  getById: async (id: number): Promise<HourlyRateResponse> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Créer un nouveau taux
  create: async (data: HourlyRateCreate): Promise<HourlyRateResponse> => {
    const response = await axiosInstance.post(BASE_URL, data)
    return response.data
  },

  // Mettre à jour un taux
  update: async (id: number, data: HourlyRateUpdate): Promise<HourlyRateResponse> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Supprimer un taux
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
  },
} 