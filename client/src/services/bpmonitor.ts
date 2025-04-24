import axios from 'axios';

export interface Producer {
  branding: {
    logo_svg?: string;
    logo_256?: string;
  };
  candidate_name: string;
  fio_address: string;
  flagIconUrl: string;
  id: string;
  owner: string;
  score: {
    details: {
      valid_fio_address: {
        status: boolean;
      };
    };
    grade: string;
    score: number;
  };
  socials: {
    telegram?: string;
    twitter?: string;
  };
  total_votes: number;
  url: string;
}

export interface Proxy {
  owner: string;
  fio_address: string;
  vote: string[];
  delegators: {
    owner: string;
    weight: number;
  }[];
}

export type ProducerMap = Map<string, Producer>;

const bpMonitorBaseUrl = 'https://bpmonitor.fio.net/api';

export const getProducers = async (): Promise<Producer[]> => {
  // TODO: Add hanling for testnet https://bpmonitor.fio.net/api/producers?chain=testnet
  const response = await axios.get<Producer[]>(`${bpMonitorBaseUrl}/producers`);

  return response.data;
};

export const getProxies = async (): Promise<Proxy[]> => {
  // TODO: Add hanling for testnet https://bpmonitor.fio.net/api/proxies?chain=testnet
  const response = await axios.get<Proxy[]>(`${bpMonitorBaseUrl}/proxies`);

  return response.data;
};
