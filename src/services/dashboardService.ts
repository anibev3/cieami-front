import axiosInstance from '@/lib/axios'

// Types pour les statistiques
export interface DashboardUsersStats {
  total_users: { value: number }
  active_users: { value: number }
  inactive_users: { value: number }
}

export interface DashboardAssignmentsStats {
  total_assignments: { value: number }
  open_assignments: { value: number }
  realized_assignments: { value: number }
  edited_assignments: { value: number }
  validated_assignments: { value: number }
  closed_assignments: { value: number }
  assignments_edition_time_expired: number
  assignments_recovery_time_expired: number
}

export interface DashboardInsurersStats {
  total_insurers: { value: number }
  active_insurers: { value: number }
  inactive_insurers: { value: number }
}

export interface DashboardRepairersStats {
  total_repairers: { value: number }
  active_repairers: { value: number }
  inactive_repairers: { value: number }
}

export interface DashboardVehiclesStats {
  total_vehicles: { value: number }
  active_vehicles: { value: number }
  inactive_vehicles: { value: number }
}

export interface DashboardStats {
  users: DashboardUsersStats
  assignments: DashboardAssignmentsStats
  insurers: DashboardInsurersStats
  repairers: DashboardRepairersStats
  vehicles: DashboardVehiclesStats
}

class DashboardService {
  // Statistiques des utilisateurs
  async getUsersStats(): Promise<DashboardUsersStats> {
    const response = await axiosInstance.get('/dashboard/users')
    return response.data.data
  }

  // Statistiques des dossiers
  async getAssignmentsStats(): Promise<DashboardAssignmentsStats> {
    const response = await axiosInstance.get('/dashboard/assignments')
    return response.data.data
  }

  // Statistiques des compagnies d'assurance
  async getInsurersStats(): Promise<DashboardInsurersStats> {
    const response = await axiosInstance.get('/dashboard/insurers')
    return response.data.data
  }

  // Statistiques des réparateurs
  async getRepairersStats(): Promise<DashboardRepairersStats> {
    const response = await axiosInstance.get('/dashboard/repairers')
    return response.data.data
  }

  // Statistiques des véhicules
  async getVehiclesStats(): Promise<DashboardVehiclesStats> {
    const response = await axiosInstance.get('/dashboard/vehicles')
    return response.data.data
  }

  // Toutes les statistiques
  async getAllStats(): Promise<DashboardStats> {
    const [users, assignments, insurers, repairers, vehicles] = await Promise.all([
      this.getUsersStats(),
      this.getAssignmentsStats(),
      this.getInsurersStats(),
      this.getRepairersStats(),
      this.getVehiclesStats()
    ])

    return {
      users,
      assignments,
      insurers,
      repairers,
      vehicles
    }
  }
}

export const dashboardService = new DashboardService() 