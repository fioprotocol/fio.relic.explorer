import { FC } from 'react';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { TX_TABLE_COLUMNS } from './TxComponent';
import { useTxInfiniteUpdateConext } from './TxInfiniteUpdateComponentConext';

export const TxInfiniteUpdateComponent: FC = () => {
  const {
    transactions,
    onActionButtonClick,
  } = useTxInfiniteUpdateConext();
  
  return <div className='my-4'>
    <LoadableTable
      columns={TX_TABLE_COLUMNS}
      data={transactions || []}
      title="Transactions"
      showActionButton
      actionButtonText="VIEW ALL TRANSACTIONS"
      onActionButtonClick={onActionButtonClick}
      showPagination={false}
      showInCardComponent={false}
    />
  </div>;
};
