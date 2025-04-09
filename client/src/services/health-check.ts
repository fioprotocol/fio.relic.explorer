import { HealthCheckResponse } from '@shared/types/health-check';
import { apiClient } from './api-client';

export const getHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await apiClient.get<HealthCheckResponse>('/health-check');
  return response.data;
};
