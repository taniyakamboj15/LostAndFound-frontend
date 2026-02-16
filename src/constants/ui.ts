import { ShieldCheck } from 'lucide-react';
import { ClaimStatus } from './status';

export const ROLE_BADGE_CONFIG = {
  ADMIN: { variant: 'success', icon: ShieldCheck },
  STAFF: { variant: 'default', icon: ShieldCheck },
} as const;

export const STATUS_BADGE_CONFIG = {
  true: { variant: 'success', label: 'Active' },
  false: { variant: 'default', label: 'Inactive' },
} as const;

export const VERIFICATION_BADGE_CONFIG = {
  true: { variant: 'success', label: 'Verified' },
  false: { variant: 'warning', label: 'Pending' },
} as const;

export const CLAIM_STATUS_BADGE_MAP = {
  [ClaimStatus.VERIFIED]: 'success',
  [ClaimStatus.REJECTED]: 'danger',
  [ClaimStatus.IDENTITY_PROOF_REQUESTED]: 'warning',
  [ClaimStatus.PICKUP_BOOKED]: 'info',
  [ClaimStatus.RETURNED]: 'info',
  [ClaimStatus.FILED]: 'default',
} as const;
