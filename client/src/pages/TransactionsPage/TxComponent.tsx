import { FC } from 'react';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { useTxComponentContext } from './TxComponentContext';
import { TableColumn } from 'src/components/layout/TableComponent/TableComponent';

export const TX_TABLE_COLUMNS: TableColumn[] = [
  { key: 'transactionId', title: 'Transaction ID', mobileRow: [0, 0] },
  { key: 'account', title: 'Account', mobileRow: [0, 1] },
  { key: 'date', title: 'Date', mobileRow: [1, 0] },
  { key: 'action', title: 'Action', mobileRow: [2, 0] },
  { key: 'details', title: 'Details / Items', mobileRow: [2, 1] },
  { key: 'fee', title: 'Fees', align: 'end', mobileRow: [1, 1] },
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
