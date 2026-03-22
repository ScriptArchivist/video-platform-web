'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';

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

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          router.push('/login');
        }}
        className="inline-flex h-10 items-center rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Logout
      </button>
    </header>
  );
}