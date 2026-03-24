'use client';

import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
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
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((video, index) => {
        const duration = formatDuration(video.duration);
        const detailVideo = ownerQueries[index].data;
        const creatorName =
          detailVideo?.owner?.username ?? video.owner?.username ?? '—';

        return (
          <Link
            key={video.id}
            href={`/videos/${video.id}`}
            className="flex h-full"
          >
            <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50">
              {/* FIX: строго фиксированная зона превью */}
              <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-slate-200">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                    No preview
                  </div>
                )}

                {duration && (
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                    {duration}
                  </div>
                )}
              </div>

              {/* FIX: контент всегда одинаковой высоты */}
              <div className="flex flex-1 flex-col px-4 py-3">
                <div className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-900">
                  {video.title}
                </div>

                <div className="mt-2 text-sm text-slate-600">
                  {creatorName}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {formatUploadedAt(video.uploaded_at)}
                </div>

                <div className="mt-auto pt-3">
                  <VisibilityBadge visibility={video.visibility} />
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}