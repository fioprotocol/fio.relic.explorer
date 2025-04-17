import { useState, useCallback, useEffect } from 'react';
import { AnyObject } from '@shared/types/general';
import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';

type UseLoadMoreDataProps<T> = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
  dataKey?: string;
  itemIdKey?: keyof T;
  limit?: number;
};

export type UseLoadMoreBtnProps = {
  loading: boolean;
  loadMore: () => void;
};

export type UseLoadMoreDataReturn<T, O = AnyObject> = {
  data: T[];
  loading: boolean;
  fetched: boolean;
  hasMore: boolean;
  error: Error | null;
  otherData: O | null;
  reset?: () => void;
} & UseLoadMoreBtnProps;

export const useLoadMoreData = <T, O = AnyObject>({
  action,
  params = {},
  dataKey = 'data',
  itemIdKey = 'id' as keyof T,
  limit = DEFAULT_REQUEST_ITEMS_LIMIT,
}: UseLoadMoreDataProps<T>): UseLoadMoreDataReturn<T, O> => {
  const [data, setData] = useState<T[]>([]);
  const [otherData, setOtherData] = useState<O | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [hasMore, toggleHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const serializedParams = JSON.stringify(params);

  // Function to fetch data for a specific page
  const fetchData = useCallback(async () => {
    const page = currentPage || 1;

    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * limit;

      const queryParams = {
        ...JSON.parse(serializedParams),
        offset,
        limit,
      };

      const response = await action(queryParams);
      const { [dataKey]: newItems = [], more, ...restData } = response || {};

      toggleHasMore(!!more);

      // Filter out duplicates before adding new items
      setData((prevItems) => {
        const existingIds = new Set(prevItems.map((item: T) => item[itemIdKey]));
        const uniqueNewItems = (newItems as T[]).filter(
          (item: T) => !existingIds.has(item[itemIdKey])
        );
        return [...prevItems, ...uniqueNewItems];
      });

      // Store additional data
      setOtherData(Object.keys(restData).length > 0 ? (restData as O) : null);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [action, dataKey, itemIdKey, limit, serializedParams, currentPage]);

  const loadMore = useCallback(() => {
    setCurrentPage((page) => (page || 1) + 1);
  }, []);

  // Function to reset and reload data
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      setData([]);
      setOtherData(null);
      setCurrentPage(1);
      toggleHasMore(false);
      setLoading(false);
      setFetched(false);
      setError(null);
    };
  }, []);

  return {
    data,
    otherData,
    loading,
    fetched,
    error,
    loadMore,
    hasMore,
    reset,
  };
};
