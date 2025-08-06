export interface Client {
  id: number
  name: string
  email: string
  phone_1?: string | null
  phone_2?: string | null
  address?: string | null
  deleted_at?: string | null
  created_at: string
  updated_at: string
  created_by: CreatedBy
}

export interface CreatedBy {
  id: number
  hash_id: string
  code: string
  email: string | null
  username: string | null
  name: string
  last_name: string
  first_name: string
  telephone: string | null
  photo_url: string | null
  pending_verification: boolean
  signature: string | null
  created_at: string
  updated_at: string
}

            // "created_by": {
            //     "id": 20,
            //     "hash_id": "use_9PwYN7KEzepJm",
            //     "code": "U023",
            //     "email": null,
            //     "username": null,
            //     "name": "KOUASSI Julien",
            //     "last_name": "Julien",
            //     "first_name": "KOUASSI",
            //     "telephone": null,
            //     "photo_url": "https:\/\/ui-avatars.com\/api\/?name=K+J&color=FFF&background=f59e0b",
            //     "pending_verification": false,
            //     "signature": null,
            //     "created_at": null,
            //     "updated_at": null
            // },

export interface ClientStatus {
  id: number
  code: string
  label: string
  description: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ClientApiResponse {
  data: Client[]
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

export interface ClientFilters {
  search?: string
  page?: number
  // per_page?: number 
} 