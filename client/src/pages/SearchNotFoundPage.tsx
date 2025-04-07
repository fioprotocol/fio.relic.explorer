import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import { SearchContainer } from '../components/Search';

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
            <Alert variant="danger">
              <span className="fw-bold">Your search '{query}'</span> - Did not match any records
            </Alert>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
