import axiosInstance from '@/lib/axios'
import { WorkFee, WorkFeeApiResponse } from './types'

const API_URL = '/work-fees'

export async function getWorkFees(page = 1): Promise<WorkFeeApiResponse> {
  const res = await axiosInstance.get(`${API_URL}?page=${page}`)
  return res.data
}

export async function getWorkFeeById(id: number | string): Promise<WorkFee> {
  const res = await axiosInstance.get(`${API_URL}/${id}`)
  return res.data
}

export async function createWorkFee(data: Partial<WorkFee>): Promise<WorkFee> {
  const res = await axiosInstance.post(API_URL, data)
  return res.data
}

export async function updateWorkFee(id: number | string, data: Partial<WorkFee>): Promise<WorkFee> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data)
  return res.data
}

export async function deleteWorkFee(id: number | string): Promise<void> {
  await axiosInstance.delete(`${API_URL}/${id}`)
} 