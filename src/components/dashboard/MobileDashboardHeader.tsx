'use client';
import Image from 'next/image';
import { User } from '@/types/dashboard';

interface MobileDashboardHeaderProps {
  user: User;
}

export function MobileDashboardHeader({ user }: MobileDashboardHeaderProps) {
  return (
    <header className="p-4 flex justify-start items-center lg:hidden">
      <div className="flex items-center space-x-3">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-[#1e3a3a] rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
