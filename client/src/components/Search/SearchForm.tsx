import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Search as SearchIcon } from 'react-bootstrap-icons';

interface SearchFormProps {
  onSearch: (searchQuery: string) => void;
  value?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, value }) => {
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
        />
        <Button variant="primary" type="submit">
          <SearchIcon size={20} />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchForm;
