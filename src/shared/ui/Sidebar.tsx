'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video, Upload, Radio, PlaySquare, User } from 'lucide-react';

const items = [
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/videos/new', label: 'Upload', icon: Upload },
  { href: '/live', label: 'Live Studio', icon: Radio },
  { href: '/live/active', label: 'Active Live', icon: PlaySquare },
  { href: '/profile', label: 'Profile', icon: User },
];

function isItemActive(pathname: string, href: string) {
  if (href === '/videos') {
    return pathname === '/videos' || pathname.startsWith('/videos/');
  }

  if (href === '/live') {
    return pathname === '/live';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">
          Pring Eye
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}