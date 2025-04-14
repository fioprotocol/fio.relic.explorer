import { FC } from 'react';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { useTxComponentContext } from './TxComponentContext';

export const TX_TABLE_COLUMNS = [
  { key: 'transactionId', title: 'Transaction ID' },
  { key: 'account', title: 'Account' },
  { key: 'date', title: 'Date' },
  { key: 'action', title: 'Action' },
  { key: 'details', title: 'Details / Items' },
  { key: 'fee', title: 'Fees' },
];

export const TxComponent: FC = () => {
  const { 
    transactions, 
    ...paginationProps
  } = useTxComponentContext();

  return (
    <LoadableTable
      columns={TX_TABLE_COLUMNS}
      data={transactions || []}
      title="All Transactions"        
      showPagination
      showInCardComponent
      {...paginationProps}
    />
  );
};
