// Types pour les types de photos
export interface PhotoType {
  id: number
  code: string
  label: string
  description: string
  status?: {
    id: number
    code: string
    label: string
    description: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
  }
  created_by: {
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
  updated_by: {
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
  deleted_by: {
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
  } | null
  created_at: string
  updated_at: string
}

export interface CreatePhotoTypeData {
  label: string
  description: string
}

export interface UpdatePhotoTypeData {
  label?: string
  description?: string
}

export interface PhotoTypeResponse {
  data: PhotoType[]
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

export interface PhotoTypeFilters {
  search?: string
  page?: number
  per_page?: number
}

// Types pour les photos
export interface Photo {
  id: number
  assignment_id: string
  photo_type_id: string
  photo_url: string
  is_cover: boolean
  photo_type?: PhotoType
  assignment?: {
    id: number
    reference: string
  }
  created_by: {
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
  updated_by: {
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
  deleted_by: {
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
  } | null
  created_at: string
  updated_at: string
}

export interface CreatePhotoData {
  assignment_id: string
  photo_type_id: string
  photos: File[]
}

export interface UpdatePhotoData {
  photo_type_id: string
  photo: File
}

export interface PhotoResponse {
  data: Photo[]
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

export interface PhotoFilters {
  search?: string
  assignment_id?: string
  photo_type_id?: string
  page?: number
  per_page?: number
} 