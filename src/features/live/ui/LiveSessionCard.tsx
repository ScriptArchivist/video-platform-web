'use client';

import Link from 'next/link';
import type { ActiveLiveItemDTO } from '../types';
import { LiveStatusBadge } from './LiveStatusBadge';

interface LiveSessionCardProps {
  session: ActiveLiveItemDTO;
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const status = (session.status || '').toLowerCase();

  const isStarted = status === 'started';
  const hasPlayback = Boolean(session.hls_url);

  // 👉 главное правило:
  // если стрим started — всегда разрешаем открыть
  const canWatch = Boolean(isStarted || hasPlayback);

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div className="aspect-video w-full">
          {session.thumbnail_url ? (
            <img
              src={session.thumbnail_url}
              alt={session.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
              No thumbnail
            </div>
          )}
        </div>
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

        {/* безопасно приводим статус */}
        <LiveStatusBadge status={status as any} />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm leading-6 text-slate-600">
          {isStarted
            ? hasPlayback
              ? 'The stream is live and playback is available.'
              : 'The stream is live. Playback is starting and may appear shortly.'
            : hasPlayback
              ? 'Playback is ready and the watch page can be opened.'
              : 'The stream is being prepared. Playback may appear with a short delay.'}
        </p>
      </div>

      <div className="mt-auto pt-5">
        <Link
          href={`/watch/live/${session.stream_key}`}
          className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition ${
            canWatch
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'cursor-not-allowed border border-slate-200 bg-white text-slate-400'
          }`}
          aria-disabled={!canWatch}
          onClick={(event) => {
            if (!canWatch) {
              event.preventDefault();
            }
          }}
        >
          Watch
        </Link>
      </div>
    </article>
  );
}