// Storage Types
export interface Storage {
  _id: string;
  name: string;
  location: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity: number;
  currentCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create Storage Data
export interface CreateStorageData {
  name: string;
  location: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity: number;
}

// Update Storage Data
export interface UpdateStorageData {
  name?: string;
  location?: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity?: number;
  isActive?: boolean;
}

// Storage Form Data
export interface StorageFormData {
  name: string;
  location: string;
  shelfNumber?: string;
  binNumber?: string;
  capacity: number;
  isActive: boolean;
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
