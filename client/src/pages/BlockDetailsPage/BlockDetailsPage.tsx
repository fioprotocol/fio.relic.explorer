import React from 'react';
import { Link } from 'react-router';
import { Spinner } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { DataTile } from 'src/components/common/DataTile';

import { useBlockDetailsContext } from './BlockDetailsContext';

import { ROUTES } from 'src/constants/routes';

const BlockDetailsPage: React.FC = () => {
  const { block_number, block, producer, previous_block_number, next_block_number, loading } =
    useBlockDetailsContext();

  return (
    <Container className="py-5">
      <h4>Block: #{block_number?.toLocaleString()}</h4>
      {!block || loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p>Block ID: {block?.block_id}</p>
            <div className="d-flex justify-content-between align-items-center">
              <p>{new Date(block?.stamp).toUTCString()}</p>
              <p>Status: - </p>
            </div>
          </div>

          <DataTile
            className="mb-4"
            layout="multi-column"
            columns={2}
            items={[
              {
                title: 'Previous Block',
                value: (
                  <Link to={`${ROUTES.blocks.path}/${previous_block_number}`}>
                    {previous_block_number?.toLocaleString()}
                  </Link>
                ),
              },
              {
                title: 'Next Block',
                value: (
                  <Link to={`${ROUTES.blocks.path}/${next_block_number}`}>
                    {next_block_number?.toLocaleString()}
                  </Link>
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
            Transactions: {block.transaction_count}
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default BlockDetailsPage;
