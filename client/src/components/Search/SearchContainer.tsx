import React from 'react';
import { Row, Col } from 'react-bootstrap';

import Container from '../layout/Container';

import SearchForm from './SearchForm';

import styles from './Search.module.scss';

interface SearchContainerProps {
  searching?: boolean;
  value?: string;
  hovered?: boolean;
  onSearch: (searchQuery: string) => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  onSearch,
  value,
  searching = false,
  hovered = false,
}) => {
  return (
    <div className={`${styles.searchContainer} w-100 py-5 ${hovered ? styles.hovered : ''}`}>
      <Container className="py-5">
        <h3 className="text-white mb-4">FIO Chain Explorer</h3>
        <Row>
          <Col lg={8}>
            <SearchForm onSearch={onSearch} value={value} searching={searching} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchContainer;
