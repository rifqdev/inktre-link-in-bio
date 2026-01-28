/**
 * useApi Hook
 * Custom hook for API mutations with loading state and error handling
 */

import { useState, useCallback } from 'react';
import { handleApiError, showErrorToast, showSuccessToast, shouldShowToast } from '@/lib/api/errors';
import type { ApiError } from '@/lib/api/errors';

interface UseApiOptions {
  successMessage?: string;
  showToast?: boolean;
}

interface UseApiReturn {
  execute: <T>(apiCall: () => Promise<T>, options?: UseApiOptions) => Promise<T>;
  loading: boolean;
  error: ApiError | null;
}

export function useApi(): UseApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async <T>(apiCall: () => Promise<T>, options: UseApiOptions = {}): Promise<T> => {
      const { successMessage, showToast = true } = options;

      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();

        // Show success toast if message provided
        if (successMessage && showToast) {
          showSuccessToast(successMessage);
        }

        return result;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError);

        // Show error toast for client/server errors
        if (showToast && shouldShowToast(apiError)) {
          showErrorToast(apiError.message);
        }

        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    execute,
    loading,
    error,
  };
}
