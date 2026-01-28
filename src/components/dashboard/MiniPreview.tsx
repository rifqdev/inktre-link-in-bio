'use client';
import Image from 'next/image';
import { User, Link as UserLink } from '@/types/dashboard';

interface MiniPreviewProps {
  user: User;
  links: UserLink[];
}

export function MiniPreview({ user, links }: MiniPreviewProps) {
  // Show max 3 links in preview
  const previewLinks = links.slice(0, 3);

  return (
    <div className="bg-white w-full h-full rounded-xl shadow-sm p-3 flex flex-col items-center">
      {/* Avatar */}
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover mb-1"
        />
      ) : (
        <div className="w-8 h-8 bg-[#1e3a3a] rounded-full flex items-center justify-center text-white text-[10px] mb-1">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Name */}
      <p className="font-bold text-[8px] text-center">{user.name}</p>

      {/* Bio (truncated) */}
      <p className="text-[6px] text-center text-gray-400 line-clamp-2 mb-1">
        {user.bio || 'Add a bio...'}
      </p>

      {/* Preview Links - sesuai update user */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {previewLinks.length === 0 ? (
          <div className="w-full bg-[#1e3a3a] h-8 mt-2 rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          previewLinks.map((link) => (
            <div
              key={link.id}
              className='p-1 border my-1 border-slate-300 rounded-lg text-[8px] text-center font-medium text-gray-700 truncate'
              title={link.title}
            >
              {link.title}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
