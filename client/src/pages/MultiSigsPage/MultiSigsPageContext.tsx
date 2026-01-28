import BigNumber from 'big.js';

import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { useGetData } from 'src/hooks/useGetData';

import { getBlocksDate } from 'src/services/blocks';
import { getMultiSigsData } from 'src/services/hyperion';

import { Proposal } from '@shared/types/hyperion';
import { BlocksDateResponse } from '@shared/types/blocks';

export type UseMultiSigsPageContextType = {
  loading: boolean;
  fetched: boolean;
  proposals: Proposal[];
  paginationProps: UsePaginationDefaultProps;
};

export const useMultiSigsPageContext = (): UseMultiSigsPageContextType => {
  const { data, loading, fetched, ...paginationProps } = usePaginationData<Proposal>({
    action: getMultiSigsData,
    dataKey: 'proposals',
  });

  const blocks = data?.map((proposal) => new BigNumber(proposal.block_num).toString());
  const { response } = useGetData<BlocksDateResponse>({
    ready: !!blocks?.length,
    action: getBlocksDate,
    params: {
      blocks,
    },
  });

  return {
    fetched,
    loading,
    paginationProps,
    proposals:
      data?.map((proposal) => ({
        ...proposal,
        block_date: response?.data?.[new BigNumber(proposal.block_num).toString()],
      })) || [],
  };
};
