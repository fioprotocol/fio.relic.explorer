import { apiClient } from './api-client';
import { getAccountPublicKey } from './fio';

const JIRA_API_URL = 'https://jira.fio.net/';

export type JiraCandidate = {
  id: string;
  fields: {
    customfield_10176: string;
    customfield_10177: string;
    customfield_10178: string;
    customfield_10179: string;
    customfield_10180: {
      content: Array<{
        content: {
          text: string;
        }[];
      }>;
    };
    customfield_10181: string;
    customfield_10183: number;
    customfield_10184: string;
    issuelinks: {
      outwardIssue: {
        id: string;
        key: string;
        self: string;
        fields: {
          summary: string;
          status: {
            self: string;
            description: string;
            iconUrl: string;
            name: string;
            id: string;
            statusCategory: {
              self: string;
              id: number;
              key: string;
              colorName: string;
              name: string;
            }
          };
          priority: {
            self: string;
            iconUrl: string;
            name: string;
            id: string;
          };
          issuetype: {
            self: string;
            id: string;
            description: string;
            iconUrl: string;
            name: string;
            subtask: boolean;
            avatarId: number;
            hierarchyLevel: number;
          };
        };
      };
      type: {
        outward: string;
      };
    }[];
    status: {
      name: string;
    };
    summary: string;
  };
  key: string;
};

export type JiraVotesResponse = {
  expand: string;
  issues: JiraCandidate[];
  maxResults: number;
  startAt: number;
  total: number;
};

export type getJiraBoardMembersVotesResponse = {
  expand: string;
  issues: JiraCandidate[];
  maxResults: number;
  startAt: number;
  total: number;
};

export const getJiraBoardMembers = async (): Promise<getJiraBoardMembersVotesResponse> => {
  const response = await apiClient.get(`${JIRA_API_URL}search?jql=filter=10080&maxResults=1000`);
  return response.data;
};

export const getJiraVotes = async ({
  publicKey,
}: {
  publicKey: string;
}): Promise<JiraVotesResponse> => {
  const response = await apiClient.get(
    `${JIRA_API_URL}search?jql=filter=10081 AND summary ~ "${publicKey}"&maxResults=1000`
  );
  return response.data;
};

export const getBoardMembersVotes = async ({
  publicKey,
  votingProxy,
}: {
  publicKey: string;
  votingProxy: string;
}): Promise<JiraVotesResponse> => {
  let votingPublicKey = publicKey;

  if (votingProxy) {
    const getAccountPublicKeyResponse = await getAccountPublicKey({ accountName: votingProxy });

    if (getAccountPublicKeyResponse?.fio_public_key) {
      votingPublicKey = getAccountPublicKeyResponse?.fio_public_key;
    }
  }

  return await getJiraVotes({ publicKey: votingPublicKey });
};
