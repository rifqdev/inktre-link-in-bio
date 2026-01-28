'use client';

import { useState } from 'react';
import { Share, Check } from 'lucide-react';

interface ShareButtonProps {
  slug: string;
}

export function ShareButton({ slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Share profile"
    >
      {copied ? (
        <Check className="w-6 h-6 text-gray-700" />
      ) : (
        <Share className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
}
