import { FC } from 'react';
import { Tab } from 'react-bootstrap';
import { Link } from 'react-router';

import Container from 'src/components/layout/Container';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { Tabs } from 'src/components/common/Tabs';
import DataTile from 'src/components/common/DataTile/DataTile';
import { CardComponent } from 'src/components/layout/CardComponent';

import { ROUTES } from 'src/constants/routes';
import { formatDate } from 'src/utils/general';

import { Transactions } from './Transactions';
import { FioHandlesTab } from './FioHandlesTab';

import { useAccountDetailsPageContext } from './AccountDetailsPageContext';

const AccountDetailsPage: FC = () => {
  const { account, publicKey, date, blockNumber, stats, isBlockProducer, isProxy, loading } =
    useAccountDetailsPageContext();

  return (
    <Container className="py-5">
      <BackButton to={ROUTES.accounts.path} />
      <div className="d-flex flex-row flex-wrap align-items-center gap-2">
        <h4 className="lh-1">Account: {account}</h4>
        {isBlockProducer && <Badge variant="white">Block Producer</Badge>}
        {isProxy && <Badge variant="white">Proxy</Badge>}
      </div>
      <div className="d-flex justify-content-between align-items-start align-items-md-center flex-wrap flex-column flex-md-row my-3 gap-2 gap-md-5 f-size-sm lh-1 w-100">
        <div className="text-secondary d-flex justify-content-between align-items-center">
          <span className="me-2">Public key:</span>
          <span className="fw-bold text-primary">{publicKey}</span>
        </div>
        <div className="d-flex flex-row flex-wrap align-items-center gap-3">
          <div className="text-secondary d-flex justify-content-between align-items-center">
            <span className="me-2">Date:</span>
            <span className="text-dark fw-bold">{date ? formatDate(date) : 'N/A'}</span>
          </div>
          <div className="text-secondary d-flex justify-content-between align-items-center">
            <span className="me-2">Block #:</span>
            <span className="text-dark fw-bold">
              {blockNumber ? (
                <Link to={`${ROUTES.blocks.path}/${blockNumber}`}>{blockNumber}</Link>
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>
      </div>
      <DataTile items={stats} columns={3} layout="multi-column" loading={loading} />
      <CardComponent title="Account Details" useMobileStyle className="mt-3">
        <Tabs
          defaultActiveKey="transactions"
          id="domains-details-tabs"
          variant="underline"
          className="mb-3"
        >
          <Tab.Pane eventKey="transactions" title="Transactions">
            <Transactions />
          </Tab.Pane>
          <Tab.Pane eventKey="fio-handles" title="FIO Handles">
            <FioHandlesTab />
          </Tab.Pane>
          <Tab.Pane eventKey="fio-domains" title="FIO Domains">
            Fio Domains
          </Tab.Pane>
          <Tab.Pane eventKey="voting" title="Voting">
            Voting
          </Tab.Pane>
          <Tab.Pane eventKey="keys" title="Keys/Permissions">
            Keys/Permissions
          </Tab.Pane>
        </Tabs>
      </CardComponent>
    </Container>
  );
};

export default AccountDetailsPage;
