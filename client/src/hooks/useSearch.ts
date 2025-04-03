import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const {
    navigateOnSearch = true,
    defaultQuery = '',
    onSearchCallback
  } = options;

  const [query, setQuery] = useState<string>(defaultQuery);
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
      }
      
      // Navigate to search results page if needed
      if (navigateOnSearch) {
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    } catch (error) {
      console.error('Search error:', error);
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
    resetSearch
  };
};

export default useSearch; 