/* eslint-disable no-console */
import axiosInstance from '@/lib/axios'
import { AssignmentStatistics, AssignmentStatisticsFilters } from '@/types/assignments'

class AssignmentStatisticsService {
  private baseUrl = '/assignments/get/statistics'

  /**
   * Récupérer les statistiques des assignations
   */
  async getStatistics(filters: AssignmentStatisticsFilters): Promise<AssignmentStatistics> {
    const params = new URLSearchParams()
    
    // Paramètres de base
    params.append('start_date', filters.start_date)
    params.append('end_date', filters.end_date)
    
    // Paramètres optionnels
    if (filters.assignment_id) {
      params.append('assignment_id', filters.assignment_id.toString())
    }
    if (filters.vehicle_id) {
      params.append('vehicle_id', filters.vehicle_id.toString())
    }
    if (filters.repairer_id) {
      params.append('repairer_id', filters.repairer_id.toString())
    }
    if (filters.insurer_id) {
      params.append('insurer_id', filters.insurer_id.toString())
    }
    if (filters.assignment_type_id) {
      params.append('assignment_type_id', filters.assignment_type_id.toString())
    }
    if (filters.expertise_type_id) {
      params.append('expertise_type_id', filters.expertise_type_id.toString())
    }
    if (filters.claim_nature_id) {
      params.append('claim_nature_id', filters.claim_nature_id.toString())
    }
    if (filters.created_by) {
      params.append('created_by', filters.created_by.toString())
    }
    if (filters.edited_by) {
      params.append('edited_by', filters.edited_by.toString())
    }
    if (filters.realized_by) {
      params.append('realized_by', filters.realized_by.toString())
    }
    if (filters.directed_by) {
      params.append('directed_by', filters.directed_by.toString())
    }
    if (filters.validated_by) {
      params.append('validated_by', filters.validated_by.toString())
    }
    if (filters.status_id) {
      params.append('status_id', filters.status_id.toString())
    }

    // Construire l'URL avec les includes
    const includes = [
      'assignmentType',
      'expertiseType', 
      'vehicle',
      'repairer',
      'client',
      'insurer',
      'status',
      'createdBy',
      'realizedBy',
      'editedBy',
      'validatedBy',
      'directedBy',
      'claimNature'
    ].join(',')

    const url = `${this.baseUrl}?includes=${includes}&${params.toString()}`
    
    console.log('Statistics API URL:', url)
    
    const response = await axiosInstance.get<{status: number, message: string, data: AssignmentStatistics}>(url)
    return response.data.data
  }
}

// Export d'une instance singleton
export const assignmentStatisticsService = new AssignmentStatisticsService()
export default assignmentStatisticsService 