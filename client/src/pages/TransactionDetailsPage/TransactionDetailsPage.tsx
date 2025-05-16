import { FC } from 'react';
import { Link } from 'react-router';
import { Tab } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { CardComponent } from 'src/components/layout/CardComponent';
import { CopyButton } from 'src/components/common/CopyButton';
import { DataTile } from 'src/components/common/DataTile';
import { Tabs } from 'src/components/common/Tabs';
import { JsonSyntaxHighlighter } from 'src/components/common/JsonSyntaxHighlighter';
import { JsonDataRender } from 'src/components/common/JsonDataRender';
import { DetailsPagesHeaderItem } from 'src/components/common/DetailsPagesHeaderItem';

import { ROUTES } from 'src/constants/routes';
import { formatDate } from 'src/utils/general';

import { useTransactionDetailsPageContext } from './TransactionDetailsPageContext';

import styles from './TransactionDetailsPage.module.scss';

const ContractActionBadge: FC<{ contractActionName: string; actionName: string }> = ({
  contractActionName,
  actionName,
}) => {
  if (!contractActionName || !actionName) return null;
  return (
    <div className="p-0">
      <Badge variant="white" className={`px-3 rounded-2 ${styles.actionBadge}`}>
        <span>{contractActionName}</span>
        <span> - </span>
        <span>{actionName}</span>
      </Badge>
    </div>
  );
};

const TransactionDetailsPage: FC = () => {
  const { id, loading, transaction, isIrreversible, stats, rawData } =
    useTransactionDetailsPageContext();
  const tabRowStyle = 'm-0 gap-4 d-flex flex-column flex-md-row flex-wrap w-100';

  return (
    <Container className="py-5">
      <BackButton />
      <h4>Transaction</h4>
      <div className="d-flex flex-column flex-md-row flex-wrap w-100 mb-4 gap-3 f-size-sm">
        <DetailsPagesHeaderItem title="Transaction ID:" value={id} inTheSameRow />
        <DetailsPagesHeaderItem title="Date:" value={formatDate(transaction?.block_timestamp)} />
        <DetailsPagesHeaderItem
          title="Block #"
          value={
            <Link to={`${ROUTES.blocks.path}/${transaction?.block_number}`}>
              {transaction?.block_number}
            </Link>
          }
        />
        <DetailsPagesHeaderItem
          title="Status:"
          value={
            <div className="d-flex flex-row gap-2">
              <Badge variant="success" className="text-capitalize">
                {transaction?.result_status}
              </Badge>
              {isIrreversible && <Badge variant="warning">Irreversible</Badge>}
            </div>
          }
        />
      </div>
      <DataTile items={stats} layout="row" loading={loading} />
      <CardComponent title="Transaction Details" className="mt-4" useMobileStyle>
        <Tabs
          defaultActiveKey="input"
          id="transaction-details-tabs"
          variant="underline"
          className="mb-3"
        >
          <Tab.Pane eventKey="input" title="Input">
            <div className={tabRowStyle}>
              <ContractActionBadge
                contractActionName={transaction?.contract_action_name}
                actionName={transaction?.action_name}
              />
              <JsonDataRender data={transaction?.request_data} />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="response" title="Response">
            <div className={tabRowStyle}>
              <ContractActionBadge
                contractActionName={transaction?.contract_action_name}
                actionName={transaction?.action_name}
              />
              <JsonDataRender data={transaction?.response_data} />
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="traces" title="Traces">
            {transaction?.traces.map((trace, key) => (
              <div
                key={key}
                className={`${tabRowStyle} border-bottom py-4 ${key === transaction?.traces.length - 1 ? 'border-bottom-0' : ''}`}
              >
                <ContractActionBadge
                  contractActionName={trace.account_name}
                  actionName={trace.action_name}
                />
                <JsonDataRender data={trace.request_data} isPrimaryFirst />
              </div>
            ))}
          </Tab.Pane>
          <Tab.Pane eventKey="raw" title="Raw">
            <div className="ps-3">
              <CopyButton data={rawData} variant="primary" className="mb-3" />
              <div className="ps-3">
                <JsonSyntaxHighlighter json={rawData || {}} />
              </div>
              <CopyButton data={rawData} variant="primary" className="mt-3" />
            </div>
          </Tab.Pane>
        </Tabs>
      </CardComponent>
    </Container>
  );
};

export default TransactionDetailsPage;
