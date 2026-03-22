'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Upload,
  Radio,
  PlaySquare,
  User,
} from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/videos',
    label: 'Videos',
    icon: Video,
  },
  {
    href: '/videos/new',
    label: 'Upload',
    icon: Upload,
  },
  {
    href: '/live',
    label: 'Live Studio',
    icon: Radio,
  },
  {
    href: '/live/active',
    label: 'Active Live',
    icon: PlaySquare,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white xl:flex xl:flex-col">
      <div className="border-b px-6 py-5">
        <div className="text-lg font-semibold text-slate-900">Video Platform</div>
        <div className="mt-1 text-sm text-slate-500">Desktop control panel</div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}