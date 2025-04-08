import axios from 'axios';

interface Producer {
  candidate_name: string;
  fio_address: string;
  owner: string;
}

const producerMap = new Map<string, Producer>();

export const getProducers = async (): Promise<Producer[]> => {
  const response = await axios.get(`https://bpmonitor.fio.net/api/producers`);

  return response.data;
};

export const setProducers = async (): Promise<void> => {
  const producers = await getProducers();
  producers.forEach((producer) => {
    producerMap.set(producer.owner, producer);
  });
};

export const getProducerByAccountName = (producer_account_name: string): Producer | undefined => {
  return producerMap.get(producer_account_name);
};
