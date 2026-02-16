// User Roles
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CLAIMANT = 'CLAIMANT',
}

// Role Display Names
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.STAFF]: 'Staff Member',
  [UserRole.CLAIMANT]: 'Claimant',
};

// Role Colors for Badges
export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
  [UserRole.STAFF]: 'bg-blue-100 text-blue-800',
  [UserRole.CLAIMANT]: 'bg-green-100 text-green-800',
};

// Role Permissions
export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    'view_all_items',
    'create_item',
    'update_item',
    'delete_item',
    'view_all_claims',
    'verify_claim',
    'reject_claim',
    'view_analytics',
    'manage_storage',
    'manage_disposition',
    'view_activities',
  ],
  [UserRole.STAFF]: [
    'view_all_items',
    'create_item',
    'update_item',
    'view_all_claims',
    'verify_claim',
    'reject_claim',
    'manage_storage',
    'complete_pickup',
  ],
  [UserRole.CLAIMANT]: [
    'create_report',
    'view_own_reports',
    'create_claim',
    'view_own_claims',
    'upload_proof',
    'book_pickup',
  ],
} as const;
