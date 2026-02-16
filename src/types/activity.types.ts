import { ActivityAction } from '@constants/common';
import { PaginationMeta } from './api.types';

// Activity Types
export interface Activity {
  _id: string;
  action: ActivityAction;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  entityType: 'Item' | 'Claim' | 'LostReport' | 'Pickup' | 'Disposition' | 'Match' | 'User';
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Activity Filters
export interface ActivityFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: ActivityAction;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Activity Response
export interface ActivityResponse {
  success: boolean;
  data: Activity[];
  pagination: PaginationMeta;
}
