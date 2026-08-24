import { apiClient } from './api';
import { normalizeLog, unwrapListResponse } from '../utils/apiMappers';

export const anomalyService = {
  async getAnomalies(params = {}) {
    const response = await apiClient.get('/anomalies', {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search || undefined,
        severity: params.severity && params.severity !== 'ALL' ? params.severity : undefined,
        minScore: params.minScore > 0 ? params.minScore : undefined,
        source: params.source || undefined,
      },
    });
    const normalized = unwrapListResponse(response);
    return { anomalies: normalized.logs, total: normalized.total, page: normalized.page, limit: normalized.limit, totalPages: normalized.totalPages };
  },

  async getTopSources() {
    const response = await apiClient.get('/dashboard/top-sources');
    return response?.data || [];
  },

  async getSeverityBreakdown() {
    const response = await apiClient.get('/dashboard/anomaly-breakdown');
    return response?.data || { critical: 0, high: 0, medium: 0, low: 0 };
  },
};
