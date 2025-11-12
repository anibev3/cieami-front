export interface AssignmentMessage {
  id: string
  assignment_id: {
    id: string
    reference: string
    [key: string]: any
  }
  message: string
  status_id: {
    id: string
    code: string
    label: string
    description: string
    deleted_at: string | null
    created_at: string
    updated_at: string
  }
  created_by: {
    id: string
    code: string
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
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface AssignmentMessageApiResponse {
  data: AssignmentMessage[]
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
      page: number | null
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface CreateAssignmentMessagePayload {
  assignment_id: string
  message: string
}

export interface UpdateAssignmentMessagePayload {
  assignment_id?: string
  message?: string
}

