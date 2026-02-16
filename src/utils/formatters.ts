import { format, formatDistance, formatRelative } from 'date-fns';
import { DATE_FORMATS } from '../constants';

// Format date for display
export const formatDate = (date: string | Date, formatStr: string = DATE_FORMATS.DISPLAY): string => {
  if (!date) return '';
  return format(new Date(date), formatStr);
  return format(new Date(date), formatStr);
};

// Format time
export const formatTime = (date: string | Date): string => {
  if (!date) return '';
  return format(new Date(date), 'p');
};

// Format date with time
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return format(new Date(date), DATE_FORMATS.DISPLAY_WITH_TIME);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

// Format relative date (e.g., "yesterday at 3:20 PM")
export const formatRelativeDate = (date: string | Date): string => {
  if (!date) return '';
  return formatRelative(new Date(date), new Date());
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Capitalize first letter
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Convert to title case
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
