'use client';

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Plus, Layout, LogOut, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { PreviewPanel } from '@/components/dashboard/PreviewPanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Get previewRefreshKey from context or pass it through
  // For now, we'll get it from a provider that will be added to the page
  const [previewRefreshKey, setPreviewRefreshKey] = React.useState(0);

  // This will be overridden by the page component
  React.useEffect(() => {
    // The page will set this value in the context
    const handlePreviewUpdate = () => {
      setPreviewRefreshKey(prev => prev + 1);
    };

    // Listen for custom event from page
    window.addEventListener('preview-update', handlePreviewUpdate);

    return () => {
      window.removeEventListener('preview-update', handlePreviewUpdate);
    };
  }, []);

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/login');
  }

  return (
    <div className="flex h-screen bg-background font-sans text-foreground">
      {/* Sidebar Navigasi */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-[#8129D9] rounded-full flex items-center justify-center text-white">
              {session?.user?.name?.charAt(0).toUpperCase() || 'L'}
            </div>
            <span>{session?.user?.name || 'User'}</span>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto mt-4">
          {/* Menu Utama: My Linktree */}
          <div>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors font-semibold bg-purple-50 text-[#8129D9]`}
            >
              <Users size={20} />
              <span>My Linktree</span>
            </div>
            <div className="ml-8 space-y-1">
              <Link
                href="/dashboard"
                className={`block px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-[#8129D9] font-bold bg-transparent'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Links
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full p-3 bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <LogOut size={20} className="text-gray-500" />
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 flex overflow-hidden">
        <div className="w-[65%] flex flex-col overflow-hidden border-r border-slate-300">
          {/* Header Atas */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-lg font-bold">
              {pathname === '/dashboard' && 'Links'}
              {pathname?.includes('profile') && 'Profile'}
            </h1>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
        </div>

        {/* Preview Panel - Desktop Only */}
        <div className="w-[30%] hidden lg:flex">
          <PreviewPanel slug={(session?.user as any)?.slug} refreshKey={previewRefreshKey} />
        </div>
      </main>
    </div>
  );
}
