import { create } from 'zustand'
import { brandService } from '@/services/brandService'
import { Brand, BrandCreate, BrandUpdate, BrandFilters } from '@/types/brands'

interface BrandsState {
  brands: Brand[]
  currentBrand: Brand | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    lastPage: number
    perPage: number
    from: number
    to: number
    total: number
  }
  filters: BrandFilters
}

interface BrandsActions {
  // Actions
  fetchBrands: (filters?: BrandFilters) => Promise<void>
  fetchBrand: (id: number) => Promise<void>
  createBrand: (brandData: BrandCreate) => Promise<void>
  updateBrand: (id: number, brandData: BrandUpdate) => Promise<void>
  deleteBrand: (id: number) => Promise<void>
  setCurrentBrand: (brand: Brand | null) => void
  setFilters: (filters: BrandFilters) => void
  clearError: () => void
}

type BrandsStore = BrandsState & BrandsActions

export const useBrandsStore = create<BrandsStore>((set, get) => ({
  // État initial
  brands: [],
  currentBrand: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 25,
    from: 1,
    to: 1,
    total: 0,
  },
  filters: {
    search: '',
    page: 1
  },

  // Actions
  fetchBrands: async (filters) => {
    set({ loading: true, error: null })
    
    try {
      const response = await brandService.getBrands(filters)
      
      set({
        brands: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          from: response.meta.from,
          to: response.meta.to,
          total: response.meta.total,
        },
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement des marques',
      })
    }
  },

  fetchBrand: async (id) => {
    set({ loading: true, error: null })
    
    try {
      const brand = await brandService.getBrand(id)
      set({ currentBrand: brand, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors du chargement de la marque',
      })
    }
  },

  createBrand: async (brandData) => {
    set({ loading: true, error: null })
    
    try {
      await brandService.createBrand(brandData)
      // Recharger la liste après création
      await get().fetchBrands()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la création de la marque',
      })
      throw error
    }
  },

  updateBrand: async (id, brandData) => {
    set({ loading: true, error: null })
    
    try {
      await brandService.updateBrand(id, brandData)
      // Recharger la liste après mise à jour
      await get().fetchBrands()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la marque',
      })
      throw error
    }
  },

  deleteBrand: async (id) => {
    set({ loading: true, error: null })
    
    try {
      await brandService.deleteBrand(id)
      // Recharger la liste après suppression
      await get().fetchBrands()
      set({ loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de la marque',
      })
      throw error
    }
  },

  setCurrentBrand: (brand) => {
    set({ currentBrand: brand })
  },

  setFilters: (filters) => {
    set({ filters })
  },

  clearError: () => {
    set({ error: null })
  },
})) 