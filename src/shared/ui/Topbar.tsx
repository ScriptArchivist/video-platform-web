'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/useAuth';
import { LogOut, ChevronRight } from 'lucide-react';

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

function getBreadcrumb(pathname: string): string[] {
  if (pathname.startsWith('/videos/new')) return ['Videos', 'Upload'];
  if (pathname.startsWith('/videos/') && pathname.endsWith('/edit')) {
    return ['Videos', 'Edit'];
  }
  if (pathname.startsWith('/videos/')) return ['Videos', 'Detail'];
  if (pathname.startsWith('/videos')) return ['Videos'];
  if (pathname.startsWith('/live/active')) return ['Live', 'Active'];
  if (pathname.startsWith('/live')) return ['Live Studio'];
  if (pathname.startsWith('/profile')) return ['Profile'];
  if (pathname.startsWith('/dashboard')) return ['Dashboard'];
  return ['Control panel'];
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1 text-xs text-slate-500">
            {breadcrumb.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center gap-1">
                {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
                <span>{item}</span>
              </div>
            ))}
          </div>

          <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">
            {getPageTitle(pathname)}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="app-btn-secondary shrink-0 gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}