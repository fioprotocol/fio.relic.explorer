import { useCallback, useEffect, useState } from 'react';

import { getProducers, Producer, ProducerMap } from 'src/services/bpmonitor';

interface UseProducersOptions {
  refresh?: boolean;
  name?: string;
}

interface UseProducersReturn {
  producers: ProducerMap;
  producer?: Producer;
}

let sharedProducersMap: ProducerMap = new Map();
let isLoading = false;

export const useProducers = (options: UseProducersOptions = {}): UseProducersReturn => {
  const { refresh = false, name } = options;

  const [producersMap, setProducersMap] = useState<ProducerMap>(sharedProducersMap);

  const loadProducers = useCallback(async (refresh = false): Promise<void> => {
    if (isLoading || (!refresh && sharedProducersMap.size > 0)) {
      return;
    }

    // prevent multiple requests
    isLoading = true;
    const producers = await getProducers();
    const newProducersMap = new Map<string, Producer>();
    producers.forEach((producer) => {
      newProducersMap.set(producer.owner, producer);
    });

    sharedProducersMap = newProducersMap;
    setProducersMap(sharedProducersMap);
    isLoading = false;
  }, []);

  useEffect(() => {
    loadProducers(refresh);
  }, [refresh, loadProducers]);

  return {
    producers: producersMap,
    producer: name ? producersMap.get(name) : undefined,
  };
};

export default useProducers;
