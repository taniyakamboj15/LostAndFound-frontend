import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reportService } from '@services/report.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useQueryFilters } from './useQueryFilters';
import { getErrorMessage } from '@utils/errors';
import { ItemCategory } from '@constants/categories';
import type { LostReport, CreateLostReportData, ReportFilterState } from '../types/report.types';

export const useReportsList = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const initialFilters: ReportFilterState = useMemo(() => ({
    keyword: searchParams.get('keyword') || undefined,
    category: (searchParams.get('category') as ItemCategory) || undefined,
    dateLostFrom: searchParams.get('dateLostFrom') || undefined,
    dateLostTo: searchParams.get('dateLostTo') || undefined,
  }), []);

  const { filters, setFilters, debouncedFilters } = useQueryFilters<ReportFilterState>(initialFilters);
  
  const [reports, setReports] = useState<LostReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchReports = useCallback(async (currentFilters: ReportFilterState = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParams = {
        keyword: currentFilters.keyword,
        category: currentFilters.category || undefined,
        dateLostFrom: currentFilters.dateLostFrom || undefined,
        dateLostTo: currentFilters.dateLostTo || undefined,
      };

      if (!user) return;

      let response;
      if (user.role === 'CLAIMANT') {
        response = await reportService.getMyReports(filterParams);
      } else if (user.role === 'STAFF' || user.role === 'ADMIN') {
        response = await reportService.getAll(filterParams);
      } else {
        return;
      }
      setReports(response.data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters, toast, user]);

  const updateFilters = useCallback((newFilters: ReportFilterState) => {
    setFilters(newFilters);
  }, [setFilters]);

  // Fetch reports only when filters change or user changes
  useEffect(() => {
    if (user?.role) {
      fetchReports(debouncedFilters);
    }
  }, [debouncedFilters, user?.role, fetchReports]); 

  return useMemo(() => ({
    reports,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: () => fetchReports(filters),
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
