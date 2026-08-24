import { useState, useEffect, useCallback } from 'react';
import { logService } from '../services/logService';
import { useDebounce } from './useDebounce';
import { useApp } from '../context/AppContext';

export function useLogs(filters = {}, options = {}) {
  const { initialLimit = 25 } = options;
  const { refreshTrigger } = useApp();

  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search query so API is not hammered on keystroke
  const debouncedSearch = useDebounce(filters.search || '', 300);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await logService.getLogs({
        page,
        limit,
        search: debouncedSearch,
        severity: filters.severity,
        status: filters.status,
        anomalyFilter: filters.anomalyFilter,
        source: filters.source,
        sortBy: filters.sortBy || 'timestamp',
        sortOrder: filters.sortOrder || 'desc',
      });

      setLogs(result.logs || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs from server');
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearch,
    filters.severity,
    filters.status,
    filters.anomalyFilter,
    filters.source,
    filters.sortBy,
    filters.sortOrder,
    refreshTrigger,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.severity, filters.status, filters.anomalyFilter, filters.source]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    setPage,
    setLimit,
    refetch: fetchLogs,
  };
}
