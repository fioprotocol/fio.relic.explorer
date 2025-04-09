import { useState, useCallback, useEffect, useRef } from 'react';
import { AnyObject } from '@shared/types/general';
import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';

type UsePaginationDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
  dataKey?: string;
  limit?: number;
};

type UsePaginationDataReturn<T> = {
  data: T[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasMore: boolean;
  reset: () => void;
};

export const usePaginationData = <T>({ 
  action, 
  params = {}, 
  dataKey = 'data',
  limit = DEFAULT_REQUEST_ITEMS_LIMIT
}: UsePaginationDataProps): UsePaginationDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [offset, setOffset] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Store memoized versions of the params and serialized params
  const paramsRef = useRef(params);
  const serializedParamsRef = useRef(JSON.stringify(params));

  // Function to fetch data with the given offset
  const fetchData = useCallback(async (currentOffset: number, isNewSearch: boolean) => {
    // Prevent concurrent requests
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        ...paramsRef.current,
        offset: currentOffset,
        limit
      };
      
      const response = await action(queryParams);
      const newItems = (response[dataKey] || []) as T[];
      
      setData(prevData => {
        // If this is a new search or the first page, replace the data
        if (isNewSearch || currentOffset === 0) {
          return [...newItems];
        }
        // Otherwise append to existing data
        return [...prevData, ...newItems];
      });
      
      // Update hasMore flag based on returned items count
      setHasMore(newItems.length >= limit);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [action, dataKey, limit, loading]);

  // Reset pagination and load initial data when params change
  useEffect(() => {
    const serializedParams = JSON.stringify(params);
    
    // Skip if params haven't actually changed
    if (serializedParams === serializedParamsRef.current && offset !== null) {
      return;
    }
    
    // Update refs with current values
    paramsRef.current = params;
    serializedParamsRef.current = serializedParams;
    
    // Reset pagination state
    setOffset(0);
    setHasMore(true);
    
    // Load first page with new parameters
    fetchData(0, true);
  }, [params, fetchData, offset]);

  // Function to load more data
  const loadMore = useCallback(() => {
    if (!loading && hasMore && offset !== null) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchData(nextOffset, false);
    }
  }, [fetchData, hasMore, limit, loading, offset]);

  // Function to reset and reload data
  const reset = useCallback(() => {
    setOffset(null);
    setHasMore(true);
    fetchData(0, true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    loadMore,
    hasMore,
    reset
  };
};
