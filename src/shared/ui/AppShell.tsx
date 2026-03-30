'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

function getBackgroundImage(pathname: string): string {
  if (pathname.startsWith('/videos/new')) return '/backgrounds/upload.png';
  if (pathname.startsWith('/videos/')) return '/backgrounds/video-detail.png';
  if (pathname.startsWith('/videos')) return '/backgrounds/videos.png';
  if (pathname.startsWith('/live/active')) return '/backgrounds/live-active.png';
  if (pathname.startsWith('/live')) return '/backgrounds/live.png';
  if (pathname.startsWith('/profile')) return '/backgrounds/videos.png';
  if (pathname.startsWith('/dashboard')) return '/backgrounds/videos.png';

  return '/backgrounds/videos.png';
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const backgroundImage = getBackgroundImage(pathname);

  return (
    <div className="relative min-h-screen text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[#081120]/78" />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 px-4 py-4 sm:px-6 xl:px-10 xl:py-6">
            <div className="mx-auto w-full max-w-[1720px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}