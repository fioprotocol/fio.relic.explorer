import React from 'react';

import Container from '../../components/layout/Container';
import { TxComponent } from './TxComponent';
import { DataTile } from 'src/components/common/DataTile';
import { useTransactionsPageContext } from './TransactionsPageContext';

const TransactionsPage: React.FC = () => {
  const { stats, loading } = useTransactionsPageContext();

  return <Container title='Transactions'>
    <DataTile items={stats} loading={loading} columns={3} />
    <TxComponent />
    </Container>;
};

export default TransactionsPage;
