export type Proposal = {
  proposer: string;
  proposal_name: string;
  executed: string;
  requested_approvals: string[];
  provided_approvals: string[];
  block_num: number;
  block_date?: number;
};

export type ProposalsResponse = {
  proposals: Proposal[];
  total: number;
};
