import { useMemo } from 'react';
import BigNumber from 'big.js';

import { useGetData } from 'src/hooks/useGetData';
import {
  getBoardMembersVotes,
  getJiraBoardMembers,
  getJiraBoardMembersVotesResponse,
  JiraVotesResponse,
} from 'src/services/jira';
import { getNextGovernanceDate } from 'src/utils/fio';

import { FIO_PREFIX } from '@shared/constants/fio';

type BoardMember = {
  id: string;
  image: string | undefined;
  name: string;
  status: string;
};

type UseVotingTabContext = {
  currentBoardVotingPower: string;
  lastBoardVote: string;
  boardMembers: BoardMember[];
  loading: boolean;
};

export const useVotingTabContext = ({
  publicKey,
  votingProxy,
}: {
  publicKey: string | undefined;
  votingProxy: string | null;
}): UseVotingTabContext => {
  const { response, loading } = useGetData<JiraVotesResponse>({
    action: getBoardMembersVotes,
    params: { publicKey, votingProxy },
    ready: !!publicKey,
  });

  const { response: boardMembersResponse } = useGetData<getJiraBoardMembersVotesResponse>({
    action: getJiraBoardMembers,
  });

  const boardMembers = useMemo(() => {
    return response?.issues[0]?.fields?.issuelinks
      .filter((issueLink) => issueLink?.type?.outward === 'votes on')
      .map(({ outwardIssue: { key, fields, id } }) => ({
        id: key?.replace('FB-', ''),
        image: boardMembersResponse?.issues.find(({ id: boardMemberId }) => boardMemberId === id)
          ?.fields?.customfield_10178,
        name: fields?.summary,
        status: fields?.issuetype?.name,
      }));
  }, [boardMembersResponse?.issues, response?.issues]);

  return {
    boardMembers,
    currentBoardVotingPower: `${new BigNumber(
      response?.issues[0]?.fields?.customfield_10183 || '0'
    ).toString()} ${FIO_PREFIX}`,
    lastBoardVote: getNextGovernanceDate({ returnLastVoteDate: true, returnDefaultFormat: true }),
    loading,
  };
};
