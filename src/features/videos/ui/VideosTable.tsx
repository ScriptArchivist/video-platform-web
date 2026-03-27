'use client';

import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { PlayCircle } from 'lucide-react';
import { getVideoById } from '../api';
import { videoQueryKeys } from '../queryKeys';
import type { VideoListItemDTO } from '../types';
import { VisibilityBadge } from './VisibilityBadge';

interface VideosTableProps {
  items: VideoListItemDTO[];
}

function formatDuration(seconds: number | null) {
  if (seconds === null || seconds === undefined) {
    return null;
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatUploadedAt(value: string) {
  return new Date(value).toLocaleString();
}

export function VideosTable({ items }: VideosTableProps) {
  const ownerQueries = useQueries({
    queries: items.map((video) => ({
      queryKey: videoQueryKeys.detail(video.id),
      queryFn: () => getVideoById(video.id, { consistent: true }),
      staleTime: 60_000,
    })),
  });

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((video, index) => {
        const duration = formatDuration(video.duration);
        const detailVideo = ownerQueries[index].data;
        const creatorName =
          detailVideo?.owner?.username ?? video.owner?.username ?? '—';

        return (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="block h-full rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <article className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
              <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-slate-100">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-400">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    No preview
                  </div>
                )}

                {duration ? (
                  <div className="absolute bottom-3 right-3 rounded-xl bg-black/80 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                    {duration}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="space-y-1.5">
                  <div className="line-clamp-2 min-h-[52px] text-base font-semibold leading-6 text-slate-900">
                    {video.title}
                  </div>

                  <div className="text-sm text-slate-600">{creatorName}</div>

                  <div className="text-xs text-slate-500">
                    {formatUploadedAt(video.uploaded_at)}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Visibility
                  </div>
                  <div className="mt-2">
                    <VisibilityBadge visibility={video.visibility} />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}