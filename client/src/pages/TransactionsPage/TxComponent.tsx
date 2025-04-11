import { FC } from 'react';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { useTxComponentContext } from './TxComponentContext';

export const columns = [
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
      columns={columns}
      data={transactions || []}
      title="All Transactions"        
      showPagination
      showInCardComponent
      {...paginationProps}
    />
  );
};
