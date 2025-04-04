import axios from 'axios';
import { API_PREFIX } from 'shared/constants/network';
import { HealthCheckResponse } from 'shared/types/health-check';

const API_URL = `${API_PREFIX}/health-check`;

export const getHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await axios.get<HealthCheckResponse>(API_URL);
  return response.data;
};
