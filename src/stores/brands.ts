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
    totalPages: number
    totalItems: number
    perPage: number
  }
}

interface BrandsActions {
  // Actions
  fetchBrands: (page?: number, filters?: BrandFilters) => Promise<void>
  fetchBrand: (id: number) => Promise<void>
  createBrand: (brandData: BrandCreate) => Promise<void>
  updateBrand: (id: number, brandData: BrandUpdate) => Promise<void>
  deleteBrand: (id: number) => Promise<void>
  setCurrentBrand: (brand: Brand | null) => void
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
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },

  // Actions
  fetchBrands: async (page = 1, filters) => {
    set({ loading: true, error: null })
    
    try {
      const response = await brandService.getBrands(page, filters)
      
      set({
        brands: response.data,
        pagination: {
          currentPage: response.meta.current_page,
          totalPages: response.meta.last_page,
          totalItems: response.meta.total,
          perPage: response.meta.per_page,
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
      await get().fetchBrands(get().pagination.currentPage)
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
      await get().fetchBrands(get().pagination.currentPage)
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
      await get().fetchBrands(get().pagination.currentPage)
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

  clearError: () => {
    set({ error: null })
  },
})) 