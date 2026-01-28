/**
 * Profile Service
 * All profile-related API operations
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  UserWithTimestamps,
  UpdateProfileInput,
  LinkWithTimestamps,
} from '@/lib/api/types';

// Get current user profile
export async function getProfile(): Promise<UserWithTimestamps> {
  return api.get<UserWithTimestamps>(API_ENDPOINTS.profile);
}

// Update current user profile
export async function updateProfile(data: UpdateProfileInput): Promise<UserWithTimestamps> {
  return api.put<UserWithTimestamps>(API_ENDPOINTS.profile, data);
}

// Get public profile by slug (includes links)
// Note: API returns user object with links included, not wrapped in { user, links }
export async function getProfileBySlug(slug: string): Promise<UserWithTimestamps & { links: LinkWithTimestamps[] }> {
  return api.get<any>(API_ENDPOINTS.profileBySlug(slug));
}

// Profile service object
export const profileService = {
  getProfile,
  updateProfile,
  getProfileBySlug,
};
