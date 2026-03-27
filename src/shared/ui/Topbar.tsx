'use client';

import { Search, Bell } from 'lucide-react';

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 xl:px-8">
        {/* left */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search..."
              className="app-input w-[240px] pl-10"
            />
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-3">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
            <Bell className="h-4 w-4 text-slate-600" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-medium">
              V
            </div>
            <div className="hidden text-sm font-medium text-slate-700 sm:block">
              Vadim
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}