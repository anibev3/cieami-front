// Configuration de l'API
export const API_CONFIG = {
  // BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://back.roomcodetraining.com/api/v1',
  BASE_URL: import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_SUFIX,
  TIMEOUT: 180000,
  ENDPOINTS: {
    ENTITIES: '/entities',
    AUTH: {
      LOGIN: '/auth/tokens',
      USER_INFO: '/auth/user',
      LOGOUT: '/auth/tokens',
      RESET_PASSWORD: '/users/reset-password',
    },
    COLORS: '/colors',
    BRANDS: '/brands',
    VEHICLE_STATES: '/vehicle-states',
    VEHICLE_MODELS: '/vehicle-models',
    VEHICLES: '/vehicles',
    ASSIGNMENT_TYPES: '/assignment-types',
    ASSIGNMENTS: '/assignments',
    ASSIGNMENT_REQUESTS: '/assignment-requests',
    ASSIGNMENT_MESSAGES: '/assignment-messages',
    ASSIGNMENTS_EDITE_ELEMENTS: '/assignments/update-edit',
    ASSIGNMENTS_STATISTICS: '/assignments/statistics',
    ASSIGNMENTS_EDITION_EXPIRED: '/assignments/get/assignment-edition-time-to-expired', // get-assignment-edition-time-to-expired
    ASSIGNMENTS_RECOVERY_EXPIRED: '/assignments/get/assignment-recovery-time-to-expired', // get-assignment-recovery-time-to-expired
    ASSIGNMENTS_EDIT: '/assignments/edit',
    RECEIPTS: '/receipts',
    RECEIPT_TYPES: '/receipt-types',
    INVOICES: '/invoices',
    INSURER_RELATIONSHIPS: '/insurer-relationships',
    REPAIRER_RELATIONSHIPS: '/repairer-relationships',
    // Endpoints pour l'édition des assignations
    SHOCK_POINTS: '/shock-points',
    SUPPLIES: '/supplies',
    WORKFORCE_TYPES: '/workforce-types',
    OTHER_COST_TYPES: '/other-cost-types',
    PAINT_TYPES: '/paint-types',
    HOURLY_RATES: '/hourly-rates',
    CALCULATIONS: '/assignments/calculate',
    CALCULATE_EVALUATION: '/assignments/calculate-evaluation',
    EVALUATE: '/assignments/evaluate',
    // Endpoints pour la gestion
    PHOTO_TYPES: '/photo-types',
    PHOTOS: '/photos',
    SHOCK_WORKS: "/shock-works",
    WORKFORCES: "/workforces",
    OTHER_COSTS: "/other-costs",
    ASCERTAINMENTS: "/ascertainments",
    // Endpoints pour la réorganisation
    SHOCKS: "/shocks",
    ADD_SHOCK_IN_MODIF: "/shocks/store/point",
    ORDER_SHOCK_WORKS: "/shocks",
    ORDER_WORKFORCES: "/shocks",
    DELETE_SHOCK: "/shocks",
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
      RESET_PASSWORD: string
    }
    COLORS: string
    BRANDS: string
    VEHICLE_STATES: string
    VEHICLE_MODELS: string
    VEHICLES: string
    ASSIGNMENT_TYPES: string
    ASSIGNMENTS: string
    ASSIGNMENTS_STATISTICS: string
    RECEIPTS: string
    RECEIPT_TYPES: string
    INVOICES: string
    // Endpoints pour l'édition des assignations
    SHOCK_POINTS: string
    SUPPLIES: string
    WORKFORCE_TYPES: string
    OTHER_COST_TYPES: string
    PAINT_TYPES: string
    HOURLY_RATES: string
    CALCULATIONS: string
    // Endpoints pour la gestion
    PHOTO_TYPES: string
    PHOTOS: string
  }
} 