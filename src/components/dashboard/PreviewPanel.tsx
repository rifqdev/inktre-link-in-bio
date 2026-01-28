'use client';

import { useEffect, useState } from 'react';
import { MobilePreviewContainer } from '@/components/profile/MobilePreviewContainer';
import { ShareableLink } from '@/components/dashboard/ShareableLink';

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
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPreviewData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/profile/${slug}`);
        if (response.ok) {
          const previewData = await response.json();
          setData({
            user: {
              name: previewData.name,
              avatar: previewData.avatar,
              bio: previewData.bio,
              themeColor: previewData.themeColor,
            },
            links: previewData.links,
          });
        } else {
          setError('Failed to load preview');
        }
      } catch (err) {
        console.error('Error fetching preview data:', err);
        setError('Failed to load preview');
      } finally {
        setLoading(false);
      }
    }

    fetchPreviewData();
  }, [slug, refreshKey]);

  if (!slug) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <p className="text-gray-500 text-sm">No slug available</p>
      </div>
    );
  }

  if (loading) {
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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 bg-gray-100">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

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
