import axiosInstance from '@/lib/axios'
import { AssignmentStatistics, AssignmentStatisticsFilters } from '@/types/assignments'

class AssignmentStatisticsService {
  private baseUrl = '/assignments/statistics'

  /**
   * Récupérer les statistiques des assignations
   */
  async getStatistics(filters: AssignmentStatisticsFilters): Promise<AssignmentStatistics> {
    const params = new URLSearchParams()
    
    params.append('start_date', filters.start_date)
    params.append('end_date', filters.end_date)
    
    if (filters.assignment_id) {
      params.append('assignment_id', filters.assignment_id.toString())
    }

    const response = await axiosInstance.get<AssignmentStatistics>(
      `${this.baseUrl}/${filters.start_date}/${filters.end_date}?assignment_type_id=${filters.assignment_id}`
    )
    return response.data
  }
}

// Export d'une instance singleton
export const assignmentStatisticsService = new AssignmentStatisticsService()
export default assignmentStatisticsService 