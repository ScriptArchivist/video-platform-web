'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { LogOut } from 'lucide-react';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/videos/new')) return 'Upload video';
  if (pathname.startsWith('/videos/')) return 'Video';
  if (pathname.startsWith('/videos')) return 'Videos';
  if (pathname.startsWith('/live/active')) return 'Active live sessions';
  if (pathname.startsWith('/live')) return 'Live studio';
  if (pathname.startsWith('/profile')) return 'Profile';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return 'Control panel';
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const isLiveStudio = pathname.startsWith('/live');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {!isLiveStudio && (
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      )}
    </header>
  );
}