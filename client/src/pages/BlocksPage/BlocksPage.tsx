import React, { FC } from 'react';
import { Link } from 'react-router';

import Container from 'src/components/layout/Container';
import { LoadableTable } from 'src/components/common/LoadableTable';
import CurrentBlock from 'src/components/CurrentBlock/CurrentBlock';

import { useBlocksPageContext } from './BlocksPageContext';

import { formatDate, formatBlockNumber } from 'src/utils/general';
import { ROUTES } from 'src/constants/routes';
import { truncateLongText } from 'src/utils/general';

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
    key: 'transactions_count',
    title: 'Transactions',
  },
];

const BlocksPage: FC = () => {
  const { blocks, blocksLoading, currentBlock, producers, ...paginationProps } =
    useBlocksPageContext();

  return (
    <Container className="py-5">
      <h4 className="mb-5">Blocks</h4>
      <CurrentBlock
        producer={
          currentBlock?.producer_account_name
            ? producers.get(currentBlock?.producer_account_name)
            : undefined
        }
        currentBlock={currentBlock}
        loading={blocksLoading}
      />
      <LoadableTable
        columns={columns}
        data={blocks.map((block) => ({
          pk_block_number: (
            <Link to={`${ROUTES.blocks.path}/${block.pk_block_number}`}>
              {formatBlockNumber(Number(block.pk_block_number))}
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
          transactions_count: block.transactions_count,
        }))}
        title="All Blocks"
        showInCardComponent
        loading={blocksLoading}
        emptyStateMessage="No blocks found"
        {...paginationProps}
      />
    </Container>
  );
};

export default BlocksPage;
