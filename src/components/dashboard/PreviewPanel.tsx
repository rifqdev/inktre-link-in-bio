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
    [slug, refreshKey],
    !shouldFetch // Skip if no slug
  );

  // Show loading state while fetching or if no slug yet (initial state)
  if (!shouldFetch || loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-300"></div>
          <div className="w-40 h-5 bg-gray-300 rounded"></div>
          <div className="w-24 h-3 bg-gray-300 rounded"></div>
          <div className="w-32 h-3 bg-gray-300 rounded mt-2"></div>
          <div className="w-36 h-8 bg-gray-300 rounded mt-4"></div>
          <div className="w-36 h-8 bg-gray-300 rounded mt-2"></div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 text-sm font-medium mb-1">Unable to load preview</p>
          <p className="text-gray-500 text-xs mb-3">{error?.message || 'Please try again'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#8129D9] text-white text-xs rounded-full hover:bg-[#6b1fb8] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const data: PreviewData = {
    user: {
      name: profileData.name,
      avatar: profileData.avatar,
      bio: profileData.bio,
      themeColor: profileData.themeColor,
    },
    links: profileData.links || [],
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
