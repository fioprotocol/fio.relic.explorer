import React from 'react';
import { Link } from 'react-router';

import { DataTile } from 'src/components/common/DataTile';
import { ProducerTile } from '../ProducerTile';

import { formatBlockNumber, formatDate } from 'src/utils/general';

import { ROUTES } from 'src/constants/routes';

import { Producer } from 'src/services/bpmonitor';
import { Block } from '@shared/types/blocks';

const CurrentBlock: React.FC<{ currentBlock: Block; producer?: Producer }> = ({
  currentBlock,
  producer,
}) => {
  return (
    <DataTile
      title="Current block"
      items={[
        {
          title: 'Block Number',
          value: formatBlockNumber(currentBlock.pk_block_number),
        },
        {
          title: 'Date',
          value: formatDate(currentBlock.stamp),
        },
        {
          title: 'Producer',
          value: (
            <ProducerTile
              name={producer?.candidate_name}
              account={currentBlock.producer_account_name}
              handle={producer?.fio_address}
            />
          ),
        },
        {
          title: 'Block ID',
          value: (
            <Link to={`${ROUTES.blocks.path}/${currentBlock.pk_block_number}`}>
              {currentBlock.block_id}
            </Link>
          ),
        },
        {
          title: 'Transactions',
          value: currentBlock.transaction_count,
        },
        {
          title: '',
          value: '',
        },
      ]}
      columns={3}
      layout="multi-column"
    />
  );
};

export default CurrentBlock;
