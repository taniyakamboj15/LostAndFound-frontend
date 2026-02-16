import { DispositionType } from '@constants/status';

// Disposition Types
export interface Disposition {
  _id: string;
  itemId: {
    _id: string;
    category: string;
    description: string;
  };
  type: DispositionType;
  processedBy: {
    _id: string;
    name: string;
  };
  processedAt: string;
  recipient?: string;
  notes?: string;
  auditTrail: Array<{
    action: string;
    timestamp: string;
    userId: {
      _id: string;
      name: string;
    };
    details: string;
  }>;
}

// Create Disposition Data
export interface CreateDispositionData {
  itemId: string;
  type: DispositionType;
  recipient?: string;
  notes?: string;
}

// Disposition Response
export interface DispositionResponse {
  success: boolean;
  message: string;
  data: Disposition;
}

// Disposition List Response
export interface DispositionListResponse {
  success: boolean;
  data: Disposition[];
}
