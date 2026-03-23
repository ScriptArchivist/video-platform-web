'use client';

import Link from 'next/link';
import type { ActiveLiveItemDTO } from '../types';

interface LiveSessionCardProps {
  session: ActiveLiveItemDTO;
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
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

      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900">{session.title}</h3>

        <p className="text-sm text-slate-500">
          {session.owner_name ?? 'Unknown owner'}
        </p>

        <p className="text-sm text-slate-500">
          Status: {session.status}
          {!session.hls_ready ? ' (starting stream...)' : ''}
        </p>
      </div>

      <div className="mt-4">
        <Link
          href={`/watch/live/${session.stream_key}`}
          className={`inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition ${
            session.hls_ready && session.hls_url
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'cursor-not-allowed border border-slate-200 text-slate-400'
          }`}
          aria-disabled={!session.hls_ready || !session.hls_url}
          onClick={(event) => {
            if (!session.hls_ready || !session.hls_url) {
              event.preventDefault();
            }
          }}
        >
          Watch
        </Link>
      </div>
    </div>
  );
}