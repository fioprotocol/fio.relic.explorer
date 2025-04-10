import { useState, useCallback, useEffect, useRef } from 'react';
import { AnyObject } from '@shared/types/general';
import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';

type UsePaginationDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
  dataKey?: string;
  limit?: number;
};

export type UsePaginationDefaultProps = {
  loading: boolean;
  error: Error | null;
  currentPage: number | null;
  totalPages: number;
  goToPage?: (page: number) => void;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  reset?: () => void;
};

export type UsePaginationDataReturn<T, O = AnyObject> = {
  data: T[];
  otherData: O | null;
} & UsePaginationDefaultProps;

export const usePaginationData = <T, O = AnyObject>({ 
  action, 
  params = {}, 
  dataKey = 'data',
  limit = DEFAULT_REQUEST_ITEMS_LIMIT
}: UsePaginationDataProps): UsePaginationDataReturn<T, O> => {
  const [data, setData] = useState<T[]>([]);
  const [otherData, setOtherData] = useState<O | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Store memoized versions of the params and serialized params
  const paramsRef = useRef(params);
  const serializedParamsRef = useRef(JSON.stringify(params));

  // Function to fetch data for a specific page
  const fetchData = useCallback(async (page: number) => {
    // Prevent concurrent requests
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * limit;
      
      const queryParams = {
        ...paramsRef.current,
        offset,
        limit
      };
      
      const response = await action(queryParams);
      const { [dataKey]: newItems = [], total, ...restData } = response || {};
      
      // Calculate total pages if available
      if (total) {
        setTotalPages(Math.ceil(total / limit));
      } else {
        // If no total count is provided from API, estimate based on current results
        if (newItems.length < limit) {
          setTotalPages(page);
        } else {
          setTotalPages(Math.max(page + 1, totalPages));
        }
      }
      
      setData(newItems as T[]);
      
      // Store additional data
      setOtherData(Object.keys(restData).length > 0 ? restData as O : null);
      
      setCurrentPage(page);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [action, dataKey, limit, loading, totalPages]);

  // Reset pagination and load initial data when params change
  useEffect(() => {
    const serializedParams = JSON.stringify(params);
    
    // Skip if params haven't actually changed
    if (serializedParams === serializedParamsRef.current && currentPage !== null) {
      return;
    }
    
    // Update refs with current values
    paramsRef.current = params;
    serializedParamsRef.current = serializedParams;
    
    // Reset pagination state and load first page
    setCurrentPage(1);
    fetchData(1);
  }, [params, fetchData, currentPage]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    if (targetPage !== currentPage) {
      fetchData(targetPage);
    }
  }, [currentPage, fetchData, totalPages]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToPreviousPage = useCallback(() => {
    currentPage && goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToNextPage = useCallback(() => {
    currentPage && goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Function to reset and reload data
  const reset = useCallback(() => {
    setCurrentPage(1);
    fetchData(1);
  }, [fetchData]);

  return {
    data,
    otherData,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    reset
  };
};
