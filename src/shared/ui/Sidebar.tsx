'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Video, Radio, User } from 'lucide-react';

const items = [
  { href: '/videos', label: 'Videos', icon: Video },
  { href: '/live', label: 'Live', icon: Radio },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white/80 backdrop-blur lg:flex">
      <div className="flex h-16 items-center px-6">
        <div className="text-lg font-semibold tracking-tight">
          Video Platform
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}