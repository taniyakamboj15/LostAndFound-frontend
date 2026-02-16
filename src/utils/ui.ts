import { BadgeVariant } from '@components/ui/Badge';

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
