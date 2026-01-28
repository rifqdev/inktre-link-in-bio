'use client';
import { useState } from 'react';
import {
  Share2,
  Trash2,
  Link as LinkIcon,
  Instagram,
  Music2,
  AtSign,
  Globe,
  Lock,
  Star,
  Calendar,
  BarChart2,
  LayoutGrid,
  Pencil
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/types/dashboard';

interface LinkCardDetailedProps {
  link: Link;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function LinkCardDetailed({ link, onToggle, onEdit, onDelete, dragHandleProps }: LinkCardDetailedProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'tiktok': return <Music2 size={18} />;
      case 'threads': return <AtSign size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'website': return <Globe size={18} />;
      default: return <LinkIcon size={18} />;
    }
  };

  const getHighlightColor = (type?: string) => {
    // Always return transparent border (no highlight)
    return 'border-transparent';
  };

  const getIconColor = (type?: string) => {
    switch (type) {
      case 'tiktok': return 'text-purple-600';
      case 'instagram': return 'text-pink-600';
      default: return '';
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border-2 transition-all overflow-hidden shadow-sm",
      getHighlightColor(link.type)
    )}>
      <div className="p-4 flex gap-4">
        {/* Drag Handle */}
        <div
          className="flex flex-col gap-1 justify-center text-gray-300 cursor-grab"
          {...dragHandleProps}
        >
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>

        <div className="flex-1">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  defaultValue={link.title}
                  className="font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-600"
                  autoFocus
                  onBlur={(e) => {
                    // Handle title update
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                    }
                  }}
                />
              ) : (
                <span
                  className="font-bold text-gray-800 cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {link.title}
                </span>
              )}
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Pencil size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Share2 size={18} className="text-gray-400 cursor-pointer" />
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={link.active}
                  onChange={onToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* URL Row */}
          <div className="flex items-center gap-2 mb-4">
            {isEditingUrl ? (
              <input
                type="url"
                defaultValue={link.url}
                className="text-sm text-gray-500 bg-transparent border-b border-gray-300 focus:outline-none focus:border-purple-600 flex-1"
                autoFocus
                onBlur={(e) => {
                  // Handle URL update
                  setIsEditingUrl(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingUrl(false);
                  }
                }}
              />
            ) : (
              <span
                className="text-sm text-gray-500 truncate max-w-50 cursor-pointer"
                onClick={() => setIsEditingUrl(true)}
              >
                {link.url}
              </span>
            )}
            <button
              onClick={() => setIsEditingUrl(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Pencil size={14} />
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-4 text-gray-400">
              <div className={getIconColor(link.type)}>
                {getIcon(link.type)}
              </div>
              <LayoutGrid size={18} className="hover:text-gray-600 cursor-pointer" />
              <Star size={18} className="hover:text-gray-600 cursor-pointer" />
              <Calendar size={18} className="hover:text-gray-600 cursor-pointer" />
              <Lock size={18} className="hover:text-gray-600 cursor-pointer" />
              <div className="flex items-center gap-1 text-xs font-medium">
                <BarChart2 size={16} />
                {link.clicks || 0} click{link.clicks !== 1 ? 's' : ''}
              </div>
            </div>
            <Trash2
              size={18}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={onDelete}
            />
          </div>
        </div>
      </div>

      {/* Contextual Banners - REMOVED */}
    </div>
  );
}
