import React from 'react';
import { Link } from 'react-router';
import { Spinner } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import CurrentBlock from 'src/components/CurrentBlock/CurrentBlock';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { useBlocksPageContext } from './BlocksPageContext';

import { formatBlockNumber, formatDate, truncateLongText } from 'src/utils/general';

import { ROUTES } from 'src/constants/routes';

const columns = [
  {
    key: 'pk_block_number',
    title: 'Block Number',
  },
  {
    key: 'block_id',
    title: 'Block ID',
  },
  {
    key: 'stamp',
    title: 'Date',
  },
  {
    key: 'producer',
    title: 'Producer',
  },
  {
    key: 'transaction_count',
    title: 'Transactions',
  },
];

const BlocksPage: React.FC = () => {
  const { blocks, currentBlock, producers, ...paginationProps } = useBlocksPageContext();

  return (
    <Container className="py-5">
      <h4 className="mb-5">Blocks</h4>
      {blocks.length === 0 || !currentBlock ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <CurrentBlock
            currentBlock={currentBlock}
            producer={producers.get(currentBlock.producer_account_name)}
          />
          <LoadableTable
            columns={columns}
            data={
              blocks.map((block) => ({
                pk_block_number: (
                  <Link to={`${ROUTES.blocks.path}/${block.pk_block_number}`}>
                    {formatBlockNumber(block.pk_block_number)}
                  </Link>
                ),
                block_id: (
                  <Link to={`${ROUTES.blocks.path}/${block.pk_block_number}`}>
                    {truncateLongText(block.block_id)}
                  </Link>
                ),
                stamp: formatDate(block.stamp),
                producer: (
                  <Link to={`${ROUTES.accounts.path}/${block.producer_account_name}`}>
                    {producers.get(block.producer_account_name)?.candidate_name ||
                      block.producer_account_name}
                  </Link>
                ),
                transaction_count: block.transaction_count,
              }))
            }
            title="All Blocks"
            {...paginationProps}
          />
        </>
      )}
    </Container>
  );
};

export default BlocksPage;
