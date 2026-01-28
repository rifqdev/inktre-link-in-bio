/**
 * Links Service
 * All links-related API operations
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  LinkWithTimestamps,
  CreateLinkInput,
  UpdateLinkInput,
  ReorderLinksInput,
} from '@/lib/api/types';

// Get all links for current user
export async function getLinks(): Promise<LinkWithTimestamps[]> {
  return api.get<LinkWithTimestamps[]>(API_ENDPOINTS.links);
}

// Get single link by ID
export async function getLink(id: string): Promise<LinkWithTimestamps> {
  return api.get<LinkWithTimestamps>(API_ENDPOINTS.linkById(id));
}

// Create new link
export async function createLink(data: CreateLinkInput): Promise<LinkWithTimestamps> {
  return api.post<LinkWithTimestamps>(API_ENDPOINTS.links, data);
}

// Update existing link
export async function updateLink(id: string, data: UpdateLinkInput): Promise<LinkWithTimestamps> {
  return api.put<LinkWithTimestamps>(API_ENDPOINTS.linkById(id), data);
}

// Delete link
export async function deleteLink(id: string): Promise<void> {
  return api.delete<void>(API_ENDPOINTS.linkById(id));
}

// Toggle link active status
export async function toggleLink(id: string): Promise<LinkWithTimestamps> {
  return api.patch<LinkWithTimestamps>(API_ENDPOINTS.toggleLink(id), {});
}

// Reorder links
export async function reorderLinks(data: ReorderLinksInput): Promise<void> {
  return api.post<void>(API_ENDPOINTS.reorderLinks, data);
}

// Links service object (optional, for named imports)
export const linksService = {
  getLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  toggleLink,
  reorderLinks,
};
