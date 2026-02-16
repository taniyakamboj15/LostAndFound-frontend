import { useState, useCallback } from 'react';
import { useToast } from './useToast';
import { validateFile } from '@utils/fileUtils';

interface UsePhotoUploadOptions {
  maxPhotos?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const usePhotoUpload = (options: UsePhotoUploadOptions = {}) => {
  const {
    maxPhotos = 5,
    maxSizeMB = 5,
    acceptedTypes = ['image/']
  } = options;

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const toast = useToast();

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const { valid, error } = validateFile(file, { maxSizeMB, acceptedTypes });
      if (!valid) {
        toast.error(error || 'Invalid file');
        return false;
      }
      return true;
    });

    // Limit to maxPhotos total
    const remainingSlots = maxPhotos - photos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast.error(`You can only upload up to ${maxPhotos} photos`);
    }

    // Create previews
    const promises = filesToAdd.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(newPreviews => {
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
      setPhotos(prev => [...prev, ...filesToAdd]);
    });
  }, [photos, maxPhotos, maxSizeMB, acceptedTypes, toast]);

  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
    setPhotoPreviews([]);
  }, []);

  return {
    photos,
    photoPreviews,
    handlePhotoChange,
    removePhoto,
    clearPhotos
  };
};
