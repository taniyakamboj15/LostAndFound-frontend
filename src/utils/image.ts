import { API_BASE_URL } from '../constants/api';

/**
 * Generates the full URL for an item image.
 * Handles both absolute URLs (external) and relative paths (stored on server).
 * 
 * @param photoPath - The path or URL of the photo data
 * @returns The full URL to be used in <img src="..." />
 */
export const getItemImageUrl = (photoPath: string | undefined): string | null => {
  if (!photoPath) return null;
  return photoPath.startsWith('http') ? photoPath : `${API_BASE_URL}/${photoPath}`;
};
