import { FC } from 'react';
import { Link } from 'react-router';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { LoadableTable } from 'src/components/common/LoadableTable';
import { Loader } from 'src/components/common/Loader';
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

  if (!fetched) {
    return (
      <Container title="Multi-signature Proposals">
        <Loader fullScreen className="my-5" />
      </Container>
    );
  }

  return (
    <Container title="Multi-signature Proposals">
      <CardComponent title="Proposal Details" className="mb-3" useMobileStyle>
        {proposals.length > 0 ? (
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
                  {proposal.requested_approvals.length} / {proposal.provided_approvals.length}
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
        ) : (
          <Alert variant="info" title="No data found" className="mt-5" hasDash={false} />
        )}
      </CardComponent>
    </Container>
  );
};

export default ContractsPage;
