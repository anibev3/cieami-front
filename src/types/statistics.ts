// Types génériques pour les statistiques
export interface BaseStatisticsData {
  year: number
  month: number
}

export interface CountByMonth extends BaseStatisticsData {
  count: number
}

export interface AmountByMonth extends BaseStatisticsData {
  amount: string
}

// Types spécifiques pour chaque type de statistique
export interface AssignmentStatistics {
  assignments_by_year_and_month_count: CountByMonth[]
  assignments_by_year_and_month_amount: AmountByMonth[]
  assignments_total_shock_amount_by_year_and_month?: AmountByMonth[]
  export_url?: string
}

export interface PaymentStatistics {
  payments_by_year_and_month_count: CountByMonth[]
  payments_by_year_and_month_amount: AmountByMonth[]
  export_url?: string
}

export interface InvoiceStatistics {
  invoices_by_year_and_month_count: CountByMonth[]
  invoices_by_year_and_month_amount: AmountByMonth[]
  export_url?: string
}

// Type union pour toutes les statistiques
export type StatisticsData = AssignmentStatistics | PaymentStatistics | InvoiceStatistics

// Filtres de base communs
export interface BaseStatisticsFilters {
  start_date: string
  end_date: string
}

// Filtres spécifiques pour chaque type
export interface AssignmentStatisticsFilters extends BaseStatisticsFilters {
  assignment_id?: number
  vehicle_id?: number
  repairer_id?: number
  insurer_id?: number
  assignment_type_id?: number
  expertise_type_id?: number
  claim_nature_id?: number
  created_by?: number
  edited_by?: number
  realized_by?: number
  directed_by?: number
  validated_by?: number
  status_id?: number
}

export interface PaymentStatisticsFilters extends BaseStatisticsFilters {
  payment_id?: number
  payment_method_id?: number
  payment_type_id?: number
  bank_id?: number
  client_id?: number
  assignment_id?: number
  created_by?: number
  status_id?: number
}

export interface InvoiceStatisticsFilters extends BaseStatisticsFilters {
  invoice_id?: number
  client_id?: number
  assignment_id?: number
  payment_status_id?: number
  created_by?: number
  status_id?: number
}

// Type union pour tous les filtres
export type StatisticsFilters = AssignmentStatisticsFilters | PaymentStatisticsFilters | InvoiceStatisticsFilters

// Types pour l'interface utilisateur
export type StatisticsType = 'assignments' | 'payments' | 'invoices'

export interface StatisticsTypeConfig {
  type: StatisticsType
  label: string
  description: string
  icon: string
  baseUrl: string
  filters: string[]
}

export const STATISTICS_TYPES: StatisticsTypeConfig[] = [
  {
    type: 'assignments',
    label: 'Dossiers',
    description: 'Statistiques des dossiers d\'expertise',
    icon: '📁',
    baseUrl: '/assignments/get/statistics',
    filters: ['repairer', 'insurer', 'broker', 'claim_nature', 'status', 'created_by', 'edited_by', 'realized_by', 'validated_by', 'directed_by']
  },
  {
    type: 'payments',
    label: 'Paiements',
    description: 'Statistiques des paiements reçus',
    icon: '💰',
    baseUrl: '/payments/get/statistics',
    filters: ['payment_method', 'payment_type', 'bank', 'client', 'assignment', 'created_by', 'status']
  },
  {
    type: 'invoices',
    label: 'Factures',
    description: 'Statistiques des factures émises',
    icon: '🧾',
    baseUrl: '/invoices/get/statistics',
    filters: ['client', 'assignment', 'payment_status', 'created_by', 'status']
  }
]
