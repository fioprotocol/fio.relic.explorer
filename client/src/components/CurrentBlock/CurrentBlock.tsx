import React from 'react';
import { Link } from 'react-router';

import { DataTile } from 'src/components/common/DataTile';
import { ProducerTile } from '../ProducerTile';

import { formatBlockNumber, formatDate } from 'src/utils/general';

import { ROUTES } from 'src/constants/routes';

import { Producer } from 'src/services/bpmonitor';
import { Block } from '@shared/types/blocks';

const CurrentBlock: React.FC<{
  currentBlock: Block | undefined;
  producer?: Producer;
  loading: boolean;
}> = ({ currentBlock, producer, loading }) => {
  return (
    <DataTile
      title="Current block"
      items={[
        {
          title: 'Block Number',
          value: currentBlock?.pk_block_number
            ? formatBlockNumber(currentBlock.pk_block_number)
            : 'N/A',
        },
        {
          title: 'Producer',
          value: (
            <ProducerTile
              name={producer?.candidate_name}
              account={currentBlock?.producer_account_name || 'N/A'}
              handle={producer?.fio_address}
            />
          ),
          wideWidth: true,
        },
        {
          title: 'Transactions',
          value: currentBlock?.transactions_count || 'N/A',
          narrowWidth: true,
        },
        {
          title: 'Date',
          value: currentBlock?.stamp ? formatDate(currentBlock.stamp) : 'N/A',
        },
        {
          title: 'Block ID',
          value: currentBlock?.pk_block_number ? (
            <Link
              to={`${ROUTES.blocks.path}/${currentBlock.pk_block_number}`}
              className="word-break-all"
            >
              {currentBlock.block_id}
            </Link>
          ) : (
            'N/A'
          ),
          wideWidth: true,
        },
      ]}
      columns={3}
      loading={loading}
    />
  );
};

export default CurrentBlock;
