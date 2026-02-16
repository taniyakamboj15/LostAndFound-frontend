// Notification Events
export enum NotificationEvent {
  MATCH_FOUND = 'MATCH_FOUND',
  CLAIM_STATUS_UPDATE = 'CLAIM_STATUS_UPDATE',
  RETENTION_EXPIRY_WARNING = 'RETENTION_EXPIRY_WARNING',
  PICKUP_REMINDER = 'PICKUP_REMINDER',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PROOF_REQUESTED = 'PROOF_REQUESTED',
}

// Activity Actions
export enum ActivityAction {
  ITEM_REGISTERED = 'ITEM_REGISTERED',
  ITEM_UPDATED = 'ITEM_UPDATED',
  LOST_REPORT_SUBMITTED = 'LOST_REPORT_SUBMITTED',
  MATCH_GENERATED = 'MATCH_GENERATED',
  CLAIM_FILED = 'CLAIM_FILED',
  PROOF_UPLOADED = 'PROOF_UPLOADED',
  CLAIM_VERIFIED = 'CLAIM_VERIFIED',
  CLAIM_REJECTED = 'CLAIM_REJECTED',
  PICKUP_BOOKED = 'PICKUP_BOOKED',
  PICKUP_COMPLETED = 'PICKUP_COMPLETED',
  DISPOSITION_PROCESSED = 'DISPOSITION_PROCESSED',
  USER_REGISTERED = 'USER_REGISTERED',
  USER_VERIFIED = 'USER_VERIFIED',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_FILES: 5,
} as const;

// Retention Periods (in days)
export const RETENTION_PERIODS = {
  DEFAULT: 30,
  HIGH_VALUE: 90,
  DOCUMENTS: 60,
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in!',
    REGISTER: 'Account created successfully!',
    ITEM_CREATED: 'Item registered successfully!',
    ITEM_UPDATED: 'Item updated successfully!',
    CLAIM_FILED: 'Claim filed successfully!',
    PROOF_UPLOADED: 'Proof uploaded successfully!',
    PICKUP_BOOKED: 'Pickup booked successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'Resource not found.',
    VALIDATION: 'Please check your input and try again.',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;
