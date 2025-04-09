import axios from 'axios';

export interface Producer {
  candidate_name: string;
  fio_address: string;
  owner: string;
}

export type ProducerMap = Map<string, Producer>;

export const getProducers = async (): Promise<Producer[]> => {
  const response = await axios.get(`https://bpmonitor.fio.net/api/producers`);

  return response.data;
};
