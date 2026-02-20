import { BadgeVariant } from '@app-types/ui.types';

/**
 * Returns the badge configuration for a match confidence score.
 * 
 * @param confidence - The confidence score (0-1)
 * @returns Object containing variant and label
 */
export const getConfidenceBadge = (confidence: number): { variant: BadgeVariant; label: string } => {
  if (confidence >= 0.8) return { variant: 'success', label: 'High Match' };
  if (confidence >= 0.6) return { variant: 'warning', label: 'Medium Match' };
  return { variant: 'default', label: 'Low Match' };
};

/**
 * Returns the color variant for a claim status badge
 */
export const getClaimStatusVariant = (status: string): "success" | "danger" | "warning" | "info" | "default" => {
  const variantMap: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
    'VERIFIED': 'success',
    'REJECTED': 'danger',
    'IDENTITY_PROOF_REQUESTED': 'warning',
    'PICKUP_BOOKED': 'info',
    'RETURNED': 'info',
    'AWAITING_TRANSFER': 'warning',
    'AWAITING_RECOVERY': 'warning',
    'IN_TRANSIT': 'info',
    'ARRIVED': 'success',
  };
  return variantMap[status] || 'default';
};

/**
 * Returns the color variant for a transfer status badge
 */
export const getTransferStatusVariant = (status: string): "success" | "danger" | "warning" | "info" | "default" => {
  const variantMap: Record<string, "success" | "danger" | "warning" | "info" | "default"> = {
    'ARRIVED': 'success',
    'IN_TRANSIT': 'info',
    'RECOVERY_REQUIRED': 'danger',
    'PENDING': 'warning',
    'CANCELLED': 'danger',
  };
  return variantMap[status] || 'default';
};
