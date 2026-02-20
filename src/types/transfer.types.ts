import { Item } from './item.types';
import { Claim } from './claim.types';
import { Storage } from './storage.types';

export enum TransferStatus {
  PENDING = 'PENDING',
  RECOVERY_REQUIRED = 'RECOVERY_REQUIRED',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  CANCELLED = 'CANCELLED',
}

export interface Transfer {
  _id: string;
  claimId: string | Claim;
  itemId: string | Item;
  fromStorageId: string | Storage;
  toStorageId: string | Storage;
  status: TransferStatus;
  estimatedArrival?: string;
  shippedAt?: string;
  receivedAt?: string;
  carrierInfo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferFilters {
  status?: TransferStatus | '';
  fromStorageId?: string;
  toStorageId?: string;
  claimId?: string;
  page?: number;
  limit?: number;
  keyword?: string;
}

export interface TransferResponse {
  success: boolean;
  data: Transfer[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleTransferResponse {
  success: boolean;
  data: Transfer;
  message?: string;
}
