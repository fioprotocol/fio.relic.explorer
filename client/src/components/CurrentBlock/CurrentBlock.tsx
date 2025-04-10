import React from 'react';
import { Link } from 'react-router';

import { DataTile } from 'src/components/common/DataTile';

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
            <div className="text-secondary d-flex justify-content-start align-items-center gap-2 text-nowrap">
              <Link to={`${ROUTES.accounts.path}/${currentBlock.producer_account_name}`}>
                {producer?.candidate_name || '-'}
              </Link>{' '}
              <div className="border-start ps-2">
                Account:{' '}
                <Link to={`${ROUTES.accounts.path}/${currentBlock.producer_account_name}`}>
                  {currentBlock.producer_account_name}
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
