import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(20, 'Slug must be at most 20 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  themeColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format (use hex like #6366f1)')
    .optional(),
});

export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(20, 'Slug must be at most 20 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

// Social link types
export const socialLinkTypes = z.enum([
  'regular',
  'instagram',
  'twitter',
  'facebook',
  'linkedin',
  'tiktok',
  'youtube',
]);

// Link schemas
export const createLinkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  url: z.string().url('Invalid URL'),
  active: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  type: socialLinkTypes.optional(),
  icon: z.string().optional(),
});

export const updateLinkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters')
    .optional(),
  url: z.string().url('Invalid URL').optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  type: socialLinkTypes.optional(),
  icon: z.string().optional(),
});

export const reorderLinksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string().uuid('Invalid link ID'),
      order: z.number().int().min(0),
    })
  ),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ReorderLinksInput = z.infer<typeof reorderLinksSchema>;
