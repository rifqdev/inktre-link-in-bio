/**
 * useApiQuery Hook
 * Custom hook for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '@/lib/api/errors';
import type { ApiError } from '@/lib/api/errors';

interface UseApiQueryReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useApiQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): UseApiQueryReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryFn();
      setData(result);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
