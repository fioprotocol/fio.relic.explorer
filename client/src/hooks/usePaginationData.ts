import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AnyObject } from '@shared/types/general';
import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';
import { QUERY_PARAMS_NAMES } from 'src/constants/query';

type UsePaginationDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  withNavigation?: boolean;
  params?: AnyObject;
  dataKey?: string;
  limit?: number;
};

export type UsePaginationDefaultProps = {
  currentPage?: number | null;
  totalPages?: number;
  goToPage?: (page: number) => void;
};

export type UsePaginationDataReturn<T, O = AnyObject> = {
  data: T[];
  loading: boolean;
  fetched: boolean;
  error: Error | null;
  otherData: O | null;
  reset?: () => void;
} & UsePaginationDefaultProps;

const PAGE_PARAM_NAME = QUERY_PARAMS_NAMES.PAGE;

export const usePaginationData = <T, O = AnyObject>({
  action,
  params = {},
  dataKey = 'data',
  limit = DEFAULT_REQUEST_ITEMS_LIMIT,
  withNavigation = true,
}: UsePaginationDataProps): UsePaginationDataReturn<T, O> => {
  // Get URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const urlPage =
    withNavigation && !isNaN(Number(searchParams.get(PAGE_PARAM_NAME)))
      ? Number(searchParams.get(PAGE_PARAM_NAME))
      : null;

  const [data, setData] = useState<T[]>([]);
  const [otherData, setOtherData] = useState<O | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(urlPage || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const serializedParams = JSON.stringify(params);

  // Function to update URL with new page number
  const updateUrlPage = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(location?.search || '');
      if (page === 1) {
        newSearchParams.delete(PAGE_PARAM_NAME);
      } else {
        newSearchParams.set(PAGE_PARAM_NAME, page.toString());
      }

      navigate(`${location?.pathname}?${newSearchParams.toString()}`, { replace: true });
    },
    [location?.pathname, location?.search, navigate]
  );

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
      const { [dataKey]: newItems = [], total, ...restData } = response || {};

      // Calculate total pages if available
      setTotalPages(Math.ceil(total / limit));

      setData(newItems as T[]);

      // Store additional data
      setOtherData(Object.keys(restData).length > 0 ? (restData as O) : null);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [action, dataKey, limit, serializedParams, currentPage]);

  useEffect(() => {
    if (withNavigation) {
      updateUrlPage(currentPage || 1);
    }
  }, [currentPage, updateUrlPage, withNavigation]);

  // Reset pagination and load initial data when params change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigation functions
  const goToPage = useCallback(
    (page: number) => {
      const targetPage = Math.max(1, Math.min(page, totalPages));
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      }
    },
    [currentPage, totalPages]
  );

  // Function to reset and reload data
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    data,
    otherData,
    loading,
    fetched,
    error,
    currentPage,
    totalPages,
    goToPage,
    reset,
  };
};
