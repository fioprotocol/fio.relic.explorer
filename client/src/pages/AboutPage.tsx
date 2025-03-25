import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage: React.FC = () => {
  return (
    <Container>
      <h1 className="page-header">About This App</h1>
      
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>FIO Explorer Application</Card.Title>
              <Card.Text>
                This is a full-stack application built using modern web technologies.
              </Card.Text>
              <Card.Text>
                The application demonstrates a complete client-server architecture with the 
                following technologies:
              </Card.Text>
              <ul>
                <li>Frontend: React (Create React App), TypeScript, React Bootstrap, SCSS</li>
                <li>Routing: React Router</li>
                <li>Backend: Fastify with TypeScript</li>
                <li>API Documentation: Swagger with OpenAPI</li>
                <li>Environment Configuration: dotenv</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Frontend Features</Card.Title>
              <ul>
                <li>Component-based architecture</li>
                <li>State management with React hooks</li>
                <li>Type safety with TypeScript</li>
                <li>Responsive design with Bootstrap</li>
                <li>Custom styling with SCSS</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Backend Features</Card.Title>
              <ul>
                <li>RESTful API with Fastify</li>
                <li>API validation with JSON Schema</li>
                <li>API documentation with Swagger</li>
                <li>Environment configuration</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage; 