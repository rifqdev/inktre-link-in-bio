/**
 * API Endpoint Configuration
 * Centralized API endpoint URLs
 */

const BASE_URL = '/api';

export const API_ENDPOINTS = {
  // Links endpoints
  links: `${BASE_URL}/links`,
  linkById: (id: string) => `${BASE_URL}/links/${id}`,
  toggleLink: (id: string) => `${BASE_URL}/links/${id}/toggle`,
  reorderLinks: `${BASE_URL}/links/reorder`,

  // Profile endpoints
  profile: `${BASE_URL}/profile`,
  profileBySlug: (slug: string) => `${BASE_URL}/profile/${slug}`,

  // Auth endpoints
  register: `${BASE_URL}/auth/register`,
  auth: `${BASE_URL}/auth`,

  // Analytics endpoints
  click: `${BASE_URL}/click`,
} as const;
