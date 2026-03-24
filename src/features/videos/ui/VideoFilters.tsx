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
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search videos..."
          className="h-10 min-w-[260px] flex-1 rounded-md border px-3 text-sm"
        />

        <select
          value={visibility ?? ''}
          onChange={(e) =>
            onVisibilityChange(
              (e.target.value || undefined) as VideoVisibility | undefined,
            )
          }
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="">All visibility</option>
          <option value="private">private</option>
          <option value="public">public</option>
          <option value="unlisted">unlisted</option>
        </select>

        {showReset && (
          <button
            onClick={onReset}
            className="h-10 rounded-md border px-3 text-sm"
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