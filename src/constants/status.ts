import { BadgeVariant } from '@app-types/ui.types';

// Item Status
export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  CLAIMED = 'CLAIMED',
  RETURNED = 'RETURNED',
  DISPOSED = 'DISPOSED',
}

// Item Status Labels
export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  [ItemStatus.AVAILABLE]: 'Available',
  [ItemStatus.CLAIMED]: 'Claimed',
  [ItemStatus.RETURNED]: 'Returned',
  [ItemStatus.DISPOSED]: 'Disposed',
};

// Item Status Colors
export const ITEM_STATUS_COLORS: Record<ItemStatus, string> = {
  [ItemStatus.AVAILABLE]: 'bg-green-100 text-green-800',
  [ItemStatus.CLAIMED]: 'bg-yellow-100 text-yellow-800',
  [ItemStatus.RETURNED]: 'bg-blue-100 text-blue-800',
  [ItemStatus.DISPOSED]: 'bg-gray-100 text-gray-800',
};

// Claim Status
export enum ClaimStatus {
  FILED = 'FILED',
  IDENTITY_PROOF_REQUESTED = 'IDENTITY_PROOF_REQUESTED',
  VERIFIED = 'VERIFIED',
  AWAITING_TRANSFER = 'AWAITING_TRANSFER',
  AWAITING_RECOVERY = 'AWAITING_RECOVERY',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVED = 'ARRIVED',
  PICKUP_BOOKED = 'PICKUP_BOOKED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
}

// Claim Status Labels
export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  [ClaimStatus.FILED]: 'Filed',
  [ClaimStatus.IDENTITY_PROOF_REQUESTED]: 'Proof Requested',
  [ClaimStatus.VERIFIED]: 'Verified',
  [ClaimStatus.AWAITING_TRANSFER]: 'Awaiting Transfer',
  [ClaimStatus.AWAITING_RECOVERY]: 'Recovery in Progress',
  [ClaimStatus.IN_TRANSIT]: 'In Transit',
  [ClaimStatus.ARRIVED]: 'Arrived at Pickup',
  [ClaimStatus.PICKUP_BOOKED]: 'Pickup Booked',
  [ClaimStatus.RETURNED]: 'Returned',
  [ClaimStatus.REJECTED]: 'Rejected',
};

// Claim Status Colors
export const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  [ClaimStatus.FILED]: 'bg-blue-100 text-blue-800',
  [ClaimStatus.IDENTITY_PROOF_REQUESTED]: 'bg-yellow-100 text-yellow-800',
  [ClaimStatus.VERIFIED]: 'bg-green-100 text-green-800',
  [ClaimStatus.AWAITING_TRANSFER]: 'bg-amber-100 text-amber-800',
  [ClaimStatus.AWAITING_RECOVERY]: 'bg-rose-100 text-rose-800',
  [ClaimStatus.IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
  [ClaimStatus.ARRIVED]: 'bg-emerald-100 text-emerald-800',
  [ClaimStatus.PICKUP_BOOKED]: 'bg-purple-100 text-purple-800',
  [ClaimStatus.RETURNED]: 'bg-gray-100 text-gray-800',
  [ClaimStatus.REJECTED]: 'bg-red-100 text-red-800',
};

// Payment Status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.FAILED]: 'Failed',
};

// Disposition Type
export enum DispositionType {
  DONATE = 'DONATE',
  AUCTION = 'AUCTION',
  DISPOSE = 'DISPOSE',
}

// Disposition Type Labels
export const DISPOSITION_TYPE_LABELS: Record<DispositionType, string> = {
  [DispositionType.DONATE]: 'Donate',
  [DispositionType.AUCTION]: 'Auction',
  [DispositionType.DISPOSE]: 'Dispose',
};

// Combined Item Status Info (for easy access in components)
export const ITEM_STATUS: Record<ItemStatus, { label: string; variant: BadgeVariant }> = {
  [ItemStatus.AVAILABLE]: {
    label: ITEM_STATUS_LABELS[ItemStatus.AVAILABLE],
    variant: 'success',
  },
  [ItemStatus.CLAIMED]: {
    label: ITEM_STATUS_LABELS[ItemStatus.CLAIMED],
    variant: 'warning',
  },
  [ItemStatus.RETURNED]: {
    label: ITEM_STATUS_LABELS[ItemStatus.RETURNED],
    variant: 'info',
  },
  [ItemStatus.DISPOSED]: {
    label: ITEM_STATUS_LABELS[ItemStatus.DISPOSED],
    variant: 'default',
  },
};


