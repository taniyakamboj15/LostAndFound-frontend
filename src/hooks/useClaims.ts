import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { claimService } from '@services/claim.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useQueryFilters } from './useQueryFilters';
import { ClaimStatus } from '@constants/status';
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

import { Claim, ClaimFilterState } from '../types/claim.types';

export const useClaimsList = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const initialFilters: ClaimFilterState = useMemo(() => ({
    keyword: searchParams.get('keyword') || undefined,
    status: (searchParams.get('status') as ClaimStatus) || undefined,
    date: searchParams.get('date') || undefined,
  }), []);

  const { filters, setFilters, debouncedFilters } = useQueryFilters<ClaimFilterState>(initialFilters);

  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async (currentFilters: ClaimFilterState = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanFilters = {
        ...currentFilters,
        status: currentFilters.status || undefined,
        date: currentFilters.date || undefined,
      };

      if (!user) return;

      let response;
      if (user.role === 'CLAIMANT') {
        response = await claimService.getMyClaims(cleanFilters);
      } else if (user.role === 'STAFF' || user.role === 'ADMIN') {
        response = await claimService.getAll(cleanFilters);
      } else {
        return;
      }
      setClaims(response.data);
    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.message || 'Failed to fetch claims';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters, toast, user]);

  const updateFilters = useCallback((newFilters: ClaimFilterState) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Fetch claims only when filters change or user changes
  useEffect(() => {
    if (user?.role) {
      fetchClaims(debouncedFilters);
    }
  }, [debouncedFilters, user?.role, fetchClaims]); 

  return useMemo(() => ({
    claims,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: () => fetchClaims(filters),
  }), [claims, isLoading, error, filters, updateFilters, fetchClaims]);
};
