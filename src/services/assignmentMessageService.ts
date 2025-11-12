/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosInstance from '@/lib/axios'
import { API_CONFIG } from '@/config/api'
import {
  AssignmentMessage,
  AssignmentMessageApiResponse,
  CreateAssignmentMessagePayload,
  UpdateAssignmentMessagePayload,
} from '@/types/assignment-messages'

class AssignmentMessageService {
  private baseUrl = API_CONFIG.ENDPOINTS.ASSIGNMENT_MESSAGES

  async getMessages(assignmentId?: string, page: number = 1): Promise<AssignmentMessageApiResponse> {
    const params = new URLSearchParams()
    // params.append('page', page.toString())
    if (assignmentId) {
      params.append('assignment_id', assignmentId)
    }

    const response = await axiosInstance.get<AssignmentMessageApiResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    // Filtrer les messages par assignment_id côté client si nécessaire
    const data = response.data
    if (assignmentId && data.data) {
      data.data = data.data.filter(
        (msg) => msg.assignment_id?.id === assignmentId || String(msg.assignment_id?.id) === String(assignmentId)
      )
    }
    return data
  }

  async createMessage(data: CreateAssignmentMessagePayload): Promise<AssignmentMessage> {
    const response = await axiosInstance.post<{
      status: number
      message: string
      data: AssignmentMessage
    }>(this.baseUrl, data)
    return response.data.data
  }

  async updateMessage(id: string, data: UpdateAssignmentMessagePayload): Promise<AssignmentMessage> {
    const response = await axiosInstance.put<AssignmentMessage>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteMessage(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }
}

export const assignmentMessageService = new AssignmentMessageService()
export default assignmentMessageService

