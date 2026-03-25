'use client';

import Link from 'next/link';
import type { ActiveLiveItemDTO } from '../types';
import { LiveStatusBadge } from './LiveStatusBadge';

interface LiveSessionCardProps {
  session: ActiveLiveItemDTO;
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const canWatch = Boolean(session.hls_ready && session.hls_url);

  return (
    <article className="flex h-full flex-col rounded-xl border bg-white p-4">
      <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-slate-100">
        {session.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.thumbnail_url}
            alt={session.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No thumbnail
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {session.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {session.owner_name ?? 'Unknown owner'}
          </p>
        </div>

        <LiveStatusBadge status={session.status} />
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {session.status === 'started'
          ? 'Live now'
          : session.hls_ready
          ? 'Ready to watch'
          : 'Starting stream...'}
      </p>

      <div className="mt-auto pt-4">
        <Link
          href={`/watch/live/${session.stream_key}`}
          className={`inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition ${
            canWatch
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'cursor-not-allowed border border-slate-200 text-slate-400'
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