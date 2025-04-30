import { useNavigate, useParams } from 'react-router';

import { getProposal } from 'src/services/hyperion';
import { getBlocksDate } from 'src/services/blocks';

import { useGetData } from 'src/hooks/useGetData';

import { formatDate } from 'src/utils/general';

import { Proposal } from '@shared/types/hyperion';
import { BlocksDateResponse } from '@shared/types/blocks';

type UseProposalDetailsContext = {
  proposal_name?: string;
  proposal?: Proposal;
  block_date?: number;
  requested_approvals: {
    account: string;
    date: string;
    executed: boolean;
  }[];
  loading?: boolean;
  error: Error | null;
  onBack: () => void;
};

export const useProposalDetailsContext = (): UseProposalDetailsContext => {
  const navigate = useNavigate();
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

  const onBack = (): void => {
    navigate(-1);
  };

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

  return {
    proposal_name,
    proposal,
    block_date: blockDateResponse?.data?.[proposal?.block_num],
    requested_approvals,
    onBack,
    error,
    loading,
  };
};
