// Route Paths
export const ROUTES = {
  // Public
  HOME: '/',
  // SEARCH: '/search', // Removed
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  OAUTH_CALLBACK: '/auth/google/callback',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Items
  ITEMS: '/items',
  ITEMS_NEW: '/items/new',
  ITEMS_DETAIL: '/items/:id',
  ITEMS_EDIT: '/items/:id/edit',
  
  // Reports
  REPORTS: '/reports',
  REPORTS_NEW: '/reports/create',
  LOST_REPORT: '/reports/create',
  REPORTS_DETAIL: '/reports/:id',
  
  // Claims
  CLAIMS: '/claims',
  CLAIMS_DETAIL: '/claims/:id',
  
  // Pickups
  PICKUPS: '/pickups',
  PICKUPS_NEW: '/pickups/new',
  PICKUPS_DETAIL: '/pickups/:id',
  
  // Storage
  STORAGE: '/storage',
  STORAGE_NEW: '/storage/new',
  
  // Disposition
  DISPOSITION: '/disposition',
  
  // Analytics
  ANALYTICS: '/analytics',
  
  // Activities
  ACTIVITIES: '/activities',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  
  // Staff
  STAFF: '/admin/staff',
} as const;

// Helper to build route with params
export const buildRoute = (route: string, params: Record<string, string>): string => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
