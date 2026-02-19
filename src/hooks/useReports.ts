import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { reportService } from '@services/report.service';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useQueryFilters } from './useQueryFilters';
import { getErrorMessage } from '@utils/errors';
import { ItemCategory } from '@constants/categories';
import type { LostReport, CreateLostReportData, ReportFilterState, LostReportFilters } from '../types/report.types';

export const useReportsList = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const initialFilters: ReportFilterState = useMemo(() => ({
    keyword: searchParams.get('keyword') || undefined,
    category: (searchParams.get('category') as ItemCategory) || undefined,
    dateLostFrom: searchParams.get('dateLostFrom') || undefined,
    dateLostTo: searchParams.get('dateLostTo') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
  }), []);

  const { filters, setFilters, debouncedFilters } = useQueryFilters<ReportFilterState>(initialFilters);
  
  const [reports, setReports] = useState<LostReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const fetchReports = useCallback(async (currentFilters: ReportFilterState = debouncedFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const filterParams: LostReportFilters = {
        keyword: currentFilters.keyword as string,
        category: (currentFilters.category || undefined) as ItemCategory,
        dateLostFrom: currentFilters.dateLostFrom as string,
        dateLostTo: currentFilters.dateLostTo as string,
        page: (currentFilters.page as number) || 1,
        limit: (currentFilters.limit as number) || 10,
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
      if (response.pagination) {
          setPagination(response.pagination);
      }
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

  const handlePageChange = useCallback((page: number) => {
    updateFilters({ ...filters, page });
  }, [filters, updateFilters]);

  return useMemo(() => ({
    reports,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: () => fetchReports(filters),
    pagination,
    handlePageChange
  }), [reports, isLoading, error, filters, updateFilters, fetchReports, pagination, handlePageChange]);
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
