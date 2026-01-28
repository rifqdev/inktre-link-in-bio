'use client';

import { useState } from 'react';

interface ShareableLinkProps {
  slug: string | undefined;
}

export function ShareableLink({ slug }: ShareableLinkProps) {
  const [copied, setCopied] = useState(false);

  if (!slug) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className="relative h-10 w-74 rounded-full bg-background-elevated"
    >
      <button
        onClick={handleCopy}
        className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-primary px-10 py-0.5 text-center transition-colors hover:bg-background-primary"
        aria-label="Copy link to clipboard"
      >
        <div className="truncate text-sm font-normal leading-5 tracking-[0.21px] text-foreground-primary">
          {copied ? 'Copied!' : fullUrl}
        </div>
      </button>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center"
          aria-label="Copy link to clipboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 256 256"
            strokeWidth="1.5"
            className="size-5! h-5 w-5 text-foreground-primary hover:text-foreground-secondary transition-colors"
          >
            <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96H80a8,8,0,0,1,0,16H56v96H200V112H176a8,8,0,0,1,0-16h24A16,16,0,0,1,216,112ZM93.66,69.66,120,43.31V136a8,8,0,0,0,16,0V43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,69.66Z"></path>
          </svg>
        </button>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-slate-700"
      ></div>
    </div>
  );
}
