import { FC } from 'react';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { useTxComponentContext } from './TxComponentContext';
import { TableColumn } from 'src/components/layout/TableComponent/TableComponent';

export const TX_TABLE_COLUMNS: TableColumn[] = [
  { key: 'transactionId', title: 'Transaction ID' },
  { key: 'account', title: 'Account' },
  { key: 'date', title: 'Date' },
  { key: 'action', title: 'Action' },
  { key: 'details', title: 'Details / Items' },
  { key: 'fee', title: 'Fees', align: 'end' },
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
