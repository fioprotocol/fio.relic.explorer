import React from 'react';

import Container from '../../components/layout/Container';
import { SearchComponent } from '../../components/SearchComponent';
import { StatisticComponent } from '../../components/StatisticComponent';

import { TransactionPageComponent } from '../TransactionsPage/TransactionPageComponent';
import { useHomePageContext } from './HomePageContext';

const HomePage: React.FC = () => {
  const { stats, chartData } = useHomePageContext();

  return (
    <Container>
      <SearchComponent />
      <StatisticComponent stats={stats} chartData={chartData} />
      <TransactionPageComponent />
    </Container>
  );
};

export default HomePage;
