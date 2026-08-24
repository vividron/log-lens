import { apiClient } from './api';
import { normalizeLog, unwrapListResponse } from '../utils/apiMappers';

export const logService = {
  async getLogs(params = {}) {
    const backendParams = {
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search || undefined,
      severity: params.severity && params.severity !== 'ALL' ? params.severity : undefined,
      status: params.status && params.status !== 'ALL' ? params.status : undefined,
      anomalyFilter: params.anomalyFilter && params.anomalyFilter !== 'ALL' ? params.anomalyFilter : undefined,
      source: params.source || undefined,
      eventType: params.eventType || undefined,
      sortBy: params.sortBy || 'timestamp',
      sortOrder: params.sortOrder || 'desc',
    };
    return unwrapListResponse(await apiClient.get('/logs', { params: backendParams }));
  },

  async getLogById(id) {
    const response = await apiClient.get(`/logs/${id}`);
    return normalizeLog(response?.data || response);
  },

  async uploadLogs(file, onProgressStage) {
    const formData = new FormData();
    formData.append('file', file);
    onProgressStage?.('uploading', 10);

    const response = await apiClient.post('/logs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!event.total) return;
        onProgressStage?.('uploading', Math.min(40, Math.round((event.loaded / event.total) * 40)));
      },
    });

    onProgressStage?.('processing', 60);
    onProgressStage?.('detecting', 80);
    onProgressStage?.('saving', 95);
    onProgressStage?.('complete', 100);

    const summary = response?.summary || {};
    return {
      success: Boolean(response?.success),
      message: response?.message || 'Logs processed successfully',
      filename: file.name,
      totalRecords: Number(summary.total || 0),
      importedRecords: Number(summary.valid || 0),
      anomaliesDetected: Number(summary.anomalies || 0),
      missingTimestamps: Number(summary.missingTimestamps || 0),
      invalidCount: Number(summary.invalid || 0),
      validationErrors: response?.validationErrors || [],
    };
  },

  async deleteAll() {
    return apiClient.delete('/logs');
  },
};
