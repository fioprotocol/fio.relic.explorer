import axios from 'axios';

import { HYPERION_API_URL } from '@shared/constants/fio';
import { Proposal, ProposalsResponse } from '@shared/types/hyperion';

export const getMultiSigsData = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<ProposalsResponse> => {
  const response = await axios.get<{
    proposals: Proposal[];
    total: { value: number; relation: string };
  }>(`${HYPERION_API_URL}/state/get_proposals`, {
    params: {
      limit,
      skip: offset,
    },
  });

  return {
    proposals: response.data.proposals,
    total: response.data.total.value,
  };
};
