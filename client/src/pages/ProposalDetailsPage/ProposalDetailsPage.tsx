import React from 'react';
import { Link } from 'react-router';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { DataTile } from 'src/components/common/DataTile';
import { TableComponent } from 'src/components/layout/TableComponent';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { Alert } from 'src/components/common/Alert';
import { Loader } from 'src/components/common/Loader';

import { useProposalDetailsContext } from './ProposalDetailsContext';

import { formatDate } from 'src/utils/general';

import { ROUTES } from 'src/constants/routes';

const COLUMNS = [
  {
    key: 'proposer',
    title: 'Account',
  },
  {
    key: 'date',
    title: 'Date/Time Signed',
  },
  {
    key: 'status',
    title: 'Status',
  },
];

const ProposalDetailsPage: React.FC = () => {
  const { requested_approvals, proposal, block_date, error, loading } = useProposalDetailsContext();

  if (error) {
    return (
      <Container className="py-5" title="Multisig TX">
        <BackButton />
        <Alert variant="danger" title="Error fetching proposal details" message={error.message} />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <BackButton />
      <h4>Multisig TX</h4>
      {!proposal || loading ? (
        <Loader fullScreen noBg />
      ) : (
        <>
          <div className="d-block d-lg-flex justify-content-between align-items-center mb-4 gap-5 f-size-sm lh-1"></div>

          <DataTile
            className="mb-4"
            columns={5}
            items={[
              {
                title: 'Proposer',
                value: proposal.proposer ? (
                  <Link to={`${ROUTES.account.path}/${proposal.proposer}`}>
                    {proposal.proposer}
                  </Link>
                ) : (
                  '-'
                ),
              },
              {
                title: 'Proposal Name',
                value: <span className="fw-semibold-inter">{proposal.proposal_name}</span>,
              },
              {
                title: 'Date',
                value: (
                  <span className="fw-semibold-inter">
                    {block_date ? formatDate(block_date) : '-'}
                  </span>
                ),
              },
              {
                title: 'Approval Status',
                value: (
                  <span className="fw-semibold-inter">
                    {proposal.requested_approvals.length} / {proposal.provided_approvals.length}
                  </span>
                ),
              },
              {
                title: 'Status',
                value: proposal.executed ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                ),
              },
            ]}
          />

          <CardComponent title="Requested Approvals" useMobileStyle>
            <TableComponent
              columns={COLUMNS}
              data={requested_approvals.map((approval) => ({
                proposer: (
                  <Link to={`${ROUTES.account.path}/${approval.account}`}>{approval.account}</Link>
                ),
                date: approval.date,
                status: approval.executed ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Badge variant="warning">Pending</Badge>
                ),
              }))}
            />
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default ProposalDetailsPage;
