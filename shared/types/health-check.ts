export interface HealthCheckResponse {
  data: {
    status: string,
    uptime: number,
    timestamp: string,
  }
}
