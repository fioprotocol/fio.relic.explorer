import { useCallback, useEffect, useState } from 'react';

import { getProducers, Producer, ProducerMap } from 'src/services/bpmonitor';

interface UseProducersOptions {
  refresh?: boolean;
  name?: string;
}

interface UseProducersReturn {
  producers: ProducerMap;
  producer?: Producer;
  loading: boolean;
}

let sharedProducersMap: ProducerMap = new Map();

export const useProducers = (options: UseProducersOptions = {}): UseProducersReturn => {
  const { refresh = false, name } = options;

  const [producersMap, setProducersMap] = useState<ProducerMap>(sharedProducersMap);
  const [loading, setIsLoading] = useState(false);

  const loadProducers = useCallback(async (): Promise<void> => {
    try {
      const producers = await getProducers();
      const newProducersMap = new Map<string, Producer>();
      producers.forEach((producer) => {
        newProducersMap.set(producer.owner, producer);
      });

      sharedProducersMap = newProducersMap;
      setProducersMap(sharedProducersMap);
    } catch (error) {
      console.error('Failed to load producers:', error);
    }
  }, []);

  const fetchProducers = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && sharedProducersMap.size > 0) {
      return;
    }

    try {
      setIsLoading(true);

      await loadProducers();
    } catch (error) {
      console.error('Failed to load producers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadProducers]);

  useEffect(() => {
    fetchProducers(refresh);
  }, [fetchProducers, refresh]);

  return {
    producers: producersMap,
    producer: name ? producersMap.get(name) : undefined,
    loading,
  };
};

export default useProducers;
