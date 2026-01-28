'use client';

import { MobilePreviewContainer } from '@/components/profile/MobilePreviewContainer';
import { ShareableLink } from '@/components/dashboard/ShareableLink';
import { profileService } from '@/services/profile.service';
import { useApiQuery } from '@/hooks';

interface User {
  name: string;
  avatar?: string | null;
  bio?: string | null;
  themeColor?: string | null;
}

interface UserLink {
  id: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
}

interface PreviewData {
  user: User;
  links: UserLink[];
}

interface PreviewPanelProps {
  slug: string | undefined;
  refreshKey?: number;
}

export function PreviewPanel({ slug, refreshKey }: PreviewPanelProps) {
  // Only fetch if slug exists
  const shouldFetch = !!slug;

  const { data: profileData, loading, error } = useApiQuery(
    () => profileService.getProfileBySlug(slug!),
    [slug, refreshKey]
  );

  if (!slug) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <p className="text-gray-500 text-sm">No slug available</p>
      </div>
    );
  }

  if (shouldFetch && loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-300"></div>
          <div className="w-40 h-5 bg-gray-300 rounded"></div>
          <div className="w-24 h-3 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <p className="text-red-500 text-sm">{error?.message || 'Failed to load preview'}</p>
      </div>
    );
  }

  const data: PreviewData = {
    user: {
      name: (profileData as any).name,
      avatar: (profileData as any).avatar,
      bio: (profileData as any).bio,
      themeColor: (profileData as any).themeColor,
    },
    links: (profileData as any).links || [],
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="sticky top-6 flex flex-col items-center">
        <ShareableLink slug={slug} />
        <div className="flex justify-center mt-2">
          <MobilePreviewContainer user={data.user} links={data.links} />
        </div>
      </div>
    </div>
  );
}
