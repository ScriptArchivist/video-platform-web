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
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white xl:flex xl:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="text-lg font-semibold tracking-tight text-slate-900">
          Video Platform
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Desktop control panel
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition ${
                  active
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-slate-700'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}