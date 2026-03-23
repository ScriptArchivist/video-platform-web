'use client';

import Link from 'next/link';
import type { VideoListItemDTO } from '../types';
import { VideoStatusBadge } from './VideoStatusBadge';
import { VisibilityBadge } from './VisibilityBadge';

interface VideosTableProps {
  items: VideoListItemDTO[];
}

export function VideosTable({ items }: VideosTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-500">
              Title
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-500">
              Visibility
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-500">
              Duration
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-500">
              Uploaded
            </th>
            <th className="px-4 py-3 text-right font-semibold text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((video) => (
            <tr
              key={video.id}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              <td className="px-4 py-4 align-top">
                <div className="font-medium text-slate-900">
                  {video.title}
                </div>
                <div className="mt-1 max-w-[420px] truncate text-xs text-slate-500">
                  {video.description ?? '—'}
                </div>
              </td>

              <td className="px-4 py-4 align-top">
                <VideoStatusBadge status={video.status} />
              </td>

              <td className="px-4 py-4 align-top">
                <VisibilityBadge visibility={video.visibility} />
              </td>

              <td className="px-4 py-4 align-top text-slate-700">
                {video.duration ?? '—'}
              </td>

              <td className="px-4 py-4 align-top text-slate-700">
                {new Date(video.uploaded_at).toLocaleString()}
              </td>

              <td className="px-4 py-4 align-top text-right">
                <Link
                  href={`/videos/${video.id}`}
                  className="inline-flex h-9 items-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}