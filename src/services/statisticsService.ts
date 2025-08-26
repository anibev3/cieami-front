/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import axiosInstance from '@/lib/axios'
import { 
  StatisticsData, 
  StatisticsFilters, 
  StatisticsType,
  AssignmentStatisticsFilters,
  PaymentStatisticsFilters,
  InvoiceStatisticsFilters
} from '@/types/statistics'

class StatisticsService {
  /**
   * Récupérer les statistiques selon le type
   */
  async getStatistics(
    type: StatisticsType, 
    filters: StatisticsFilters
  ): Promise<StatisticsData> {
    let baseUrl: string
    let includes: string[]

    switch (type) {
      case 'assignments':
        baseUrl = '/assignments/get/statistics'
        includes = [
          'assignmentType',
          'expertiseType', 
          'vehicle',
          'repairer',
          'client',
          'insurer',
          'status',
          'createdBy',
          'realized_by',
          'editedBy',
          'validatedBy',
          'directedBy',
          'claimNature'
        ]
        break
      
      case 'payments':
        baseUrl = '/payments/get/statistics'
        includes = [
          'paymentMethod',
          'paymentType',
          'bank',
          'client',
          'assignment',
          'status',
          'createdBy'
        ]
        break
      
      case 'invoices':
        baseUrl = '/invoices/get/statistics'
        includes = [
          'client',
          'assignment',
          'paymentStatus',
          'status',
          'createdBy'
        ]
        break
      
      default:
        throw new Error(`Type de statistique non supporté: ${type}`)
    }

    const params = new URLSearchParams()
    
    // Paramètres de base
    params.append('start_date', filters.start_date)
    params.append('end_date', filters.end_date)
    
    // Paramètres spécifiques selon le type
    this.addTypeSpecificParams(type, filters, params)

    // Construire l'URL avec les includes
    const includesParam = includes.join(',')
    const url = `${baseUrl}?includes=${includesParam}&${params.toString()}`
    
    console.log(`${type} Statistics API URL:`, url)
    
    const response = await axiosInstance.get<{status: number, message: string, data: StatisticsData}>(url)
    return response.data.data
  }

  /**
   * Ajouter les paramètres spécifiques selon le type de statistique
   */
  private addTypeSpecificParams(
    type: StatisticsType, 
    filters: StatisticsFilters, 
    params: URLSearchParams
  ): void {
    switch (type) {
      case 'assignments':
        const assignmentFilters = filters as AssignmentStatisticsFilters
        if (assignmentFilters.assignment_id) {
          params.append('assignment_id', assignmentFilters.assignment_id.toString())
        }
        if (assignmentFilters.vehicle_id) {
          params.append('vehicle_id', assignmentFilters.vehicle_id.toString())
        }
        if (assignmentFilters.repairer_id) {
          params.append('repairer_id', assignmentFilters.repairer_id.toString())
        }
        if (assignmentFilters.insurer_id) {
          params.append('insurer_id', assignmentFilters.insurer_id.toString())
        }
        if (assignmentFilters.assignment_type_id) {
          params.append('assignment_type_id', assignmentFilters.assignment_type_id.toString())
        }
        if (assignmentFilters.expertise_type_id) {
          params.append('expertise_type_id', assignmentFilters.expertise_type_id.toString())
        }
        if (assignmentFilters.claim_nature_id) {
          params.append('claim_nature_id', assignmentFilters.claim_nature_id.toString())
        }
        if (assignmentFilters.created_by) {
          params.append('created_by', assignmentFilters.created_by.toString())
        }
        if (assignmentFilters.edited_by) {
          params.append('edited_by', assignmentFilters.edited_by.toString())
        }
        if (assignmentFilters.realized_by) {
          params.append('realized_by', assignmentFilters.realized_by.toString())
        }
        if (assignmentFilters.directed_by) {
          params.append('directed_by', assignmentFilters.directed_by.toString())
        }
        if (assignmentFilters.validated_by) {
          params.append('validated_by', assignmentFilters.validated_by.toString())
        }
        if (assignmentFilters.status_id) {
          params.append('status_id', assignmentFilters.status_id.toString())
        }
        break

      case 'payments':
        const paymentFilters = filters as PaymentStatisticsFilters
        if (paymentFilters.payment_id) {
          params.append('payment_id', paymentFilters.payment_id.toString())
        }
        if (paymentFilters.payment_method_id) {
          params.append('payment_method_id', paymentFilters.payment_method_id.toString())
        }
        if (paymentFilters.payment_type_id) {
          params.append('payment_type_id', paymentFilters.payment_type_id.toString())
        }
        if (paymentFilters.bank_id) {
          params.append('bank_id', paymentFilters.bank_id.toString())
        }
        if (paymentFilters.client_id) {
          params.append('client_id', paymentFilters.client_id.toString())
        }
        if (paymentFilters.assignment_id) {
          params.append('assignment_id', paymentFilters.assignment_id.toString())
        }
        if (paymentFilters.created_by) {
          params.append('created_by', paymentFilters.created_by.toString())
        }
        if (paymentFilters.status_id) {
          params.append('status_id', paymentFilters.status_id.toString())
        }
        break

      case 'invoices':
        const invoiceFilters = filters as InvoiceStatisticsFilters
        if (invoiceFilters.invoice_id) {
          params.append('invoice_id', invoiceFilters.invoice_id.toString())
        }
        if (invoiceFilters.client_id) {
          params.append('client_id', invoiceFilters.client_id.toString())
        }
        if (invoiceFilters.assignment_id) {
          params.append('assignment_id', invoiceFilters.assignment_id.toString())
        }
        if (invoiceFilters.payment_status_id) {
          params.append('payment_status_id', invoiceFilters.payment_status_id.toString())
        }
        if (invoiceFilters.created_by) {
          params.append('created_by', invoiceFilters.created_by.toString())
        }
        if (invoiceFilters.status_id) {
          params.append('status_id', invoiceFilters.status_id.toString())
        }
        break
    }
  }

  /**
   * Télécharger le fichier Excel d'export
   */
  async downloadExport(exportUrl: string): Promise<void> {
    try {
      const response = await axiosInstance.get(exportUrl, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `export_statistiques_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      throw new Error('Erreur lors du téléchargement du fichier')
    }
  }
}

// Export d'une instance singleton
export const statisticsService = new StatisticsService()
export default statisticsService
