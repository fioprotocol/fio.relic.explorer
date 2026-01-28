import React, { useState } from 'react';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Search as SearchIcon } from 'react-bootstrap-icons';

interface SearchFormProps {
  onSearch: (searchQuery: string) => void;
  searching?: boolean;
  value?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, value, searching = false }) => {
  const [query, setQuery] = useState(value || '');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="w-100">
      <InputGroup className="mb-3 mx-auto">
        <Form.Control
          type="text"
          placeholder="Search by Account, Public Key, Handle, Domain or Transaction"
          value={query}
          onChange={(e): void => setQuery(e.target.value)}
          className="py-3"
          aria-label="Search"
          disabled={searching}
        />
        <Button variant="primary" type="submit" disabled={searching}>
          {searching ? <Spinner animation="border" size="sm" /> : <SearchIcon size={16} />}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchForm;
