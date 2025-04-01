import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import TransactionChart from 'src/components/TransactionChart/TransactionChart';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="display-4 mb-4">Welcome to the FIO Explorer</h1>
          <p className="lead mb-4">A full-stack application built with React and Fastify</p>
          <Link to="/health-check">
            <Button variant="primary" size="lg">
              Check API Health
            </Button>
          </Link>
        </Col>
      </Row>
      <Row className="justify-content-center text-center">
        <Col md={6}></Col>
        <Col md={6}>
          <TransactionChart />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
