import { apiClient } from './api';

export const aiService = {
  async getAIAnalysis(log) {
    if (!log?.id) throw new Error('Valid anomaly is required for AI analysis');

    const response = await apiClient.post(`/anomalies/${log.id}/analyze`);
    const data = response?.data || response;
    return {
      whatHappened: data.explanation || data.whatHappened || '',
      likelyCause: data.likelyCause || '',
      recommendedNextStep: data.recommendedNextStep || '',
      analyzedAt: data.generatedAt || data.analyzedAt,
      model: data.model || 'Gemini',
      confidence: data.confidence,
    };
  },

  async retryAIAnalysis(log) {
    if (!log?.id) throw new Error('Valid anomaly is required for AI analysis');
    const response = await apiClient.post(`/anomalies/${log.id}/analyze?regenerate=true`);
    const data = response?.data || response;
    return {
      whatHappened: data.explanation || '',
      likelyCause: data.likelyCause || '',
      recommendedNextStep: data.recommendedNextStep || '',
      analyzedAt: data.generatedAt,
      model: data.model || 'Gemini',
      confidence: data.confidence,
    };
  },
};
