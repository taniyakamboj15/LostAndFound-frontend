
import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './useToast';

export interface Match {
  _id: string;
  itemId: {
    _id: string;
    description: string;
    category: string;
    dateFound: string;
    locationFound: string;
    photos: { path: string }[];
  };
  lostReportId: {
    _id: string;
    description: string;
    category: string;
    dateLost: string;
    locationLost: string;
    contactEmail: string;
  };
  confidenceScore: number;
  categoryScore?: number;
  keywordScore?: number;
  dateScore?: number;
  locationScore?: number;
  featureScore?: number;
  colorScore?: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'AUTO_CONFIRMED';
  notified?: boolean;
  createdAt: string;
}

export interface MatchFilters {
  status?: string;
  minConfidence?: number;
  fromDate?: string;
  toDate?: string;
}

interface UseMatchesReturn {
  matches: Match[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchMatches: (page?: number, filters?: MatchFilters) => Promise<void>;
  updateMatchStatus: (id: string, status: 'CONFIRMED' | 'REJECTED') => Promise<void>;
}

export const useMatches = (): UseMatchesReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { success, error: showError } = useToast();

  const fetchMatches = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    setErrorState(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters,
      });

      const response = await api.get(`/api/matches?${queryParams.toString()}`);
      
      setMatches(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(response.data.pagination.page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch matches';
      setErrorState(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateMatchStatus = useCallback(async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await api.patch(`/api/matches/${id}/status`, { status });
      
      setMatches(prev => prev.map(m => 
        m._id === id ? { ...m, status } : m
      ));

      success(`Match ${status.toLowerCase()}`);
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : 'Failed to update match status');
    }
  }, [success, showError]);

  // Initial fetch
  useEffect(() => {
      fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error: errorState,
    totalPages,
    currentPage,
    fetchMatches,
    updateMatchStatus,
  };
};
