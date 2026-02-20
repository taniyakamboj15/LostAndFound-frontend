export const getErrorMessage = (error: unknown): string => {
  // Handle silent errors
  if (error && typeof error === 'object' && 'silent' in error && (error as { silent: boolean }).silent) {
    return '';
  }

  if (error instanceof Error) return error.message;
  
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return 'An unexpected error occurred';
};
