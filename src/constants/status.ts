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
  PICKUP_BOOKED = 'PICKUP_BOOKED',
  RETURNED = 'RETURNED',
  REJECTED = 'REJECTED',
}

// Claim Status Labels
export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  [ClaimStatus.FILED]: 'Filed',
  [ClaimStatus.IDENTITY_PROOF_REQUESTED]: 'Proof Requested',
  [ClaimStatus.VERIFIED]: 'Verified',
  [ClaimStatus.PICKUP_BOOKED]: 'Pickup Booked',
  [ClaimStatus.RETURNED]: 'Returned',
  [ClaimStatus.REJECTED]: 'Rejected',
};

// Claim Status Colors
export const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  [ClaimStatus.FILED]: 'bg-blue-100 text-blue-800',
  [ClaimStatus.IDENTITY_PROOF_REQUESTED]: 'bg-yellow-100 text-yellow-800',
  [ClaimStatus.VERIFIED]: 'bg-green-100 text-green-800',
  [ClaimStatus.PICKUP_BOOKED]: 'bg-purple-100 text-purple-800',
  [ClaimStatus.RETURNED]: 'bg-gray-100 text-gray-800',
  [ClaimStatus.REJECTED]: 'bg-red-100 text-red-800',
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
export const ITEM_STATUS: Record<ItemStatus, { label: string; color: string }> = {
  [ItemStatus.AVAILABLE]: {
    label: ITEM_STATUS_LABELS[ItemStatus.AVAILABLE],
    color: 'green',
  },
  [ItemStatus.CLAIMED]: {
    label: ITEM_STATUS_LABELS[ItemStatus.CLAIMED],
    color: 'yellow',
  },
  [ItemStatus.RETURNED]: {
    label: ITEM_STATUS_LABELS[ItemStatus.RETURNED],
    color: 'blue',
  },
  [ItemStatus.DISPOSED]: {
    label: ITEM_STATUS_LABELS[ItemStatus.DISPOSED],
    color: 'gray',
  },
};


