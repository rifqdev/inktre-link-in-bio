'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export function DashboardCard({ children, className, onClick, icon }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "aspect-square bg-gray-200 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-300 transition-colors w-full",
        className
      )}
      onClick={onClick}
    >
      {children}
      {icon && (
        <div className="absolute top-3 left-3 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
          {icon}
        </div>
      )}
    </div>
  );
}
