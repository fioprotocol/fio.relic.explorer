import React from 'react';
import { Link } from 'react-router';
import { Spinner, Tab, Tabs } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { DataTile } from 'src/components/common/DataTile';
import { ProducerTile } from 'src/components/ProducerTile';
import { TableComponent } from 'src/components/layout/TableComponent';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { Alert } from 'src/components/common/Alert';

import { useBlockDetailsContext } from './BlockDetailsContext';

import { formatBlockNumber, formatDate } from 'src/utils/general';
import { transformTransactions } from 'src/utils/transactions';

import { ROUTES } from 'src/constants/routes';
import { TX_TABLE_COLUMNS } from 'src/pages/TransactionsPage/TxComponent';

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
      <BackButton to={ROUTES.blocks.path} />
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
                    <Badge variant="warning">Irreversible</Badge>
                  ) : (
                    <Badge variant="success">Executed</Badge>
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
                  <ProducerTile
                    name={producer?.candidate_name}
                    account={block.producer_account_name}
                    handle={producer?.fio_address}
                  />
                ),
              },
              {
                title: 'Transactions',
                value: block.transaction_count,
              },
            ]}
          />
          <CardComponent title="Block Details">
            <Tabs
              defaultActiveKey="transactions"
              id="block-details-tabs"
              variant="underline"
              className="mb-3"
            >
              <Tab eventKey="transactions" title="Transactions">
                {transactions.length > 0 ? (
                  <TableComponent
                    columns={TX_TABLE_COLUMNS}
                    data={transactions.map(transformTransactions)}
                  />
                ) : (
                  <Alert hasDash={false} title="No transactions found" />
                )}
              </Tab>
            </Tabs>
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default BlockDetailsPage;
