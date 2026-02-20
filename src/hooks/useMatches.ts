
import { useState, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './useToast';

import { Match, MatchFilters } from '../types/match.types';

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
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined)
      );

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...cleanFilters,
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
