import { useParams } from 'react-router';

import { getProposal } from 'src/services/hyperion';
import { getBlocksDate } from 'src/services/blocks';

import { useGetData } from 'src/hooks/useGetData';

import { formatDate } from 'src/utils/general';

import { Proposal } from '@shared/types/hyperion';
import { BlocksDateResponse } from '@shared/types/blocks';

type ProvidedApproval = {
  account: string;
  date: string;
  executed: boolean;
  originalTime?: string;
};

type UseProposalDetailsContext = {
  proposal_name?: string;
  proposal?: Proposal;
  block_date?: number;
  requested_approvals: ProvidedApproval[];
  provided_approvals: ProvidedApproval[];
  loading?: boolean;
  error: Error | null;
};

export const useProposalDetailsContext = (): UseProposalDetailsContext => {
  const { proposal_name } = useParams();
  const {
    response: proposal,
    loading,
    error,
  } = useGetData<Proposal>({
    action: getProposal,
    params: { proposal: proposal_name },
  });

  const { response: blockDateResponse } = useGetData<BlocksDateResponse>({
    ready: !!proposal?.block_num,
    action: getBlocksDate,
    params: {
      blocks: [proposal?.block_num],
    },
  });

  const requested_approvals =
    proposal?.requested_approvals.map((approval) => {
      const provided_approval = proposal?.provided_approvals.find(
        (provided) => provided.actor === approval.actor
      );

      return {
        account: approval.actor,
        date: provided_approval?.time ? formatDate(provided_approval.time) : '-',
        executed: provided_approval ? true : false,
      };
    }) || [];

  const provided_approvals =
    proposal?.provided_approvals.map((approval) => ({
      account: approval.actor,
      date: approval.time ? formatDate(approval.time) : '-',
      executed: true,
      originalTime: approval.time || '',
    })) || [];

  return {
    proposal_name,
    proposal,
    block_date: blockDateResponse?.data?.[proposal?.block_num],
    requested_approvals,
    provided_approvals,
    error,
    loading,
  };
};
