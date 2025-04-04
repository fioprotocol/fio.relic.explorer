import React, { useCallback, useEffect, useState } from 'react';
import { Card, Spinner, Alert, Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import Container from '../components/layout/Container';
import { SearchContainer } from '../components/Search';

import { useSearch } from '../hooks';

import { searchService } from '../services/search';

import { SearchResult } from 'shared/types/search';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchType] = useState<SearchResult['type']>('tx');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the hook with navigation disabled to prevent unnecessary redirects on this page
  const { handleSearch } = useSearch({
    navigateOnSearch: false,
    defaultQuery: query,
    onSearchCallback: async (searchQuery) => {
      await fetchResults(searchQuery, currentPage, pageSize);
    },
  });

  const fetchResults = useCallback(
    async (searchQuery: string, page: number, size: number): Promise<void> => {
      if (!searchQuery) return;

      setLoading(true);
      setError(null);

      try {
        const data = await searchService.searchByType(searchQuery, searchType, page, size);
        setResults(data.results);
        setTotalCount(data.totalCount || 0);
        setCurrentPage(data.page || 1);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    },
    [searchType]
  );

  // Initial load of search results when page loads or query changes
  useEffect(() => {
    if (query) {
      fetchResults(query, currentPage, pageSize);
    }
  }, [query, currentPage, pageSize, fetchResults]);

  // Handle page change
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    fetchResults(query, page, pageSize);
    window.scrollTo(0, 0);
  };

  // Generate pagination items
  const generatePaginationItems = (): React.ReactNode[] => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const items = [];

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={(): void => handlePageChange(currentPage - 1)}
      />
    );

    // First page
    if (currentPage > 3) {
      items.push(
        <Pagination.Item key={1} onClick={(): void => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (currentPage > 4) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    // Pages around current page
    for (
      let page = Math.max(1, currentPage - 1);
      page <= Math.min(totalPages, currentPage + 1);
      page++
    ) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={(): void => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={(): void => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={(): void => handlePageChange(currentPage + 1)}
      />
    );

    return items;
  };

  return (
    <div>
      <SearchContainer onSearch={handleSearch} value={query} />

      <Container className="py-4">
        <h2 className="mb-4">Search Results for: "{query}"</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-muted mb-4">Found {totalCount} results</p>

            {results.map((result) => (
              <Card key={result.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{result.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Type: {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </Card.Subtitle>
                  <Card.Text>
                    {/* Render different content based on result type */}
                    {result.type === 'tx' && <code className="d-block">{result.id}</code>}
                    {(result.type === 'account' || result.type === 'publicKey') && (
                      <div>
                        <code className="d-block mb-2">{result.id}</code>
                      </div>
                    )}
                    {(result.type === 'domain' || result.type === 'handle') && (
                      <div>{result.data.description || 'No description'}</div>
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}

            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>{generatePaginationItems()}</Pagination>
              </div>
            )}
          </>
        ) : (
          <Alert variant="info">
            No results found for "{query}". Please try a different search term.
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default SearchPage;
