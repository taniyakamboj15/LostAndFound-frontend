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
  reportedBy: ReportedBy;
  submittedBy?: ReportedBy; // Legacy field or alias
  contactEmail: string;
  contactPhone?: string;
  identifyingFeatures: string[];
  matches?: any[]; // For future strict typing
  matchCount?: number;
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
