import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { anomalyService } from '../services/anomalyService';
import { useApp } from '../context/AppContext';

export function useDashboardStats() {
  const { refreshTrigger } = useApp();

  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [topSources, setTopSources] = useState([]);
  const [severityBreakdown, setSeverityBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, timelineData, sourcesData, breakdownData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getActivityTimeline('24h'),
        anomalyService.getTopSources(),
        anomalyService.getSeverityBreakdown(),
      ]);

      setStats(statsData);
      setTimeline(timelineData);
      setTopSources(sourcesData);
      setSeverityBreakdown(breakdownData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  return {
    stats,
    timeline,
    topSources,
    severityBreakdown,
    loading,
    error,
    refetch: fetchAllDashboardData,
  };
}
