import { useCallback, useState, useEffect, useRef } from 'react';
import useInterval from './useInterval';
import { AnyObject } from '@shared/types/general';

type UseGetDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
  interval?: number;
  ready?: boolean;
};

type UseGetDataReturnProps<T> = {
  loading: boolean;
  error: Error | null;
  response: T;
};

export const useGetData = <T>({
  action,
  params = {},
  interval,
  ready = true,
}: UseGetDataProps): UseGetDataReturnProps<T> => {
  const [response, setResponse] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Create a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Stringify params safely
  const getParamsString = (): string => {
    try {
      return JSON.stringify(params);
    } catch (err) {
      console.error('Error stringifying params:', err);
      return '{}';
    }
  };

  const paramsString = getParamsString();

  const getData = useCallback(async () => {
    if (!ready) return;

    setLoading(true);
    setError(null);

    try {
      const result = await action(JSON.parse(paramsString));

      // Only update state if component is still mounted
      if (isMounted.current) {
        setResponse(result);
      }
    } catch (error) {
      if (isMounted.current) {
        setError(error as Error);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [action, paramsString, ready]);

  // Initial fetch when params change
  useEffect(() => {
    getData();
  }, [getData]);

  // Set up interval if provided
  useInterval(getData, interval || null, { callImmediately: false });

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    response: response as T,
    loading,
    error,
  };
};
