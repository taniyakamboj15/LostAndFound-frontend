// Storage Types
export interface Storage {
  _id: string;
  name: string;
  location: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity: {
    small: number;
    medium: number;
    large: number;
  };
  currentCount: {
    small: number;
    medium: number;
    large: number;
  };
  isActive: boolean;
  isPickupPoint: boolean;
  city: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export type StorageLocation = Storage;

// Create Storage Data
export interface CreateStorageData {
  name: string;
  location: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity: {
    small: number;
    medium: number;
    large: number;
  };
  isPickupPoint: boolean;
  city: string;
  address?: string;
}

// Update Storage Data
export interface UpdateStorageData {
  name?: string;
  location?: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity?: {
    small?: number;
    medium?: number;
    large?: number;
  };
  isActive?: boolean;
  isPickupPoint?: boolean;
  city?: string;
  address?: string;
}

// Storage Form Data
export interface StorageFormData {
  name: string;
  location: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity: {
    small: number;
    medium: number;
    large: number;
  };
  isActive: boolean;
  isPickupPoint: boolean;
  city: string;
  address?: string;
}

// Storage Response
export interface StorageResponse {
  success: boolean;
  message: string;
  data: Storage;
}

// Storage List Response
export interface StorageListResponse {
  success: boolean;
  data: Storage[];
}
