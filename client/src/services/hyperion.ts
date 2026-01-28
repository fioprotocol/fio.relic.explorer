import axios from 'axios';

import { HISTORY_V2_SERVERS, FIO_HYPERION_VERSION } from '@shared/constants/fio';
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
  }>(`${HISTORY_V2_SERVERS[0]}${FIO_HYPERION_VERSION}/state/get_proposals`, {
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

export const getProposal = async ({ proposal }: { proposal: string }): Promise<Proposal> => {
  const response = await axios.get<{
    proposals: Proposal[];
    total: { value: number; relation: string };
  }>(`${HISTORY_V2_SERVERS[0]}${FIO_HYPERION_VERSION}/state/get_proposals`, {
    params: {
      proposal,
    },
  });

  return response.data.proposals[0];
};
