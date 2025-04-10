import React from 'react';
import { Link } from 'react-router';
import { Spinner, Badge, Tab, Tabs } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { DataTile } from 'src/components/common/DataTile';
import { TableComponent } from 'src/components/layout/TableComponent';

import { useBlockDetailsContext } from './BlockDetailsContext';

import { formatBlockNumber, formatDate } from 'src/utils/general';
import { transformTransactions } from 'src/utils/transactions';

import { ROUTES } from 'src/constants/routes';

const txColumns = [
  { key: 'transactionId', title: 'Transaction ID' },
  { key: 'account', title: 'Account' },
  { key: 'date', title: 'Date' },
  { key: 'action', title: 'Action' },
  { key: 'details', title: 'Details / Items' },
  { key: 'fee', title: 'Fees' },
];

const BlockDetailsPage: React.FC = () => {
  const {
    block_number,
    block,
    producer,
    previous_block_number,
    next_block_number,
    last_irreversible_block_num,
    transactions = [],
    loading,
  } = useBlockDetailsContext();

  return (
    <Container className="py-5">
      <h4>Block: #{formatBlockNumber(block_number || 0)}</h4>
      {!block || loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="d-block d-lg-flex justify-content-between align-items-center mb-4 gap-5 f-size-sm lh-1">
            <p className="text-secondary mb-0">
              Block ID: <span className="text-dark fw-bold">{block?.block_id}</span>
            </p>
            <div className="d-flex justify-content-between align-items-center gap-5">
              <div className="text-secondary mb-0">
                <span className="me-2">Date:</span>
                <span className="text-dark fw-bold">{formatDate(block?.stamp)}</span>
              </div>
              <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
                <span className="me-2">Status:</span>
                {block_number && last_irreversible_block_num ? (
                  block_number > last_irreversible_block_num ? (
                    <Badge bg="warning" text="secondary" className="p-2 rounded-1">
                      Irreversible
                    </Badge>
                  ) : (
                    <Badge bg="success" text="secondary" className="p-2 rounded-1">
                      Executed
                    </Badge>
                  )
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>

          <DataTile
            className="mb-4"
            layout="multi-column"
            columns={2}
            items={[
              {
                title: 'Previous Block',
                value: previous_block_number ? (
                  <Link to={`${ROUTES.blocks.path}/${previous_block_number}`}>
                    {formatBlockNumber(previous_block_number)}
                  </Link>
                ) : (
                  '-'
                ),
              },
              {
                title: 'Next Block',
                value: next_block_number ? (
                  <Link to={`${ROUTES.blocks.path}/${next_block_number}`}>
                    {formatBlockNumber(next_block_number)}
                  </Link>
                ) : (
                  '-'
                ),
              },
              {
                title: 'Producer',
                value: (
                  <div className="text-secondary d-flex justify-content-start align-items-center gap-2 text-nowrap">
                    <Link to={`${ROUTES.accounts.path}/${block.producer_account_name}`}>
                      {producer?.candidate_name || '-'}
                    </Link>{' '}
                    <div className="border-start ps-2">
                      Account:{' '}
                      <Link to={`${ROUTES.accounts.path}/${block.producer_account_name}`}>
                        {block.producer_account_name}
                      </Link>
                    </div>
                    <div className="border-start ps-2 overflow-hidden text-truncate text-truncate-max-w">
                      FIO Handle:{' '}
                      {producer?.fio_address ? (
                        <Link to={`${ROUTES.handles.path}/${producer?.fio_address}`}>
                          {producer?.fio_address}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                ),
              },
              {
                title: 'Transactions',
                value: block.transaction_count,
              },
            ]}
          />
          <CardComponent title="Block Details">
            <Tabs defaultActiveKey="transactions" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="transactions" title="Transactions">
                <TableComponent
                  columns={txColumns}
                  data={transactions.map(transformTransactions)}
                />
              </Tab>
            </Tabs>
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default BlockDetailsPage;
