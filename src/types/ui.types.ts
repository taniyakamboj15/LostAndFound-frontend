import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { ItemCategory } from '@constants/categories';
import { ItemStatus } from '@constants/status';
import { BUTTON_VARIANTS, BUTTON_SIZES, CARD_PADDINGS, MODAL_SIZES, SPINNER_SIZES } from '@constants/ui';
import { variantStyles as badgeVariantStyles, sizeStyles as badgeSizeStyles } from '@constants/badge';
import { Item } from './item.types';
import { Claim } from './claim.types';

// Generic UI Types
export type BadgeVariant = keyof typeof badgeVariantStyles;
export type BadgeSize = keyof typeof badgeSizeStyles;

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: keyof typeof CARD_PADDINGS;
  hover?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: keyof typeof MODAL_SIZES;
  showCloseButton?: boolean;
}

export interface SpinnerProps {
  size?: keyof typeof SPINNER_SIZES;
  className?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export interface ShimmerCardProps {
  className?: string;
}

export interface ShimmerListProps {
  count?: number;
}

export interface ShimmerTableProps {
  rows?: number;
}

// Layout & Navigation Types
export interface NavItem {
  label: string;
  path: string;
}

export interface NavProps {
  items: readonly NavItem[];
  staffItems: readonly NavItem[];
}

// Specialized Component Props
export interface GuestRouteProps {
  children: ReactNode;
}

export interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export interface ClaimCardProps {
  claim: Claim;
}

export interface ItemCardProps {
  item: Item;
}

export interface DispositionActionsProps {
  itemId: string;
  onDispositionComplete: () => void;
}

export interface PickupSchedulerProps {
  claimId: string;
  onScheduled: () => void;
}

export interface ScanPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (pickupData: any) => void; // Using any for Pickup to avoid circular dependency or just import it
}

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

export interface ComponentErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  title?: string;
  message?: string;
}

// Filters (Existing)
export interface BaseSearchFilters {
  keyword: string;
  category: ItemCategory | '';
}

export interface PublicSearchFilters extends BaseSearchFilters {
  location: string;
  dateFrom: string;
  dateTo: string;
}

export interface AdminItemFilters extends BaseSearchFilters {
  status: ItemStatus | '';
}


