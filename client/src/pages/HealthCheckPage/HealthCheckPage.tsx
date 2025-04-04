import React, { useState } from 'react';

import { getHealthCheck } from 'src/services/health-check';

import { HealthCheckResponse } from 'shared/types/health-check';

import styles from './HealthCheckPage.module.scss';

const HealthCheckPage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkHealth = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getHealthCheck();
      setHealthStatus(response);
    } catch (err) {
      setError('Failed to check health status');
      console.error('Health check error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>API Health Check</h2>
      <button 
        onClick={checkHealth}
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Checking...' : 'Check API Health'}
      </button>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {healthStatus && (
        <div className={styles.statusCard}>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status:</span>
            <span className={healthStatus.data.status === 'healthy' ? styles.healthy : styles.unhealthy}>
              {healthStatus.data.status}
            </span>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Uptime:</span>
            <span>{Math.floor(healthStatus.data.uptime)} seconds</span>
          </div>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Timestamp:</span>
            <span>{new Date(healthStatus.data.timestamp).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckPage; 