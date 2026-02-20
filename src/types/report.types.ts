import { ItemCategory } from '@constants/categories';
import { PaginationMeta } from './api.types';

// Lost Report Types
export interface ReportedBy {
  _id: string;
  name: string;
  email: string;
}

export interface LostReport {
  _id: string;
  category: ItemCategory;
  description: string;
  keywords: string[];
  locationLost: string;
  dateLost: string;
  reportedBy: string | ReportedBy;
  submittedBy?: ReportedBy; 
  contactEmail: string;
  contactPhone?: string;
  identifyingFeatures: string[];
  // Structured markers
  brand?: string;
  color?: string;
  itemSize?: string;
  bagContents?: string[];
  matches?: unknown[]; 
  matchCount?: number;
  starredBy?: string[];
  createdAt: string;
  updatedAt: string;
}

// Create Lost Report Data
export interface CreateLostReportData {
  category: ItemCategory;
  description: string;
  locationLost: string;
  dateLost: string;
  contactEmail?: string;
  contactPhone?: string;
  identifyingFeatures: string[];
  brand?: string;
  color?: string;
  itemSize?: string;
  bagContents?: string[];
}

// Update Lost Report Data
export interface UpdateLostReportData {
  description?: string;
  contactPhone?: string;
  identifyingFeatures?: string[];
}

// Lost Report Filters
export interface LostReportFilters {
  category?: ItemCategory;
  location?: string;
  dateLostFrom?: string;
  dateLostTo?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

// Reports Filter State (Frontend)
export interface ReportFilterState {
  keyword?: string;
  category?: ItemCategory | '';
  dateLostFrom?: string;
  dateLostTo?: string;
  [key: string]: unknown;
}

// Lost Report Response
export interface LostReportResponse {
  success: boolean;
  message: string;
  data: LostReport;
}

// Lost Reports List Response
export interface LostReportsListResponse {
  success: boolean;
  data: LostReport[];
  pagination: PaginationMeta;
}
