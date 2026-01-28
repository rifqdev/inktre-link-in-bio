/**
 * API Type Definitions
 * Centralized types for all API requests and responses
 */

// Import existing types to re-export
import type { Link, User } from '@/types/dashboard';
import type {
  CreateLinkInput,
  UpdateLinkInput,
  ReorderLinksInput,
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
} from '@/lib/validations';

// Re-export types
export type { Link, User };
export type { CreateLinkInput, UpdateLinkInput, ReorderLinksInput, RegisterInput, LoginInput, UpdateProfileInput };

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Error type
export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: unknown;
}

// Link with timestamps
export interface LinkWithTimestamps extends Link {
  createdAt: string;
  updatedAt: string;
}

// User with timestamps
export interface UserWithTimestamps extends User {
  createdAt: string;
  updatedAt: string;
}

// Click tracking data
export interface ClickData {
  linkId: string;
  timestamp?: string;
  userAgent?: string;
  referrer?: string;
}

// Public profile response
export interface PublicProfileResponse {
  user: UserWithTimestamps;
  links: LinkWithTimestamps[];
}

// Reorder link item
export interface ReorderLinkItem {
  id: string;
  order: number;
}
