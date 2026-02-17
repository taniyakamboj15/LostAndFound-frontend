import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimService } from '@services/claim.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useDebounce } from './useDebounce';
import { ClaimStatus } from '@constants/status';
import { Claim } from '../types/claim.types';
import { ApiError } from '../types/api.types';

export const useFileClaim = (itemId: string | null) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  const handleFileChange = useCallback((files: File[]) => {
    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const validTypes = ['image/', 'application/pdf'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid file type (images or PDF only)`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    // Limit to 5 files total
    setProofFiles((prev) => {
      const remainingSlots = 5 - prev.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (validFiles.length > remainingSlots) {
        toast.error(`You can only upload up to 5 proof documents`);
      }

      return [...prev, ...filesToAdd];
    });
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const submitClaim = useCallback(async (description: string) => {
    if (!itemId) {
      toast.error('Invalid item ID');
      return;
    }

    if (proofFiles.length === 0) {
      toast.error('Please upload at least one proof document');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create the claim
      const claimRes = await claimService.create({
        itemId,
        description,
      });

      const claimId = claimRes.data._id;

      // 2. Upload proof files
      await claimService.uploadProof(claimId, {
        type: 'OWNERSHIP_PROOF',
        files: proofFiles,
      });

      toast.success('Claim filed successfully!');
      navigate('/claims');
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to file claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [itemId, proofFiles, navigate, toast]);

  return useMemo(() => ({
    proofFiles,
    isSubmitting,
    handleFileChange,
    removeFile,
    submitClaim,
  }), [proofFiles, isSubmitting, handleFileChange, removeFile, submitClaim]);
};

interface ClaimFilters {
  keyword?: string;
  status?: ClaimStatus | '';
}

export const useClaimsList = (initialFilters: ClaimFilters = {}) => {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClaimFilters>(initialFilters);
  const debouncedFilters = useDebounce(filters, 500);
  const toast = useToast();

  const fetchClaims = useCallback(async (currentFilters: ClaimFilters = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanFilters = {
        ...currentFilters,
        status: currentFilters.status || undefined
      };

      const response = user?.role === 'CLAIMANT'
        ? await claimService.getMyClaims(cleanFilters)
        : await claimService.getAll(cleanFilters);
      setClaims(response.data);
    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.message || 'Failed to fetch claims';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters, toast, user?.role]); // Added user?.role dependency

  const updateFilters = useCallback((newFilters: ClaimFilters) => {
    setFilters(newFilters);
    // Removed immediate fetchClaims call
  }, []);

  useEffect(() => {
    fetchClaims(debouncedFilters);
  }, [debouncedFilters]); // Trigger fetch when debounced filters change

  return useMemo(() => ({
    claims,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: fetchClaims,
  }), [claims, isLoading, error, filters, updateFilters, fetchClaims]);
};
