import { API_BASE_URL } from '@constants/api';

/**
 * Formats an image URL, handling both absolute paths/external URLs 
 * and relative paths from the backend.
 * 
 * @param path The photo path or URL
 * @returns The formatted URL
 */
export const formatImageUrl = (path?: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Clean the path of any double slashes if needed
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Alias for formatImageUrl to maintain backward compatibility if needed
 * or for more semantic usage with items.
 */
export const getItemImageUrl = formatImageUrl;
