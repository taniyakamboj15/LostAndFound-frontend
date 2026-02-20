// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },
  
  // Users
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    VERIFY_EMAIL: '/api/users/verify-email',
    RESEND_VERIFICATION: '/api/users/resend-verification',
  },
  
  // Items
  ITEMS: {
    BASE: '/api/items',
    BY_ID: (id: string) => `/api/items/${id}`,
    STATUS: (id: string) => `/api/items/${id}/status`,
    STORAGE: (id: string) => `/api/items/${id}/storage`,
  },
  
  // Public
  PUBLIC: {
    ITEMS: '/api/items/public/search',
  },
  
  // Lost Reports
  LOST_REPORTS: {
    BASE: '/api/lost-reports',
    MY_REPORTS: '/api/lost-reports/my-reports',
    BY_ID: (id: string) => `/api/lost-reports/${id}`,
  },
  
  // Claims
  CLAIMS: {
    BASE: '/api/claims',
    MY_CLAIMS: '/api/claims/my-claims',
    BY_ID: (id: string) => `/api/claims/${id}`,
    PROOF: (id: string) => `/api/claims/${id}/proof`,
    VERIFY: (id: string) => `/api/claims/${id}/verify`,
    REJECT: (id: string) => `/api/claims/${id}/reject`,
    REQUEST_PROOF: (id: string) => `/api/claims/${id}/request-proof`,
    ANONYMOUS: '/api/claims/anonymous',
  },
  
  // Matches
  MATCHES: {
    FOR_REPORT: (reportId: string) => `/api/matches/report/${reportId}`,
    FOR_ITEM: (itemId: string) => `/api/matches/item/${itemId}`,
  },
  
  // Pickups
  PICKUPS: {
    BASE: '/api/pickups',
    SLOTS: '/api/pickups/available-slots',
    BY_ID: (id: string) => `/api/pickups/${id}`,
    COMPLETE: (id: string) => `/api/pickups/${id}/complete`,
  },
  
  // Storage
  STORAGE: {
    BASE: '/api/storage',
    BY_ID: (id: string) => `/api/storage/${id}`,
  },
  
  // Disposition
  DISPOSITION: {
    BASE: '/api/disposition',
    BY_ID: (id: string) => `/api/disposition/${id}`,
    BY_ITEM: (itemId: string) => `/api/disposition/item/${itemId}`,
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    CATEGORY_BREAKDOWN: '/api/analytics/category-breakdown',
    TRENDS: '/api/analytics/trends',
    DISPOSITION_STATS: '/api/analytics/disposition-stats',
    STAFF_WORKLOAD: '/api/analytics/staff-workload',
    PREDICTION_ACCURACY: '/api/analytics/prediction-accuracy',
  },
  
  // Activities
  ACTIVITIES: {
    BASE: '/api/activities',
    BY_USER: (userId: string) => `/api/activities/user/${userId}`,
    BY_ENTITY: (type: string, id: string) => `/api/activities/entity/${type}/${id}`,
  },

  // Chat
  CHAT: {
    START: '/api/chat/start',
    MESSAGE: '/api/chat/message',
    SESSION: (sessionId: string) => `/api/chat/session/${sessionId}`,
  },

  // Payments
  PAYMENTS: {
    FEE_BREAKDOWN: (claimId: string) => `/api/payments/fee-breakdown/${claimId}`,
    CREATE_INTENT: '/api/payments/create-intent',
    VERIFY: '/api/payments/verify',
    ANALYTICS: '/api/analytics/payments',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
  }
} as const;
