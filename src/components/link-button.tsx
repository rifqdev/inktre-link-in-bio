'use client';

import { MoreHorizontal } from 'lucide-react';
import { DynamicIcon } from '@/components/icons/IconMap';
import { analyticsService } from '@/services/analytics.service';

interface LinkButtonProps {
  id: string;
  title: string;
  url: string;
  themeColor: string;
  icon?: string | null;
}

export function LinkButton({ id, title, url, icon }: LinkButtonProps) {
  async function handleClick() {
    // Track click using service
    await analyticsService.trackClick(id);

    // Open in new tab
    window.open(url, '_blank');
  }

  return (
    <button
      onClick={handleClick}
      className="link-button w-full bg-white border border-gray-100 p-4 rounded-2xl text-center font-semibold text-gray-800 card-shadow flex justify-between items-center px-6 hover:scale-105 transition-transform"
      style={{
        backgroundColor: 'white',
      }}
    >
      {icon && (
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
          <DynamicIcon name={icon} className="text-gray-700 w-6 h-6" />
        </div>
      )}
      <span className="grow">{title}</span>
      <MoreHorizontal className="w-5 h-5 text-gray-400" />
    </button>
  );
}
