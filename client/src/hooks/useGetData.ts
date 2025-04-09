import { useCallback, useState, useEffect, useRef } from 'react';

import { AnyObject } from '@shared/types/general';

type UseGetDataProps = {
  action: (params: AnyObject) => Promise<AnyObject>;
  params?: AnyObject;
};

type UseGetDataReturnProps = {
  loading: boolean;
  error: Error | null;
  response: AnyObject;
};

export const useGetData = ({ action, params = {} }: UseGetDataProps): UseGetDataReturnProps => {
  const [response, setResponse] = useState<AnyObject>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Create a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  // Use a ref to store the stringified params to detect changes
  const paramsRef = useRef<string>('');
  
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
    // Skip if params haven't changed
    if (paramsRef.current === paramsString) return;
    
    paramsRef.current = paramsString;
    setLoading(true);
    setError(null);

    try {
      const result = await action(JSON.parse(paramsRef.current));

      // Only update state if component is still mounted
      // Always set the response on first load, then check if mounted for subsequent updates
      if (response === null || isMounted.current) {
        setResponse(result);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [action, paramsString, response]);

  useEffect(() => {
    getData();
  }, [getData]);
  
  // Cleanup function to prevent memory leaks
  useEffect(() => {
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
