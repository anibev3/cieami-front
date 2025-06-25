// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://back.roomcodetraining.com/api/v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/tokens',
      USER_INFO: '/auth/user',
      LOGOUT: '/auth/tokens',
    },
    COLORS: '/colors',
    BRANDS: '/brands',
    VEHICLE_STATES: '/vehicle-states',
    VEHICLE_MODELS: '/vehicle-models',
    VEHICLES: '/vehicles',
    ASSIGNMENT_TYPES: '/assignment-types',
    ASSIGNMENTS: '/assignments',
    RECEIPTS: '/receipts',
    // Endpoints pour l'édition des assignations
    SHOCK_POINTS: '/shock-points',
    SUPPLIES: '/supplies',
    WORKFORCE_TYPES: '/workforce-types',
    OTHER_COST_TYPES: '/other-cost-types',
    CALCULATIONS: '/assignments/calculate',
  },
} as const

// Types pour les variables d'environnement
export interface ApiConfig {
  BASE_URL: string
  TIMEOUT: number
  ENDPOINTS: {
    AUTH: {
      LOGIN: string
      USER_INFO: string
      LOGOUT: string
    }
    COLORS: string
    BRANDS: string
    VEHICLE_STATES: string
    VEHICLE_MODELS: string
    VEHICLES: string
    ASSIGNMENT_TYPES: string
    ASSIGNMENTS: string
    RECEIPTS: string
    // Endpoints pour l'édition des assignations
    SHOCK_POINTS: string
    SUPPLIES: string
    WORKFORCE_TYPES: string
    OTHER_COST_TYPES: string
    CALCULATIONS: string
  }
} 