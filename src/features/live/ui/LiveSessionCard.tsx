'use client';

import Link from 'next/link';
import { PlayCircle, Radio } from 'lucide-react';
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
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
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

      <div className="mt-auto pt-5">
        <Link
          href={`/watch/live/${session.stream_key}`}
          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium transition ${
            canWatch
              ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800'
              : 'cursor-not-allowed border border-slate-200 bg-white text-slate-400'
          }`}
          aria-disabled={!canWatch}
          onClick={(event) => {
            if (!canWatch) {
              event.preventDefault();
            }
          }}
        >
          <Radio className="h-4 w-4" />
          {canWatch ? 'Watch stream' : 'Not available yet'}
        </Link>
      </div>
    </article>
  );
}