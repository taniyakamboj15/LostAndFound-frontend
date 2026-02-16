// Common API Types

// Pagination Meta
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// API Error
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Loading State
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form State
export interface FormState<T> extends LoadingState {
  data: T | null;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Table State
export interface TableState<T> extends LoadingState {
  data: T[];
  pagination: PaginationMeta;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Select Option
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// File Upload State
export interface FileUploadState {
  file: File;
  preview?: string;
  progress: number;
  error?: string;
}
