import { useState, useEffect, useCallback } from 'react';

import { useGetData } from 'src/hooks/useGetData';
import { getProxies } from 'src/services/bpmonitor';
import { Proxy } from 'src/services/bpmonitor';

export type ProxyItemType = Proxy & { showVotes: boolean };

export type UseProxiesPageContextType = {
  loading: boolean;
  proxies: ProxyItemType[];
  toggleVotes: (owner: string) => void;
};

export const useProxiesPageContext = (): UseProxiesPageContextType => {
  const [proxies, setProxies] = useState<ProxyItemType[]>([]);

  const { response, loading } = useGetData<Proxy[]>({ action: getProxies });

  const toggleVotes = useCallback((owner: string) => {
    setProxies(proxies.map((p) => ({ ...p, showVotes: p.owner === owner ? !p.showVotes : p.showVotes })));
  }, [proxies]);

  useEffect(() => {
    setProxies(response?.map((proxy) => ({ ...proxy, showVotes: false })));
  }, [response]);

  return {
    loading,
    proxies,
    toggleVotes,
  };
};
