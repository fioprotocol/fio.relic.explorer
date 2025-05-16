import React from 'react';
import { Link } from 'react-router';
import { Tab } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { DataTile } from 'src/components/common/DataTile';
import { ProducerTile } from 'src/components/ProducerTile';
import { TableComponent } from 'src/components/layout/TableComponent';
import { BackButton } from 'src/components/common/BackButton';
import { Alert } from 'src/components/common/Alert';
import { Loader } from 'src/components/common/Loader';
import { Tabs } from 'src/components/common/Tabs';
import { IrreversibleStatus } from 'src/components/IrreversibleStatus';

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
    error,
    loading,
  } = useBlockDetailsContext();

  if (error) {
    return (
      <Container className="py-5">
        <BackButton />
        <Alert variant="danger" title="Error fetching block details" message={error.message} />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <BackButton />
      <h4>Block: #{formatBlockNumber(block_number || 0)}</h4>
      {!block || loading ? (
        <Loader fullScreen noBg />
      ) : (
        <>
            <div className="d-flex justify-content-between align-items-start align-items-md-center flex-wrap flex-column flex-md-row my-3 gap-2 f-size-sm lh-1 w-100">
              <p className="text-secondary m-0 lh-lg word-break-all">
              Block ID: <span className="text-dark fw-bold">{block?.block_id}</span>
            </p>
            <div className="d-flex flex-row flex-wrap align-items-center gap-3">
              <div className="text-secondary mb-0">
                <span className="me-2">Date:</span>
                <span className="text-dark fw-bold">{formatDate(block?.stamp)}</span>
              </div>
              <div className="text-secondary d-flex justify-content-between align-items-center mb-0 gap-2">
                <span>Status:</span>
                <IrreversibleStatus
                  blockNumber={block_number}
                  lastIrreversibleBlockNumber={last_irreversible_block_num}
                />
              </div>
            </div>
          </div>

          <DataTile
            className="mb-4"
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
                title: 'Transactions',
                value: block.transaction_count,
              },
            ]}
          />
          <CardComponent title="Block Details" useMobileStyle>
            <Tabs
              defaultActiveKey="transactions"
              id="block-details-tabs"
              variant="underline"
              className="mb-3"
            >
              <Tab.Pane eventKey="transactions" title="Transactions">
                {transactions.length > 0 ? (
                  <TableComponent
                    columns={TX_TABLE_COLUMNS}
                    data={transactions.map(transformTransactions)}
                  />
                ) : (
                  <Alert hasDash={false} title="No transactions found" />
                )}
              </Tab.Pane>
            </Tabs>
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default BlockDetailsPage;
