export interface FileValidationOptions {
  maxSizeMB: number;
  acceptedTypes: string[];
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (file: File, options: FileValidationOptions): ValidationResult => {
  const { maxSizeMB, acceptedTypes } = options;

  // Check file type
  const isValidType = acceptedTypes.some(type => {
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(`${baseType}/`);
    }
    return file.type === type || file.type.startsWith(type);
  });

  if (!isValidType) {
    return { 
      valid: false, 
      error: `${file.name} is not a valid format (${acceptedTypes.join(', ').replace(/image\//g, '').replace(/\/\*/g, '')})` 
    };
  }

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { 
      valid: false, 
      error: `${file.name} is larger than ${maxSizeMB}MB` 
    };
  }

  return { valid: true };
};
