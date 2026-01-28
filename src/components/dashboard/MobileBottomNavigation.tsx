'use client';
import { useRouter } from 'next/navigation';
import { Shapes, LogOut } from 'lucide-react';

interface MobileBottomNavigationProps {
  onLogout: () => Promise<void>;
}

export function MobileBottomNavigation({ onLogout }: MobileBottomNavigationProps) {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 lg:hidden">
      {/* My inktre - Active */}
      <div className="flex flex-col items-center gap-1 text-[#7c3aed] cursor-pointer">
        <Shapes size={24} />
        <span className="text-xs font-semibold">My inktre</span>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex flex-col items-center gap-1 text-red-500 cursor-pointer"
      >
        <LogOut size={24} />
        <span className="text-xs">Logout</span>
      </button>
    </nav>
  );
}
