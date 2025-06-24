import axios from 'axios'
import { Photo, PhotoApiResponse, PhotoFilters } from './types'

const API_URL = 'https://back.roomcodetraining.com/api/v1/photos'

export const getPhotos = async (filters?: PhotoFilters, token?: string): Promise<PhotoApiResponse> => {
  const { data } = await axios.get(API_URL, {
    params: filters,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const getPhotoById = async (id: number, token?: string): Promise<Photo> => {
  const { data } = await axios.get(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const createPhoto = async (photo: Partial<Photo>, token?: string): Promise<Photo> => {
  const { data } = await axios.post(API_URL, photo, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const updatePhoto = async (id: number, photo: Partial<Photo>, token?: string): Promise<Photo> => {
  const { data } = await axios.put(`${API_URL}/${id}`, photo, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return data
}

export const deletePhoto = async (id: number, token?: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
} 