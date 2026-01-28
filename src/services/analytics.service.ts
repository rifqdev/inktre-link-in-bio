/**
 * Analytics Service
 * Click tracking and analytics operations
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Track link click
export async function trackClick(linkId: string): Promise<void> {
  return api.post<void>(API_ENDPOINTS.click, { linkId });
}

// Analytics service object
export const analyticsService = {
  trackClick,
};
