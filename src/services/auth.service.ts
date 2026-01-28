/**
 * Auth Service
 * Authentication operations
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { RegisterInput } from '@/lib/api/types';

// Register new user
export async function register(data: RegisterInput): Promise<void> {
  return api.post<void>(API_ENDPOINTS.register, data);
}

// Auth service object
export const authService = {
  register,
};
