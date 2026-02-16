import { FILE_UPLOAD } from '../constants';

// Validate file size
export const validateFileSize = (file: File): boolean => {
  return file.size <= FILE_UPLOAD.MAX_SIZE;
};

// Validate file type (images)
export const validateImageType = (file: File): boolean => {
  return FILE_UPLOAD.ACCEPTED_IMAGE_TYPES.includes(file.type as any);
};

// Validate file type (documents)
export const validateDocumentType = (file: File): boolean => {
  return FILE_UPLOAD.ACCEPTED_DOCUMENT_TYPES.includes(file.type as any);
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Create file preview URL
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

// Revoke file preview URL
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
