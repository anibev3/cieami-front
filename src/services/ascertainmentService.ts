import axiosInstance from '@/lib/axios'

export interface User {
  id: number
  hash_id: string
  email: string
  username: string
  name: string
  last_name: string
  first_name: string
  telephone: string
  photo_url: string
  pending_verification: boolean
  signature: string | null
  created_at: string
  updated_at: string
}

export interface Status {
  id: number
  code: string
  label: string
  description: string | null
  deleted_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface AscertainmentType {
  id: number
  code: string
  label: string
  description: string | null
  status: Status | null
  created_by: User | null
  updated_by: User | null
  deleted_by: User | null
  created_at: string | null
  updated_at: string | null
}

export interface DocumentTransmitted {
  id: number
  code: string
  label: string
}

export interface Assignment {
  id: number
  reference: string
  policy_number: string
  claim_number: string
  claim_starts_at: string
  claim_ends_at: string
  expertise_date: string
  expertise_place: string
  received_at: string
  insurer_id: number
  repairer_id: number
  administrator: any
  circumstance: string
  damage_declared: string
  observation: string | null
  point_noted: string | null
  seen_before_work_date: string | null
  seen_during_work_date: string | null
  seen_after_work_date: string | null
  contact_date: string | null
  assured_value: number | null
  salvage_value: number | null
  new_market_value: number | null
  depreciation_rate: number | null
  market_value: number | null
  work_duration: number | null
  expert_remark: string | null
  shock_amount_excluding_tax: number | null
  shock_amount_tax: number | null
  shock_amount: number | null
  other_cost_amount_excluding_tax: number | null
  other_cost_amount_tax: number | null
  other_cost_amount: number | null
  receipt_amount_excluding_tax: number | null
  receipt_amount_tax: number | null
  receipt_amount: number | null
  total_amount_excluding_tax: number | null
  total_amount_tax: number | null
  total_amount: number | null
  emails: any
  qr_codes: any
  document_transmitted: DocumentTransmitted[]
  expertise_sheet: string
  expertise_report: string
  work_sheet: string
  expert_signature: string
  repairer_signature: string | null
  customer_signature: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  closed_at: string | null
  cancelled_at: string | null
  edited_at: string | null
  validated_at: string | null
  realized_at: string | null
  work_sheet_established_at: string | null
  edition_time_expire_at: string
  edition_status: string
  edition_per_cent: number
  recovery_time_expire_at: string
  recovery_status: string
  recovery_per_cent: number
}

export interface Ascertainment {
  id: number
  ascertainment_type: AscertainmentType
  very_good: boolean
  good: boolean
  acceptable: boolean
  less_good: boolean
  bad: boolean
  very_bad: boolean
  comment: string
  assignment: Assignment
  status: Status
  created_by: User
  updated_by: User
  deleted_by: User | null
  created_at: string
  updated_at: string
}

export interface AscertainmentResponse {
  data: Ascertainment[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateAscertainmentData {
  assignment_id: string
  ascertainments: Array<{
    ascertainment_type_id: string
    very_good: boolean
    good: boolean
    acceptable: boolean
    less_good: boolean
    bad: boolean
    very_bad: boolean
    comment: string
  }>
}

export interface UpdateAscertainmentData {
  ascertainment_type_id?: string
  very_good?: boolean
  good?: boolean
  acceptable?: boolean
  less_good?: boolean
  bad?: boolean
  very_bad?: boolean
  comment?: string
}

export interface AscertainmentFilters {
  search?: string
  page?: number
  per_page?: number
  assignment_id?: string
}

class AscertainmentService {
  private baseUrl = '/ascertainments'

  /**
   * Récupérer tous les constats avec pagination
   */
  async getAll(filters?: AscertainmentFilters): Promise<AscertainmentResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('q', filters.search)
    }
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.per_page) {
      params.append('per_page', filters.per_page.toString())
    }
    if (filters?.assignment_id) {
      params.append('assignment_id', filters.assignment_id)
    }

    const response = await axiosInstance.get<AscertainmentResponse>(
      `${this.baseUrl}?${params.toString()}`
    )
    return response.data
  }

  /**
   * Récupérer un constat par ID
   */
  async getById(id: number): Promise<{ status: number; message: string | null; data: Ascertainment }> {
    const response = await axiosInstance.get<{ status: number; message: string | null; data: Ascertainment }>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Créer un nouveau constat
   */
  async create(data: CreateAscertainmentData): Promise<{ status: number; message: string; data: Ascertainment }> {
    const response = await axiosInstance.post<{ status: number; message: string; data: Ascertainment }>(this.baseUrl, data)
    return response.data
  }

  /**
   * Mettre à jour un constat
   */
  async update(id: number, data: UpdateAscertainmentData): Promise<{ status: number; message: string; data: Ascertainment }> {
    const response = await axiosInstance.put<{ status: number; message: string; data: Ascertainment }>(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  /**
   * Supprimer un constat
   */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Rechercher des constats
   */
  async search(query: string): Promise<AscertainmentResponse> {
    return this.getAll({ search: query })
  }
}

// Export d'une instance singleton
export const ascertainmentService = new AscertainmentService()
export default ascertainmentService 