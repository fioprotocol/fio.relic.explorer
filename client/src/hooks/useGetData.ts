import { useCallback, useState, useEffect, useRef } from 'react';
import useInterval from './useInterval';
import { AnyObject } from '@shared/types/general';

type UseGetDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
  interval?: number;
};

type UseGetDataReturnProps = {
  loading: boolean;
  error: Error | null;
  response: AnyObject;
};

export const useGetData = ({
  action,
  params = {},
  interval,
}: UseGetDataProps): UseGetDataReturnProps => {
  const [response, setResponse] = useState<AnyObject>(null);
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
  }, [action, paramsString]);

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
    response,
    loading,
    error,
  };
};
