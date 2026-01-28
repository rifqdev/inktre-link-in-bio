/**
 * API Error Handling
 * Centralized error handling with toast integration
 */

import { toast } from 'sonner';
import type { ApiErrorResponse } from './types';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handler function
export function handleApiError(error: unknown): ApiError {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    return new ApiError(500, error.message);
  }

  // Unknown error type
  return new ApiError(500, 'An unknown error occurred');
}

// Parse error response from API
export async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const data: ApiErrorResponse = await response.json();
    return new ApiError(response.status, data.error || data.message || 'Request failed', data.details);
  } catch {
    // If parsing fails, use status text
    return new ApiError(response.status, response.statusText || 'Request failed');
  }
}

// Show error toast
export function showErrorToast(message: string): void {
  toast.error(message, {
    duration: 3000,
    position: 'top-right',
  });
}

// Show success toast
export function showSuccessToast(message: string): void {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
}

// Check if error should show toast
export function shouldShowToast(error: ApiError): boolean {
  // Show toast for client errors (4xx) and server errors (5xx)
  return error.status >= 400 && error.status < 600;
}
