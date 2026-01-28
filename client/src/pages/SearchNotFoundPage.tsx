import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { SearchContainer } from 'src/components/Search';
import { Alert } from 'src/components/common/Alert';

import { useSearch } from '../hooks';

const HomePage: React.FC = () => {
  // Setup search hook with custom callback
  const { handleSearch, query, isSearching } = useSearch();

  return (
    <>
      <SearchContainer onSearch={handleSearch} value={query} searching={isSearching} />

      <Container className="my-5">
        <Row>
          <Col>
            <Alert
              variant="danger"
              title={`Your search "${query}"`}
              message="Did not match any records"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
