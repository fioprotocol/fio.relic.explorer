import React, { useState } from 'react';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Search as SearchIcon } from 'react-bootstrap-icons';
import { useLocation } from 'react-router';

import Container from 'src/components/layout/Container';

import { ROUTES } from 'src/constants/routes';

import styles from './Search.module.scss';

// Define pages where the search should be hidden as a constant
const HIDE_SEARCH_ON_PAGES = [ROUTES.home.path, ROUTES.search.path, ROUTES.searchNotFound.path];

interface TopBarSearchProps {
  onSearch: (searchQuery: string) => void;
  searching?: boolean;
  withContainer?: boolean;
  placeholder?: string;
  className?: string;
}

const TopBarSearch: React.FC<TopBarSearchProps> = ({
  onSearch,
  searching = false,
  placeholder = 'Search by Account, Public Key, Handle, Domain or Transaction',
  className = '',
  withContainer = false,
}) => {
  const [query, setQuery] = useState('');
  const location = useLocation();

  // Check if search should be hidden on current page
  const shouldHide = HIDE_SEARCH_ON_PAGES.some(
    (path) =>
      location.pathname === path ||
      (path.endsWith('*') && location.pathname.startsWith(path.slice(0, -1)))
  );

  // If the search should be hidden, return null
  if (shouldHide) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const renderForm = (): React.JSX.Element => (
    <Form onSubmit={handleSubmit} className={`d-flex ${className}`}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e): void => setQuery(e.target.value)}
          className={`py-2 text-small ${styles.topBarSearchInput}`}
          aria-label="Search"
          disabled={searching}
        />
        <Button
          variant="primary"
          type="submit"
          className="d-flex align-items-center justify-content-center"
          disabled={searching}
        >
          {searching ? (
            <Spinner animation="border" size="sm" className={styles.topBarSearchIcon} />
          ) : (
            <SearchIcon size={14} />
          )}
        </Button>
      </InputGroup>
    </Form>
  );

  return withContainer ? (
    <Container className="border-top pt-3 mt-3">{renderForm()}</Container>
  ) : (
    renderForm()
  );
};

export default TopBarSearch;
