import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SearchContainer } from '../components/Search';
import TransactionChart from 'src/components/TransactionChart/TransactionChart';
import { useSearch } from '../hooks';
import { searchService } from '../services/search';

const HomePage: React.FC = () => {
  // Setup search hook with custom callback
  const { handleSearch, isSearching } = useSearch({
    // Optional callback to perform additional actions before navigation
    onSearchCallback: async (query) => {
      // You could log analytics, set context, or do other things here
      console.log('Searching for:', query);
      
      try {
        // Optionally pre-fetch results to cache them
        await searchService.search(query);
      } catch (error) {
        // Handle error silently as navigation will still occur
        console.error('Error pre-fetching search results', error);
      }
    }
  });

  return (
    <>
      <SearchContainer onSearch={handleSearch} />
      
      <Container className="mt-5">
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4 mb-4">Welcome to the FIO Explorer</h1>
            <p className="lead mb-4">A full-stack application built with React and Fastify</p>
            <Link to="/health-check">
              <Button variant="primary" size="lg">
                Check API Health
              </Button>
            </Link>
            {isSearching && <p className="mt-3">Searching...</p>}
          </Col>
        </Row>
        <Row className="justify-content-center text-center mt-5">
          <Col md={6}></Col>
          <Col md={6}>
            <TransactionChart />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
