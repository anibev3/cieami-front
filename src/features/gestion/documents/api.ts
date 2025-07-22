import axiosInstance from '@/lib/axios'
import { DocumentTransmis, DocumentTransmisApiResponse, DocumentTransmisFilters } from './types'

const API_URL = 'https://e-expert-back.ddev.site/api/v1/document-transmitteds'

export const getDocumentsTransmis = async (filters?: DocumentTransmisFilters, token?: string): Promise<DocumentTransmisApiResponse> => {
  const { data } = await axiosInstance.get(API_URL, {
    params: filters,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const getDocumentTransmisById = async (id: number, token?: string): Promise<DocumentTransmis> => {
  const { data } = await axiosInstance.get(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const createDocumentTransmis = async (doc: Partial<DocumentTransmis>, token?: string): Promise<DocumentTransmis> => {
  const { data } = await axiosInstance.post(API_URL, doc, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const updateDocumentTransmis = async (id: number, doc: Partial<DocumentTransmis>, token?: string): Promise<DocumentTransmis> => {
  const { data } = await axiosInstance.put(`${API_URL}/${id}`, doc, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const deleteDocumentTransmis = async (id: number, token?: string): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
} 