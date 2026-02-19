import { ClaimStatus } from '@constants/status';
import { PaginationMeta } from './api.types';
import { Item } from './item.types';
import { User } from './user.types';

// Proof Document
export interface ProofDocument {
  type: string;
  filename: string;
  path: string;
  uploadedAt: string;
}

// Claim Types
export interface Claim {
  _id: string;
  itemId: Item; // Populated item
  claimantId: User; // Populated claimant
  // item: Item; // Removed as it's now itemId
  // claimant: User; // Removed as it's now claimantId
  lostReportId?: {
    _id: string;
    description: string;
  } | string;
  description: string;
  status: ClaimStatus;
  proofDocuments: ProofDocument[];
  verificationNotes?: string;
  verifiedBy?: {
    _id: string;
    name: string;
  } | string;
  verifiedAt?: string;
  rejectionReason?: string;
  filedAt?: string; // Some parts of the UI use filedAt
  createdAt: string;
  updatedAt: string;
  timeline: Array<{
    action: string;
    actor: string;
    timestamp: string;
  }>;
}

// Create Claim Data
export interface CreateClaimData {
  itemId: string;
  description: string;
  lostReportId?: string;
}

// Upload Proof Data
export interface UploadProofData {
  files: File[];
  type: string;
}

// Verify Claim Data
export interface VerifyClaimData {
  notes?: string;
}

// Reject Claim Data
export interface RejectClaimData {
  reason: string;
}

// Claim Filters
export interface ClaimFilters {
  keyword?: string;
  status?: ClaimStatus;
  itemId?: string;
  page?: number;
  limit?: number;
}

// Claim Filter State (Frontend)
export interface ClaimFilterState {
  keyword?: string;
  status?: ClaimStatus | '';
  date?: string;
  [key: string]: unknown;
}

// Claim Response
export interface ClaimResponse {
  success: boolean;
  message: string;
  data: Claim;
}

// Claims List Response
export interface ClaimsListResponse {
  success: boolean;
  data: Claim[];
  pagination: PaginationMeta;
}
