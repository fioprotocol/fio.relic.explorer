import React from 'react';
import { Link } from 'react-router';
import BigNumber from 'big.js';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { DataTile } from 'src/components/common/DataTile';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { Alert } from 'src/components/common/Alert';
import { LoadableTable } from 'src/components/common/LoadableTable';

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
  const { requested_approvals, proposal, block_date, error, loading, provided_approvals } =
    useProposalDetailsContext();

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
      <div className="d-block d-lg-flex justify-content-between align-items-center mb-4 gap-5 f-size-sm lh-1"></div>

      <DataTile
        className="mb-4"
        columns={5}
        items={[
          {
            title: 'Proposer',
            value: proposal?.proposer ? (
              <Link to={`${ROUTES.account.path}/${proposal?.proposer}`}>{proposal?.proposer}</Link>
            ) : (
              '-'
            ),
          },
          {
            title: 'Proposal Name',
            value: <span className="fw-semibold-inter">{proposal?.proposal_name}</span>,
          },
          {
            title: 'Date',
            value: (
              <span className="fw-semibold-inter">{block_date ? formatDate(block_date) : '-'}</span>
            ),
          },
          {
            title: 'Approval Status',
            value: (
              <span className="fw-semibold-inter">
                {proposal?.provided_approvals.length} /{' '}
                {new BigNumber(proposal?.provided_approvals.length || 0)
                  .add(proposal?.requested_approvals.length || 0)
                  .toString()}
              </span>
            ),
          },
          {
            title: 'Status',
            value: proposal?.executed ? (
              <Badge variant="success">Executed</Badge>
            ) : (
              <Badge variant="warning">Pending</Badge>
            ),
          },
        ]}
        loading={loading}
      />

      <CardComponent title="Requested Approvals" useMobileStyle>
        <LoadableTable
          columns={COLUMNS}
          data={[
            ...provided_approvals.map((approval) => ({
              proposer: (
                <Link to={`${ROUTES.account.path}/${approval.account}`}>{approval.account}</Link>
              ),
              date: approval.date,
              status: <Badge variant="success">Approved</Badge>,
              originalTime: approval.originalTime,
            })),
            ...requested_approvals
              .filter((approval) => !approval.executed)
              .map((approval) => ({
                proposer: (
                  <Link to={`${ROUTES.account.path}/${approval.account}`}>{approval.account}</Link>
                ),
                date: approval.date,
                status: <Badge variant="warning">Pending</Badge>,
                originalTime: '', // Empty for sorting purposes
              })),
          ].sort((a, b) => {
            if (!a.originalTime || !b.originalTime) {
              return a.originalTime ? -1 : 1; // Items with originalTime first
            }
            return new Date(b.originalTime).getTime() - new Date(a.originalTime).getTime(); // Newest first
          })}
          showPagination={false}
          loading={loading}
        />
        {!loading && !proposal && (
          <Alert variant="info" title="No data found" className="mt-5" hasDash={false} />
        )}
      </CardComponent>
    </Container>
  );
};

export default ProposalDetailsPage;
