import axios from 'axios';
import { HealthCheckResponse } from '../types/health-check';

const API_URL = '/api/health-check';

export const getHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await axios.get<HealthCheckResponse>(API_URL);
  return response.data;
};
