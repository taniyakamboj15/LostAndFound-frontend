import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '@services/report.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useDebounce } from './useDebounce';
import { getErrorMessage } from '@utils/errors';
import { ItemCategory } from '@constants/categories';
import type { LostReport, CreateLostReportData } from '../types/report.types';

interface ReportFilters {
  keyword?: string;
  category?: ItemCategory | '';
}

export const useReportsList = (initialFilters: ReportFilters = {}) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<LostReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const debouncedFilters = useDebounce(filters, 500);
  const toast = useToast();

  const fetchReports = useCallback(async (currentFilters: ReportFilters = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParams = {
        keyword: currentFilters.keyword,
        category: currentFilters.category || undefined,
      };

      const response = user?.role === 'CLAIMANT'
        ? await reportService.getMyReports(filterParams)
        : await reportService.getAll(filterParams);
      setReports(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters, toast, user?.role]);

  const updateFilters = useCallback((newFilters: ReportFilters) => {
    setFilters(newFilters);
    // Removed immediate fetchReports call
  }, []);

  useEffect(() => {
    fetchReports(debouncedFilters);
  }, [debouncedFilters]); // Trigger fetch when debounced filters change

  return useMemo(() => ({
    reports,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: fetchReports,
  }), [reports, isLoading, error, filters, updateFilters, fetchReports]);
};

export const useReportDetail = (id: string | null) => {
  const [report, setReport] = useState<LostReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchReport = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [reportResponse, matchesResponse] = await Promise.all([
        reportService.getById(id),
        reportService.getMatches(id)
      ]);
      setReport({ ...reportResponse.data, matches: matchesResponse.data });
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return useMemo(() => ({
    report,
    isLoading,
    error,
    refresh: fetchReport,
  }), [report, isLoading, error, fetchReport]);
};

export const useCreateReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const createReport = useCallback(async (data: CreateLostReportData) => {
    setIsSubmitting(true);
    try {
      await reportService.create(data);
      toast.success('Lost report submitted successfully! We\'ll notify you if we find a match.');
      navigate('/reports');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, navigate]);

  return useMemo(() => ({ createReport, isSubmitting }), [createReport, isSubmitting]);
};
