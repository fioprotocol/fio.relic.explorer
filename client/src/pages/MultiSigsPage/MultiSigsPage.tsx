import { FC } from 'react';
import { Link } from 'react-router';
import BigNumber from 'big.js';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { LoadableTable } from 'src/components/common/LoadableTable';
import { Alert } from 'src/components/common/Alert';

import { formatDate } from 'src/utils/general';
import { useMultiSigsPageContext } from './MultiSigsPageContext';

import { ROUTES } from 'src/constants/routes';

const COLUMNS = [
  {
    key: 'proposer',
    title: 'Proposer',
  },
  {
    key: 'proposal_name',
    title: 'Proposal Name',
  },
  {
    key: 'executed',
    title: 'Executed',
  },
  {
    key: 'status',
    title: 'Request/Approval Status',
  },
  {
    key: 'date',
    title: 'Date',
  },
  {
    key: 'proposals',
    title: 'Proposals',
  },
];

const ContractsPage: FC = () => {
  const { loading, fetched, proposals, paginationProps } = useMultiSigsPageContext();

  return (
    <Container title="Multi-signature Proposals">
      <CardComponent title="Proposal Details" className="mb-3" useMobileStyle>
        {!proposals.length && fetched ? (
          <Alert variant="info" title="No data found" className="mt-5" hasDash={false} />
        ) : (
          <LoadableTable
            columns={COLUMNS}
            data={proposals.map((proposal) => ({
              proposer: (
                <Link to={`${ROUTES.accounts.path}/${proposal.proposer}`}>{proposal.proposer}</Link>
              ),
              proposal_name: (
                <Link to={`${ROUTES.multisigs.path}/${proposal.proposal_name}`}>
                  {proposal.proposal_name}
                </Link>
              ),
              status: (
                <span>
                  {proposal.provided_approvals.length} /{' '}
                  {new BigNumber(proposal.provided_approvals.length)
                    .add(proposal.requested_approvals.length)
                    .toString()}
                </span>
              ),
              executed: proposal.executed ? 'Yes' : 'No',
              date: proposal.block_date ? formatDate(proposal.block_date) : '-',
              proposals: (
                <>
                  <Link
                    className="d-none d-lg-inline-block btn btn-primary px-5 f-size-sm"
                    to={`${ROUTES.multisigs.path}/${proposal.proposal_name}`}
                  >
                    Show proposal
                  </Link>

                  <Link
                    className="d-lg-none"
                    to={`${ROUTES.multisigs.path}/${proposal.proposal_name}`}
                  >
                    Show proposal
                  </Link>
                </>
              ),
            }))}
            loading={loading}
            {...paginationProps}
          />
        )}
      </CardComponent>
    </Container>
  );
};

export default ContractsPage;
