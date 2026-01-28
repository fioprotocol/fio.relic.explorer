export type Approval = {
  actor: string;
  permission: string;
  time: string;
};

export type Proposal = {
  proposer: string;
  proposal_name: string;
  executed: string;
  requested_approvals: Approval[];
  provided_approvals: Approval[];
  block_num: number;
  block_date?: number;
};

export type ProposalsResponse = {
  proposals: Proposal[];
  total: number;
};

export type ProposalResponseData = {
  proposal: Proposal;
};
