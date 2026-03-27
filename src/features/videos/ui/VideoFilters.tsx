'use client';

import { Search, RotateCcw } from 'lucide-react';
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
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search videos"
            className="app-input pl-10"
          />
        </div>

        <select
          value={visibility ?? ''}
          onChange={(e) =>
            onVisibilityChange(
              (e.target.value || undefined) as VideoVisibility | undefined,
            )
          }
          className="app-select"
        >
          <option value="">All visibility</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
        </select>

        {showReset ? (
          <button type="button" onClick={onReset} className="app-btn-secondary gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        ) : (
          <div />
        )}
      </div>

      {typeof total === 'number' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {total} video{total === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}