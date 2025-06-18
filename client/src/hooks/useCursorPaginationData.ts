import { useState, useCallback, useEffect } from 'react';
import { AnyObject } from '@shared/types/general';
import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';
import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { PaginationProps } from './usePaginationData';

type UseCursorPaginationDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
  dataKey?: string;
  limit?: number;
  autoFetch?: boolean;
  ready?: boolean;
};

export type UseCursorPaginationReturn<T, O = AnyObject> = {
  data: T[];
  loading: boolean;
  fetched: boolean;
  error: Error | null;
  otherData: O | null;
  nextCursor: string | null;
  prevCursor: string | null;
  reset: () => void;
  refresh: () => void;
} & PaginationProps;

interface CursorState {
  current: string | null;
  direction: PaginationDirection;
}

export const useCursorPaginationData = <T, O = AnyObject>({
  action,
  params = {},
  dataKey = 'data',
  limit = DEFAULT_REQUEST_ITEMS_LIMIT,
  autoFetch = true,
  ready = true,
}: UseCursorPaginationDataProps): UseCursorPaginationReturn<T, O> => {
  const [data, setData] = useState<T[]>([]);
  const [otherData, setOtherData] = useState<O | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Cursor pagination state
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    current: null,
    direction: PAGINATION_DIRECTIONS.FIRST,
  });

  const serializedParams = JSON.stringify(params);

  // Function to fetch data based on cursor and direction
  const fetchData = useCallback(
    async (cursor: string | null, direction: PaginationDirection) => {
      if (!ready) return;

      setLoading(true);
      setError(null);

      try {
        const queryParams: AnyObject = {
          ...JSON.parse(serializedParams),
          limit,
        };

        // Add cursor and direction for navigation (except for first page)
        if (direction !== PAGINATION_DIRECTIONS.FIRST && cursor) {
          queryParams.cursor = cursor;
          queryParams.direction =
            direction === PAGINATION_DIRECTIONS.LAST ? PAGINATION_DIRECTIONS.PREV : direction;
        }

        const response = await action(queryParams);

        const {
          [dataKey]: newItems = [],
          hasNextPage: responseHasNext = false,
          hasPrevPage: responseHasPrev = false,
          nextCursor: responseNextCursor = null,
          prevCursor: responsePrevCursor = null,
          ...restData
        } = response || {};

        setData(newItems as T[]);
        setHasNextPage(responseHasNext);
        setHasPrevPage(responseHasPrev);
        setNextCursor(responseNextCursor);
        setPrevCursor(responsePrevCursor);

        // Store additional data
        setOtherData(Object.keys(restData).length > 0 ? (restData as O) : null);

        // Update cursor state
        setCursorState({
          current:
            direction === PAGINATION_DIRECTIONS.NEXT
              ? responseNextCursor
              : direction === PAGINATION_DIRECTIONS.PREV
                ? responsePrevCursor
                : direction === PAGINATION_DIRECTIONS.LAST
                  ? responsePrevCursor
                  : null,
          direction,
        });
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
        setFetched(true);
      }
    },
    [action, dataKey, limit, serializedParams]
  );

  // Navigation functions
  const goToNext = useCallback(() => {
    if (hasNextPage && nextCursor) {
      fetchData(nextCursor, PAGINATION_DIRECTIONS.NEXT);
    }
  }, [fetchData, hasNextPage, nextCursor]);

  const goToPrev = useCallback(() => {
    if (hasPrevPage && prevCursor) {
      fetchData(prevCursor, PAGINATION_DIRECTIONS.PREV);
    }
  }, [fetchData, hasPrevPage, prevCursor]);

  const goToFirst = useCallback(() => {
    fetchData(null, PAGINATION_DIRECTIONS.FIRST);
  }, [fetchData]);

  const goToLast = useCallback(async () => {
    // For "last", we fetch without a cursor in "prev" direction
    // This will get us the oldest records, but since we're using ID-based cursors
    // we'll fetch in prev direction without a cursor to get the last page
    setLoading(true);
    setError(null);

    try {
      const queryParams: AnyObject = {
        ...JSON.parse(serializedParams),
        limit,
        direction: PAGINATION_DIRECTIONS.PREV,
        // No cursor means we start from the end
      };

      const response = await action(queryParams);
      const {
        [dataKey]: newItems = [],
        hasNextPage: responseHasNext = false,
        hasPrevPage: responseHasPrev = false,
        nextCursor: responseNextCursor = null,
        prevCursor: responsePrevCursor = null,
        ...restData
      } = response || {};

      setData(newItems as T[]);
      setHasNextPage(responseHasNext);
      setHasPrevPage(responseHasPrev);
      setNextCursor(responseNextCursor);
      setPrevCursor(responsePrevCursor);
      setOtherData(Object.keys(restData).length > 0 ? (restData as O) : null);

      setCursorState({
        current: responsePrevCursor,
        direction: PAGINATION_DIRECTIONS.LAST,
      });
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [action, dataKey, limit, serializedParams]);

  // Reset function
  const reset = useCallback(() => {
    setData([]);
    setOtherData(null);
    setHasNextPage(false);
    setHasPrevPage(false);
    setNextCursor(null);
    setPrevCursor(null);
    setCursorState({ current: null, direction: PAGINATION_DIRECTIONS.FIRST });
    setFetched(false);
    setError(null);
  }, []);

  // Refresh current page
  const refresh = useCallback(() => {
    fetchData(cursorState.current, cursorState.direction);
  }, [fetchData, cursorState]);

  // Auto-fetch on mount and when params change
  useEffect(() => {
    if (autoFetch) {
      fetchData(null, PAGINATION_DIRECTIONS.FIRST);
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    otherData,
    loading,
    fetched,
    error,
    nextCursor,
    prevCursor,
    reset,
    refresh,
    // Pagination props
    useCursorPagination: true,
    hasNextPage,
    hasPrevPage,
    goToNext,
    goToPrev,
    goToFirst,
    goToLast,
  };
};
