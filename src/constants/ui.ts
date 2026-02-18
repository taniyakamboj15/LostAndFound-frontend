import { ShieldCheck, Gift, Trash2, Gavel } from 'lucide-react';
import { ClaimStatus, DispositionType } from './status';
import { BadgeVariant } from '@app-types/ui.types';
import { SelectHTMLAttributes } from 'react';
export interface ErrorConfig {
  title: string;
  message: string;
  variant: BadgeVariant;
}

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

export const CLAIM_STATUS_VARIANT_MAP: Record<ClaimStatus | 'PENDING', BadgeVariant> = {
  [ClaimStatus.VERIFIED]: 'success',
  [ClaimStatus.REJECTED]: 'danger',
  [ClaimStatus.IDENTITY_PROOF_REQUESTED]: 'warning',
  [ClaimStatus.PICKUP_BOOKED]: 'info',
  [ClaimStatus.RETURNED]: 'info',
  [ClaimStatus.FILED]: 'default',
  PENDING: 'warning', // For legacy support or specific UI states
} as const;

export const CONFIDENCE_BADGE_CONFIG = (score: number): { variant: BadgeVariant; label: string } => {
  if (score >= 0.9) return { variant: 'success', label: 'Very High' };
  if (score >= 0.7) return { variant: 'info', label: 'High' };
  if (score >= 0.5) return { variant: 'warning', label: 'Medium' };
  return { variant: 'danger', label: 'Low' };
};

export const BUTTON_VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
} as const;

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

export const CARD_PADDINGS = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

export const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const;

export const SPINNER_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const;

export const ERROR_UI_CONFIG = {
  default: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
    variant: 'danger',
  },
  notFound: {
    title: 'Page Not Found',
    message: "The page you're looking for doesn't exist.",
    variant: 'warning',
  },
  unauthorized: {
    title: 'Unauthorized',
    message: 'You do not have permission to view this page.',
    variant: 'danger',
  },
  unavailable: {
    title: 'Service Unavailable',
    message: 'Our servers are currently unavailable. Please try again later.',
    variant: 'warning',
  },
} as const;

export const PICKUP_SLOT_VARIANT_MAP = {
  selected: 'bg-primary-600 text-white border-primary-600',
  available: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
  unavailable: 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200',
} as const;

export const INPUT_ERROR_STYLES = {
  true: 'border-red-500 focus:ring-red-500',
  false: 'border-gray-300',
} as const;

export const PUBLIC_NAV_ITEMS = [
  { label: 'Lost & Found', path: '/' },
] as const;

export const PROTECTED_NAV_ITEMS = [
  { label: 'Claims', path: '/claims' },
  { label: 'Reports', path: '/reports' },
  { label: 'Pickups', path: '/pickups' },
] as const;

export const STAFF_NAV_ITEMS = [
  {label: 'Items', path: '/items'},
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: 'Analytics', path: '/analytics' },
  { label: 'Storage', path: '/storage' },
  {label: 'Staff', path: '/admin/staff'},
] as const;

export const DISPOSITION_UI_CONFIG: Record<DispositionType, { 
  label: string; 
  icon: typeof Gift; 
  variant: BadgeVariant;
  colorClass: string;
  placeholder: string;
}> = {
  [DispositionType.DONATE]: {
    label: 'Donate',
    icon: Gift,
    variant: 'success',
    colorClass: 'bg-green-50 border-green-500 text-green-700',
    placeholder: 'e.g. Goodwill, Red Cross',
  },
  [DispositionType.AUCTION]: {
    label: 'Auction',
    icon: Gavel,
    variant: 'info',
    colorClass: 'bg-blue-50 border-blue-500 text-blue-700',
    placeholder: 'e.g. eBay, Local Auction House',
  },
  [DispositionType.DISPOSE]: {
    label: 'Dispose',
    icon: Trash2,
    variant: 'danger',
    colorClass: 'bg-red-50 border-red-500 text-red-700',
    placeholder: 'e.g. Recycling Center, Incinerator',
  },
} as const;

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}