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
  PlayCircle,
} from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    description: 'Overview',
    icon: LayoutDashboard,
  },
  {
    href: '/videos',
    label: 'Videos',
    description: 'Catalog and playback',
    icon: Video,
  },
  {
    href: '/videos/new',
    label: 'Upload',
    description: 'Add new content',
    icon: Upload,
  },
  {
    href: '/live',
    label: 'Live Studio',
    description: 'RTMP session control',
    icon: Radio,
  },
  {
    href: '/live/active',
    label: 'Active Live',
    description: 'Current sessions',
    icon: PlaySquare,
  },
  {
    href: '/profile',
    label: 'Profile',
    description: 'Account area',
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-200/80 bg-white/75 backdrop-blur xl:flex xl:flex-col">
      <div className="border-b border-slate-200/80 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <PlayCircle className="h-5 w-5" />
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-950">
              Video Platform
            </div>
            <div className="mt-0.5 text-sm text-slate-500">
              Streaming control panel
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-start gap-3 rounded-2xl px-4 py-3 transition-all ${
                active
                  ? 'border border-slate-900/10 bg-slate-900 text-white shadow-sm'
                  : 'border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                  active
                    ? 'bg-white/12 text-white'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold">{item.label}</div>
                <div
                  className={`mt-0.5 text-xs leading-5 ${
                    active ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 px-5 py-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="text-sm font-semibold text-slate-900">
            RTMP workflow
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Create session → paste credentials into OBS → start streaming →
            monitor playback.
          </p>
        </div>
      </div>
    </aside>
  );
}