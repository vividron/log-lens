import { useState, useEffect, useCallback } from 'react';
import { anomalyService } from '../services/anomalyService';
import { useDebounce } from './useDebounce';
import { useApp } from '../context/AppContext';

export function useAnomalies(filters = {}, options = {}) {
  const { initialLimit = 20 } = options;
  const { refreshTrigger } = useApp();

  const [anomalies, setAnomalies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(filters.search || '', 300);

  const fetchAnomalies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await anomalyService.getAnomalies({
        page,
        limit,
        search: debouncedSearch,
        severity: filters.severity,
        minScore: filters.minScore || 0,
        source: filters.source,
      });

      setAnomalies(result.anomalies || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch anomaly records');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filters.severity, filters.minScore, filters.source, refreshTrigger]);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.severity, filters.minScore, filters.source]);

  return {
    anomalies,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    setPage,
    setLimit,
    refetch: fetchAnomalies,
  };
}
