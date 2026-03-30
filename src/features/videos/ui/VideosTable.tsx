'use client';

import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { PlayCircle } from 'lucide-react';
import { getVideoById } from '../api';
import { videoQueryKeys } from '../queryKeys';
import type { VideoListItemDTO } from '../types';

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

function formatVisibility(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {items.map((video, index) => {
        const duration = formatDuration(video.duration);
        const detailVideo = ownerQueries[index].data;
        const creatorName =
          detailVideo?.owner?.username ?? video.owner?.username ?? '—';

        return (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="block h-full rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-300/40"
          >
            <article className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-sm backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-white/30 hover:bg-white/14 hover:shadow-xl">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/8">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/16 bg-[#0f1a2f]/78 shadow-sm backdrop-blur-xl">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                    No preview
                  </div>
                )}

                {duration ? (
                  <div className="absolute bottom-3 right-3 rounded-xl bg-black/70 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                    {duration}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                      {video.title}
                    </div>

                    <div className="truncate text-xs text-slate-200">
                      {creatorName}
                    </div>

                    <div className="truncate text-xs text-slate-400">
                      {formatUploadedAt(video.uploaded_at)} ·{' '}
                      {formatVisibility(video.visibility)}
                    </div>
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