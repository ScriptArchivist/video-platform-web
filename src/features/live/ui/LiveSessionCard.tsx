'use client';

import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import type { ActiveLiveItemDTO } from '../types';
import { LiveStatusBadge } from './LiveStatusBadge';

interface LiveSessionCardProps {
  session: ActiveLiveItemDTO;
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const status = (session.status || '').toLowerCase();

  const isStarted = status === 'started';
  const hasPlayback = Boolean(session.hls_url);
  const canWatch = Boolean(isStarted || hasPlayback);

  function getStatusText() {
    if (isStarted && hasPlayback) {
      return 'Live now • Playback available';
    }

    if (isStarted && !hasPlayback) {
      return 'Live now • Preparing playback...';
    }

    if (!isStarted && hasPlayback) {
      return 'Playback ready';
    }

    return 'Waiting for stream';
  }

  function getDescription() {
    if (isStarted && hasPlayback) {
      return 'The stream is live and ready to watch.';
    }

    if (isStarted && !hasPlayback) {
      return 'The stream has started, but playback is still initializing. This usually takes a few seconds.';
    }

    if (!isStarted && hasPlayback) {
      return 'Playback is ready. You can open the stream.';
    }

    return 'The streamer has not started broadcasting yet.';
  }

  return (
    <Link
      href={`/watch/live/${session.stream_key}`}
      aria-disabled={!canWatch}
      onClick={(event) => {
        if (!canWatch) {
          event.preventDefault();
        }
      }}
      className={`block h-full rounded-3xl transition ${
        canWatch ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
    >
      <article
        className={`flex h-full flex-col overflow-hidden rounded-3xl border p-5 shadow-sm transition ${
          canWatch
            ? 'border-white/70 bg-white/90 hover:-translate-y-0.5 hover:shadow-md'
            : 'border-white/70 bg-white/90 opacity-80'
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
          <div className="aspect-video w-full">
            {session.thumbnail_url ? (
              <img
                src={session.thumbnail_url}
                alt={session.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-sm text-slate-500">
                <PlayCircle className="h-8 w-8" />
                No thumbnail
              </div>
            )}
          </div>

          {isStarted ? (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              LIVE
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900">
              {session.title}
            </h3>
            <p className="text-sm text-slate-500">
              {session.owner_name ?? 'Unknown owner'}
            </p>
          </div>

          <LiveStatusBadge status={status as any} />
        </div>

        <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-900">
            {getStatusText()}
          </div>

          <p className="text-sm leading-6 text-slate-600">
            {getDescription()}
          </p>
        </div>
      </article>
    </Link>
  );
}