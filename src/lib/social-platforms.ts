import { Instagram, Twitter, Facebook, Linkedin, Music2, Youtube } from 'lucide-react';

export interface SocialPlatform {
  id: string;
  name: string;
  icon: any;
  urlPattern: RegExp;
  placeholder: string;
  baseUrl: string;
  color: string;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    urlPattern: /instagram\.com\/[\w.-]+/,
    placeholder: 'https://instagram.com/username',
    baseUrl: 'https://instagram.com/',
    color: '#E4405F',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Twitter,
    urlPattern: /(?:x\.com|twitter\.com)\/[\w.-]+/,
    placeholder: 'https://x.com/username',
    baseUrl: 'https://x.com/',
    color: '#000000',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    urlPattern: /facebook\.com\/[\w.-]+/,
    placeholder: 'https://facebook.com/pagename',
    baseUrl: 'https://facebook.com/',
    color: '#1877F2',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    urlPattern: /linkedin\.com\/in\/[\w.-]+/,
    placeholder: 'https://linkedin.com/in/profile',
    baseUrl: 'https://linkedin.com/',
    color: '#0A66C2',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Music2,
    urlPattern: /tiktok\.com\/@?[\w.-]+/,
    placeholder: 'https://tiktok.com/@username',
    baseUrl: 'https://tiktok.com/',
    color: '#000000',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    urlPattern: /youtube\.com\/(channel|user|c)\/[\w.-]+/,
    placeholder: 'https://youtube.com/channel/...',
    baseUrl: 'https://youtube.com/',
    color: '#FF0000',
  },
];

export function getPlatformById(id: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find(p => p.id === id);
}

export function validateSocialUrl(url: string, platformId: string): boolean {
  const platform = getPlatformById(platformId);
  return platform ? platform.urlPattern.test(url) : false;
}

export function getPlatformFromUrl(url: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find(p => p.urlPattern.test(url));
}
