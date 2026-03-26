'use client';

import type { VideoVisibility } from '../types';

interface Props {
  search: string;
  visibility?: VideoVisibility;
  total?: number;
  showReset?: boolean;
  onSearchChange: (value: string) => void;
  onVisibilityChange: (value?: VideoVisibility) => void;
  onReset: () => void;
}

export function VideoFilters({
  search,
  visibility,
  total,
  showReset,
  onSearchChange,
  onVisibilityChange,
  onReset,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search videos..."
          className="h-10 min-w-[260px] flex-1 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />

        <select
          value={visibility ?? ''}
          onChange={(e) =>
            onVisibilityChange(
              (e.target.value || undefined) as VideoVisibility | undefined,
            )
          }
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        >
          <option value="">All visibility</option>
          <option value="private">private</option>
          <option value="public">public</option>
          <option value="unlisted">unlisted</option>
        </select>

        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>

      {typeof total === 'number' && (
        <div className="text-sm text-slate-500">
          {total} video{total === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}