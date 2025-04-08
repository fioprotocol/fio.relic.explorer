import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { searchService } from 'src/services/search';

import { ROUTES } from 'src/constants/routes';

import { SearchResultType } from '@shared/types/search';

interface UseSearchOptions {
  navigateOnSearch?: boolean;
  defaultQuery?: string;
  onSearchCallback?: (query: string) => void;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  handleSearch: (query: string) => Promise<void>;
  resetSearch: () => void;
}

const ROUTE_BY_SEARCH_TYPE: Record<SearchResultType, string> = {
  publicKey: ROUTES.account.path,
  account: ROUTES.account.path,
  tx: ROUTES.transaction.path,
  domain: ROUTES.domain.path,
  handle: ROUTES.handle.path,
};

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { navigateOnSearch = true, defaultQuery = '', onSearchCallback } = options;

  const location = useLocation();
  const locationQuery = new URLSearchParams(location.search).get('q') || '';

  const [query, setQuery] = useState<string>(locationQuery || defaultQuery);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string): Promise<void> => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    setIsSearching(true);

    try {
      // Call the callback if provided
      if (onSearchCallback) {
        await onSearchCallback(trimmedQuery);

        // Navigate to search results page if needed
        if (navigateOnSearch) {
          navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        }
      } else {
        const results = await searchService.search(trimmedQuery);

        const route =
          results.length > 0
            ? `${ROUTE_BY_SEARCH_TYPE[results[0].type]}`.replace(':id', results[0].id)
            : ROUTES.searchNotFound.path;

        navigate(`${route}?q=${encodeURIComponent(trimmedQuery)}`);
      }
    } catch (error) {
      console.error('Search error:', error);

      navigate(`/${ROUTES.searchNotFound.path}?q=${encodeURIComponent(trimmedQuery)}`);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = (): void => {
    setQuery('');
  };

  return {
    query,
    setQuery,
    isSearching,
    handleSearch,
    resetSearch,
  };
};

export default useSearch;
