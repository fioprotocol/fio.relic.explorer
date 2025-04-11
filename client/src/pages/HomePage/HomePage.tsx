import React from 'react';

import Container from 'src/components/layout/Container';
import SearchContainer from 'src/components/Search/SearchContainer';
import { StatisticComponent } from 'src/components/StatisticComponent';
import { TxInfiniteUpdateComponent } from 'src/pages/TransactionsPage/TxInfiniteUpdateComponent';

import { useSearch } from 'src/hooks';

import { useHomePageContext } from './HomePageContext';

const HomePage: React.FC = () => {
  const { stats, chartData, loading } = useHomePageContext();
  const { handleSearch, query, isSearching } = useSearch();

  return (
    <>
      <SearchContainer
        onSearch={handleSearch}
        value={query}
        searching={isSearching}
        hovered={true}
      />
      <Container>
        <StatisticComponent stats={stats} chartData={chartData} loading={loading} />
        <TxInfiniteUpdateComponent />
      </Container>
    </>
  );
};

export default HomePage;
