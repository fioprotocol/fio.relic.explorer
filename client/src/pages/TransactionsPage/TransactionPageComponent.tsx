import { FC } from 'react';
import { TableComponent } from '../../components/layout/TableComponent';

const columns = [
  { key: 'transactionId', title: 'Transaction ID' },
  { key: 'account', title: 'Account' },
  { key: 'date', title: 'Date' },
  { key: 'action', title: 'Action' },
  { key: 'details', title: 'Details / Items' },
  { key: 'fees', title: 'Fees' },
];

export const TransactionPageComponent: FC = () => {
  return <TableComponent columns={columns} data={[]} title="Transactions" />;
};
