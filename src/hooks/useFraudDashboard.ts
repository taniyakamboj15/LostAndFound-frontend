import { useState, useEffect } from 'react';
import api from '../services/api';
import { FraudClaim } from '@app-types/analytics.types';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useFraudDashboard = (initialThreshold: number = 70) => {
  const [claims, setClaims] = useState<FraudClaim[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [inputThreshold, setInputThreshold] = useState(initialThreshold.toString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHighRiskClaims = async (t = threshold, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/fraud/high-risk?threshold=${t}&page=${page}&limit=20`);
      setClaims(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setError('Failed to load high-risk claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHighRiskClaims(); }, []);

  const applyThreshold = () => {
    const val = parseInt(inputThreshold);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setThreshold(val);
      fetchHighRiskClaims(val, 1);
    }
  };

  return {
    claims,
    pagination,
    threshold,
    inputThreshold,
    setInputThreshold,
    loading,
    error,
    applyThreshold,
    fetchHighRiskClaims
  };
};
