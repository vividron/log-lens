import { apiClient } from './api';

export const dashboardService = {
  async getDashboardStats() {
    const response = await apiClient.get('/dashboard/stats');
    return response?.data || {};
  },

  async getActivityTimeline(range = '24h') {
    const response = await apiClient.get('/dashboard/timeline', { params: { range } });
    return response?.data || [];
  },
};
