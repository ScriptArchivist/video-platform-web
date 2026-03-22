'use client';

import type { VideoStatus, VideoVisibility } from '../types';

interface VideoFiltersProps {
  search: string;
  status?: VideoStatus;
  visibility?: VideoVisibility;
  onSearchChange: (value: string) => void;
  onStatusChange: (value?: VideoStatus) => void;
  onVisibilityChange: (value?: VideoVisibility) => void;
}

export function VideoFilters({
  search,
  status,
  visibility,
  onSearchChange,
  onStatusChange,
  onVisibilityChange,
}: VideoFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search videos..."
        className="h-10 min-w-[280px] rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />

      <select
        value={status ?? ''}
        onChange={(e) =>
          onStatusChange((e.target.value || undefined) as VideoStatus | undefined)
        }
        className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      >
        <option value="">All statuses</option>
        <option value="uploading">uploading</option>
        <option value="uploaded">uploaded</option>
        <option value="processing">processing</option>
        <option value="ready">ready</option>
        <option value="failed">failed</option>
      </select>

      <select
        value={visibility ?? ''}
        onChange={(e) =>
          onVisibilityChange(
            (e.target.value || undefined) as VideoVisibility | undefined,
          )
        }
        className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      >
        <option value="">All visibility</option>
        <option value="private">private</option>
        <option value="public">public</option>
        <option value="unlisted">unlisted</option>
      </select>
    </div>
  );
}