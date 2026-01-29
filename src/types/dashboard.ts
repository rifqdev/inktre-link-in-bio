/**
 * Dashboard Type Definitions
 * Types based on Prisma schema for type safety
 */

export interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
  type?: string | null;
  icon?: string | null;
  clicks?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  slug: string;
  bio?: string | null;
  avatar?: string | null;
  themeColor?: string | null;
}

// NextAuth extended types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      slug: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    slug: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    slug: string;
  }
}
