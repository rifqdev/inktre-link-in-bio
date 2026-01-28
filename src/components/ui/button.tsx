'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-[#8129D9] text-white hover:bg-[#6a21b3] focus:ring-[#8129D9] focus:ring-offset-[#8129D9]',
      secondary:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-[#8129D9] focus:ring-offset-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-600',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
