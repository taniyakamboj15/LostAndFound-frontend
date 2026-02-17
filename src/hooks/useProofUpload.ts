import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@hooks/useToast';
import { claimService } from '@services/claim.service';
import { getErrorMessage} from '@utils/errors';
import { usePhotoUpload } from '@hooks/usePhotoUpload';

interface ProofUploadOptions {
  claimId: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const useProofUpload = ({ claimId, maxFiles = 5, maxSizeMB = 10 }: ProofUploadOptions) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofType, setProofType] = useState('GOVERNMENT_ID');

  const { photos: files, handlePhotoChange, removePhoto } = usePhotoUpload({
    maxPhotos: maxFiles,
    maxSizeMB,
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (files.length === 0) {
      toast.error('Please select at least one document');
      return;
    }

    setIsSubmitting(true);
    try {
      await claimService.uploadProof(claimId, {
        type: proofType,
        files,
      });
      toast.success('Proof documents uploaded successfully');
      navigate(`/claims/${claimId}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/claims/${claimId}`);
  };

  return {
    proofType,
    setProofType,
    files,
    handlePhotoChange,
    removePhoto,
    handleSubmit,
    handleCancel,
    isSubmitting,
  };
};
