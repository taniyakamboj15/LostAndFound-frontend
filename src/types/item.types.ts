import { ItemCategory } from '@constants/categories';
import { ItemStatus } from '@constants/status';
import { PaginationMeta } from './api.types';

// Uploaded File
export interface UploadedFile {
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: string;
}

// Item Types
export interface Item {
  _id: string;
  category: ItemCategory;
  description: string;
  photos: UploadedFile[];
  locationFound: string;
  dateFound: string;
  status: ItemStatus;
  storageLocation?: {
    _id: string;
    name: string;
    location: string;
  };
  retentionPeriodDays: number;
  retentionExpiryDate: string;
  registeredBy: {
    _id: string;
    name: string;
    email: string;
  };
  claimedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  keywords: string[];
  isHighValue: boolean;
  estimatedValue?: number;
  finderName?: string;
  finderContact?: string;
  identifyingFeatures?: string[];
  createdAt: string;
  updatedAt: string;
}

// Create Item Data (Structured format)
export interface CreateItemFields {
  category: ItemCategory;
  description: string;
  photos: File[];
  locationFound: string;
  dateFound: string;
  isHighValue: boolean;
  estimatedValue?: number;
  finderName?: string;
  finderContact?: string;
  storageLocation?: string;
}

// Create Item Data can be either structured object or FormData (for direct multipart uploads)
export type CreateItemData = CreateItemFields | FormData;

// Update Item Data (JSON format)
export interface UpdateItemFields {
  description?: string;
  locationFound?: string;
  dateFound?: string;
  category?: ItemCategory;
  isHighValue?: boolean;
  estimatedValue?: number;
  finderName?: string;
  finderContact?: string;
  status?: ItemStatus;
  storageLocation?: string;
}

// Update Item Data can be either JSON or FormData (for photo uploads)
export type UpdateItemData = UpdateItemFields | FormData;

// Item Filters
export interface ItemFilters {
  category?: ItemCategory;
  status?: ItemStatus;
  location?: string;
  dateFoundFrom?: string;
  dateFoundTo?: string;
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Item Search Response
export interface ItemSearchResponse {
  success: boolean;
  data: Item[];
  pagination: PaginationMeta;
}

// Public Item (limited info)
export interface PublicItem {
  _id: string;
  category: ItemCategory;
  description: string;
  photos: UploadedFile[];
  locationFound: string;
  dateFound: string;
  keywords: string[];
  createdAt: string;
}

export interface EditItemFormData {
  category: ItemCategory;
  description: string;
  locationFound: string;
  dateFound: string;
  finderName?: string;
  finderContact?: string;
  isHighValue: boolean;
  storageLocation?: string | null;
  status: ItemStatus;
  identifyingFeatures?: string;
}