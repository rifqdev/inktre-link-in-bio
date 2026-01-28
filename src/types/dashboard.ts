export interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
  type?: string;
  icon?: string;
  clicks?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  slug: string;
  bio?: string;
  avatar?: string;
  themeColor?: string;
}
